<?php
/**
 * This file contains any static helper functions used by Loris that don't
 * fit elsewhere or are used in many different modules.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


/**
 * A class for holding a set of (static) utility/helper functions in a
 * single namespace.
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Utility
{
    /**
     * Stops anyone from instantiating an instance of Utility
     */
    private function __construct()
    {
    }

    /**
     * Computes an age in years:months:days (assumes 30 days per months)
     *
     * NOTE This function assumes 1 month = 30 days. Although this is not really
     * accurate, it should not be changed as it impacts the reproducibility of
     * the analysis of data in LORIS.
     *
     * @param string $dob      date of birth (or first date), formatted YYYY-MM-DD
     * @param string $testdate date of testing (or second date), formatted YYYY-MM-DD
     *
     * @return mixed an array with keys 'year', 'mon', 'day' containing the
     *               computed age, or a PEAR::Error object
     */
    static function calculateAge($dob, $testdate)
    {
        if (!preg_match(
            "/([0-9]{4})-?([0-9]{1,2})-?([0-9]{1,2})/",
            $dob,
            $matches
        )) {
            throw new Exception(
                "Argument 1 does not match expected date format (YYYY-MM-DD)"
            );
        }
        $dob = array(
                'year' => $matches[1],
                'mon'  => $matches[2],
                'day'  => $matches[3],
               );

        if (!preg_match(
            "/([0-9]{4})-?([0-9]{1,2})-?([0-9]{1,2})/",
            $testdate,
            $matches
        )) {
            throw new Exception(
                "Argument 2 does not match expected date format (YYYY-MM-DD)"
            );
        }
        $testdate = array(
                     'year' => $matches[1],
                     'mon'  => $matches[2],
                     'day'  => $matches[3],
                    );

        if ($testdate['day'] < $dob['day']) {
            $testdate['day'] += 30;
            $testdate['mon']--;
        }
        if ($testdate['mon'] < $dob['mon']) {
            $testdate['mon'] += 12;
            $testdate['year']--;
        }

        $age = array(
                'year' => $testdate['year'] - $dob['year'],
                'mon'  => $testdate['mon'] - $dob['mon'],
                'day'  => $testdate['day'] - $dob['day'],
               );

        return $age;
    }
    /**
     * Returns list of consents in the database
     *
     * @return array An associative array of consents, with their names and labels.
     *               The keys of the arrays are the IDs of the consents
     */
    static function getConsentList()
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $query = "SELECT ConsentID, Name, Label FROM consent";
        $key   = "ConsentID";

        $result = $DB->pselectWithIndexKey($query, array(), $key);

        return $result;
    }
    /**
     * Returns a list of sites in the database
     *
     * @param bool $study_site If true only return sites that are
     *                         study sites according to the psc
     *                         table
     *
     * @return array an associative array("center ID" => "site name")
     */
    static function getSiteList($study_site = true)
    {
        $DB =& Database::singleton();

        // get the list of study sites - to be replaced by the Site object
        $query = "SELECT CenterID, Name FROM psc ";
        if ($study_site) {
            $query .= "WHERE Study_site='Y'";
        }
        $result = $DB->pselect($query, array());

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["CenterID"]] = $row["Name"];
        }
        natcasesort($list);
        return $list;
    }


    /**
     * Get the list of sites as an associative array
     *
     * @param boolean $study_site if true only return study sites from psc
     *                            table
     * @param boolean $DCC        Whether the DCC should be included or not
     *
     * @return array of the form CenterID => Site Name.
     *         Note that even though CenterID is numeric, the array
     *         should be interpreted as an associative array since the keys
     *         refer to the centerID, not the array index.
     */
    static function getAssociativeSiteList($study_site = true, $DCC = true)
    {
        $DB =& Database::singleton();

        // get the list of study sites - to be replaced by the Site object
        $query = "SELECT CenterID, Name FROM psc ";
        if ($study_site) {
            $query .= "WHERE Study_site='Y'";
        }
        if (!$DCC) {
            $query .= " AND CenterID <> 1";
        }

        $result = $DB->pselect($query, array());

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["CenterID"]] = $row["Name"];
        }
        return $list;
    }

    /**
     * Gets a list of visits used by the database as specified from
     * the Visit_Windows table
     *
     * @return array<string, string> of the form VisitLabel => Visit_label
     */
    static function getVisitList() : array
    {
        $DB =& Database::singleton();

        $query = "SELECT Visit_label from Visit_Windows ORDER BY Visit_label";

        $result = $DB->pselect($query, array());

        $list = array();
        foreach ($result as $row) {
            $list[$row["Visit_label"]] = ucfirst($row["Visit_label"]);
        }
        return $list;
    }

    /**
     * Returns a list of study Projects
     *
     * @return array an associative array("projectID" => "project title")
     * @access public
     */
    static function getProjectList()
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();
        // get the list of projects
        $projects = $DB->pselect("SELECT * FROM Project", array());
        $project  = array();
        foreach ($projects as $row) {
            $project[$row['ProjectID']] = $row['Name'];
        }
        return $project;
    }

    /**
     * Returns a list of study Subprojects
     *
     * @param integer $projectID The project for which you would like
     *                           to get the subprojects
     *
     * @return array       an associative array("SubprojectID" => "Subproject title")
     */
    static function getSubprojectList($projectID = null)
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        if (!is_null($projectID)) {
            $subprojects = $DB->pselect(
                "SELECT * FROM subproject " .
                "JOIN project_rel USING (SubprojectID) WHERE ProjectID=:pID",
                array('pID' => $projectID)
            );
        } else {
            $subprojects = $DB->pselect("SELECT * FROM subproject", array());
        }

        $subprojs = array();
        foreach ($subprojects as $row) {
            $subprojs[$row['SubprojectID']] = $row['title'];
        }
        return $subprojs;
    }

    /**
     * Returns a list of study Subprojects associated with a project
     *
     * @param integer $projectID The project for which you would like
     *                           to get the subprojects
     *
     * @return array an associative array("SubprojectID" => "Subproject title")
     */
    static function getSubprojectsForProject($projectID = null)
    {
        return self::getSubprojectList($projectID);
    }

    /**
     * Returns the test name associated with a given commentID
     *
     * @param string $commentID A CommentID for which you would like
     *                          to know the test_name
     *
     * @return  string The test name this commentID is a part of
     * @note    This should be moved to whatever module uses it, or perhaps
     *       NDB_BVL_Instrument
     * @cleanup
     */
    static function getTestNameByCommentID($commentID)
    {
        $db =& Database::singleton();

        $query    = "SELECT Test_name FROM flag WHERE CommentID=:CID";
        $testName = $db->pselectOne($query, array('CID' => $commentID));

        return $testName;
    }

    /**
     * Cleans a string to make it safe for variables and such
     *
     * @param string $string the string to clean
     *
     * @return string The string cleaned up enough to be used as a
     *                variable name
     */
    static function getCleanString($string)
    {
        $string = trim($string);
        $string = str_replace('  ', ' ', $string);
        $string = str_replace(' ', '_', $string);
        $string = str_replace("'", '', $string);
        $string = str_replace('"', '', $string);
        $string = preg_replace('/[^A-Za-z0-9_\/-]*/', '', $string);
        $string = strtolower($string);
        return $string;
    }

    /**
     * Transforms a config structure (such as in PSCID) into a
     * Perl-compatible regex expression for validation
     *
     * @param array  $structure  the structure root
     * @param string $siteAbbrev the site abbreviation, sometimes used as part
     *                           of the PSCID
     *
     * @return string the regex pattern
     *
     * @note    This should probably be moved to the Candidate class, since it's
     *       only used there to validate the PSCID
     * @note    This should be removed when user-generated PSCID support is removed
     * @cleanup
     */
    static function structureToPCRE($structure, $siteAbbrev=null)
    {
        $seqs = $structure['seq'];
        // handle the situation where there exists only one seq
        if (isset($seqs['#'])) {
            $seqs = array($seqs);
        }
        $regex = "";
        foreach ($seqs AS $seq) {
            $unit = "";

            switch($seq['@']['type']) {
            case 'alpha':
                $unit .= '[a-z]';
                break;

            case 'alphanumeric':
                $unit .= '[0-9a-z]';
                break;

            case 'numeric':
                $unit .= '[0-9]';
                break;

            case 'static':
                $unit .= '('.$seq['#'].')';
                break;

            case 'set':
                if (strpos($seq['#'], '|') !== false) {
                    $unit .= '('.$seq['#'].')';
                } else {
                    $unit .= '['.$seq['#'].']';
                }
                break;

            case 'siteAbbrev':
                $unit .= $siteAbbrev;
                break;
            } // end switch

            $length = "";
            if (isset($seq['@']['length'])) {
                $length .= $seq['@']['length'];
            } elseif (isset($seq['@']['minLength'])) {
                $length .= $seq['@']['minLength'];
            } else {
                $length .= '1';
            }

            $length .= ',';

            if (isset($seq['@']['length'])) {
                $length .= $seq['@']['length'];
            } elseif (isset($seq['@']['maxLength'])) {
                $length .= $seq['@']['maxLength'];
            } elseif (!isset($seq['@']['length'])
                && !isset($seq['@']['minLength'])
            ) {
                $length .= '1';
            }

            $regex .= $unit.'{'.$length.'}';

        } // end foreach seq

        return '/^'.$regex.'$/i';
    }

    /**
     * Merges two arrays recursively, overwriting values of the first
     * with the second.  the one "strange" bit is that if there exists
     * a set of 2 or more sibling elements with the same name, then
     * the entire set will be replaced rather than recursively merged.
     *
     * @param array $array1       The first array to be merged
     * @param array $array2       The second array to be merged
     * @param array $merged_array A reference to an array to merge
     *                            the parameters into. If not specified,
     *                            a new array will be created
     *
     * @return array with the two parameters recursively merged
     */
    static function arrayMergeRecursiveOverwriting(
        $array1,
        $array2,
        &$merged_array=null
    ) {
        if (empty($merged_array)) {
            $merged_array = $array1;
        }
        foreach ($array2 AS $key=>$value) {
            if (is_array($array1[$key]) && isset($array1[$key][0])) {
                $merged_array[$key] = $value;
            } elseif (is_array($array2[$key]) && !isset($array2[$key][0])) {
                Utility::arrayMergeRecursiveOverwriting(
                    $array1[$key],
                    $array2[$key],
                    $merged_array[$key]
                );
            } else {
                $merged_array[$key] = $value;
            }
        }
        return $merged_array;
    }

    /**
     * Returns a list of bvl instruments
     *
     * Returns a list of instruments for a timepoint's stage ($stage).
     * If no stage arg is passed, return the full list for all stages
     *
     * @param integer $age   age in days
     * @param string  $stage study stage (screening or visit)
     *
     * @return array list of instruments
     */
    static function lookupBattery($age, $stage=null)
    {
        $DB =& Database::singleton();

        // craft the select query
        $query  = "SELECT t.Test_name FROM test_battery AS b, test_names AS t
            WHERE t.Test_name=b.Test_name
            AND b.AgeMinDays<=:CandAge AND b.AgeMaxDays>=:CandAge
            AND b.Active='Y'";
        $params = array('CandAge' => $age);

        if (!is_null($stage)) {
            $query .= " AND b.Stage=:BatStage";
            $params['BatStage'] = $stage;
        }

        $query .= " GROUP BY Test_name ORDER BY Test_name";

        // get the list of instruments
        $rows  = array();
        $tests = array();
        $rows  = $DB->pselect($query, $params);

        // repackage the array
        foreach ($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    }

    /**
     * Ensures that $var is a collection of $var elements, not just a
     * single element. This is useful for using config->getSetting for an element
     * that may be in the config multiple times or may be in the config file a
     * single time. By calling toArray, you ensure that the value you're working
     * with is an array and don't need to determine if it's an array or a scalar.
     * Note: This does not change a string into an array with one string element
     * Note: This function should be used for tags with attributes
     *
     * @param mixed $var The variable to be converted to an array.
     *
     * @return array If $var is an array, var, otherwise an array containing $var
     */
    static function toArray($var)
    {
        if (is_array($var) && !array_key_exists(0, $var)) {
            $var = array($var);
        }
        return $var;
    }

    /**
     * Ensures that $var is a collection elements, not just a single element
     * Not the same as toArray, apparently.
     * Note: This function should be used for tags without attributes
     *
     * @param mixed $var The variable to be converted to an array.
     *
     * @return  array If $var is an array, var, otherwise an array containing $var
     * @cleanup This should be removed and all uses converted to toArray
     *          (or vice versa, but toArray seems to be more common in the code)
     */
    static function asArray($var)
    {
        if (!is_array($var)) {
            return array($var);
        }
        return $var;
    }

    /**
     * Replace the empty string with null in specified field
     * in an array passed in as an argument. This undoes the
     * damage that Smarty causes by making nulls in a dropdown
     * the empty string.
     *
     * This is needed before calling $db->insert() on any integer
     * fields, because mysql considers '' to be 0, not null if
     * the database column is of type integer. Failing to call this
     * function will result in '' being saved as 0 for fields where
     * the backend data type is int.
     *
     * @param array  $arr   A reference to an array being saved to
     *                      the database. This array may be modified
     *                      by calls to this function.
     * @param string $field The field for which '' should be converted
     *                      to null.
     *
     * @return array The same array passed in, after modifications.
     */
    public static function nullifyEmpty(&$arr, $field)
    {
        if ($arr[$field] === '') {
            $arr[$field] = null;
        }
        return $arr;
    }

    /**
     * Get a list of instruments installed in Loris.
     *
     * @return array of the form Test_name => Full Description
     */
    static function getAllInstruments()
    {
        $Factory       = NDB_Factory::singleton();
        $DB            = $Factory->Database();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names",
            array()
        );
        $instruments   = array();
        foreach ($instruments_q as $row) {
            if (isset($row['Test_name']) && isset($row['Full_name'])) {
                $instruments[$row['Test_name']] =$row['Full_name'];
            }
        }

        return $instruments;
    }

    /**
     * Get a list of DDE instruments installed in Loris.
     *
     * @return array of the form Test_name => Full Description
     */
    static function getAllDDEInstruments()
    {
        $Factory       = NDB_Factory::singleton();
        $DB            = $Factory->Database();
        $config        =& NDB_Config::singleton();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names",
            array()
        );
        $doubleDataEntryInstruments = $config->getSetting(
            'DoubleDataEntryInstruments'
        );

        $instruments = array();
        foreach ($instruments_q as $row) {
            if (isset($row['Test_name']) && isset($row['Full_name'])) {
                if (in_array($row['Test_name'], $doubleDataEntryInstruments)) {
                    $instruments[$row['Test_name']] = $row['Full_name'];
                }
            }
        }
        return $instruments;
    }

    /**
     * Gets a list of all instruments where are administered as direct data
     * entry from subjects.
     * This should return an array in a format suitable for addSelect() from
     * NDB_Page
     *
     * @return array of test_names in a Test_Name => "Full Name"
     */
    static function getDirectInstruments()
    {
        $DB            =& Database::singleton();
        $instruments   = array();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names WHERE IsDirectEntry=true",
            array()
        );
        foreach ($instruments_q as $key) {
            $instruments[$key['Test_name']] =$key['Full_name'];
        }

        return $instruments;
    }

    /**
     * Get a list of all instruments which have scoring implemented.
     * Used in statistics module.
     *
     * @return array non-associative array of test_names
     */
    static function getScoredInstruments()
    {
        $All     = Utility::getAllInstruments();
        $Scored  = array();
        $Nothing = array();
        foreach (array_keys($All) as $Instrument) {
            if (Utility::getScoreColsForInstrument($Instrument) != $Nothing) {
                $Scored[] = $Instrument;
            }
        }
        return $Scored;
    }

    /**
     * Return the score columns which exist for a given instrument.
     *
     * @param string $inst The test_name of the instrument for which you would
     *                     like to know the score columns
     *
     * @return array (non-associative) of scored columns for the instrument given
     */
    static function getScoreColsForInstrument($inst)
    {
        include_once "NDB_BVL_Instrument.class.inc";
        $i = NDB_BVL_Instrument::factory($inst, '', '', true);
        if (isset($i->scoreLabels)) {
            $score = $i->scoreLabels;
        } elseif (isset($i->scoreCols)) {
            $score = $i->scoreCols;
        } elseif (isset($i->scores)) {
            $score = $i->scores;
        }
        if (isset($score[0])) {
            return $score;
        } else {
            if ($score != null) {
                return array_keys($score);
            }
        }
        return array();
    }

    /**
     * Checks to see if a table contains a specified column
     *
     * @param string $table_name The table to check for a column.
     * @param string $column     The column name to check the table for.
     *
     * @return boolean true if the table has at least one NULL in the column
     * @note   This should really be in the Database.class.inc file... -anyhowstep
     */
    static function columnsHasNull($table_name,$column)
    {
        //$config   =& NDB_Config::singleton();
        //$database = $config->getSetting('database');
        $query    = "SELECT count(*)
            FROM {$table_name}
            WHERE {$column} is NULL";
        $DB       =& Database::singleton();
        $num_null = $DB->pselectOne(
            $query,
            array()
        );
        if ($num_null > 0) {
            return true;
        }
        return false;
    }

    /**
     * Looks up visit stage using candidate ID.
     *
     * @param string $Cand_id candidate ID
     *
     * @return array
     * @throws DatabaseException
     */
    static function getStageUsingCandID($Cand_id)
    {
        $db    =& Database::singleton();
        $query = "select DISTINCT Current_stage from session where ".
            "CandID = :Cand_id";
        $stage = $db->pselect($query, array('Cand_id' => $Cand_id));
        return $stage[0]['Current_stage'];
    }

    /**
     * Looks up visit stage using candidate ID.
     *
     * @param string $Cand_id candidate ID
     *
     * @return array
     * @throws DatabaseException
     */
    static function getSubprojectIDUsingCandID($Cand_id)
    {
        $db    =& Database::singleton();
        $query = "select DISTINCT SubprojectID from session where CandID = :CandID";
        $stage = $db->pselect($query, array('CandID' => $Cand_id));
        return $stage[0]['SubprojectID'];
    }

    /**
     * Looks up the test_name for the current full name
     *
     * @param string $fullname Descriptive name to be looked up
     *
     * @return  string (Non-associative array of the form array(Test1, Test2, ..))
     * @note    This should be moved out of the Utility class into whatever
     *       module uses it. (Data team helper?)
     * @note    Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function getTestNameUsingFullName($fullname)
    {
        $test_name = '';
        $db        =& Database::singleton();
        //print_r($instument);
        $instrument = $db->pselect(
            "SELECT Test_name FROM test_names WHERE Full_name =:fname",
            array('fname' => $fullname)
        );
        if (is_array($instrument) && count($instrument)) {
            //$full_name = $names[0]
            list(,$test_name) = each($instrument[0]);
        }
        return $test_name;
    }

    /**
     * Returns all the sourcefrom instruments from parameter_type
     *
     * @param string $instrument If specified, return fields from this
     *                           test_name
     * @param string $commentID  If specified, return fields for this
     *                           commentid
     * @param string $name       If specified, return fields for this
     *                           parameter_type name
     *
     * @return  Array of the form array(
     *              0 => array(
     *                   'SourceField' => value
     *                   'Name'        => name
     *
     *              )
     *         )
     * @note    This should be moved out of the Utility class into whatever
     *       module uses it. (Data team helper, BVL_Feedback_panel)
     * @note    Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function getSourcefields($instrument=null,$commentID=null,$name=null)
    {
        $DB =& Database::singleton();
        //get sourcefield using instrument
        if (!is_null($instrument)) {
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable='1' AND sourcefrom = :sf
                ORDER BY Name",
                array('sf' => $instrument)
            );
        } elseif (!is_null($commentID)) { //get sourcefield using commentid
            $instrument   = $DB->pselectOne(
                "SELECT Test_name FROM flag WHERE CommentID = :cid",
                array('cid' => $commentID)
            );
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable = '1' AND sourcefrom = :instrument
                ORDER BY Name",
                array('instrument' => $instrument)
            );
        } elseif (!is_null($name)) { //get all source fields
            $sourcefields = $DB->pselectRow(
                "SELECT * FROM parameter_type WHERE Name = :pn",
                array('pn' => $name)
            );
        }
        return $sourcefields;
    }


    /**
     * Returns a list of study Visit Labels that are being used by this study.
     *
     * @param integer $projectID Limit visit labels to labels used by this project
     *
     * @return array of study visits in the format array('VL' => 'VL')
     *         where VL is the visit label
     *
     * @note       THIS FUNCTION USES STRING CONCATENATION TO GENERATE AN
     *             SQL STATEMENT.
     *             IT IS VULNERABLE TO AN SQL INJECTION ATTACK.
     * @note       Function comment written by Dave, not the author of this function.
     * @vulnerable
     * @cleanup
     */
    static function getExistingVisitLabels($projectID = null)
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();
        $qparams = array();

        if ($projectID != null) {
            $ExtraProject_Criteria
                = ' AND (c.ProjectID IS NULL OR c.ProjectID=:ProjectID)';
            $qparams["ProjectID"]  = $projectID;
        } else {
            $ExtraProject_Criteria ='';
        }
        $query       = "SELECT DISTINCT Visit_label FROM session s
            JOIN candidate c ON (s.CandID = c.Candid)
            JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE c.Active = 'Y'
            AND s.Active = 'Y'
            AND c.Entity_type != 'Scanner'
            AND psc.CenterID!= '1'
            $ExtraProject_Criteria ORDER BY Visit_label";
        $visitlabels = $db->pselect($query, $qparams);
        $visits      = array();
        for ($i = 0; $i < count($visitlabels); $i++) {
            $visits[$visitlabels[$i]['Visit_label']]
                = ($visitlabels[$i]['Visit_label']);
        }
        return $visits;
    }

    /**
     * Get all the instruments which currently exist for a given visit label
     * in the database.
     *
     * @param string $visit_label The visit label for which you would like
     *                            to know the existing visit labels
     *
     * @return array Array of instruments which exist for the given visit label
     *               array is of the form
     *               array(0 => array('Test_name_display' => $TestName))?
     *
     * @note    Function comment written by Dave, not the author of this function.
     *       The return value format seems weird. Should possibly be refactored.
     * @note    Used in:
     *      - data_team_helper/php/NDB_Form_data_team_helper.class.inc
     *      - data_team_helper/ajax/GetInstruments.php
     * @cleanup
     */
    static function getVisitInstruments($visit_label)
    {
        $DB =& Database::singleton();

        if ($DB->ColumnExists('test_battery', 'Test_name_display')) {
            $test_names = $DB->pselect(
                "SELECT DISTINCT Test_name_display FROM test_battery
                WHERE Visit_label=:vl",
                array('vl' => $visit_label)
            );
        } else {
            $test_names = $DB->pselect(
                "SELECT DISTINCT t.Full_name as Test_name_display FROM session s
                JOIN candidate c ON (c.candid=s.candid)
                JOIN psc ON (s.CenterID = psc.CenterID)
                JOIN flag f ON (f.sessionid=s.id)
                JOIN test_names t ON (f.test_name=t.Test_name)
                WHERE c.Active='Y' AND s.Active='Y' AND s.Visit_label =:vl
                AND psc.CenterID != '1' AND c.Entity_type != 'Scanner'
                ORDER BY t.Full_name",
                array('vl' => $visit_label)
            );
        }

        return $test_names;
    }

    /**
     * Determine whether an array is a numeric (normal) array or an
     * associative (hashtable) array.
     *
     * @param array $arr The array to be checked for numeric keys.
     *
     * @return boolean True if the given parameter is an array with
     *                 numeric keys, false otherwise.
     * @note   Fix this in future, checking $arr[0] is naive
     */
    static function numericArray($arr)
    {
        if (!is_array($arr)) {
            return false;
        }
        $keys = array_keys($arr);
        if (count($keys) === 0) {
            return false;
        }
        return isset($arr[0]);
    }

    /**
     * This function takes two strings. If one string has a
     * suffix which is a prefix of the other, it will return
     * the part of the second string minus the common
     * suffix/prefix.
     *
     * This is mostly used for removing pieces of a relative
     * URL in a way that can be concatinated to an absolute
     * URL without duplicating components. ie.
     *
     * removeCommonAffix("http://localhost/foo", "/foo/bar")
     *
     * would return "/bar", which can then be concatenated
     * to "http://localhost/foo" to form the URL
     * "http://loclahost/foo/bar"
     *
     * @param string $suffixStr The string which may contain a common affix
     *                          at the end of the string
     * @param string $prefixStr The string to compare the suffix string to
     *
     * @return string $prefixStr minus the largest common piece of $suffixStr
     */
    static function removeCommonAffix($suffixStr, $prefixStr)
    {
        $lastFound = '';
        // Start from the end of $suffixStr and work backwords, to make sure
        // it fails fast in the event that there's nothing in common.
        for ($i = strlen($suffixStr)-1; $i >= 0; $i -= 1) {
            $piece = substr($suffixStr, $i);
            $found = strpos($prefixStr, $piece);
            if ($found === 0) {
                // The current substring starts at index 0 in prefixStr, so we
                // know that it's a prefix. Keep track of it.
                $lastFound = $piece;
            } else if ($found === false) {
                // The current substring doesn't appear anywhere in
                // $prefixStr, so return the last known complete prefix.
                // There's no chance that a larger string is going to
                // be a prefix either.
                return substr($prefixStr, strlen($lastFound));
            } else {
                // Otherwise, the string appears somewhere, but isn't at the
                // beginning of the string. Keep going because this might be
                // the middle of a larger prefix.
            }
        }
        return $prefixStr;
    }

    /**
    * Coverts array into CSV string
    *
    * @param array $array the array to be converted
    *
    * @return string CSV string of data
    */
    static function arrayToCSV($array)
    {
        $fp = fopen("php://temp", 'w+');

        fputcsv($fp, $array['headers']);
        foreach ($array['data'] as $item) {
            fputcsv($fp, $item);
        }

        // Read what we have written.
        rewind($fp);
        $csv_string = stream_get_contents($fp);

        fclose($fp);
        return $csv_string;
    }

    /**
     * QuickForm rule to check that a date is valid.
     * This is used by create timepoint and start timepoint pages,
     * so it probably shouldn't be in the instrument class.
     *
     * @param array $dateElement The date element in QuickForm array format.
     *
     * @return True if the date is invalid, false if it's valid.
     */
    static function _checkDate($dateElement)
    {
        if (empty($dateElement['M'])
            && empty($dateElement['d'])
            && empty($dateElement['Y'])
        ) {
            // if all three elements are empty, return true b/c it'll
            // save the NULL in date field
            return true;
        } elseif (empty($dateElement['M'])
            || empty($dateElement['d'])
            || empty($dateElement['Y'])
        ) {
            // otherwise, if any of the three elements are empty, return
            // false b/c date entry has been attempted
            return false;
        }
        return checkdate($dateElement['M'], $dateElement['d'], $dateElement['Y']);
    }

    /**
     * Effectively resolve '..' characters in a file path
     *
     * @param string $path A potentially-relative filepath to be resolved
     *
     * @return string $resolvedPath a path containing no .. sequences
     */
    static function resolvePath($path)
    {
        $resolvedPath = array();
        // do some normalization
        $path        = str_replace('//', '/', $path);
        $path_pieces = explode('/', $path);
        foreach ($path_pieces as $piece) {
            if ($piece == '.') {
                continue;
            }
            if ($piece == '..') {
                if (!is_array($resolvedPath)) {
                    error_log("ERROR: Resolved path not an array");
                    return "";
                }
                array_pop($resolvedPath);
                continue;
            }
            array_push($resolvedPath, $piece);
        }
        $resolvedPath = implode('/', $resolvedPath);
        return $resolvedPath;
    }

    /**
     * Get maximum upload size. Will be the smaller value of
     * upload_max_filesize and post_max_size
     *
     * @return string smaller value of upload_max_filesize or post_max_size
     */
    static function getMaxUploadSize()
    {
        $umf = ini_get('upload_max_filesize');
        $pms = ini_get('post_max_size');
        return self::returnBytes($umf) < self::returnBytes($pms) ? $umf : $pms;
    }

    /**
     * Takes in a storage string (e.g., 64K, 1024M, 2G, etc.)
     * and returns value in bytes
     *
     * @param string $val The formatted string
     *
     * @return int|string The formatted string represented as bytes
     *
     * @note taken from http://php.net/manual/en/function.ini-get.php
     */
    static function returnBytes($val)
    {
        $val  = trim($val);
        $last = strtolower($val[strlen($val)-1]);

        switch($last) {
        case 'g':
            return (int)$val * 1024 * 1024 * 1024;
        case 'm':
            return (int)$val * 1024 * 1024;
        case 'k':
            return (int)$val * 1024;
        default:
            return (int)$val;
        }
    }

    /**
     * Get the list of language available in the database
     *
     * @return array Array of language which exist in the database table 'language'
     *               array is of the form
     *               array($language_id => $language_label)
     */
    static function getLanguageList()
    {
        $DB = \Database::singleton();

        $languagesDB = $DB->pselect(
            "SELECT language_id, language_label
             FROM language",
            array()
        );
        foreach ($languagesDB as $language) {
            $languages[$language['language_id']] = $language['language_label'];
        }
        return $languages;
    }
}
?>
