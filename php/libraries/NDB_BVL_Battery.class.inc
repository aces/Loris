<?php
require_once "PEAR.php";

/**
 * Behavioural battery of instruments class
 *
 * This class provides management tools for a battery of instruments
 * in the NeuroDB framework.  It is, therefore, understood that a
 * visit unique identifier is equivalent to a battery unique
 * identifier.  Thus, we use the session table's ID column to identify
 * any battery.
 * @package behavioural  
 * @access public
 */

class NDB_BVL_Battery extends PEAR
{

    /**
     * ID column of session table - identifies a visit - which is the
     * same as identifying a battery
     *
     * @access private
     */
    var $sessionID = null;

    /**
     * constructor - merely asserts that the environment is suitable
     *
     * @throws PEAR::Error
     * @return void
     * @access public
     */
    function NDB_BVL_Battery()
    {
        // assert that a global Database object exists
        if(!isset($GLOBALS['DB']))
            return $this->raiseError("No Database object exists in global scope");

        // assert that the Database object is connected
        if(!$GLOBALS['DB']->isConnected())
            return $this->raiseError("Database object is not connected");
    }

    /**
     * selects a specific visit/battery
     *
     * @param int $sessionID   the ID of the session/visit (session.ID)
     * @throws PEAR::Error
     * @return void
     * @access public
     */
    function selectBattery($sessionID)
    {
        $timepoint=TimePoint::singleton($sessionID);
        if(Utility::isErrorX($timepoint)){
        	return $this->raiseError("Invalid session ID");
        }
        
        // set the battery
        $this->sessionID = $sessionID;
        
        $timepointData=$timepoint->getData();
        $dob = $timepoint->getEffectiveDateOfBirth();
        
        if($timepointData['Date_visit'] == '0000-00-00' || empty($timepointData['Date_visit'])) $dateField = 'Date_screening';
        else $dateField = 'Date_visit';

        if(!isset($timepointData[$dateField])) {
            $testDate = null;
        } else {
            $testDate = $timepointData[$dateField];
        }

        // compute subject age
        if((!is_null($testDate)) && (!is_null($dob))) {
            $ageArray = Utility::calculateAge($dob, $testDate);
            $age = ($ageArray['year'] * 12 + $ageArray['mon']) * 30 + $ageArray['day'];
            //echo "age is:".$age."<BR>\n";
            /*
            if ($age < 0) {
                $age = 0;
            }
            */
            $this->age = $age;
        }


    } // end selectBattery()

    /**
     * asserts that no instruments are in the current battery and
     * then, based on age AND SubprojectID, adds all appropriate instruments to the
     * battery
     *
     * @param string $stage either 'visit' or 'screening' - determines
     * whether to register only screening instruments or visit
     * instruments
     * @throws PEAR::Error
     * @return void
     * @access public
     */
    function createBattery($SubprojectID, $stage=null, $visit_label=null, $center_ID=null)
    {
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if($this->isError($error)) return $error;
        
        // get the current battery (center id is irrelevant here, as is stage probably)
        $currentTests = $this->getBattery($stage, $SubprojectID, $visit_label);
        if($this->isError($currentTests)) {
            return $this->raiseError("Could not get the current list of instruments, thus unable to assert that the battery is empty");
        }

        // assert that the current battery is empty
        if(count($currentTests) > 0) {
            return $this->raiseError("Battery is not empty - will not clobber an existing battery.");
        }

        // determine the list of instruments to register
        $neededTests = $this->lookupBattery($this->age, $SubprojectID, $stage, $visit_label, $center_ID);
        if($this->isError($neededTests)) {
            return $this->raiseError("Could not lookup the battery for age $this->age and subprojectID ".$this->getSubprojectID());
        }

        // loop over the list of instruments
        foreach($neededTests AS $testName) {
            // add the instrument
            $success = $this->addInstrument($testName);

            // make sure that the addition succeeded
            if($this->isError($success)) {
                return $this->raiseError("Failed to add instrument $testName to battery");
            }
        } // end looping over the list of instruments
    } // end createBattery()
    
