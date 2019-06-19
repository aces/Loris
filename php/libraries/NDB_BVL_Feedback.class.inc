<?php
/**
 * This is legacy code that should be rewritten, but is currently used - Dave
 *
 * Original file document comments below:
 *
 * missing code in update thread to move to answered if PSC, and to preserve
 * comment in all cases
 *
 * missing QC status and in .php file the req.actio value {$required
 *   action }/per thread to automatically make the proper form field.
 *
 * missing error display row in each form (already working in cose/activate
 * forms)
 *
 * missing general error display and per thread(form)
 *
 * need error trapping to prevent screen display in case of all failures
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
use \Loris\StudyEntities\Candidate\CandID;

/**
 * A NDB_BVL_Feedback object wraps access to behavioural feedback related
 * tables.
 *
 * @category Behavioural
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Feedback
{
    // contains info necessary to structure the object
    var $_feedbackObjectInfo = [];

    // contains full candidate profile/timepoint/instrument info
    var $_feedbackCandidateProfileInfo = [];

    // set of status options
    var $_feedbackStatusOptions = array(
                                   'opened',
                                   'answered',
                                   'closed',
                                   'comment',
                                  );

    var $_username ='';

    var $_feedbackLevel ='';

    /**
     * Static function to return a feedback object. Only one will ever be
     * instantiated. Note that ANY of $candID, $sessionID, or $commentID
     * can be passed but not necessarily all of them, depending on which
     * page is receiving feedback.
     *
     * @param string   $username  The currently logged in user (why?)
     * @param ?CandID  $candID    The 6 digit CandID
     * @param ?integer $sessionID The session ID with feedback
     * @param ?string  $commentID The commentID receiving feedback.
     *
     * @return NDB_BVL_Feedback object
     */
    static function &singleton(
        $username,
        ?CandID $candID=null,
        $sessionID=null,
        $commentID=null
    ) {
        // at least one of the args have to be passed
        if (empty($candID) && empty($sessionID) && empty($commentID)) {
            throw new Exception(
                "You need to pass at least one of the following when creating "
                . " the Feedback Object: CandID, SessionID, or CommentID"
            );
        }

        static $feedbackList = array();

        $objectName = md5(
            sprintf(
                "c%ss%si%s",
                $candID,
                $sessionID ?? '',
                $commentID ?? ''
            )
        );

        if (!isset($feedbackList[$objectName])) {
            try {
                $feedbackList[$objectName] = new NDB_BVL_Feedback();
                $feedbackList[$objectName]->setup(
                    $username,
                    $candID,
                    $sessionID,
                    $commentID
                );
            } catch(Exception $e) {
                unset($feedbackList[$objectName]);
                throw new Exception(
                    "Could not instantiate feedback object",
                    0,
                    $e
                );
            }
        }

        return $feedbackList[$objectName];
    }

    /**
     * Sets up a newly instantiated feedback thread object
     *
     * @param string  $username  The name of the currently logged in user.
     *                          (why is this here?)
     * @param ?CandID $candID    The CandID we're getting a feedback thread for.
     * @param ?string $sessionID The sessionID we're getting a feedback thread for.
     * @param ?string $commentID The commentID we're getting a feedback thread for.
     *
     * @return void
     */
    function setup(
        string $username,
        ?CandID $candID=null,
        $sessionID=null,
        $commentID=null
    ) {

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
            throw new Exception(
                "You need to pass at least one of the following to setup the "
                . "Feedback Object: CandID, SessionID, or CommentID"
            );
        }

        $this->_username = $username;

        // get CandID (and SessionID)
        $this->_setCandidateProfileInfo();
    }

    /**
     * Retrieves candidate profile info for the feedback object
     * When you pass SessionID and CommentID, you'll need additional profile info
     * to be able to complete various queries.
     *
     * @return void
     */
    function _setCandidateProfileInfo()
    {
        // new DB Object
        $db =& Database::singleton();

        // SELECT section
        $query = "SELECT c.CandID";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", SessionID";
        }

        $query  .= " FROM candidate as c";
        $qparams = array();

        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= " JOIN session as s
                          ON (c.CandID=s.CandID)
                        JOIN flag as f
                          ON (f.SessionID=s.ID)
                        WHERE f.CommentID = :ComID";

            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query .= " JOIN session as s
                          ON (s.CandID=c.CandID)
                        WHERE s.ID = :SID";

            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query          .= " WHERE c.CandID = :CaID";
            $qparams['CaID'] = (string) $this->_feedbackObjectInfo['CandID'];
        } else {
            throw new Exception(
                "You need to pass at least one of the following to setup "
                . "the Feedback Object: CandID, SessionID, or CommentID"
            );
        }
        $query .= " LIMIT 1";

        $result = $db->pselect($query, $qparams);
        if (!is_array($result) || count($result) == 0) {
            throw new Exception(
                "Error, unable to select data for the feedback object"
            );
        }

        $this->_feedbackCandidateProfileInfo['CandID'] = $result[0]['CandID'];
        if (isset($result[0]['SessionID'])
            || isset($this->_feedbackObjectInfo['SessionID'])
        ) {
            $this->_feedbackCandidateProfileInfo['SessionID']
                = $result[0]['SessionID'] ?? $this->_feedbackObjectInfo['SessionID'];
        }
    }

    /**
     * Get feedback level of currently instantiated thread object
     *
     * @return string feedback_level (either profile, visit, or instrument)
     */
    function getFeedbackLevel()
    {
        return $this->_feedbackLevel;
    }

    /**
     * Returns an array of feedback types array format: [Type][Name, Label]
     *
     * @return array
     */
    static public function getFeedbackTypes()
    {
        // new DB Object

        $query = "SELECT Feedback_type as Type, Name, Description
            FROM feedback_bvl_type";

        $result = \Database::singleton()->pselect($query, array());

        $list = array();
        foreach ($result as $record) {
            $list[$record['Type']] = array(
                                      'Type'  => $record['Type'],
                                      'Name'  => $record['Name'],
                                      'Label' => $record['Description'],
                                     );
        }
        return $list;
    }


    /**
     * Get feedback type id given the feedback type name
     *
     * @param string $name feedback type name
     *
     * @return int feedback type id, empty array if none found
     */
    public function getFeedbackTypeIdByName($name)
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->Database();

        $query = "SELECT  `Feedback_type`
                    FROM  `feedback_bvl_type`
                    WHERE  `Name` =  :name ";

        return $db->pselectOne($query, array(':name' => $name));
    }

    /**
     * Create new feedback type
     *
     * @param string $name        feedback type name
     * @param string $description feedback type description
     *
     * @return int feedback type id
     * @throws DatabaseException
     * @throws LorisException
     */
    public function createFeedbackType($name, $description = null)
    {
        if (empty($name) || strlen($name)>100 ) {
            throw new LorisException("Invalid feedback type name");
        }

        if (empty($description)) {
            $description = null;
        }

        $factory = NDB_Factory::singleton();
        $db      = $factory->Database();

        $values = array(
                   'Name'        => $name,
                   'Description' => $description,
                  );
        $db->insert("feedback_bvl_type", $values);
        return $db->getLastInsertId();
    }

    /**
     * Returns a type of the thread identified by the FeedbackID
     *
     * @param integer $feedbackID ID of the thread whose type we want to get
     *
     * @return string feedback type of the thread
     * @author Evan McIlroy <evanmcilroy@gmail.com>
     */
    function getThreadType($feedbackID)
    {
        // new DB Object
        $db =& Database::singleton();

        $query = "SELECT Name FROM feedback_bvl_thread
                  JOIN feedback_bvl_type ON
                  feedback_bvl_type.Feedback_type = feedback_bvl_thread.Feedback_type
                  WHERE feedback_bvl_thread.FeedbackID = :FID";

        $result = $db->pselectOne($query, array('FID' => $feedbackID));
        return $result;
    }

    /**
     * Return the hex code of the status color defined in config.xml
     *
     * @param string $status The status for which we want to get the colour
     *
     * @return string color hex code (format #xxxxxx)
     */
    static function getThreadColor($status)
    {
        if (empty($status)) {
            return '';
        }

        $smarty = new Smarty_neurodb;
        // What does this do?
        $smarty->ConfigLoad('default.conf', 'bvlqc');
        return $smarty->getConfigVars($status);
    }

    /**
     * Get the status of the given thread.
     *
     * @param integer $feedbackID The feedback thread ID to get the status of
     *
     * @return string The current status.
     */
    function getThreadStatus($feedbackID)
    {
        // new DB Object
        $db =& Database::singleton();

        $query = "SELECT Status FROM feedback_bvl_thread WHERE FeedbackID = :FID";

        $result = $db->pselectOne($query, array('FID' => $feedbackID));
        return $result;
    }

    /**
     * This function returns the greatest type of active feedback for the
     * candidate/timepoint/instrument
     *
     * @param string $select_inactive_threads If non-empty returns inactive
     *                                        threads, otherwise only returns
     *                                        active threads
     *
     * @return string the higest-order status of an active thread
     */
    function getMaxThreadStatus($select_inactive_threads)
    {
        // new DB Object
        $db =& Database::singleton();

        $query   = "SELECT MAX(Status) FROM feedback_bvl_thread WHERE";
        $qparams = array();
        if (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query         .= " CandID = :CID";
            $qparams['CID'] = $this->_feedbackObjectInfo['CandID'];
        }
        if (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query         .= " SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        }
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query           .= " CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        }
        if (empty($select_inactive_threads)) {
            $query .= " AND Active = 'Y'";
        }

        $query .= " ORDER BY Status ASC";
        $result = $db->pselectOne($query, $qparams);

        if (!empty($result)) {
            return $result;
        }
        return null;
    }

    /**
     * Returns the thread count for candidate/timepoint/instrument
     *
     * @return string thread count
     */
    function getThreadCount()
    {
        // new DB Object
        $db =& Database::singleton();

        $query   = "SELECT COUNT(*)
            FROM feedback_bvl_thread
            WHERE Active ='Y' AND Public = 'Y' AND Status <> 'closed'";
        $qparams = array();
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query           .= " AND CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
            $queryBy          = " CommentID";
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query         .= " AND SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
            $queryBy        = " SessionID";
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query           .= " AND CandID = :CanID";
            $qparams['CanID'] = $this->_feedbackObjectInfo['CandID'];
            $queryBy          = " CandID";
        } elseif (!empty($this->_feedbackObjectInfo['FieldName'])) {
            $query           .=     " AND FieldName = :FName";
            $qparams['FName'] = $this->_feedbackObjectInfo['FieldName'];
            $queryBy          = " FieldName";
        } else {
            throw new Exception("no CandID, SessionID, CommentID provided");
        }
        $query .= " GROUP BY $queryBy";

        $success = $db->pselectOne($query, $qparams);
        return $success;
    }

    /**
     * Returns the bvl feedback threads count for a candidate/timepoint/instrument
     *
     * @return array array of threads
     */
    function getSummaryOfThreads()
    {
        // new DB Object
        $db =& Database::singleton();

        // get User object
        $user =& User::singleton($this->_username);
        $hasReadPermission = $user->hasPermission('access_all_profiles');

        $query = "SELECT c.CandID as CandID,
                    c.PSCID as PSCID,
                    c.Ethnicity,
                    c.Sex,
                    s.ID as SessionID,
                    s.Visit_label as Visit,
                    ft.Feedback_level as QC_Class,
                    COUNT(ft.FeedbackID) as No_Threads";
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= ", f.Test_name as Instrument, ft.CommentID";
        }
        $query  .= " FROM candidate as c
                        JOIN feedback_bvl_thread as ft ON (c.CandID=ft.CandID)
                        LEFT JOIN session as s ON (s.ID = ft.SessionID)";
        $qparams = array();
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " LEFT JOIN flag as f ON (ft.CommentID = f.CommentID)";
        }
        $query .= " WHERE ft.Active ='Y'";
        if (!$hasReadPermission===true) {
            $query            .= " AND FIND_IN_SET(s.CenterID, :CentID)";
            $qparams['CentID'] = implode(',', $user->getCenterIDs());
        }

        $query .= " AND Public = 'Y' AND Status <> 'closed'";
        if (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query          .= " AND ft.CandID = :CaID";
            $qparams['CaID'] = $this->_feedbackObjectInfo['CandID'];
        }

        if (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query         .= " AND ft.SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        }
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query          .= " AND ft.SessionID = :CSID";
            $qparams['CSID'] = $this->_feedbackCandidateProfileInfo['SessionID'];
        }
        $query .= " GROUP BY ft.CandID, ft.Feedback_level, ft.SessionID";
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= ", ft.CommentID";
        }
        $query .= " ORDER BY ft.CandID, ft.Feedback_level";

        $result = $db->pselect($query, $qparams);

        return $result;
    }

    /**
     * Returns the list of feedback threads
     *
     * @return array
     */
    function getThreadList()
    {
        // new DB Object
        $db =& Database::singleton();

        // create user object
        $user =& User::singleton($this->_username);
        $hasReadPermission = $user->hasPermission('access_all_profiles');

        $query   = "SELECT c.CandID as CandID, c.PSCID as PSCID";
        $qparams = array();
        if (!empty($this->_feedbackObjectInfo['SessionID'])
            || !empty($this->_feedbackObjectInfo['CommentID'])
        ) {
            $query .= ", s.VisitNo as Visit, s.SubprojectID, s.ID as SessionID";
        }

        $query .= ", ft.FeedbackID,
                     ft.Feedback_level as QCClass,
                     ftp.Description as Type,
                     ftp.Feedback_type as TypeID,
                     ft.Status as QCStatus,
                     ft.Active as Active,
                     ft.Public as Public,
                     ft.FieldName,
                     ft.UserID as User,
                     ft.Date_taken as Date,
                     DATE_FORMAT(ft.Testdate, '%Y-%m-%d') as Modified";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", f.Test_name as Instrument, f.CommentID";
        }

        $query .= " FROM candidate as c
                     JOIN feedback_bvl_thread as ft
                         ON (c.CandID=ft.CandID)
                     LEFT JOIN session as s
                         ON (s.ID = ft.SessionID)
                     JOIN feedback_bvl_type as ftp
                         ON (ftp.Feedback_type=ft.Feedback_type)";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", flag as f";
        }

        // FIXME: This clause is kept here so that the ANDs below don't
        // cause SQL syntax errors on any code paths.
        // This would make more sense to put in an array and then
        // call "join($arrayname, ", ") at the end to construct the string.
        $query .= " WHERE ftp.Feedback_type = ft.Feedback_type";

        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query           .= " AND ft.SessionID = :SID";
            $query           .= " AND ft.CommentID = :ComID
                                  AND ft.CommentID = f.CommentID";
            $qparams['SID']   = $this->_feedbackCandidateProfileInfo['SessionID'];
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query         .= " AND ft.SessionID = :SID AND ft.CommentID is null";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query          .= " AND ft.CandID = :CaID
                                 AND ft.SessionID IS NULL
                                 AND ft.CommentID IS NULL";
            $qparams['CaID'] = $this->_feedbackObjectInfo['CandID'];
        } else {
            throw new Exception(
                "You need to pass at least one of the following to retrieve the"
                . " list of thread: CandID, SessionID, or CommentID"
            );
        }

        // DCC users should be able to see THEIR OWN inactive threads,
        // other users should see only active threads
        if ($hasReadPermission===true) {
            $query .= " AND (ft.Active='Y' OR
                (ft.Active='N' AND ft.UserID=:Username)
            )";
            $qparams['Username'] = $this->_username;
        } else {
            $query            .= " AND ft.Active ='Y' 
                                   AND FIND_IN_SET(s.CenterID, :CentID)";
            $qparams['CentID'] = implode(',', $user->getCenterIDs());
        }

        $query .= " ORDER BY ft.CandID,
                             ft.Feedback_level,
                             ft.Status,
                             ft.Testdate DESC";

            $result = $db->pselect($query, $qparams);

        return $result;
    }

    /**
    * Returns the list of entries for the thread
    *
    * @param string $feedbackID feedback_bvl_thread.FeedbackID field
    *
    * @return array
    */
    static function getThreadEntries($feedbackID)
    {
        // new DB Object
        $db =& Database::singleton();

        //select the entries (details) for the thread
        $query
            = "SELECT
                  fe.ID as EntryID,
                  fe.FeedbackID,
                  fe.Comment,
                  fe.UserID as UserID,
                  DATE_FORMAT(fe.Testdate, '%Y-%m-%d') as Date
             FROM feedback_bvl_thread as ft,
                  feedback_bvl_entry as fe,
                  feedback_bvl_type as ftp
             WHERE ft.FeedbackID = :FID
                   AND ft.FeedbackID = fe.FeedbackID
                   AND ft.Feedback_type = ftp.Feedback_type
             ORDER BY ft.FeedbackID, fe.Testdate DESC";

        $result = $db->pselect($query, array('FID' => $feedbackID));

        return $result;
    }

    /**
     * Creates a new behavioural feedback thread
     *
     * @param string  $level     Feedback level
     * @param integer $type      Feedback type ID
     * @param string  $comment   The content of the thread
     * @param string  $public    Y or N depending on if the thread is public
     * @param string  $fieldname Optional fieldname for the thread to be
     *                           attached to
     *
     * @return array
     * As we need the values in this array in dynamic front-end calls.
     *
     * @throws DatabaseException
     * @throws Exception
     */
    function createThread($level, $type, $comment, $public=null,$fieldname=null)
    {
        // new DB Object
        $DB = Database::singleton();

        // public threads are inactive by default
        if ($public == 'Y') {
            $status = 'opened'; // default status
        } elseif ($public == 'N') {
            $status = 'comment';
        } else {
            throw new Exception(
                "Please select a 'Required Action?'"
                . " for the new feedback you want to create"
            );
        }
        $today = date("Y-m-d");

        // disabling post new feedback option, activate all threads
        $active = 'Y';

        // create SET array for the INSERT into the feedback_bvl_thread table
        $setArray = array(
                     'FeedbackID'    => null,
                     'Feedback_type' => $type,
                     'Public'        => $public,
                     'Status'        => $status,
                     'Active'        => $active,
                     'Date_taken'    => $today,
                     'UserID'        => $this->_username,
                    );
        if ($level == 'instrument' || $this->_feedbackLevel=='instrument') {
            $feedbackInfo =& $this->_feedbackCandidateProfileInfo;

            $setArray = array_merge(
                $setArray,
                array(
                 "CommentID"      => $this->_feedbackObjectInfo['CommentID'],
                 "SessionID"      => $feedbackInfo['SessionID'],
                 "CandID"         => $feedbackInfo['CandID'],
                 "Feedback_level" => "instrument",
                 "FieldName"      => $fieldname,
                )
            );

        } elseif ($level == 'visit' || $this->_feedbackLevel=='visit') {
            $setArray = array_merge(
                $setArray,
                array(
                 "SessionID"      => $this->_feedbackObjectInfo['SessionID'],
                 "CandID"         => $this->_feedbackCandidateProfileInfo['CandID'],
                 "Feedback_level" => "visit",
                )
            );
        } elseif ($level == 'profile' || $this->_feedbackLevel=='profile') {
            $setArray = array_merge(
                $setArray,
                array(
                 "CandID"         => $this->_feedbackObjectInfo['CandID'],
                 "Feedback_level" => "profile",
                )
            );
        } else {
            throw new Exception(
                "NDB_BVL_Feedback::closeThread: Unsupported Feedback Level\n"
            );
        }

        $DB->insert('feedback_bvl_thread', $setArray);

        // get the FeedbackID for the new thread
        $feedbackID = $DB->getLastInsertId();

        // INSERT entry for the the thread into the feedback_bvl_thread
        $this->createEntry($feedbackID, $comment, $this->_username);

        $newEntryValues = array();
        $newEntryValues["feedbackID"] = $feedbackID;
        $newEntryValues["comment"]    = $comment;
        if ($fieldname != null) {
            $newEntryValues["fieldname"] = $fieldname;
        } else {
            $newEntryValues["fieldname"] = '';
        }
        $newEntryValues["user"] = $this->_username;
        $newEntryValues["date"] = $today;
        $newEntryValues["type"] = $this->getThreadType($feedbackID);
        //These new entries are returned to be used mostly dynamic rendering of
        //new threads on the front-end
        return $newEntryValues;

    }

    /**
     * Creates a new entry under a thread, adds a record to the
     * feedback_bvl_entry table
     *
     * @param integer $feedbackID The threadID to hold the entry being created
     * @param string  $comment    The comment to add to the entry.
     * @param string  $username   The username of the entry author.
     *
     * @return array
     */
    function createEntry($feedbackID, $comment, $username): array
    {
        // new DB Object
        $db =& Database::singleton();

        // create SET array for the INSERT
        $setArray = array(
                     'FeedbackID' => $feedbackID,
                     'Comment'    => $comment,
                     'UserID'     => $username,
                    );

        $db->insert('feedback_bvl_entry', $setArray);

        // Returning the set array so the data can be returned as JSON to the GUI.
        return $setArray;
    }

    /**
     * Creates a new thread entry and (if allowed) updates the selected
     * thread's type/status/public
     *
     * @param integer  $feedbackID Thread ID being updated
     * @param string   $comment    The comment to update the thread to
     * @param ?integer $type       The typeID to update Feedback_type to
     * @param string   $public     Y or N to update thread's public status to
     * @param string   $status     Status of the thread (options from
     *                            feedback_bvl_thread.Status)
     * @param string   $fieldname  The optional fieldname that the thread is in
     *                            reference to.
     *
     * @return void
     */
    function updateThread(
        $feedbackID,
        $comment,
        $type=null,
        $public='',
        $status='',
        $fieldname =''
    ) {
        // new DB Object
        $db =& Database::singleton();

        // create the new entry - every update need to be follow up with a comment
        // FIXME: I don't think the third parameter is correct, but I'm not sure
        // what it's supposed to be, and I'm not sure if this code is even used
        // at all.
        $success = $this->createEntry($feedbackID, $comment, '');

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
        if (!empty($status)) {
            $setArray = array_merge($setArray, array("Status" => $status));
        }
        if (!empty($type)) {
            $setArray = array_merge($setArray, array("Feedback_type" => $type));
        }
        if (!empty($public)) {
            $setArray = array_merge($setArray, array("Public" => $public));
        }
        if (!empty($fieldname)) {
            $setArray = array_merge($setArray, array("FieldName" => $fieldname));
        }

        // needed to avoid php complaints
        $whereArray = array();
        $whereArray = array_merge($whereArray, array("FeedbackID" => $feedbackID));

        if (is_array($setArray) && count($setArray)>0) {
            // update the thread only if the form data was changed
            $success = $db->update('feedback_bvl_thread', $setArray, $whereArray);
        }

    }

    /**
     * Deleted a thread and its entries
     *
     * @param integer $feedbackID The ID of the feedback thread being closed
     *
     * @return void
     */
    function deleteThread($feedbackID)
    {
        // new DB Object
        $db =& Database::singleton();

        // DELETE the thread's entries
        $success = $db->delete(
            'feedback_bvl_entry',
            array("FeedbackID" => $feedbackID)
        );

        // DELETE the thread
        $success = $db->delete(
            'feedback_bvl_thread',
            array("FeedbackID" => '$feedbackID')
        );

    }

    /**
     * Deletes one single entry of a thread
     *
     * @param string $entryID feedback_bvl_entry.ID field
     *
     * @return void
     */
    function deleteEntry($entryID)
    {
        // new DB Object
        $db =& Database::singleton();

        // DELETE the thread entries
        $db->delete('feedback_bvl_entry', array("ID" => $entryID));
    }

    /**
     * Activates all selected threads, including all inactive threads of lower class
     *
     * @param integer $feedbackID The ID of the feedback thread being closed
     *
     * @return void
     */
    function activateThread($feedbackID=null)
    {
        // new DB Object
        $db =& Database::singleton();

        $setArray = array(
                     "Active"   => 'Y',
                     "Testdate" => "NULL",
                    );

        // only inactive threads can be activated
        $whereArray = array("Active" => 'N');
        if (!empty($feedbackID)) {
            // only one thread to be activated
            $whereArray = array_merge(
                $whereArray,
                array("FeedbackID" => $feedbackID)
            );
        } elseif (!empty($this->_feedbackObjectInfo['CommentID'])) {
            // activate all thread for the instruments
            $whereArray = array_merge(
                $whereArray,
                array("CommentID" => $this->_feedbackObjectInfo['CommentID'])
            );
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            // activate all thread for the timepoint
            $whereArray = array_merge(
                $whereArray,
                array("SessionID" => $this->_feedbackObjectInfo['SessionID'])
            );
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            // activate all thread for the candidate
            $whereArray = array_merge(
                $whereArray,
                array("CandID" => $this->_feedbackObjectInfo['CandID'])
            );
        } else {
            // at least one of the above has to be true
            throw new Exception("Error: No threads selected to activate");
        }

        $db->update('feedback_bvl_thread', $setArray, $whereArray);
    }

    /**
     * Closes all selected threads, including all active threads of lower class
     *
     * @param integer $feedbackID The ID of the feedback thread being closed
     *
     * @return void
     *  FIXME: This shares a lot of code from activateThread, it should be
     *         refactored
     * FIXME: This needs to properly check for sites.
     */
    function closeThread($feedbackID=null)
    {
        // new DB Object
        $db =& Database::singleton();

        $setArray = array(
                     "Status" => 'closed',
                     "UserID" => $this->_username,
                    );

        $whereArray = array(
                       "Public" => 'Y',
                       "Active" => 'Y',
                      );
        if (!empty($feedbackID)) {
            // only one thread to be closed
            $whereArray = array_merge(
                $whereArray,
                array("FeedbackID" => $feedbackID)
            );
        } elseif (!empty($this->_feedbackObjectInfo['CommentID'])) {
            // close all threads for the instruments
            $whereArray = array_merge(
                $whereArray,
                array("CommentID" => $this->_feedbackObjectInfo['CommentID'])
            );
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            // close all threads for the timepoint
            $whereArray = array_merge(
                $whereArray,
                array("SessionID" => $this->_feedbackObjectInfo['SessionID'])
            );
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            // close all threads for the candidate
            $whereArray = array_merge(
                $whereArray,
                array("CandID" => $this->_feedbackObjectInfo['CandID'])
            );
        } else {
            // at least one of the above has to be true
            throw new Exception(
                "Error: No threads selected were selected to be closed"
            );
        }

        // close the threads - update feedback_bvl_thread table
        $db->update('feedback_bvl_thread', $setArray, $whereArray);
    }

    /**
     * Used to re-open a thread identified by its feedbackID.
     *
     * @param integer $feedbackID The ID of the feedback thread being closed
     *
     * @author Evan McIlroy <evanmcilroy@gmail.com>
     *
     * @return void
     */
    function openThread($feedbackID)
    {
        $db =& Database::singleton();

        $setArray = array(
                     "Status" => 'opened',
                     "UserID" => $this->_username,
                    );

        $whereArray = array(
                       "Public" => 'Y',
                       "Active" => 'Y',
                      );
        if (!empty($feedbackID)) {
            // only one thread to be closed
            $whereArray = array_merge(
                $whereArray,
                array("FeedbackID" => $feedbackID)
            );
        }

        $db->update('feedback_bvl_thread', $setArray, $whereArray);

    }

    /**
     * Returns a [verbose] element name of the feedback_bvl_thread.
     *
     * Status field, i.e. feedback status
     *
     * @param integer $statusID a numerical index of the enum elements
     *                          of the feedback_bvl_thread.Status field
     *
     * @return string name of the status
     */
    static function getFeedbackStatusVerbose($statusID)
    {
        if (empty($statusID)) {
            throw new Exception(
                "NDB_BVL_Feedback::getFeedbackStatusVerbose "
                . "Error, empty status ID\n"
            );
        }
        // new DB Object
        $db = Database::singleton();

        $record =array();
        // StatusID is passed in as an integer, but the field in the database
        // is an enum, so we need to do WHERE Status+0= .. to convert it to
        // an int (of the index into the enum) so that this query works.
        $query  = "SELECT Status FROM feedback_bvl_thread WHERE Status+0=:StatID";
        $param  = array('StatID' => $statusID);
        $record = $db->pselectOne($query, $param);
        return $record;
    }

    /**
     * This function is currently used to check whether or not to render
     * the bvl_feedback_icon in main.tpl. It checks if the user has the
     * bvl feedback permission first, if the user has the permissions it
     * then checks if the user is on the timepoint_list, instrument_list
     * or on any instrument page.
     *
     * Returns false if the user doesn't have the appropriate permissions
     * or is not on one of the appropriate pages to return bvl_feedback.
     *
     * @param string $test_name The name of the test to be checked.
     *
     * @return bool
     * @throws ConfigurationException
     * @throws Exception
     * @author Evan McIlroy <evanmcilroy@gmail.com>
     */
    static function bvlFeedbackPossible(string $test_name): bool
    {
        if (\User::singleton()->hasPermission('bvl_feedback')) {
            if (($test_name === "timepoint_list")
                || ($test_name === "instrument_list")
            ) {
                return true;
            } else {
                $instruments_q = \NDB_Factory::singleton()->database()
                    ->pselectOne(
                        "SELECT Count(*) FROM test_names WHERE Test_name=:testName",
                        array('testName' => $test_name)
                    );
                if ($instruments_q == 1) {
                    return true;
                }
            }
        }
        return false; //returning false when user is not on appropriate study site
    }
}
