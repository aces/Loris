<?php

/**
 * missing code in update thread to move to answered if PSC, and to preserve comment in all cases
 * missing QC status and in .php file the req.actio value {$required action }/per thread to automatically make the proper form field.
 * missing error display row in each form (already working in cose/activate forms)
 * missing general error display and per thread(form)
 * need error trapping to prevent screen display in case of all failures
 * @package behavioural 
 * @version $Id: NDB_BVL_Feedback.class.inc,v 3.16 2007/03/02 21:16:28 sebas Exp $
 */
require_once 'User.class.inc';
require_once 'Database.class.inc';

Class NDB_BVL_Feedback
{
    // contains info necessary to structure the object
    var $_feedbackObjectInfo='';
    
    // contains full candidate profile/timepoint/instrument info
    var $_feedbackCandidateProfileInfo='';

    // set of status options
    var $_feedbackStatusOptions = array('opened','answered','closed','comment');
    
    var $_username='';
    
    var $_feedbackLevel='';
    
    static function &singleton($username, $candID=null, $sessionID=null, $commentID=null)
    {
        // at least one of the args have to be passed
        if (empty($candID) && empty($sessionID) && empty($commentID)) {
            return PEAR::raiseError("You need to pass at least one of the following when creating the Feedback Object: CandID, SessionID, or CommentID");
        }
        
        static $feedbackList = array();
        
        $objectName = md5(sprintf("c%ss%si%s", $candID, $sessionID, $commentID));
        
        if (!isset($feedbackList[$objectName])) {
            $feedbackList[$objectName] = new NDB_BVL_Feedback();
            $error = $feedbackList[$objectName]->setup($username, $candID, $sessionID, $commentID);
            if (Utility::isErrorX($error)) {
                unset($feedbackList[$objectName]);
                return PEAR::raiseError("Could not instantiate Feedback Object: ".$error->getMessage());
            }
        }
        
        return $feedbackList[$objectName];
    }

    function setup($username, $candID=null, $sessionID=null, $commentID=null)
    {
        if (!empty($commentID)) {
            $this->_feedbackObjectInfo['CommentID'] = $commentID;
            $this->_feedbackLevel = 'instrument';
        } elseif (!empty($sessionID)) {
            $this->_feedbackObjectInfo['SessionID'] = $sessionID;
            $this->_feedbackLevel = 'visit';
        } elseif (!empty($candID)) {
            $this->_feedbackObjectInfo['CandID'] = $candID;
            $this->_feedbackLevel = 'profile';
        } else {
            return PEAR::raiseError("You need to pass at least one of the following to setup the Feedback Object: CandID, SessionID, or CommentID");
        }
        
        $this->_username = $username;
        
        // get CandID (and SessionID)
        $success = $this->_setCandidateProfileInfo();
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError ("Could not get candidate info: ".$success->getMessage());
        }
    }
    
    /**
    * retrieves candidate profile info for the feedback object
    * when you pass SessionID and CommentID, you'll need additional profile info to be able to complete vairious queries.
    * @return void
    * @throws PEAR::Error
    */
    function _setCandidateProfileInfo()
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // SELECT section
        $query = "SELECT c.CandID";
        if(!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", SessionID";
        }

        $query .= " FROM candidate as c";
        $qparams = array();

        if(!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", session as s, flag as f WHERE c.CandID=s.CandID AND s.ID=f.SessionID AND f.CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        } elseif(!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query .= ", session as s WHERE c.CandID=s.CandID AND s.ID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " WHERE c.CandID = :CaID";
            $qparams['CaID'] = $this->_feedbackObjectInfo['CandID'];
        } else {
             return PEAR::raiseError("You need to pass at least one of the following to setup the Feedback Object: CandID, SessionID, or CommentID");
        }
        $query .= " LIMIT 1";

        $result = $db->pselect($query, $qparams);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("dbError: " . $result->getMessage());
        }
        
        if (!is_array($result) || count($result) == 0) {
            return PEAR::raiseError("Error, unable to select data for the feedback object");
        }
        
        $this->_feedbackCandidateProfileInfo['CandID'] = $result[0]['CandID'];
        if (isset($result[0]['SessionID'])) {
            $this->_feedbackCandidateProfileInfo['SessionID'] = $result[0]['SessionID'];
        }
    }
    
    function getFeedbackLevel()
    {
        return $this->_feedbackLevel;
    }
    
    /**
    * returns an array of feedback types array format: [Type][Name, Label]
    * @return array
    * @throws PEAR::Error
    */
    function getFeedbackTypes()
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        $query = "SELECT Feedback_type as Type, Name, Description FROM feedback_bvl_type";
        
        $result = $db->pselect($query, array());
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Db Error: " . $result->getMessage());
        }
        
        foreach ($result as $record) {
            $list[$record['Type']] = array('Type'=>$record['Type'], 'Name'=>$record['Name'], 'Label'=>$record['Description']);
        }
        return $list;
    }
    
    /**
    * returns a type of the thread identified by the FeedbackID
    * @param int value from the table feedback_bvl_thread.FeedbackID
    * @return string feedback type of the thread
    * @throws PEAR::Error
    */
    function getThreadType($feedbackID)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        $query = "SELECT Type FROM feedback_bvl_thread WHERE FeedbackID = :FID";
        
        $result = $db->pselectOne($query, array('FID' => $feedbackID));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Db Error: " . $result->getMessage());
        }
        return $result;
    }
    
    /**
    * return the hex code of the status color defined in config.xml
    * @static
    * @return string color hex code (format #xxxxxx)
    */
    function getThreadColor($status)
    {
        if(empty($status)) return '';

        $smarty = new Smarty_neurodb;
        $smarty->config_load('default.conf', 'bvlqc');
        return $smarty->get_config_vars($status);
    }
    
    function getThreadStatus($feedbackID)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        $query = "SELECT Status FROM feedback_bvl_thread WHERE FeedbackID = :FID";
        
        $result = $db->pselectOne($query, array('FID' => $feedbackID));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Db Error: " . $result->getMessage());
        }
        return $result;
    }
    
    /**
    * this function returns the greatest type of active feedback for the candidate/timepoint/instrument
    * @return string the higest-order status of an active thread
    * @throws PEAR::Error
    * @param int $CandID
    * @param int @SessionID
    * @param string $CommentID
    * @param string $feedbackID, feedback_bvl_thread.FeedbackID field
    * @static
    */
    function getMaxThreadStatus($select_inactive_threads)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        $query = "SELECT Status FROM feedback_bvl_thread WHERE";
        $qparams = array();
        if (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " CandID = :CID";
            $qparams['CID'] = $this->_feedbackObjectInfo['CandID'];
        }
        if (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query .= " SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        }
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= " CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        }
        if (empty($select_inactive_threads)) {
            $query .= " AND Active = 'Y'";
        }
        
        $query .= " ORDER BY Status ASC";
        $result = $db->pselectOne($query,$qparams);
        
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("dbError: " . $result->getMessage());
        }
        if(isset($result)) {
            return $result;
        }
        return null;
    }
   
    /**
    * returns the thread count for candidate/timepoint/instrument
    * @return string thread count
    * @throws PEAR:Error
    */
    function getThreadCount()
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        $query  = "SELECT count(*) FROM feedback_bvl_thread WHERE Active ='Y' AND Public = 'Y' AND Status <> 'closed'";
        $qparams = array();
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= " AND CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
            $queryBy = " CommentID";
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query .= " AND SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
            $queryBy = " SessionID";
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " AND CandID = :CanID";
            $qparams['CanID'] = $this->_feedbackObjectInfo['CandID'];
            $queryBy = " CandID";
        } 
          elseif (!empty($this->_feedbackObjectInfo['FieldName'])) {
          	$query .= 	" AND FieldName = :FName";
          	$qparams['FName'] = $this->_feedbackObjectInfo['FieldName'];
            $queryBy = " FieldName";
          }
          else {
            return PEAR::raiseError("no CandID, SessionID, CommentID provided");
        }
        $query .= " GROUP BY $queryBy";
        
        $success = $db->pselectOne($query, $qparams);
        if (Utility::isErrorX($success)) {
            return "DB Error: ".$success->getMessage();
        }
        return $success;
    }

    /**
    * returns the bvl feedback threads count for a candidate/timepoint/instrument
    * @return array array of threads
    * @throws PEAR::error
    * @param int $CandID
    * @param int @SessionID
    * @param string $CommentID
    */
    function getSummaryOfThreads()
    {
        // new DB Object
        
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // get User object
        $user =& User::singleton($this->_username);
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError('unable to create user object: '.$user->getMessage());
        }
        $hasReadPermission = $user->hasPermission('access_all_profiles');
        
        $query  = "SELECT c.CandID as CandID, c.PSCID as PSCID, c.Ethnicity, c.Gender, s.ID as SessionID, s.Visit_label as Visit, ft.Feedback_level as QC_Class, count(ft.FeedbackID) as No_Threads";
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= ", f.Test_name as Instrument, ft.CommentID";
        }
        $query .= " FROM candidate as c, feedback_bvl_thread as ft LEFT JOIN session as s ON (s.ID = ft.SessionID)";
        $qparams = array();
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " LEFT JOIN flag as f ON (ft.CommentID = f.CommentID)";
        }
        $query .= " WHERE c.CandID = ft.CandID";
        $query .= " AND ft.Active ='Y'";
        if (!$user->isMultiSiteEnabled() && !$hasReadPermission===true) {
            $query .= " AND c.CenterID=:CentID";
            $qparams['CentID'] > $user->getCenterID();
        }

        $query .= " AND Public = 'Y' AND Status <> 'closed'";
        if (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " AND ft.CandID = :CaID";
            $qparams['CaID'] = $this->_feedbackObjectInfo['CandID'];
        }

        if (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query .= " AND ft.SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        }
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= " AND ft.SessionID = :CSID";
            $qparams['CSID'] = $this->_feedbackCandidateProfileInfo['SessionID'];
        }
        $query .= " GROUP BY ft.CandID, ft.Feedback_level, ft.SessionID";
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= ", ft.CommentID";
        }
        $query .= " ORDER BY ft.CandID, ft.Feedback_level, ft.Status";

        $result = $db->pselect($query, $qparams);
        
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("dbError: " . $result->getMessage());
        }
        return $result;
    }
    
    /**
    * returns the list of feedback threads
    * @throws PEAR:Error
    * @return array
    * @param int $CandID
    * @param int @SessionID
    * @param string $CommentID
    */
    function getThreadList()
    {
        // new DB Object
        
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // create user object
        $user =& User::singleton($this->_username);
        if(Utility::isErrorX($user)) {
            return "Unable to create user object".$user->getMessage();
        }
        $hasReadPermission = $user->hasPermission('access_all_profiles');
        
        $query  = "SELECT c.CandID as CandID, c.PSCID as PSCID";
        $qparams = array();
        if (!empty($this->_feedbackObjectInfo['SessionID']) || !empty($this->_feedbackObjectInfo['CommentID']))  {
            $query .= ", s.VisitNo as Visit, s.SubprojectID, s.ID as SessionID";
        }
        $query .= ", ft.FeedbackID, ft.Feedback_level as QC_class, ftp.Description as Type, ftp.Feedback_type as TypeID, ft.Status as QC_status, ft.Active as Active, ft.Public as Public,ft.FieldName, ft.UserID as User, ft.Date_taken as Date, DATE_FORMAT(ft.Testdate, '%Y-%m-%d') as Modified";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", f.Test_name as Instrument, f.CommentID";
        }
        $query .= " FROM candidate as c, feedback_bvl_thread as ft LEFT JOIN session as s ON (s.ID = ft.SessionID), feedback_bvl_type as ftp";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", flag as f";
        }
        $query .= " WHERE c.CandID = ft.CandID AND ftp.Feedback_type = ft.Feedback_type";
        
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= " AND ft.SessionID = :SID";
            $query .= " AND ft.CommentID = :ComID AND ft.CommentID = f.CommentID";
            $qparams['SID'] = $this->_feedbackCandidateProfileInfo['SessionID'];
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query .= " AND ft.SessionID = :SID AND ft.CommentID is null";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " AND ft.CandID = :CaID AND ft.SessionID is null AND ft.CommentID is null";
            $qparams['CaID'] = $this->_feedbackObjectInfo['CandID'];
        } else {
            return PEAR::raiseError("You need to pass at least one of the following to retrieve the list of thread: CandID, SessionID, or CommentID");
        }

        
        // DCC users should be able to see THEIR OWN inactive threads, other users should see only active threads
        if ($user->isMultiSiteEnabled() || $hasReadPermission===true) {
            $query .= " AND (ft.Active='Y' OR (ft.Active='N' AND ft.UserID=:Username))";
            $qparams['Username'] = $this->_username;
        } else {
            $query .= " AND ft.Active ='Y' AND c.CenterID=:CentID";
            $qparams['CentID'] = $user->getCenterID();
        }
        
        $query .= " ORDER BY ft.CandID, ft.Feedback_level, ft.Status, ft.Testdate DESC";

        $result = $db->pselect($query, $qparams);
        
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("dbError: " . $result->getMessage());
        }
        
        return $result;
    }
    
    /**
    * returns the list of entries for the thread
    * @return array
    * @throws PEAR::Error
    * @param string $feedbackID, feedback_bvl_thread.FeedbackID field
    */
    function getThreadEntries($feedbackID)
    {
        // new DB Object
        
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        //select the entries (details) for the thread
        $query  = "SELECT";
        $query .= " fe.ID as EntryID, fe.FeedbackID, fe.Comment, fe.UserID as UserID, DATE_FORMAT(fe.Testdate, '%Y-%m-%d') as Date";
        $query .= " FROM feedback_bvl_thread as ft, feedback_bvl_entry as fe, feedback_bvl_type as ftp";
        $query .= " WHERE ft.FeedbackID = :FID AND ft.FeedbackID = fe.FeedbackID AND ft.Feedback_type = ftp.Feedback_type";
        $query .= " ORDER BY ft.FeedbackID, fe.Testdate DESC";
        
        $result = $db->pselect($query, array('FID' => $feedbackID));
        
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("dbError: " . $result->getMessage());
        }
        
        return $result;
    }
    
    /**
    * @return void
    * @throws PEAR::Error
    */
    
    function createThread($level, $type, $comment, $public=null,$fieldname=null)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // get the FeedbackID for the new thread
        $query = "SELECT MAX(FeedbackID) + 1 AS FeedbackID FROM feedback_bvl_thread";
        $feedbackID = $db->pselectOne($query, array());
        if (Utility::isErrorX($feedbackID)) {
            return PEAR::raiseError("dbError: " . $feedbackID->getMessage());
        }
        unset($query);
        
        // public threads are inactive by default
        if ($public == 'Y') {
//            $active = 'N'; // all new public threads need to be activated
            $status = 'opened'; // default status
        } elseif ($public == 'N') {
            // private threads are automatically activated and made Status=Comment
//            $active = 'Y';
            $status = 'comment';
        } else {
            return PEAR::raiseError("Please select a 'Required Action?' for the new feedback you want to create");
        }
        $today = date("Y-m-d");
        
        // disabling post new feedback option, activate all threads
        $active = 'Y';
        
        // create SET array for the INSERT into the feedback_bvl_thread table
        $setArray = array('FeedbackID'=>NULL, 'Feedback_type'=>$type, 'Public'=>$public, 'Status'=>$status, 'Active'=>$active, 'Date_taken'=>$today, 'UserID'=>$this->_username);
        if ($this->_feedbackLevel=='instrument')  {
            $setArray = array_merge($setArray, array("CommentID" => $this->_feedbackObjectInfo['CommentID']));
            $setArray = array_merge($setArray, array("SessionID" => $this->_feedbackCandidateProfileInfo['SessionID']));
            $setArray = array_merge($setArray, array("CandID" => $this->_feedbackCandidateProfileInfo['CandID']));
            $setArray = array_merge($setArray, array("Feedback_level" => "instrument"));
            $setArray = array_merge($setArray, array("FieldName" => $fieldname));
        } elseif ($this->_feedbackLevel=='visit')  {
            $setArray = array_merge($setArray, array("SessionID" => $this->_feedbackObjectInfo['SessionID']));
            $setArray = array_merge($setArray, array("CandID" => $this->_feedbackCandidateProfileInfo['CandID']));
            $setArray = array_merge($setArray, array("Feedback_level" => "visit"));
        } elseif ($this->_feedbackLevel=='profile')  {
            $setArray = array_merge($setArray, array("CandID" => $this->_feedbackObjectInfo['CandID']));
            $setArray = array_merge($setArray, array("Feedback_level" => "profile"));
        }
        else {
            return PEAR::raiseError("NDB_BVL_Feedback::closeThread: Unsupported Feedback Level\n");
        }
        
        $success = $db->insert('feedback_bvl_thread', $setArray);
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
        
        // INSERT entry for the the thread into the feedback_bvl_thread
        $this->createEntry($feedbackID, $comment);
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("Unable to add entry".$success->getMessage());
        }
    }

    /*
    * creates a new entry, adds a record to the feedback_bvl_entry table
    * @return void
    * @throws PEAR::Error
    */
    function createEntry($feedbackID, $comment)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // create SET array for the INSERT
        $setArray = array('FeedbackID'=>$feedbackID, 'Comment'=>$comment, 'UserID'=>$this->_username);
        
        $success = $db->insert('feedback_bvl_entry', $setArray);
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
    }
    
    /**
    * and creates a new thread entry and (if allowed) updates the selected thread's type/status/public
    * @return void
    * @throws PEAR::Error
    * @param $updateAllowed bool TRUE/FALSE is the user allowed to update the thread status
    * @param $feedbackID - thread ID (field feedback_bvl_thread.FeedbackID)
    * @param $comment
    * @param $type
    * @param $public
    * @param $status - status of the thread (field feedback_bvl_thread.Status)
    */
    function updateThread($feedbackID, $comment, $type='', $public='', $status='',$fieldname ='')
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // create user object
        $user =& User::singleton($this->_username);
        if(Utility::isErrorX($user)) {
            return "Unable to create user object".$user->getMessage();
        }
        
        // create the new entry - every update need to be follow up with a comment
        $success = $this->createEntry($feedbackID, $comment);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("Update thread, failed to create an entry: " . $success->getMessage());
        }
        
        // force private threads to status='comment'
        if ($public=='N') {
            $status = 'comment';
        } else {
            if ($public=='Y' && empty($status)) {
                $status = 'opened';
            }
        }
        // needed to avoid php complaints
        $setArray = array();
        if (!empty($status)) $setArray = array_merge($setArray, array("Status"=>$status));
        if (!empty($type))   $setArray = array_merge($setArray, array("Feedback_type"=>$type));
        if (!empty($public)) $setArray = array_merge($setArray, array("Public"=>$public));
       	if (!empty($fieldname)) $setArray = array_merge($setArray, array("FieldName"=>$fieldname));

        // needed to avoid php complaints
        $whereArray = array();       
        $whereArray = array_merge($whereArray, array("FeedbackID" => $feedbackID));

        if (is_array($setArray) && count($setArray)>0) {
            // update the thread only if the form data was changed
            $success = $db->update('feedback_bvl_thread', $setArray, $whereArray);
        }
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
    }
    
    /**
    * deleted a thread and its entries
    * @return void
    * @throws PEAR::Error
    */
    function deleteTread($feedbackID)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // DELETE the thread's entries
        $success = $db->delete('feedback_bvl_entry', array("FeedbackID"=>'$feedbackID'));
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
        
        // DELETE the thread
        $success = $db->delete('feedback_bvl_thread', array("FeedbackID"=>'$feedbackID'));
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
    }
    
    /**
    * deletes one entry of a thread
    * @return void
    * @throws PEAR:Error
    * @param string $entryID, feedback_bvl_entry.ID field
    */
    function deleteEntry($entryID)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // DELETE the thread entries
        $success = $db->delete('feedback_bvl_entry', array("ID"=>$entryID));
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
    }
    
    /**
    * activates all selected threads, including all inactive threads of lower class
    * @return void
    * @throws PEAR:Error
    */
    function activateThread($feedbackID=null)
    {
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        $user =& User::singleton($this->_username);
        if(Utility::isErrorX($user)) {
            return "Unable to create user object in activate threads: ".$user->getMessage();
        }
        
        $setArray = array("Active"=>'Y', "Testdate"=>"NULL");
        
        // only inactive threads can be activated
        $whereArray = array("Active"=>'N');
        if (!empty($feedbackID)) {
            // only one thread to be activated
            $whereArray = array_merge($whereArray, array("FeedbackID" => $feedbackID));
        } elseif (!empty($this->_feedbackObjectInfo['CommentID']))  {
            // activate all thread for the instruments
            $whereArray = array_merge($whereArray, array("CommentID" => $this->_feedbackObjectInfo['CommentID']));
        } elseif (!empty($this->_feedbackObjectInfo['SessionID']))  {
            // activate all thread for the timepoint
            $whereArray = array_merge($whereArray, array("SessionID" => $this->_feedbackObjectInfo['SessionID']));
        } elseif  (!empty($this->_feedbackObjectInfo['CandID'])) {
            // activate all thread for the candidate
            $whereArray = array_merge($whereArray, array("CandID" => $this->_feedbackObjectInfo['CandID']));
        } else {
            // at least one of the above has to be true
            return PEAR::raiseError("Error: No threads selected to activate");
        }

        // DCC users are able to activate THEIR OWN inactive threads
        if (!$user->isMultiSiteEnabled()) {
            $whereArray = array_merge($whereArray, array('UserID'=>$this->_username));
        }

        $success = $db->update('feedback_bvl_thread', $setArray, $whereArray);

        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
    }
    
    /**
    * closes all selected threads, including all active threads of lower class
    * @return void
    * @throws PEAR:Error
    */
    function closeThread($feedbackID=null)
    {
        // create user object
        $user =& User::singleton($this->_username);
        if(Utility::isErrorX($user)) {
            return "Unable to create user object".$user->getMessage();
        }

        if (!$user->isMultiSiteEnabled($this->_username)) {
            return PEAR::raiseError("User is not allowed to close threads");
        }
        
        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        $setArray = array("Status"=>'closed', "UserID"=>$this->_username, "Testdate"=>"NULL");
        
        $whereArray = array("Public"=>'Y', "Active"=>'Y');
        if (!empty($feedbackID)) {
            // only one thread to be closed
            $whereArray = array_merge($whereArray, array("FeedbackID" => $feedbackID));
        }  elseif (!empty($this->_feedbackObjectInfo['CommentID']))  {
            // close all threads for the instruments
            $whereArray = array_merge($whereArray, array("CommentID" => $this->_feedbackObjectInfo['CommentID']));
        } elseif (!empty($this->_feedbackObjectInfo['SessionID']))  {
            // close all threads for the timepoint
            $whereArray = array_merge($whereArray, array("SessionID" => $this->_feedbackObjectInfo['SessionID']));
        } elseif  (!empty($this->_feedbackObjectInfo['CandID'])) {
            // close all threads for the candidate
            $whereArray = array_merge($whereArray, array("CandID" => $this->_feedbackObjectInfo['CandID']));
        } else {
            // at least one of the above has to be true
            return PEAR::raiseError("Error: No threads selected were selected to be closed");
        }
        
        // close the threads - update feedback_bvl_thread table
        $success = $db->update('feedback_bvl_thread', $setArray, $whereArray);
        
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("dbError: " . $success->getMessage());
        }
    }
    
    /**
    * returns a [verbose] element name of the feedback_bvl_thread.Status field, i.e. feedback status
    * @param int a numerical index of the enum elements of the feedback_bvl_thread.Status field
    * @return string name of the status
    * @throws PEAR error
    * @access static
    */
    function getFeedbackStatusVerbose($statusID) 
    {
        if (empty($statusID)) return PEAR::raiseError("NDB_BVL_Feedback::getFeedbackStatusVerbose  Error, empty status ID\n");
        // new DB Object
        $db = Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        $record=array();
        // StatusID is passed in as an integer, but the field in the database is an enum, 
        // so we need to do WHERE Status+0= .. to convert it to an int (of the index into
        // the enum) so that this query works.
        $query  = "SELECT Status FROM feedback_bvl_thread WHERE Status+0=:StatID";
        $param = array('StatID' => $statusID);
        $record = $db->pselectOne($query,$param ); 
        if (Utility::isErrorX($record)) {
        	
            return PEAR::raiseError("DBError, failed to select Status from the feedback_bvl_thread for ID ($statusID)\n");
        }
        return $record;
    }
}
?>