    /**
     * adds the specified instrument to the current battery, so long
     * as it is not already there (singleton model)
     *
     * @throws PEAR::Error
     * @return void
     * @access public
     */
    function addInstrument($testName)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if($this->isError($error)) return $error;
        
        // assert that the instrument is valid
        $error = $this->_assertValidInstrument($testName);
        if($this->isError($error)) return $error;

        // get SessionID, UserID
        $query = "SELECT ID as SessionID, UserID FROM session WHERE ID=:SID";
        $rows = $DB->pselect($query, array('SID' => $this->sessionID));
        if($this->isError($rows) || count($rows)==0) {
            return $this->raiseError("Failed to get SessionID, and UserID when trying to add $testName");
        }
        $sessionData = $rows[0];

        // generate a commentID
        $commentID = $this->_createCommentID($testName);
        if($this->isError($commentID)) {
            return $this->raiseError("Unable to generate a valid CommentID when trying to add $testName");
        }

        // insert into the test table
        $success = $DB->insert($testName, array('CommentID'=>$commentID));
        if($this->isError($success)) {
            return $this->raiseError("Unable to add storage record to $commentID $testName");
        }

        // insert into the flag table
        $success = $DB->insert('flag', array('SessionID'=>$sessionData['SessionID'],
                                                        'Test_name'=>$testName,
                                                        'CommentID'=>$commentID,
                                                        'UserID'=>$sessionData['UserID'],
                                                        'Testdate'=>null));
        if($this->isError($success)) {
            return $this->raiseError("Unable to add storage record to flag: $testName");
        }
        
        // generate the double data entry commentid
        $ddeCommentID = 'DDE_'.$commentID;

        // insert the dde into the test table
         $success = $DB->insert($testName, array('CommentID'=>$ddeCommentID));
        if($this->isError($success)) {
            return $this->raiseError("Unable to add storage record to $ddeCommentID $testName");
        }

