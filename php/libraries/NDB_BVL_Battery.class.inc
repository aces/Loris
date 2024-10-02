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
 * PHP Version 7
 *
 * @category Main
 * @package  Behavioural
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Class that implements a wrapper around a Loris battery.
 *
 * @category Main
 * @package  Behavioural
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Battery
{
    /**
     * ID column of session table - identifies a visit - which is the
     * same as identifying a battery
     *
     * @access private
     * @var    SessionID
     */
    public $sessionID = null;

    public $age;

    /**
     * Constructor - merely asserts that the environment is suitable
     */
    function __construct()
    {
    }

    /**
     * Selects a specific visit/battery
     *
     * @param SessionID $sessionID the ID of the session/visit (session.ID)
     *
     * @return void
     */
    function selectBattery(SessionID $sessionID)
    {
        $timepoint =TimePoint::singleton($sessionID);

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
     * on age AND CohortID, adds all appropriate instruments to the
     * battery
     *
     * @param \LORIS\LorisInstance $loris       The LORIS instance to add
     *                                          instruments to
     * @param integer              $CohortID    The CohortID that we want
     *                                          the battery for
     * @param string               $stage       Either 'visit' or 'screening'
     * @param string               $visit_label The visit label to create a
     *                                          battery for.
     * @param \CenterID            $center_ID   The center of the candidate
     *                                          having a battery created
     * @param boolean              $firstVisit  Whether this is a first visit
     *                                          battery.  true means ONLY
     *                                          first visit, false means NOT
     *                                          first visit, null can be any
     *                                          visit.
     *
     * @return void
     */
    function createBattery(
        \LORIS\LorisInstance $loris,
        $CohortID,
        $stage=null,
        $visit_label=null,
        $center_ID=null,
        $firstVisit=null
    ) {
        // assert that a battery has already been selected
        $this->_assertBatterySelected();

        // get the current battery (center id is irrelevant here,
        // as is stage probably)
        try {
            $currentTests = $this->getBattery($stage, $CohortID, $visit_label);
        } catch (Exception $e) {
            throw new Exception(
                "Could not get the current list of instruments, "
                . "thus unable to assert that the battery is empty",
                0,
                $e
            );
        }

        // determine the list of instruments to register
        $neededTests = $this->lookupBattery(
            $this->age,
            $CohortID,
            $stage,
            $visit_label,
            $center_ID,
            $firstVisit
        );

        // assert that the current battery is empty
        if (count($currentTests) > 0) {
            $neededTests = $this->getBatteryDifference($currentTests, $neededTests);
        }

        // loop over the list of instruments
        foreach ($neededTests AS $testName) {
            // add the instrument
            $this->addInstrument($loris, $testName);
        } // end looping over the list of instruments
    } // end createBattery()

    /**
     * Computes the difference between the existing battery and the
     * theoretical battery and returns only the missing tests as an array
     *
     * @param array $currentBattery Existing battery at the specified timepoint
     * @param array $lookupBattery  Theoretical battery from the test_battery table
     *
     * @return array
     */
    function getBatteryDifference(
        array $currentBattery=[],
        array $lookupBattery=[]
    ) : array {
        return array_unique(array_diff($lookupBattery, $currentBattery));
    }

    /**
     * Adds the specified instrument to the current battery, so long
     * as it is not already there (singleton model)
     *
     * @param \LORIS\LorisInstance $loris    The LORIS instance to add the
     *                                       instrument to
     * @param string               $testName The test to be added to the
     *                                       currently selected battery.
     *
     * @return string The generated CommentID
     */
    function addInstrument($loris, $testName)
    {
        $DB = \NDB_Factory::singleton()->database();
        // assert that a battery has already been selected
        $this->_assertBatterySelected();

        // assert that the instrument is valid
        $error = $this->_assertValidInstrument($testName);
        if ($error !== true) {
            throw new \LorisException("Invalid instrument");
        }

        // get SessionID, UserID
        $query = "SELECT ID as SessionID, UserID FROM session WHERE ID=:SID";
        $rows  = $DB->pselect($query, ['SID' => $this->sessionID]);
        if (count($rows)==0) {
            throw new Exception(
                "Failed to get SessionID, and UserID when trying to add $testName"
            );
        }
        $sessionData = $rows->getFirstRow();

        // generate a commentID
        $commentID = $this->_createCommentID($testName);

        // generate the double data entry commentid
        $ddeCommentID = 'DDE_'.$commentID;

        // instantiate instrument object to get table name attribute
        $obj = NDB_BVL_Instrument::factory($loris, $testName, '', '');

        if ($obj->usesJSONdata() !== true) {
            // insert into the test table
            $DB->insert($obj->table, ['CommentID' => $commentID]);

            // insert the dde into the test table
            $DB->insert($obj->table, ['CommentID' => $ddeCommentID]);
        }

        $testId = $DB->pselectOne(
            "SELECT ID FROM test_names WHERE Test_name=:tn",
            ['tn' => $testName]
        );
        // insert into the flag table
        $DB->insert(
            'flag',
            [
                'SessionID' => $sessionData['SessionID'],
                'TestID'    => $testId,
                'CommentID' => $commentID,
                'UserID'    => $sessionData['UserID'],
            ]
        );

        // insert the dde into the flag table
        $DB->insert(
            'flag',
            [
                'SessionID' => $sessionData['SessionID'],
                'TestID'    => $testId,
                'CommentID' => $ddeCommentID,
                'UserID'    => $sessionData['UserID'],
            ]
        );

        return $commentID ?? '';
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
        $this->_assertBatterySelected();

        // assert that the instrument is valid
        $this->_assertValidInstrument($testName);
    }

    /**
     * Gets an array of instruments which are members of the currently
     * selected session's battery
     *
     * @return array    an array of instrument names
     */
    function getBattery()
    {
        $DB = \NDB_Factory::singleton()->database();
        // assert that a battery has already been selected
        $this->_assertBatterySelected();

        // craft the select query
        $query   = "SELECT tn.Test_name FROM flag f
		JOIN test_names tn ON (f.TestID=tn.ID)
		JOIN session s
            ON (s.ID=f.SessionID)
            JOIN candidate c ON (c.CandID=s.CandID)
            WHERE f.SessionID=:SID AND s.Active='Y' AND c.Active='Y'
               AND f.CommentID NOT LIKE 'DDE%'";
        $qparams = ['SID' => $this->sessionID];
        $rows    = $DB->pselect($query, $qparams);

        // repackage the array
        $tests = [];
        foreach ($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    }

    /**
     * Gets an associative array of instruments which are members of the current
     * battery
     *
     * @return array an associative array containing Test_name,
     *         Full_name, Sub_group, CommentID
     */
    function getBatteryVerbose()
    {
        $DB = \NDB_Factory::singleton()->database();
        // assert that a battery has already been selected
        $this->_assertBatterySelected();

        // craft the select query
        $query = "SELECT t.Test_name,
                      t.Full_name,
                      f.CommentID,
                      CONCAT('DDE_', f.CommentID) AS DDECommentID,
                      ts.Subgroup_name as Sub_group,
                      ts.group_order as Subgroup_order,
                      t.isDirectEntry,
                      MAX(b.instr_order) as instrument_order
                  FROM flag f
            	      JOIN test_names t ON (f.TestID=t.ID)
            	      JOIN test_subgroups ts ON (ts.ID = t.Sub_group)
            	      LEFT JOIN session s ON (s.ID=f.SessionID)
            	      LEFT JOIN test_battery b
       	                ON ((t.Test_name=b.Test_name OR b.Test_name IS NULL)
      	                AND (s.CohortID=b.CohortID OR b.CohortID IS NULL)
       	                AND (s.Visit_label=b.Visit_label OR b.Visit_label IS NULL)
       	                AND (s.CenterID=b.CenterID OR b.CenterID IS NULL))
       	          WHERE f.SessionID=:SID
                      AND LEFT(f.CommentID, 4) != 'DDE_'
                  GROUP BY t.Test_name,
                           t.Full_name,
                           f.CommentID,
                           DDECommentID,
                           Sub_group,
                           Subgroup_order,
                           isDirectEntry";
        if (\Utility::columnsHasNull('test_subgroups', 'group_order')) {
            $query .= " ORDER BY Subgroup_name";
        } else {
            $query .= " ORDER BY Subgroup_order";
        }
        $query  .= ", instrument_order, Full_name";
        $qparams = ['SID' => $this->sessionID];

        // get the list of instruments
        $rows = $DB->pselect($query, $qparams);

        // return all the data selected
        return iterator_to_array($rows);
    }


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
     * @return ?string A test name
     */
    public static function getInstrumentNameForCommentId($commentId): ?string
    {
        return \NDB_Factory::singleton()->database()
            ->pselectOne(
                "SELECT Test_name FROM flag
		    	JOIN test_names ON (flag.TestID=test_names.ID)
		    WHERE CommentID=:CID",
                ['CID' => $commentId]
            );
    }

    /**
     * Looks up what the appropriate battery for the current visit should
     * be, based on age AND cohort
     *
     * @param integer   $age         the age of the subject, in months
     * @param integer   $CohortID    The ID of the cohort that we want
     *                               to look up the battery for.
     * @param string    $stage       either 'visit' or 'screening' - determines
     *                               whether to register only screening
     *                               instruments or visit instruments
     * @param string    $visit_label (optional) The visit label to look up the
     *                               battery for. If this is specified the
     *                               battery will use this INSTEAD OF the age
     *                               of candidate.
     * @param ?CenterID $center_ID   (optional) The center ID to look up the visit
     *                               battery for. If this is specified the lookup
     *                               will use it as an ADDITIONAL condition to
     *                               $age/$visit_label.
     * @param ?boolean  $firstVisit  (optional) Whether or not we want the battery
     *                               for the first visit of the candidate. If this
     *                               is true, it will get instruments for the
     *                               first visit. If false, it will only get
     *                               instruments where it is NOT the first visit.
     *                               If null, it will get all instruments matching
     *                               criteria regardless of if it's the first
     *                               visit or not.
     *
     * @return array  an array of instrument names
     */
    function lookupBattery(
        $age,
        $CohortID,
        $stage=null,
        $visit_label=null,
        $center_ID=null,
        $firstVisit=null
    ) {
        $DB = \NDB_Factory::singleton()->database();
        if (empty($this->age)) {
            $this->age = $age;
        }
        $qparams = [
            'vAge'      => $age,
            'SubprojID' => $CohortID,
        ];
        // The query to lookup the battery uses the min/max age ranges
        // if they are not 0
        $query = "
            SELECT DISTINCT t.Test_name
                FROM test_battery AS b, test_names AS t
                WHERE
                    t.Test_name=b.Test_name
                    AND (
                        (b.AgeMinDays=0 AND b.AgeMaxDays=0)
                            OR
                        (b.AgeMinDays<= :vAge AND b.AgeMaxDays >= :vAge)
                    )
                    AND b.Active='Y'
                    AND (CohortID=:SubprojID OR CohortID IS NULL)";

        if (!is_null($visit_label)) {
            $VisitBatteryExists = $DB->pselectOne(
                "SELECT COUNT(*)
                    FROM test_battery
                    WHERE Visit_label =:VL AND CohortID=:SubID",
                [
                    'VL'    => $visit_label,
                    'SubID' => $CohortID,
                ]
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

        if ($firstVisit === false) {
            $query .= " AND (b.firstVisit IS NULL OR b.firstVisit='N')";
        }

        // get the list of instruments
        $tests = [];
        $rows  = $DB->pselect($query, $qparams);

        // repackage the array
        foreach ($rows AS $row) {
            $tests[] = $row['Test_name'];
        }
        // get the list of instruments that should be part of first visit
        if ($firstVisit) {
            $query_firstVisit = "
                SELECT DISTINCT Test_name
                FROM test_battery
                WHERE firstVisit=:FV AND CohortID=:subID";
            $where            = [
                'FV'    => 'Y',
                'subID' => $CohortID,
            ];
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
                WHERE firstVisit=:FV AND CohortID=:subID";
            $where = [
                'FV'    => 'N',
                'subID' => $CohortID,
            ];

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
     * @return ?string the commentID generated
     */
    function _createCommentID($testName)
    {
        // assert that a battery has already been selected
        $this->_assertBatterySelected();

        // assert that the instrument is valid
        $this->_assertValidInstrument($testName);
        return NDB_BVL_Battery::generateCommentID($this->sessionID, $testName);
    }

    /**
     * Generates a CommentID of the appropriate format given a SessionID and
     * a Test name. This differs from createCommentID in that a battery does
     * not have to already be selected.
     *
     * @param \SessionID $SessionID The session ID to generate a CommentID for
     * @param string     $Test_name The test name which the CommentID will be for.
     *
     * @return ?string A Validly formatted CommentID or null if information
     *                  is missing in the database.
     */
    static function generateCommentID($SessionID, $Test_name)
    {
        $DB = \NDB_Factory::singleton()->database();

        $SessionID = $SessionID->__toString();

        $TestID = $DB->pselectOne(
            "SELECT ID FROM test_names WHERE Test_name=:TN",
            ['TN' => $Test_name]
        );

        $OtherInfo = $DB->pselectRow(
            "SELECT CandID, c.PSCID, s.CohortID FROM session s
                    JOIN candidate c USING (CandID)
                WHERE c.Active='Y' AND s.Active='Y' AND s.ID=:SID",
            ['SID' => $SessionID]
        );

        if (empty($TestID) || empty($OtherInfo)) {
            return null;
        }
        return $OtherInfo['CandID']
            . $OtherInfo['PSCID']
            . $SessionID
            . $OtherInfo['CohortID']
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
            throw new Exception("No battery selected");
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
        $DB    = \NDB_Factory::singleton()->database();
        $query = "SELECT COUNT(*) AS counter FROM test_names WHERE Test_name=:TN";
        $row   = $DB->pselectRow($query, ['TN' => $testName]);

        return ($row['counter'] ?? 0) >= 1;
    } // end _assertValidInstrument()
}
