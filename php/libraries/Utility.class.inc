<?php declare(strict_types=1);
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
     * @return array containing keys 'year', 'mon', 'day' containing the
     *               computed age
     * @throws LorisException
     */
    static function calculateAge(string $dob, string $testdate): array
    {
        if (!preg_match(
            "/([0-9]{4})-?([0-9]{1,2})-?([0-9]{1,2})/",
            $dob,
            $matches
        )
        ) {
            throw new \LorisException(
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
        )
        ) {
            throw new \LorisException(
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
                'year' => (int)$testdate['year'] - (int)$dob['year'],
                'mon'  => (int)$testdate['mon'] - (int)$dob['mon'],
                'day'  => (int)$testdate['day'] - (int)$dob['day'],
               );

        return $age;
    }
    /**
     * Returns list of consents in the database
     *
     * @return array An associative array of consents, with their names and labels.
     *               The keys of the arrays are the IDs of the consents
     */
    static function getConsentList(): array
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
    static function getSiteList(bool $study_site = true): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

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
    static function getAssociativeSiteList(
        bool $study_site = true,
        bool $DCC = true
    ): array {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

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
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

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
    static function getProjectList(): array
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        // get the list of projects
        $projects = $DB->pselectColWithIndexKey(
            "SELECT ProjectID, Name FROM Project",
            array(),
            'ProjectID'
        ) ?? array();
        return $projects;
    }

    /**
     * Returns a list of study Subprojects
     *
     * @param integer|null $projectID The project for which you would like
     *                           to get the subprojects
     *
     * @return array       an associative array("SubprojectID" => "Subproject title")
     */
    static function getSubprojectList(?int $projectID = null): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        if (!is_null($projectID)) {
            $subprojects = $DB->pselect(
                "SELECT * FROM subproject
                JOIN project_subproject_rel USING (SubprojectID) 
                WHERE ProjectID=:pID",
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
     * @param integer|null $projectID The project for which you would like
     *                           to get the subprojects
     *
     * @return array an associative array("SubprojectID" => "Subproject title")
     */
    static function getSubprojectsForProject(?int $projectID = null): array
    {
        if (is_null($projectID)) {
            return array();
        }
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
    static function getTestNameByCommentID(string $commentID): string
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $query    = "SELECT Test_name FROM flag WHERE CommentID=:CID";
        $testName = $db->pselectOne($query, array('CID' => $commentID));

        return $testName;
    }

    /**
     * Transforms a config structure (such as in PSCID) into a
     * Perl-compatible regex expression for validation
     *
     * @param array       $structure  the structure root
     * @param string|null $siteAbbrev the site abbreviation, sometimes used as part
     *                           of the PSCID
     *
     * @return string the regex pattern
     *
     * @note    This should probably be moved to the Candidate class, since it's
     *       only used there to validate the PSCID
     * @note    This should be removed when user-generated PSCID support is removed
     * @cleanup
     */
    static function structureToPCRE(
        array $structure,
        ?string $siteAbbrev = null
    ): string {
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
     * Returns a list of bvl instruments
     *
     * Returns a list of instruments for a timepoint's stage ($stage).
     * If no stage arg is passed, return the full list for all stages
     *
     * @param integer     $age   age in days
     * @param string|null $stage study stage (screening or visit)
     *
     * @return array list of instruments
     */
    static function lookupBattery(int $age, ?string $stage = null): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

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
     * Converts an associative array to a numeric array consisting of the
     * argument's value as its first and only element. This is adapted from the
     * original functioning of toArray which was not type-safe. It is
     * primarily used for extracting configuration settings.
     *
     * @param array $associative_array An asssociative array.
     *
     * @return array The new numeric array, or $array if it was already numeric.
     */
    static function associativeToNumericArray(array $associative_array): array
    {
        if (!array_key_exists(0, $associative_array)) {
            return array($associative_array);
        }
        return $associative_array;
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
        throw new \DeprecatedException(
            'Utility::toArray() is deprecated and should not be used. ' .
            'Instead use Utility::associativeToNumericArray() for converting ' .
            'arrays. Scalar values cannot be passed to this function.'
        );
    }

    /**
     * Takes a scalar value and returns an array containing that value as its
     * only element.
     * Note: This function should be used for tags without attributes
     *
     * @param mixed $var The variable to be converted to an array.
     *
     * @return array If $var is an array, var, otherwise an array containing $var
     */
    static function asArray($var): array
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
    public static function nullifyEmpty(array &$arr, string $field): array
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
    static function getAllInstruments(): array
    {
        $Factory       = \NDB_Factory::singleton();
        $DB            = $Factory->Database();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names ORDER BY Full_name",
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
    static function getAllDDEInstruments(): array
    {
        $Factory       = \NDB_Factory::singleton();
        $DB            = $Factory->Database();
        $config        = $Factory->config();
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
    static function getDirectInstruments(): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $instruments   = array();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names WHERE IsDirectEntry=true 
             ORDER BY Full_name",
            array()
        );
        foreach ($instruments_q as $key) {
            $instruments[$key['Test_name']] =$key['Full_name'];
        }

        return $instruments;
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
    static function columnsHasNull(string $table_name, string $column): bool
    {
        //$config   =& NDB_Config::singleton();
        //$database = $config->getSetting('database');
        $query    = "SELECT count(*)
            FROM {$table_name}
            WHERE {$column} is NULL";
        $DB       =& \Database::singleton();
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
     * @return string
     * @throws DatabaseException
     */
    static function getStageUsingCandID(string $Cand_id): string
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

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
     * @return int
     * @throws DatabaseException
     */
    static function getSubprojectIDUsingCandID(string $Cand_id): int
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $query = "select DISTINCT SubprojectID from session where CandID = :CandID";
        $stage = $db->pselect($query, array('CandID' => $Cand_id));
        return intval($stage[0]['SubprojectID']);
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
    static function getTestNameUsingFullName(string $fullname): string
    {
        $test_name  = '';
        $factory    = NDB_Factory::singleton();
        $db         = $factory->database();
        $instrument = $db->pselect(
            "SELECT Test_name FROM test_names WHERE Full_name =:fname",
            array('fname' => $fullname)
        );
        if (is_array($instrument) && count($instrument)) {
            list(,$test_name) = each($instrument[0]);
        }
        return $test_name;
    }

    /**
     * Returns all the sourcefrom instruments from parameter_type
     *
     * @param string|null $instrument If specified, return fields from this
     *                           test_name
     * @param string|null $commentID  If specified, return fields for this
     *                           commentid
     * @param string|null $name       If specified, return fields for this
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
    static function getSourcefields(
        ?string $instrument = null,
        ?string $commentID = null,
        ?string $name = null
    ): array {

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        //get sourcefield using instrument
        $sourcefields = array();
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
     * @param integer|null $projectID Limit visit labels to labels used by this
     *                                  project.
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
    static function getExistingVisitLabels(int $projectID = null): array
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();
        $qparams = array();

        if ($projectID != null) {
            $ExtraProject_Criteria
                = ' AND (s.ProjectID IS NULL OR s.ProjectID=:ProjectID)';
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
    static function getVisitInstruments(string $visit_label): array
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

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
     * Effectively resolve '..' characters in a file path
     *
     * @param string $path A potentially-relative filepath to be resolved
     *
     * @return string $resolvedPath a path containing no .. sequences
     */
    static function resolvePath(string $path): string
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
    static function getMaxUploadSize(): string
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
     * @return int The string's value converted to a number of bytes.
     *
     * @note taken from http://php.net/manual/en/function.ini-get.php
     */
    static function returnBytes(string $val) : int
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
    static function getLanguageList(): array
    {

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        $languagesDB = $DB->pselect(
            "SELECT language_id, language_label
             FROM language",
            array()
        );
        $languages   = array();
        if ($languagesDB !== null) {
            foreach ($languagesDB as $l) {
                $languages[$l['language_id']] =$l['language_label'] ?? null;
            }
        }
        return $languages;
    }

    /**
     * Generate a random string, using a cryptographically secure
     * pseudorandom number generator (random_int)
     *
     * @param int     $length   How many characters do we want?
     * @param ?string $keyspace A string of all possible characters
     *                         to select from. Will default to the alphanum set.
     *
     * @return string
     */
    static function randomString(
        int $length = 64,
        ?string $keyspace = null
    ): string {
        $keyspace = $keyspace
        ?? '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if ($length < 1) {
            throw new \RangeException("Length must be a positive integer");
        }
        $pieces = [];
        $max    = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            $pieces[] = $keyspace[random_int(0, $max)];
        }
        return implode('', $pieces);
    }

     /**
     * Takes an argument and determine whether it is a positive integer
     * i.e. > 0.
     *
     * @param mixed $value The value to check. Intentionally not type hinted as
     * this function is meant to assist in cases where the type is unknown, e.g.
     * when a parameter is sent via a form.
     *
     * @return bool Whether $value is a positive int.
     */
    public static function valueIsPositiveInteger($value): bool
    {

        // Reject arrays and objects
        if (!is_scalar($value)) {
            return false;
        }

        // First clause checks that only digits are present
        // Second clause ensures a positive value
        return ctype_digit(strval($value)) && intval($value) > 0;
    }
}