        // insert the dde into the flag table
        $success = $DB->insert('flag', array('SessionID'=>$sessionData['SessionID'],
                                                        'Test_name'=>$testName,
                                                        'CommentID'=>$ddeCommentID,
                                                        'UserID'=>$sessionData['UserID'],
                                                        'Testdate'=>null));
        if($this->isError($success)) {
            return $this->raiseError("Unable to add storage record to flag: $testName");
        }
        
    } // end addInstrument()
    
    /**
     * removes the specified instrument from the current battery only
     * if it is part of the battery
     *
     * @throws PEAR::Error
     * @return void
     * @access public
     * @todo make it do something
     */
    function removeInstrument($testName)
    {
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if($this->isError($error)) return $error;
        
        // assert that the instrument is valid
        $error = $this->_assertValidInstrument($testName);
        if($this->isError($error)) return $error;

        
    } // end removeInstrument()
    
    /**
     * gets the array of instruments which are members of the current
     * battery
     *
     * @param string $stage either 'visit' or 'screening' - determines
     * whether to register only screening instruments or visit
     * instruments
     * @throws PEAR::Error
     * @return array    an array of instrument names
     * @access public
     */
    function getBattery($stage=null, $SubprojectID=null, $visit_label=null)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if($this->isError($error)) return $error;
        
        // craft the select query
        $query = "SELECT f.Test_name FROM ";
        $qparams = array('SID' => $this->sessionID);
        if(!is_null($stage)) {
            $query .= "test_battery AS b, ";
        }
        $query .= " flag AS f, test_names as t WHERE f.Test_name=t.Test_name AND f.SessionID=:SID AND LEFT(f.CommentID,3) != 'DDE'";

        if(!is_null($stage)) {
            if(!is_null($visit_label)) {
                $query .= " AND b.Visit_label=:VL";
                $qparams['VL']= $visit_label;
            } else {
                $query .= " OR b.Visit_label IS NULL";
            }
        }
        if(!is_null($stage)) {
            $query .= " AND t.Test_name=b.Test_name AND b.Stage=:stg";
            $qparams['stg'] = $stage;

            if(!is_null($SubprojectID)) {
                $query .= " AND (b.SubprojectID IS NULL OR b.SubprojectID=:SubprojID)";
                $qparams['SubprojID'] = $SubprojectID;
            }
        }
        
        // get the list of instruments
        $rows = array();
        $tests = array();
        $rows = $DB->pselect($query, $qparams);
        if($this->isError($rows)) {
            return $this->raiseError("Could not get battery from database");
        }

        // repackage the array
        foreach($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    } // end getBattery()

    /**
     * gets the array of instruments which are members of the current
     * battery
     *
     * @param string $stage either 'visit' or 'screening' - determines
     * whether to register only screening instruments or visit
     * instruments
     * @throws PEAR::Error
     * @return array    an associative array containing Test_name, Full_name, Sub_group, CommentID
     * @access public
     */
    function getBatteryVerbose($stage=null, $SubprojectID=null)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if($this->isError($error)) return $error;
        
        // craft the select query
        $query = "SELECT f.Test_name, t.Full_name, f.CommentID, CONCAT('DDE_', f.CommentID) AS DDECommentID, ts.Subgroup_name as Sub_group FROM flag AS f, test_names as t, test_subgroups as ts ";
        $qparams = array('SID' => $this->sessionID);

        if(!is_null($stage)) {
            $query .= ", test_battery AS b";
        }
        $query .= " WHERE ts.ID = t.Sub_group AND f.Test_name=t.Test_name AND f.SessionID=:SID AND LEFT(f.CommentID, 3) != 'DDE'";

        if(!is_null($stage)) {
            $query .= " AND t.Test_name=b.Test_name AND b.Stage=:stg";
            $qparams['stg'] = $stage;

            if(!is_null($SubprojectID)) {
                $query .= " AND (b.SubprojectID IS NULL OR b.SubprojectID=:SubprojID)";
                $qparams['SubprojID'] = $SubprojectID;
            }
        }

        $query .= "ORDER BY Sub_group, Full_name";

        // get the list of instruments
        $rows = $DB->pselect($query, $qparams);
        if($this->isError($rows)) {
            return $this->raiseError("Could not get battery from database");
        }

        // return all the data selected
        return $rows;
    } // end getBatteryVerbose()

    function isDoubleDataEntryEnabledForInstrument($instrumentName)
    {
        
        $config =& NDB_Config::singleton();
        $doubleDataEntryInstruments= $config->getSetting("DoubleDataEntryInstruments");
		print_r($doubleDataEntryInstruments);
        return in_array($instrumentName,$doubleDataEntryInstruments);


    }

    function getInstrumentNameForCommentId($commentId) {
        $db =& Database::singleton();
        $query = "SELECT Test_name FROM flag WHERE CommentID=:CID";
        $instrumentName = $db->pselectOne($query, array('CID' => $commentId));
        return $instrumentName;
    }

    /**
     * looks up the appropriate battery for the current visit, based
     * on age AND subproject
     *
     * @throws PEAR::Error
     * @param int $age   the age of the subject, in months
     * @param string $stage either 'visit' or 'screening' - determines
     * whether to register only screening instruments or visit
     * instruments
     * @return array  an array of instrument names
     * @access public
     */
    function lookupBattery($age, $SubprojectID, $stage=null, $visit_label=null, $center_ID=null)
    {
        $DB = Database::singleton();
        if(empty($this->age)) {
            $this->age = $age;
        }
        $qparams = array(
            'vAge' => $this->age,
            'SubprojID' => $SubprojectID
        );
        // The query to lookup the battery uses the min/max age ranges if they are not 0 
        $query = "SELECT t.Test_name FROM test_battery AS b, test_names AS t WHERE t.Test_name=b.Test_name AND 
            ((b.AgeMinDays=0 AND b.AgeMaxDays=0) OR (b.AgeMinDays<= :vAge AND b.AgeMaxDays >= :vAge)) 
            AND b.Active='Y' AND (SubprojectID=:SubprojID OR SubprojectID IS NULL)";

        if(!is_null($visit_label)) {
            $VisitBatteryExists = $DB->pselectOne("SELECT count(*) FROM test_battery WHERE Visit_label =:VL AND SubprojectID=:SubID", array('VL' => $visit_label, 'SubID' => $SubprojectID));
            if($VisitBatteryExists > 0) {
                $query .= " AND b.Visit_label=:VL";
                $qparams['VL'] = $visit_label;
            } else {
                $query .= " AND b.Visit_label IS NULL";
            }
        } 
        if(!is_null($stage)) {
            $query .= " AND b.Stage=:stg";
            $qparams['stg'] = $stage;
        }

	if(!is_null($center_ID)) {  // return all instruments that match this center or all centers (null)
            $query .= " AND (b.CenterID=:CID OR b.CenterID IS NULL)";
            $qparams['CID'] = $center_ID;
    } else {
            $query .= " AND b.CenterID IS NULL"; // Unless the center is specified & matched, don't return site-restricted instruments
        }

        // get the list of instruments
        $tests = array();
        $rows = $DB->pselect($query, $qparams);
        if($this->isError($rows)) {
            return $this->raiseError("Could not lookup battery from database");
        }

        // repackage the array
        foreach($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    } // end lookupBattery()
     
    /**
     * creates a new unique commentID for the given instrument in the
     * current battery
     *
     * @throws PEAR::Error
     * @return string   the commentID generated
     * @access private
     */
    function _createCommentID($testName)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if($this->isError($error)) return $error;
        
        // assert that the instrument is valid
        $error = $this->_assertValidInstrument($testName);
        if($this->isError($error)) return $error;

        // create timepoint object
        $timepoint =& TimePoint::singleton($this->sessionID);
        if(Utility::isErrorX($timepoint)) 
            return $this->raiseError("Could not create timepoint object: ".$timepoint->getMessage());

        // create candidate object
        $candidate =& Candidate::singleton($timepoint->getCandID());
        if(Utility::isErrorX($candidate)) 
            return $this->raiseError("Could not create candidate object: ".$candidate->getMessage());

        // get test_names.ID
        $query = "SELECT ID FROM test_names WHERE Test_name=:TN";
        $row = $DB->pselectRow($query, array('TN' => $testName));
        if(Utility::isErrorX($row)) {
            return $this->raiseError("DB Error: ".$row->getMessage());
        }
        $testID = $row['ID'];

        // formula for CommentID = concat(session.CandID,
        // session.PSCID, session.ID, session.SubprojectId, test_names.ID, timestamp)
        $commentID = $candidate->getCandID()
            . $candidate->getPSCID()
            . $timepoint->getSessionID()
            . $timepoint->getSubprojectID()
            . $testID
            . time();

        return $commentID;
        
    } // end _createCommentID()
    
    /**
     * asserts that the current battery object corresponds to a
     * specific visit (in other words, asserts that selectBattery has
     * been run
     *
     * @return mixed   true if a battery is selected, a PEAR::Error otherwise
     * @access private
     */
    function _assertBatterySelected()
    {
        if(is_null($this->sessionID))
            return $this->raiseError("No battery selected");
        return true;
    } // end _assertBatterySelected()

    /**
     * asserts that the specified instrument name is valid
     *
     * @return mixed   true if valid, false if not, a PEAR::Error if hell breaks loose
     * @access private
     */
    function _assertValidInstrument($testName)
    {
        $DB = Database::singleton();
        $query = "SELECT count(*) as counter FROM test_names WHERE Test_name=:TN";
        $row = $DB->pselectRow($query, array('TN' => $testName));
        if(Utility::isErrorX($row)) {
            return $this->raiseError("DB Error: ".$row->getMessage());
        }

        return $row['counter'] >= 1;
    } // end _assertValidInstrument()
}
