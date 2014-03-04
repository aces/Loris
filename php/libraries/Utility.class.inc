<?php
/**
 * This file contains any static helper functions used by Loris that don't
 * fit elsewhere or are used in many different modules.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once 'PEAR.php';
require_once "NDB_Config.class.inc";
require_once 'NDB_Factory.class.inc';



/**
 * A class for holding a set of (static) utility/helper functions in a
 * single namespace.
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Utility extends PEAR
{
    /**
     * This is identical to PEAR::isError from PEAR only the function
     * has the static keyword. This is required because PEAR::isError
     * being called staticly throws a warning in newer versions of PHP
     * It should be used everywhere in the code instead of PEAR::isError
     *
     * @param object         $data The data to check if it is an error
     * @param string|integer $code If a string, check that data also has
     *                             the message of $code before returning true.
     *                             If an integer, the error must also have
     *                             the same error code for isErrorX to be
     *                             true
     *
     * @return boolean true if data is a PEAR error object
     */
    static function isErrorX($data, $code=null)
    {
        if (!is_a($data, 'PEAR_Error')) {
            return false;
        }

        if (is_null($code)) {
            return true;
        } elseif (is_string($code)) {
            return $data->getMessage() == $code;
        }

        return $data->getCode() == $code;
    }

    /**
     * Builds a query string
     *
     * @param array $params Array of parameters to put into query string format
     *
     * @return string
     */
    static function unparse_str ($params)
    {
        $str = '';
        foreach ($params as $key => $value) {
            if (is_array($value)) {
                foreach ($value AS $vkey => $vval) {
                    $str .= (strlen($str) < 1) ? '' : '&';
                    $str .= $key . rawurlencode("[$vkey]") 
                        . '=' . rawurlencode($vval);
                }
            } else {
                $str .= (strlen($str) < 1) ? '' : '&';
                $str .= $key . '=' . rawurlencode($value);
            }
        }
        return ($str);
    }


    /**
     * Converts a multi-dimensional array to a one-dimensional array
     *
     * @param array $array The multi-dimensional array
     *
     * @return string
     * @cleanup Determine if this is still used.
     */
    function reduce($array)
    {
        $string = array_reduce($array, array('Utility', 'crunch'));
        return (!empty($string)) ? explode('`', $string) : array();
    }


    /**
     * Implodes a multi-dimensional array using array_reduce()
     *
     * @param mixed $x Unknown
     * @param mixed $y Unknown
     *
     * @note If any element of the array contains a backtick, you'll run into trouble
     *
     * @return string
     * @cleanup Determine if this is still used.
     */
    function crunch($x, $y)
    {
        $a = (is_array($x)) ? array_reduce($x, array('Utility', 'crunch')) : $x;
        $b = (is_array($y)) ? array_reduce($y, array('Utility', 'crunch')) : $y;
        return (!empty($a)) ? "$a`$b" : $b;
    }


    /**
     * computes an age in years:months:days (assumes 30 days per months)
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
            return PEAR::raiseError(
                "Argument 1 does not match expected date format (YYYY-MM-DD)"
            );
        }
        $dob = array('year'=>$matches[1], 'mon'=>$matches[2], 'day'=>$matches[3]);

        if (!preg_match(
            "/([0-9]{4})-?([0-9]{1,2})-?([0-9]{1,2})/",
            $testdate,
            $matches
        )) {
            return PEAR::raiseError(
                "Argument 2 does not match expected date format (YYYY-MM-DD)"
            );
        }
        $testdate = array(
            'year' => $matches[1],
            'mon'  => $matches[2],
            'day'  => $matches[3]
        );

        if ($testdate['day'] < $dob['day']) {
            $testdate['day']+= 30;
            $testdate['mon']--;
        }
        if ($testdate['mon'] < $dob['mon']) {
            $testdate['mon']+= 12;
            $testdate['year']--;
        }

        $age = array('year'=>$testdate['year'] - $dob['year'],
            'mon' =>$testdate['mon'] - $dob['mon'],
            'day' =>$testdate['day'] - $dob['day']);

        return $age;
    }

    /**
     * Returns a list of available ethnicities that can be assigned to subjects
     *
     * @return array       an associative array("ethnicity" => "ethnicity")
     * @throws PEAR_Error
     * @access public
     * @static
     * @note This is no longer used and should be removed
     * @cleanup
     */
    function getEthnicityList()
    {
        $DB =& Database::singleton();

        // get the list of ethnicities
        $query = "SELECT DISTINCT Race as Ethnicity FROM ethnic WHERE Race <> ''";

        // execute the query
        $result = $DB->pselect($query, array());
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["Ethnicity"]] = $row["Ethnicity"];
        }
        return $list;
    }

    /**
     * Returns a list of existing ethnicities of all candidates
     *
     * @return array       an associative array("ethnicity" => "ethnicity")
     * @throws PEAR_Error
     * @access public
     * @static
     * @note This is no longer used and should be removed
     * @cleanup
     */
    function getListOfSubjectEthnicities()
    {
        $DB =& Database::singleton();

        // get the list of ethnicities
        $query = "SELECT DISTINCT Ethnicity 
            FROM candidate
            WHERE Ethnicity NOT IN (NULL, '')
            ORDER BY Ethnicity";
        // execute the query

        $result = $DB->pselect($query, array());
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["Ethnicity"]] = $row["Ethnicity"];
        }
        return $list;
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
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["CenterID"]] = $row["Name"];
        }
        return $list;
    }


    /**
     * Get the list of sites as an associative array
     *
     * @param boolean $study_site if true only return study sites from psc
     *                            table
     * @param boolean $DCC        Whether the DCC should be included or not
     *
     * @return Associative array of the form CenterID => Site Name.
     *         Note that even though CenterID is numeric, the array
     *         should be interpreted as an associative array since the keys
     *         refer to the centerID, not the array index.
     */
    function getAssociativeSiteList($study_site = true, $DCC = true)
    {
        $DB =& Database::singleton();

        // get the list of study sites - to be replaced by the Site object
        $query = "SELECT CenterID, Name FROM psc ";
        if ($study_site) {
            $query .= "WHERE Study_site='Y'";
        }	
        if (!$DCC) {
            $query .= " AND Name != 'DCC'";
        }

        $result = $DB->pselect($query, array());
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

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
     * @return associative array of the form VisitLabel => Visit_label
     */
    function getVisitList()
    {
        $DB =& Database::singleton();

        $query = "SELECT Visit_label from Visit_Windows ORDER BY Visit_label";

        $result = $DB->pselect($query, array());
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        $list = array();
        foreach ($result as $row) {
            $list[$row["Visit_label"]] = ucfirst($row["Visit_label"]);
        }
        return $list;
    }


    /**
     * Returns a list of study Subprojects
     *
     * @throws PEAR_Error
     * @return array       an associative array("SubprojectID" => "Subproject title")
     */
    static function getSubprojectList()
    {
        $config =& NDB_Config::singleton();

        // get the list of Subprojects
        $subprojectSettings = $config->getSetting('subprojects');
        foreach (Utility::toArray(
            $subprojectSettings['subproject']
        ) as $subproject) {
            $list[$subproject['id']]=$subproject['title'];
        }
        return $list;
    }

    /**
     * Returns a list of study Projects
     *
     * @return array an associative array("projectID" => "project title")
     * @access public
     */
    function getProjectList()
    {
        $config =& NDB_Config::singleton();

        // get the list of Subprojects
        $projectSettings= $config->getSetting('Projects');
        foreach (Utility::toArray($projectSettings['project']) AS $project) {

            $list[$project['id']]=$project['title'];
        }
        return $list;
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

        $db =& Database::singleton();
        $config =& NDB_Config::singleton();
        $subprojectSettings= $config->getSetting('subprojects');
        foreach (Utility::toArray(
            $subprojectSettings['subproject']
        ) AS $subproject) {
            $allSubprojects[$subproject['id']]=$subproject['title'];
        }
        if ($projectID != null) { 
            $query = "SELECT SubprojectID FROM project_rel WHERE ProjectID=:pID";
            $subprojList = $db->pselect($query, array('pID' => $projectID));

            if (Utility::isErrorX($subprojList)) {
                return PEAR::raiseError(
                    "Could not list of subprojects ".$subprojList->getMessage()
                );
            }
            foreach ($subprojList as $row) {
                $subList[] = $row['SubprojectID'];
            }
            $list = array();
            foreach ($subList as $row) {
                $list[$row] = $allSubprojects[$row];    
            }
            return $list;
        } else {
            return $allSubprojects;   

        }

    }

    /**
     * Returns the test name associated with a given commentID
     *
     * @param string $commentID A CommentID for which you would like
     *                          to know the test_name
     *
     * @return string The test name this commentID is a part of
     * @note This should be moved to whatever module uses it, or perhaps
     *       NDB_BVL_Instrument
     * @cleanup
     */
    static function getTestNameByCommentID($commentID)
    {
        $db =& Database::singleton();

        $query = "SELECT Test_name FROM flag WHERE CommentID=:CID";
        $testName = $db->pselectOne($query, array('CID' => $commentID));

        if (Utility::isErrorX($testName)) {
            return PEAR::raiseError(
                "Could not get test name: ".$testName->getMessage()
            );
        }

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
     * @note This should probably be moved to the Candidate class, since it's 
     *       only used there to validate the PSCID
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
     * merges two arrays recursively, overwriting values of the first
     * with the second.  the one "strange" bit is that if there exists
     * a set of 2 or more sibling elements with the same name, then
     * the entire set will be replaced rather than recursively merged.
     *
     * @param array  $array1        The first array to be merged
     * @param array  $array2        The second array to be merged
     * @param array& &$merged_array A reference to an array to merge
     *                              the parameters into. If not specified,
     *                              a new array will be created
     *
     * @return An array with the two parameters recursively merged
     */
    static function array_merge_recursive_overwriting(
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
                Utility::array_merge_recursive_overwriting(
                    $array1[$key], $array2[$key], $merged_array[$key]
                );
            } else {
                $merged_array[$key] = $value;
            }
        }
        return $merged_array;
    }

    /**
     * returns a list of bvl instruments
     * returns a list of instruments for a timepoint's stage ($stage). 
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
        $query = "SELECT t.Test_name FROM test_battery AS b, test_names AS t 
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
        $rows = array();
        $tests = array();
        $rows = $DB->pselect($query, $params);
        if (Utility::isErrorX($rows)) {
            fwrite(
                STDERR,
                "Could not lookup battery from database: ".$rows->getMessage()
            );
            return false;
        }

        // repackage the array
        foreach ($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    }

    /**
     * toArray ensures that $var is a collection of $var elements, not just a 
     * single element. This is useful for using config->getSetting for an element 
     * that may be in the config multiple times or may be in the config file a 
     * single time. By calling toArray, you ensure that the value you're working
     * with is an array and don't need to determine if it's an array or a scalar.
     * Note: This does not change a string into an array with one string element
     *
     * @param mixed $var The variable to be converted to an array.
     *
     * @return array If $var is an array, var, otherwise an array containing $var
     */
    static function toArray($var)
    {
        if (!isset($var[0])) {
            $var = array($var);
        }
        return $var;
    }

    /**
     * asArray ensures that $var is a collection elements, not just a single element
     * Not the same as toArray, apparently.
     *
     * @param mixed $var The variable to be converted to an array.
     *
     * @return array If $var is an array, var, otherwise an array containing $var
     * @cleanup This should be removed and all uses converted to toArray
     *          (or vice versa, but toArray seems to be more common in the code)
     */
    function asArray($var)
    {
        if (!is_array($var)) {
            return array($var);
        }
        return $var;
    }

    /**
     * Explodes an encapsulted, delimited string like 
     * 'hello','my name is \'bob\'', 'etc'
     *
     * @param string $seperator unknown
     * @param string $delimiter unknown
     * @param string $string    unknown
     *
     * @return unknown
     *
     * @note Don't know what the above function comment is supposed to mean, 
     *       so just preserving it for now. Appears to only be used 
     *       by NDB_Form_candidate_parameters and if so, should be moved there.
     * @cleanup
     */
    function explodeEncapsulated($seperator, $delimiter, $string)
    {
        $state=0;
        $output=$string;
        $output_index=0;

        for ($i=0;$i<strlen($string);$i++) {
            switch ($string[$i]) {
            case $delimiter:
                if ($string[$i-1]!="\\") {
                    $output=substr_replace($output, "", $output_index, 1);
                    $output_index--;
                }
                break;

            case $seperator:
                if ($state%2==0) {
                    $output=substr_replace($output, "{@}", $output_index, 1);
                    $output_index+=2;
                }
                break;
            }
            $output_index++;
        }
        $output=str_replace("\\".$delimiter, $delimiter, $output);
        return explode("{@}", $output);
    }


    /**
     * Presumably, this does an array_merge and preserves the keys. Unsure
     * why this exists instead of using built-in PHP functions.
     * to be used.
     *
     * From php.net    
     *
     * @return The parameters passed all merged together, with keys preserved?
     * @note Function comment written by Dave, not the author of this function.
     * @note This function does not appear to be used anymore.
     * @cleanup
     */
    function arrayMergeKeepKeys()
    {
        $arg_list = func_get_args();
        foreach ((array)$arg_list as $arg) {
            foreach ((array)$arg as $K => $V) {
                $Zoo[$K]=$V;
            }
        }
        return $Zoo;
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
     * @param array& &$arr  A reference to an array being saved to
     *                      the database. This array may be modified
     *                      by calls to this function.
     * @param string $field The field for which '' should be converted
     *                      to null.
     *
     * @return array The same array passed in, after modifications.
     */
    function nullifyEmpty(&$arr, $field)
    {
        if ($arr[$field] === '') {
            $arr[$field] = null;
        }
        return $arr;
    }

    /**
     * Case insensitive search to see if an item is in an array
     * from php.net comments
     *
     * @param string $item  The needle to search for
     * @param array  $array The array to search for $item
     *
     * @return True iff $item is in $array without regard to case
     * @note Function comment written by Dave, not the author of this function.
     * @note This does not appear to be used. If not, it should be removed,
     * @cleanup ?
     */
    function in_array_insensitive($item, $array)
    {
        $item = &strtoupper($item);
        foreach ($array as $element) {
            if ($item == strtoupper($element)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Function (previously?) used by stats page(?) for map/reduce to extract
     * the Test_name from all the rows returned from a database call and
     * thereby convert from an array of the form
     *
     * array(0 => array('Test_name' => value))
     *
     * to
     * 
     * array(0 => value)
     *
     *
     * If this doesn't make sense, see note.
     * 
     * @param array $Arr A row from an associative array based by array_map
     *
     * @return The name from the given array row.
     * @note Function should be removed and code using it cleaned up.
     * @cleanup
     */
    function flatten($Arr)
    {
        return $Arr['Test_name'];
    }

    /**
     * Function (previously?) used by stats page(?) for map/reduce to extract
     * the Full_name from all the rows returned from a database call and
     * thereby convert from an array of the form
     *
     * array(0 => array('Full_name' => value))
     *
     * to
     * 
     * array(0 => value)
     *
     *
     * If this doesn't make sense, see note.
     * 
     * @param array $Arr A row from an associative array based by array_map
     *
     * @return The name from the given array row.
     * @note Function should be removed and code using it cleaned up.
     * @cleanup
     */
    function flattenFull($Arr)
    {
        return $Arr['Full_name'];
    }

    /**
     * Get a list of instruments installed in Loris.
     *
     * @return Associative array of the form Test_name => Full Description
     * @note Arguably, this should be a static function in NDB_BVL_Instrument
     */
    static function getAllInstruments()
    {
        $Factory = NDB_Factory::singleton();
        $DB      = $Factory->Database(); //=& Database::singleton();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names",
            array()
        );
        $instruments = array();
        foreach ($instruments_q as $row) {
            if (isset($row['Test_name']) && isset($row['Full_name'])) {
                $instruments[$row['Test_name']]=$row['Full_name'];
            }
        }

        return $instruments;
    }


    /**
     * Return a list of instruments which have scored columns specified
     * for the instrument. 
     *
     * @return non-associative array of the test names which have scoring
     */
    function getScoredInstruments()
    {
        $All = Utility::getAllInstruments();
        $Scored = array();
        $Nothing = array();
        foreach ($All as $Instrument=>$Full_name) {
            if (Utility::getScoreColsForInstrument($Instrument) != $Nothing) {
                $Scored[] = $Instrument;
            }
        }
        return $Scored;
    }

    /**
     * Gets a list of all instruments where are administered as direct data
     * entry from subjects. 
     * This should return an array in a format suitable for addSelect() from
     * NDB_Page
     *
     * @return associative array of test_names in a Test_Name => "Full Name"
     */
    static function getDirectInstruments()
    {
        $DB =& Database::singleton();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names WHERE IsDirectEntry=true",
            array()
        );
        foreach ($instruments_q as $key) {
            $instruments[$key['Test_name']]=$key['Full_name'];
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
        $All = Utility::getAllInstruments();
        $Scored = array();
        $Nothing = array();
        foreach ($All as $Instrument=>$Full_name) {
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
     * @return non-associative array of scored columns for the instrument given
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
     * Return the number of columns to use before the quat table scripts
     * overflow into a new table. This information comes from the config.xml.
     *
     * @return integer Column threshold from config file
     * @note Function should be either removed or moved to NDB_Config
     * @note Function comment written by Dave, who can't remember if he's
     *       the author of this function.
     *
     * @cleanup
     */
    static function getColumnThresholdCount()
    {
        $config =& NDB_Config::singleton();
        // get the list of Subprojects
        $column_threshold= $config->getSetting('columnThreshold');
        return $column_threshold;
    }


    /**
     * Checks to see if a table contains a specified column
     *
     * @param string $test_name The table to check for a column.
     * @param string $column    The column name to check the table for.
     *
     * @return boolean true if the table has a the given column
     * @note This should be moved to the Database class and references to it
     *       updated.
     * @note Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function columnExists($test_name,$column)
    {
        $config =& NDB_Config::singleton();
        $database = $config->getSetting('database');
        $query = "SELECT DISTINCT table_name
            FROM information_schema.columns
            WHERE table_name = :tn 
            AND COLUMN_NAME = :cn 
            AND TABLE_SCHEMA = :db";
        $DB =& Database::singleton();
        $effected = $DB->pselectOne(
            $query,
            array('tn'=>$test_name,'cn'=>$column, 'db'=>$database)
        );
        if ($effected) {
            return true;
        }
        return false;
    }

    /**
     * Returns the visit labels that a given test_name exists in
     *
     * @param string $test_name The instrument that we want to know
     *                          which visit labels exist in.
     *
     * @return Array of the form array(0 => array('Visit_label' => VL))
     *         where VL is the value returned from the database.
     *
     * @note This should be moved out of the Utility class into whatever
     *       module uses it. (Data team helper?)
     * @note Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function getVisitLabelUsingTestName($test_name)
    {
        $db =& Database::singleton();
        $query = "SELECT DISTINCT s.visit_label FROM session s
            JOIN flag f ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.Candid = s.Candid)
            JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE s.Active = 'Y' AND c.Active= 'Y' 
            AND f.Test_name = :tn AND psc.Centerid!= '1'";

        $visitlabels = $db->pselect($query, array('tn'=>$test_name));
        if (Utility::isErrorX($visitlabels)) {
            return PEAR::raiseError(
                "Could not get visit label: ".$visitlabels->getMessage()
            );
        }
        return $visitlabels;
    }
    /**
     * Looks up the test_name for the current full name
     *
     * @param string $fullname Descriptive name to be looked up
     *
     * @return Non-associative array of the form array(Test1, Test2, ..)
     * @note This should be moved out of the Utility class into whatever
     *       module uses it. (Data team helper?)
     * @note Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function getTestNameUsingFullName($fullname)
    {
        $db =& Database::singleton();
        //print_r($instument);
        $instrument = $db->pselect(
            "SELECT Test_name FROM test_names WHERE Full_name =:fname",
            array('fname'=>$fullname)
        );
        if (is_array($instrument) && count($instrument)) {
            //$full_name = $names[0]
            list(,$test_name) = each($instrument[0]);
        }
        return $test_name;
    }

    /**
     * Get all the sourcefrom instruments from parameter_type (which 
     * exist in the data_integrity flag table)
     *
     * @return Associative array of the form array('Full Name' => 'Full Name')
     * @note This should be moved out of the Utility class into whatever
     *       module uses it. (Data team helper?)
     * @note Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function getSourcefrom()
    {
        $DB =& Database::singleton();

        $sourcefrom = $DB->pselect(
            "SELECT DISTINCT t.Full_name FROM parameter_type pt
            JOIN data_integrity_flag di ON (pt.Name = di.Name)
            JOIN test_names t ON (t.test_name = pt.sourcefrom)
            WHERE pt.sourcefrom IS NOT NULL
            ORDER BY t.Full_name",
            array()
        );

        foreach ($sourcefrom as $table) {
            if (!is_null($table)) {
                $result[$table['Full_name']] = $table['Full_name'];
            }
        }
        return $result;
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
     * @return Array of the form array(
     *              0 => array(
     *                   'SourceField' => value
     *                   'Name'        => name
     *
     *              )
     *         )
     * @note This should be moved out of the Utility class into whatever
     *       module uses it. (Data team helper?)
     * @note Function comment written by Dave, not the author of this function.
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
                array('sf'=>$instrument)
            );
        } elseif (!is_null($commentID)) { //get sourcefield using commentid
            $instrument = $DB->pselectOne(
                "SELECT Test_name FROM flag WHERE CommentID = :cid",
                array('cid'=>$commentID)
            );
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type 
                WHERE queryable = '1' AND sourcefrom = :instrument
                ORDER BY Name",
                array('instrument'=>$instrument)
            );
        } elseif (!is_null($name)) { //get all source fields
            $sourcefields = $DB->pselectRow(
                "SELECT * FROM parameter_type WHERE Name = :pn",
                array('pn'=>$name)
            );
        }
        return $sourcefields;
    }
    

    /**
     * Returns a list of study Visit Labels that are being used by this study.
     *
     * @param integer $projectID Limit visit labels to labels used by this project
     *
     * @return An associated array of study visits in the format array('VL' => 'VL')
     *         where VL is the visit label
     *
     * @note THIS FUNCTION USES STRING CONCATENATION TO GENERATE AN SQL STATEMENT.
     *       IT IS VULNERABLE TO AN SQL INJECTION ATTACK.
     * @note Function comment written by Dave, not the author of this function.
     * @vulnerable
     * @cleanup
     */
    static function getExistingVisitLabels($projectID = null)
    {
        $db =& Database::singleton();
        if ($projectID != null) {
            $ExtraProject_Criteria 
                = ' AND (c.ProjectID IS NULL OR c.ProjectID=' . $projectID . ')';
        } else {
            $ExtraProject_Criteria ='';
        }
        $query = "SELECT DISTINCT Visit_label FROM session s 
            JOIN candidate c ON (s.CandID = c.Candid) 
            JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE c.Active = 'Y'
            AND s.Active = 'Y'
            AND c.PSCID NOT LIKE '%scanner%'
            AND psc.CenterID!= '1'
            $ExtraProject_Criteria ORDER BY Visit_label";
        $visitlabels = $db->pselect($query, array());
        $visits = array();
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
     * @note Function comment written by Dave, not the author of this function.
     *       The return value format seems weird. Where is this used?
     * @cleanup
     */
    static function getVisitInstruments($visit_label)
    {
        $DB =& Database::singleton();

        if (Utility::ColumnExists('test_battery', 'Test_name_display')) {
            $test_names = $DB->pselect(
                "SELECT DISTINCT Test_name_display FROM test_battery 
                WHERE Visit_label=:vl",
                array('vl'=>$visit_label)
            );
        } else {
            $test_names= $DB->pselect(
                "SELECT DISTINCT t.Full_name as Test_name_display FROM session s
                JOIN candidate c ON (c.candid=s.candid)
                JOIN psc ON (s.CenterID = psc.CenterID)
                JOIN flag f ON (f.sessionid=s.id)
                JOIN test_names t ON (f.test_name=t.Test_name)
                WHERE c.Active='Y' AND s.Active='Y' AND s.Visit_label =:vl 
                AND psc.CenterID != '1' AND c.PSCID != '%scanner%'
                ORDER BY t.Full_name",
                array('vl'=>$visit_label)
            );
        }

        if (Utility::isErrorX($test_names)) {
            return PEAR::raiseError("DB Error: ".$instruments->getMessage());
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

}
?>
