<?php
/**
 * Behavioural battery of instruments class
 *
 * This class provides management tools for a battery of instruments
 * in the NeuroDB framework.  It is, therefore, understood that a
 * visit unique identifier is equivalent to a battery unique
 * identifier.  Thus, we use the session table's ID column to identify
 * any battery.
 *
 * PHP Version 5
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   Alex Zijdenbos <zijdenbos@example.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once "PEAR.php";

/**
 * Class that implements a wrapper around a Loris battery.
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   Alex Zijdenbos <zijdenbos@example.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
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
     * Constructor - merely asserts that the environment is suitable
     */
    function NDB_BVL_Battery()
    {
        // assert that a global Database object exists
        if (!isset($GLOBALS['DB'])) {
            return $this->raiseError("No Database object exists in global scope");
        }

        // assert that the Database object is connected
        if (!$GLOBALS['DB']->isConnected()) {
            return $this->raiseError("Database object is not connected");
        }
    }

    /**
     * Selects a specific visit/battery
     *
     * @param integer $sessionID the ID of the session/visit (session.ID)
     *
     * @return void
     */
    function selectBattery($sessionID)
    {
        $timepoint =TimePoint::singleton($sessionID);
        if (Utility::isErrorX($timepoint)) {
            return $this->raiseError("Invalid session ID");
        }

        // set the battery
        $this->sessionID = $sessionID;

        $timepointData =$timepoint->getData();
        $dob           = $timepoint->getEffectiveDateOfBirth();

        if ($timepointData['Date_visit'] == '0000-00-00'
            || empty($timepointData['Date_visit'])
        ) {
            $dateField = 'Date_screening';
        } else {
            $dateField = 'Date_visit';
        }

        if (!isset($timepointData[$dateField])) {
            $testDate = null;
        } else {
            $testDate = $timepointData[$dateField];
        }

        // compute subject age
        if ((!is_null($testDate)) && (!is_null($dob))) {
            $ageArray = Utility::calculateAge($dob, $testDate);
            $age      = ($ageArray['year'] * 12 + $ageArray['mon'])
                    * 30
                    + $ageArray['day'];
            //echo "age is:".$age."<BR>\n";
            /*
            if ($age < 0) {
                $age = 0;
            }
            */
            $this->age = $age;
        } else {
            $this->age = null;
        }
    }

    /**
     * Asserts that no instruments are in the current battery and then, based
     * on age AND SubprojectID, adds all appropriate instruments to the
     * battery
     *
     * @param integer $SubprojectID The SubprojectID that we want the battery
     *                              for
     * @param string  $stage        Either 'visit' or 'screening'
     * @param string  $visit_label  The visit label to create a battery for.
     * @param integer $center_ID    The centre of the candidate having a battery
     *                              created
     * @param boolean $firstVisit   Whether this is a first visit battery.
     *                              true means ONLY first visit
     *                              false means NOT first visit
     *                              null can be any visit.
     *
     * @return void
     */
    function createBattery(
        $SubprojectID,
        $stage=null,
        $visit_label=null,
        $center_ID=null,
        $firstVisit=null
    ) {
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if ($this->isError($error)) {
            return $error;
        }

        // get the current battery (center id is irrelevant here,
        // as is stage probably)
        $currentTests = $this->getBattery($stage, $SubprojectID, $visit_label);
        if ($this->isError($currentTests)) {
            return $this->raiseError(
                "Could not get the current list of instruments, "
                . "thus unable to assert that the battery is empty"
            );
        }

        // assert that the current battery is empty
        if (count($currentTests) > 0) {
            return $this->raiseError(
                "Battery is not empty - will not clobber an existing battery."
            );
        }

        // determine the list of instruments to register
        $neededTests = $this->lookupBattery(
            $this->age,
            $SubprojectID,
            $stage,
            $visit_label,
            $center_ID,
            $firstVisit
        );

        if ($this->isError($neededTests)) {
            return $this->raiseError(
                "Could not lookup the battery for age $this->age "
                ."and subprojectID ".$this->getSubprojectID()
            );
        }

        // loop over the list of instruments
        foreach ($neededTests AS $testName) {
            // add the instrument
            $success = $this->addInstrument($testName);

            // make sure that the addition succeeded
            if ($this->isError($success)) {
                return $this->raiseError(
                    "Failed to add instrument $testName to battery"
                );
            }
        } // end looping over the list of instruments
    } // end createBattery()

    /**
     * Adds the specified instrument to the current battery, so long
     * as it is not already there (singleton model)
     *
     * @param string $testName The test to be added to the currently
     *                         selected battery.
     *
     * @return void
     */
    function addInstrument($testName)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if ($this->isError($error)) {
            return $error;
        }

        // assert that the instrument is valid
        $error = $this->_assertValidInstrument($testName);
        if ($this->isError($error)) {
            return $error;
        }

        // get SessionID, UserID
        $query = "SELECT ID as SessionID, UserID FROM session WHERE ID=:SID";
        $rows  = $DB->pselect($query, array('SID' => $this->sessionID));
        if ($this->isError($rows) || count($rows)==0) {
            return $this->raiseError(
                "Failed to get SessionID, and UserID when trying to add $testName"
            );
        }
        $sessionData = $rows[0];

        // generate a commentID
        $commentID = $this->_createCommentID($testName);
        if ($this->isError($commentID)) {
            return $this->raiseError(
                "Unable to generate a valid CommentID when trying to add $testName"
            );
        }

        // insert into the test table
        $success = $DB->insert($testName, array('CommentID' => $commentID));
        if ($this->isError($success)) {
            return $this->raiseError(
                "Unable to add storage record to $commentID $testName"
            );
        }

        // insert into the flag table
        $success = $DB->insert(
            'flag',
            array(
             'SessionID' => $sessionData['SessionID'],
             'Test_name' => $testName,
             'CommentID' => $commentID,
             'UserID'    => $sessionData['UserID'],
             'Testdate'  => null,
            )
        );

        if ($this->isError($success)) {
            return $this->raiseError(
                "Unable to add storage record to flag: $testName"
            );
        }

        // generate the double data entry commentid
        $ddeCommentID = 'DDE_'.$commentID;

        // insert the dde into the test table
         $success = $DB->insert($testName, array('CommentID' => $ddeCommentID));
        if ($this->isError($success)) {
            return $this->raiseError(
                "Unable to add storage record to $ddeCommentID $testName"
            );
        }

        // insert the dde into the flag table
        $success = $DB->insert(
            'flag',
            array(
             'SessionID' => $sessionData['SessionID'],
             'Test_name' => $testName,
             'CommentID' => $ddeCommentID,
             'UserID'    => $sessionData['UserID'],
             'Testdate'  => null,
            )
        );

        if ($this->isError($success)) {
            return $this->raiseError(
                "Unable to add storage record to flag: $testName"
            );
        }
        return $commentID;

    } // end addInstrument()

    /**
     * Removes the specified instrument from the current battery only
     * if it is part of the battery
     *
     * @param string $testName The test name to be removed from the current
     *                         battery
     *
     * @return void
     * @todo   make it do something
     */
    function removeInstrument($testName)
    {
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if ($this->isError($error)) {
            return $error;
        }

        // assert that the instrument is valid
        $error = $this->_assertValidInstrument($testName);
        if ($this->isError($error)) {
            return $error;
        }
    }

    /**
     * Gets an array of instruments which are members of the currently
     * selected session's battery
     *
     * @param string  $stage        Either 'visit' or 'screening' - determines
     *                              whether to register only screening instruments
     *                              or visit instruments
     * @param integer $SubprojectID The SubprojectID of that we want the battery for.
     * @param string  $visit_label  The visit label of the battery that we want to
     *                              retrieve
     *
     * @return array    an array of instrument names
     */
    function getBattery($stage=null, $SubprojectID=null, $visit_label=null)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if ($this->isError($error)) {
            return $error;
        }

        // craft the select query
        $query   = "SELECT f.Test_name FROM flag f JOIN session s
            ON (s.ID=f.SessionID)
            JOIN candidate c ON (c.CandID=s.CandID)
            WHERE f.SessionID=:SID AND s.Active='Y' AND c.Active='Y'
               AND f.CommentID NOT LIKE 'DDE%'";
        $qparams = array('SID' => $this->sessionID);
        $rows    = $DB->pselect($query, $qparams);

        if ($this->isError($rows)) {
            return $this->raiseError("Could not get battery from database");
        }

        // repackage the array
        $tests = array();
        foreach ($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    } // end getBattery()

    /**
     * Gets an associative array of instruments which are members of the current
     * battery
     *
     * @param string  $stage        Either 'visit' or 'screening' - determines
     *                              whether to register only screening instruments
     *                              or visit instruments
     * @param integer $SubprojectID The SubprojectID of that we want the battery for.
     *
     * @return array an associative array containing Test_name,
     *         Full_name, Sub_group, CommentID
     */
    function getBatteryVerbose($stage=null, $SubprojectID=null)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if ($this->isError($error)) {
            return $error;
        }

        // craft the select query
        $query   = "SELECT f.Test_name,
                    t.Full_name,
                    f.CommentID,
                    CONCAT('DDE_', f.CommentID) AS DDECommentID,
                    ts.Subgroup_name as Sub_group,
                    t.isDirectEntry
                FROM flag AS f, test_names as t, test_subgroups as ts ";
        $qparams = array('SID' => $this->sessionID);

        if (!is_null($stage)) {
            $query .= ", test_battery AS b";
        }
        $query .= " WHERE ts.ID = t.Sub_group
            AND f.Test_name=t.Test_name
            AND f.SessionID=:SID
            AND LEFT(f.CommentID, 3) != 'DDE'";

        if (!is_null($stage)) {
            $query         .= " AND t.Test_name=b.Test_name AND b.Stage=:stg";
            $qparams['stg'] = $stage;

            if (!is_null($SubprojectID)) {
                $query .= " AND (
                    b.SubprojectID IS NULL
                    OR b.SubprojectID=:SubprojID
                )";

                $qparams['SubprojID'] = $SubprojectID;
            }
        }

        $query .= "ORDER BY Sub_group, Full_name";

        // get the list of instruments
        $rows = $DB->pselect($query, $qparams);
        if ($this->isError($rows)) {
            return $this->raiseError("Could not get battery from database");
        }

        // return all the data selected
        return $rows;
    } // end getBatteryVerbose()

    /**
     * Checks if a test_name has double data entry enabled in the config
     * for this Loris instance.
     *
     * @param string $instrumentName The test_name that we want to know if
     *                               we're using DDE for.
     *
     * @return boolean true if double data entry is enabled for this instrument
     */
    static function isDoubleDataEntryEnabledForInstrument($instrumentName)
    {

        $config =& NDB_Config::singleton();
        $doubleDataEntryInstruments
            = $config->getSetting("DoubleDataEntryInstruments");

        return in_array($instrumentName, $doubleDataEntryInstruments);
    }

    /**
     * Gets the instrument which a given CommentID is for
     *
     * @param string $commentId The CommentID for which we'd like to know
     *                          the test name
     *
     * @return string A test name
     */
    function getInstrumentNameForCommentId($commentId)
    {
        $db    =& Database::singleton();
        $query = "SELECT Test_name FROM flag WHERE CommentID=:CID";
        $instrumentName = $db->pselectOne($query, array('CID' => $commentId));
        return $instrumentName;
    }

    /**
     * Looks up what the appropriate battery for the current visit should
     * be, based on age AND subproject
     *
     * @param integer $age          the age of the subject, in months
     * @param integer $SubprojectID The ID of the subproject that we want
     *                              to look up the battery for.
     * @param string  $stage        either 'visit' or 'screening' - determines
     *                              whether to register only screening
     *                              instruments or visit instruments
     * @param string  $visit_label  (optional) The visit label to look up the
     *                              battery for. If this is specified the battery
     *                              will use this INSTEAD OF the age of candidate.
     * @param integer $center_ID    (optional) The center ID to look up the visit
     *                              battery for. If this is specified the lookup
     *                              will use it as an ADDITIONAL condition to
     *                              $age/$visit_label.
     * @param boolean $firstVisit   (optional) Whether or not we want the battery
     *                              for the first visit of the candidate. If this
     *                              is true, it will get instruments for the first
     *                              visit. If false, it will only get instruments
     *                              where it is NOT the first visit.
     *                              If null, it will get all instruments matching
     *                              criteria regardless of if it's the first visit
     *                              or not.
     *
     * @return array  an array of instrument names
     */
    function lookupBattery(
        $age,
        $SubprojectID,
        $stage=null,
        $visit_label=null,
        $center_ID=null,
        $firstVisit=null
    ) {
        $DB = Database::singleton();
        if (empty($this->age)) {
            $this->age = $age;
        }
        $qparams = array(
                    'vAge'      => $this->age,
                    'SubprojID' => $SubprojectID,
                   );
        // The query to lookup the battery uses the min/max age ranges
        // if they are not 0
        $query = "
            SELECT t.Test_name
                FROM test_battery AS b, test_names AS t
                WHERE
                    t.Test_name=b.Test_name
                    AND (
                        (b.AgeMinDays=0 AND b.AgeMaxDays=0)
                            OR
                        (b.AgeMinDays<= :vAge AND b.AgeMaxDays >= :vAge)
                    )
                    AND b.Active='Y'
                    AND (SubprojectID=:SubprojID OR SubprojectID IS NULL)";

        if (!is_null($visit_label)) {
            $VisitBatteryExists = $DB->pselectOne(
                "SELECT COUNT(*)
                    FROM test_battery
                    WHERE Visit_label =:VL AND SubprojectID=:SubID",
                array(
                 'VL'    => $visit_label,
                 'SubID' => $SubprojectID,
                )
            );
            if ($VisitBatteryExists > 0) {
                $query        .= " AND b.Visit_label=:VL";
                $qparams['VL'] = $visit_label;
            } else {
                $query .= " AND b.Visit_label IS NULL";
            }
        }
        if (!is_null($stage)) {
            $query         .= " AND b.Stage=:stg";
            $qparams['stg'] = $stage;
        }

        if (!is_null($center_ID)) {
            // return all instruments that match this center or all centers (null)
            $query         .= " AND (b.CenterID=:CID OR b.CenterID IS NULL)";
            $qparams['CID'] = $center_ID;
        } else {
            // Unless the center is specified & matched, don't return
            // site-restricted instruments
            $query .= " AND b.CenterID IS NULL";
        }

        // get the list of instruments
        $tests = array();
        $rows  = $DB->pselect($query, $qparams);

        if ($this->isError($rows)) {
            return $this->raiseError("Could not lookup battery from database");
        }

        // repackage the array
        foreach ($rows AS $row) {
            $tests[] = $row['Test_name'];
        }
        // get the list of instruments that should be part of first visit
        if ($firstVisit) {
            $query_firstVisit = "
                SELECT DISTINCT Test_name
                FROM test_battery
                WHERE firstVisit=:FV AND SubprojectID=:subID";
            $where            = array(
                                 'FV'    => 'Y',
                                 'subID' => $SubprojectID,
                                );
            $rows_firstVisit  = $DB->pselect($query_firstVisit, $where);

            foreach ($rows_firstVisit as $row) {
                if (!in_array($row['Test_name'], $tests)) {
                    array_push($tests, $row['Test_name']);
                }
            }
            //also remove instruments that should not be part of the first visit
            $query_notfirstVisit = "
                SELECT DISTINCT Test_name
                FROM test_battery
                WHERE firstVisit=:FV AND SubprojectID=:subID";
            $where = array(
                      'FV'    => 'N',
                      'subID' => $SubprojectID,
                     );

            $rows_notfirstVisit = $DB->pselect($query_notfirstVisit, $where);
            foreach ($rows_notfirstVisit as $row) {
                if (($key = array_search($row['Test_name'], $tests)) !== false) {
                    //remove the instrument from showing up on the first visit
                    unset($tests[$key]);
                }
            }

        }
        // return an array of test names
        return $tests;
    } // end lookupBattery()

    /**
     * Creates a new unique commentID for the given instrument in the
     * current battery
     *
     * @param string $testName The test name that we want a commentID for
     *
     * @return string the commentID generated
     */
    function _createCommentID($testName)
    {
        $DB = Database::singleton();
        // assert that a battery has already been selected
        $error = $this->_assertBatterySelected();
        if ($this->isError($error)) {
            return $error;
        }

        // assert that the instrument is valid
        $error = $this->_assertValidInstrument($testName);
        if ($this->isError($error)) {
            return $error;
        }

        // create timepoint object
        $timepoint =& TimePoint::singleton($this->sessionID);
        if (Utility::isErrorX($timepoint)) {
            return $this->raiseError(
                "Could not create timepoint object: ".$timepoint->getMessage()
            );
        }

        // create candidate object
        $candidate =& Candidate::singleton($timepoint->getCandID());
        if (Utility::isErrorX($candidate)) {
            return $this->raiseError(
                "Could not create candidate object: ".$candidate->getMessage()
            );
        }

        return NDB_BVL_Battery::generateCommentID($this->sessionID, $testName);
    }

    /**
     * Generates a CommentID of the appropriate format given a SessionID and
     * a Test name. This differs from createCommentID in that a battery does
     * not have to already be selected.
     *
     * @param integer $SessionID The session ID to generate a CommentID for
     * @param string  $Test_name The test name which the CommentID will be for.
     *
     * @return string A Validly formatted CommentID
     */
    static function generateCommentID($SessionID, $Test_name)
    {
        $DB = Database::singleton();

        $TestID = $DB->pselectOne(
            "SELECT ID FROM test_names WHERE Test_name=:TN",
            array('TN' => $Test_name)
        );

        $OtherInfo = $DB->pselectRow(
            "SELECT CandID, c.PSCID, s.SubprojectID FROM session s
                    JOIN candidate c USING (CandID)
                WHERE c.Active='Y' AND s.Active='Y' AND s.ID=:SID",
            array('SID' => $SessionID)
        );

        if (empty($TestID) || empty($OtherInfo)) {
            return null;
        }
        return $OtherInfo['CandID']
            . $OtherInfo['PSCID']
            . $SessionID
            . $OtherInfo['SubprojectID']
            . $TestID
            . time();
    }

    /**
     * Asserts that the current battery object corresponds to a
     * specific visit (in other words, asserts that selectBattery has
     * been run
     *
     * @return boolean true if a battery is selected
     */
    function _assertBatterySelected()
    {
        if (is_null($this->sessionID)) {
            return $this->raiseError("No battery selected");
        }
        return true;
    } // end _assertBatterySelected()

    /**
     * Asserts that the specified instrument name is valid and in
     * the currently selected battery
     *
     * @param string $testName the test name that we are asserting is
     *                         in the currently selected instrument.
     *
     * @return boolean true if valid, false if not
     */
    function _assertValidInstrument($testName)
    {
        $DB    = Database::singleton();
        $query = "SELECT COUNT(*) AS counter FROM test_names WHERE Test_name=:TN";
        $row   = $DB->pselectRow($query, array('TN' => $testName));

        if (Utility::isErrorX($row)) {
            return $this->raiseError("DB Error: ".$row->getMessage());
        }

        return $row['counter'] >= 1;
    } // end _assertValidInstrument()
}
