<?php declare(strict_types=1);
use \Loris\StudyEntities\Candidate\CandID;

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
            throw new LorisException(
                "Argument 1 does not match expected date format (YYYY-MM-DD)"
            );
        }
        $dob = [
            'year' => $matches[1],
            'mon'  => $matches[2],
            'day'  => $matches[3],
        ];

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
        $testdate = [
            'year' => $matches[1],
            'mon'  => $matches[2],
            'day'  => $matches[3],
        ];

        if ($testdate['day'] < $dob['day']) {
            $testdate['day'] += 30;
            $testdate['mon']--;
        }
        if ($testdate['mon'] < $dob['mon']) {
            $testdate['mon'] += 12;
            $testdate['year']--;
        }

        $age = [
            'year' => (int)$testdate['year'] - (int)$dob['year'],
            'mon'  => (int)$testdate['mon'] - (int)$dob['mon'],
            'day'  => (int)$testdate['day'] - (int)$dob['day'],
        ];

        return $age;
    }
    /**
     * Returns list of consent groups in the database
     *
     * @return array An associative array of consent grouping,
     *               with their names and labels. The keys of
     *               the arrays are the IDs of the groups.
     */
    static function getConsentGroups(): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $query = "SELECT ConsentGroupID, Name, Label FROM consent_group";
        $key   = "ConsentGroupID";

        $result = $DB->pselectWithIndexKey($query, [], $key);

        return $result;
    }
    /**
     * Returns list of consents in the database
     *
     * @return array An associative array of consents, with their names,
     *               labels, and group ID. The keys of the arrays are the
     *               IDs of the consents.
     */
    static function getConsentList(): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $query = "SELECT ConsentID, Name, Label, ConsentGroupID FROM consent";
        $key   = "ConsentID";

        $result = $DB->pselectWithIndexKey($query, [], $key);

        return $result;
    }

    /**
     * Returns a list of sites in the database
     *
     * @param boolean $study_site if true only return study sites from psc
     *                            table
     * @param boolean $DCC        Whether the DCC should be included or not
     *
     * @return array an associative array("center ID" => "site name")
     */
    static function getSiteList(
        bool $study_site = true,
        bool $DCC = true
    ): array {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        // get the list of study sites - to be replaced by the Site object
        $query         = "SELECT CenterID, Name FROM psc ";
        $whereElements = [];

        if ($study_site) {
                $whereElements[] = "Study_site='Y'";
        }
        if (!$DCC) {
                $whereElements[] = "CenterID <> 1";
        }
        if (!empty($whereElements)) {
            $query .= "WHERE ".implode(" AND ", $whereElements);
        }
        $result = $DB->pselect($query, []);

        // fix the array
        $list = [];
        foreach ($result as $row) {
            $list[$row["CenterID"]] = $row["Name"];
        }
        return $list;
    }

    /**
     * Returns a list of sites by site IDs from the database
     *
     * @param array $siteIDs a list of the study center IDs
     *
     * @return array an associative array("center ID" => "site name")
     */
    static function getSiteNameListByIDs(array $siteIDs): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $params = [];
        $values = [];
        foreach ($siteIDs as $key => $siteID) {
            $para          = "cid$key";
            $params[]      = ":$para";
            $values[$para] = $siteID;
        }

        return $DB->pselectColWithIndexKey(
            "SELECT CenterID as ID, Name FROM psc WHERE CenterID in (" .
            implode(', ', $params) . ")",
            $values,
            'ID'
        );
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
     *
     * @deprecated
     */
    static function getAssociativeSiteList(
        bool $study_site = true,
        bool $DCC = true
    ): array {
        throw new \DeprecatedException(
            ' This function is deprecated. Please use \Utility::getSiteList()'
            . ' instead.'
        );
    }

    /**
     * Returns a list of study Visit Labels that are being used by this study.
     *
     * @param ?ProjectID $projectID Limit visit labels to labels used by this
     *                              project.
     *
     * @return array of study visits in the format array('VL' => 'VL')
     *         where VL is the visit label
     */
    static function getVisitList(?ProjectID $projectID = null) : array
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();
        $qparams = [];

        if ($projectID != null) {
            $ExtraProject_Criteria
                = ' AND (s.ProjectID IS NULL OR s.ProjectID=:ProjectID)';
            $qparams["ProjectID"]  = $projectID;
        } else {
            $ExtraProject_Criteria ='';
        }
        $query  = "SELECT DISTINCT Visit_label FROM session s
            JOIN candidate c ON (s.CandID = c.Candid)
            JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE c.Active = 'Y'
            AND s.Active = 'Y'
            AND c.Entity_type != 'Scanner'
            AND psc.CenterID!= '1'
            $ExtraProject_Criteria ORDER BY Visit_label";
        $result = $db->pselect($query, $qparams);
        // The result has several columns; we only want the visit labels.
        $visitLabels = array_column($result, 'Visit_label');

        // Generates an array where the keys are equal to the values.
        return array_combine($visitLabels, $visitLabels);
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
            [],
            'ProjectID'
        ) ?? [];
        return $projects;
    }

    /**
     * Returns a list of study Cohorts
     *
     * @param ?ProjectID $projectID The project for which you would like
     *                              to get the cohorts
     *
     * @return array       an associative array("CohortID" => "Cohort title")
     */
    static function getCohortList(?ProjectID $projectID = null): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        if (!is_null($projectID)) {
            $cohorts = $DB->pselect(
                "SELECT * FROM cohort
                JOIN project_cohort_rel USING (CohortID)
                WHERE ProjectID=:pID",
                ['pID' => $projectID]
            );
        } else {
            $cohorts = $DB->pselect("SELECT * FROM cohort", []);
        }

        $subprojs = [];
        foreach ($cohorts as $row) {
            $subprojs[$row['CohortID']] = $row['title'];
        }
        return $subprojs;
    }

    /**
     * Returns a list of study Cohorts associated with a project
     *
     * @param ?ProjectID $projectID The project for which you would like
     *                              to get the cohorts
     *
     * @return array an associative array("CohortID" => "Cohort title")
     */
    static function getCohortsForProject(?ProjectID $projectID = null): array
    {
        if (is_null($projectID)) {
            return [];
        }
        return self::getCohortList($projectID);
    }

    /**
     * Returns a list of visits associated with the supplied cohort.
     * The visits are in an associative array format [VisitName=>VisitLabel]
     *
     * @param int $cohortID ID of the cohort
     *
     * @return array list of visits for supplied cohort
     *
     * @note This function should be moved to a cohort class when it is created
     */
    static function getVisitsForCohort(int $cohortID): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $result = $DB->pselectColWithIndexKey(
            "SELECT DISTINCT VisitName, VisitLabel
            FROM visit v
                JOIN visit_project_cohort_rel vpsr USING(VisitID)
                JOIN project_cohort_rel psr USING(ProjectCohortRelID)
                JOIN cohort s USING(CohortID)
            WHERE CohortID = :sid
            ORDER BY VisitLabel",
            ["sid"=>$cohortID],
            "VisitName"
        );

        return $result;
    }

    /**
     * Returns a list of visits associated with the supplied Project AND cohort.
     * The visits are in an associative array format [VisitID=>VisitLabel]
     *
     * @param \ProjectID $projectID ID of the project
     * @param int        $cohortID  ID of the cohort
     *
     * @return array list of visits for supplied project-cohort combination
     *
     * @note This function should be moved to a visits class when it is created
     */
    static function getVisitsForProjectCohort(
        \ProjectID $projectID,
        int $cohortID
    ): array {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $result = $DB->pselectColWithIndexKey(
            "SELECT DISTINCT VisitID, VisitLabel
            FROM visit v
                JOIN visit_project_cohort_rel vpsr USING(VisitID)
                JOIN project_cohort_rel psr USING(ProjectCohortRelID)
	    WHERE CohortID = :sid
		AND ProjectID = :pid
            ORDER BY VisitLabel",
            ["sid"=>$cohortID, "pid"=>$projectID],
            "VisitID"
        );

        return $result;
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
        $params = ['CandAge' => $age];

        if (!is_null($stage)) {
            $query .= " AND b.Stage=:BatStage";
            $params['BatStage'] = $stage;
        }

        $query .= " GROUP BY Test_name ORDER BY Test_name";

        // get the list of instruments
        $tests = [];
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
            return [$associative_array];
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
     *
     * @deprecated
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
            return [$var];
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
        error_log(
            "LORIS Deprecation Warning: The getAllInstruments() function of ".
            "the Utility class has been deprecated. This function does not load ".
            "the most accurate Full_name value and should be replaced by ".
            "getInstrumentNamesList() of the NDB_BVL_Instrument class."
        );
        $Factory       = \NDB_Factory::singleton();
        $DB            = $Factory->Database();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names ORDER BY Full_name",
            []
        );
        $instruments   = [];
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
        error_log(
            "LORIS Deprecation Warning: The getAllDDEInstruments() function of
            the Utility class has been deprecated. This function does not load the
            most accurate Full_name value and should be replaced by
            getDDEInstrumentNamesList() of the NDB_BVL_Instrument class."
        );
        $Factory       = \NDB_Factory::singleton();
        $DB            = $Factory->Database();
        $config        = $Factory->config();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names",
            []
        );
        $doubleDataEntryInstruments = $config->getSetting(
            'DoubleDataEntryInstruments'
        );

        $instruments = [];
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
        error_log(
            "LORIS Deprecation Warning: The getDirectInstruments() function of
            the Utility class has been deprecated. This function does not load the
            most accurate Full_name value and should be replaced by
            getDirectEntryInstrumentNamesList() of the NDB_BVL_Instrument class."
        );
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $instruments   = [];
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names WHERE IsDirectEntry=true
             ORDER BY Full_name",
            []
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
        $DB       = \NDB_Factory::singleton()->database();
        $num_null = $DB->pselectOne(
            $query,
            []
        );
        if ($num_null > 0) {
            return true;
        }
        return false;
    }

    /**
     * Looks up visit stage using candidate ID.
     *
     * @param CandID $Cand_id candidate ID
     *
     * @return string
     * @throws DatabaseException
     */
    static function getStageUsingCandID(CandID $Cand_id): string
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $query = "select DISTINCT Current_stage from session where ".
            "CandID = :Cand_id";
        $stage = $db->pselect($query, ['Cand_id' => $Cand_id->__toString()]);
        return $stage[0]['Current_stage'];
    }

    /**
     * Returns all the sourcefrom instruments from parameter_type
     *
     * @param string|null $instrument If specified, return fields from this
     *                                test_name
     * @param string|null $commentID  If specified, return fields for this
     *                                commentid
     * @param string|null $name       If specified, return fields for this
     *                                parameter_type name
     *
     * @return  ?array Format: array(
     *              0 => array(
     *                   'SourceField' => value
     *                   'Name'        => name
     *
     *              )
     *         )
     * @note    This should be moved out of the Utility class into whatever
     *       module uses it. (Behavioural Quality Control, BVL_Feedback_panel)
     * @note    Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function getSourcefields(
        ?string $instrument = null,
        ?string $commentID = null,
        ?string $name = null
    ): ?array {

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        //get sourcefield using instrument
        $sourcefields = [];
        if (!is_null($instrument)) {
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable='1' AND sourcefrom = :sf
                ORDER BY Name",
                ['sf' => $instrument]
            );
        } elseif (!is_null($commentID)) { //get sourcefield using commentid
            $instrument   = $DB->pselectOne(
                "SELECT Test_name FROM flag WHERE CommentID = :cid",
                ['cid' => $commentID]
            );
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable = '1' AND sourcefrom = :instrument
                ORDER BY Name",
                ['instrument' => $instrument]
            );
        } elseif (!is_null($name)) { //get all source fields
            $sourcefields = $DB->pselectRow(
                "SELECT * FROM parameter_type WHERE Name = :pn",
                ['pn' => $name]
            );
        }
        return $sourcefields;
    }


    /**
     * Returns a list of study Visit Labels that are being used by this study.
     *
     * @param integer|null $projectID Limit visit labels to labels used by this
     *                                project.
     *
     * @return array<string,string> Study visits in the format array('VL' => 'VL')
     *         where VL is the visit label
     *
     * @deprecated
     */
    static function getExistingVisitLabels(?int $projectID = null): array
    {
        throw new \DeprecatedException(
            'This function is deprecated. Please use Utility::getVisitList() '
            . 'instead.'
        );
    }

    /**
     * Get all the instruments which currently exist for a given visit label
     * in the database.
     *
     * @param string $visit_label The visit label for which you would like
     *                            to know the existing visit labels
     *
     * @return array Array of instruments which exist for the given visit label
     *               array is of the form [$Test_name => $Full_name]
     */
    static function getVisitInstruments(string $visit_label): array
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        $test_names = $DB->pselectColWithIndexKey(
            "SELECT DISTINCT t.Test_name, t.Full_name
            FROM session s
            JOIN candidate c ON (c.CandID=s.CandID)
            JOIN psc ON (s.CenterID=psc.CenterID)
            JOIN flag f ON (f.sessionID=s.id)
            JOIN test_names t ON (f.test_name=t.Test_name)
            WHERE c.Active='Y' AND s.Active='Y' AND s.Visit_label =:vl
            AND psc.CenterID != '1' AND c.Entity_type != 'Scanner'
            ORDER BY t.Full_name",
            ['vl' => $visit_label],
            'Test_name'
        );

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
        $resolvedPath = [];
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

        switch ($last) {
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
            []
        );
        $languages   = [];
        foreach ($languagesDB as $language) {
            $languages[$language['language_id']] = $language['language_label'];
        }
        return $languages;
    }

    /**
     * Generate a random string, using a cryptographically secure
     * pseudorandom number generator (random_int)
     *
     * @param int     $length   How many characters do we want?
     * @param ?string $keyspace A string of all possible characters
     *                          to select from. Will default to the alphanum set.
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
     * Convert a DateTime or string to the date format specified in the
     * dateDisplayFormat config setting.
     *
     * @param string $date The date to be formatted.
     *
     * @return string $date formatted according to the dateDisplayFormat setting.
     */
    static function toDateDisplayFormat(string $date): string
    {
        try {
            $dt = new DateTime($date);
        } catch (Exception $e) {
            throw new \LorisException(
                "Input must be a valid date/time string: $e"
            );
        }

        $factory = \NDB_Factory::singleton();
        return $dt->format(
            $factory->config()->getSetting('dateDisplayFormat')
            ?? DateTime::ATOM
        );
    }

     /**
      * Takes an argument and determine whether it is a positive integer
      * i.e. > 0.
      *
      * @param mixed $value The value to check. Intentionally not type hinted as
      *                     this function is meant to assist in cases where the type
      *                     is unknown, e.g. when a parameter is sent via a form.
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

    /**
     * Get the list of MRI scan type available in the database
     *
     * @return array Array of MRI scan types which exist in the database table
     *               mri_scan_type joined to the files table
     *               array($scan_type_id => $scan_type)
     */
    static function getScanTypeList(): array
    {

        $scan_types_DB = \NDB_Factory::singleton()->database()->pselect(
            "SELECT ID, Scan_type
             FROM mri_scan_type mri
                JOIN files f ON (f.AcquisitionProtocolID=mri.ID)",
            []
        );

        $scan_types = [];
        foreach ($scan_types_DB as $scan_type) {
            $scan_types[$scan_type['ID']] = $scan_type['Scan_type'];
        }

        return $scan_types;
    }

    /**
     * Append a forward slash to a path if it doesn't already exist
     *
     * @param string $path path to which the slash should be appended
     *
     * @return string
     */
    static function appendForwardSlash(string $path) : string
    {
        return rtrim($path, '/\\') . '/';
    }

    /**
     * Joins strings together to create a well-formed filepath.
     *
     * @param string ...$paths The path components to be joined.
     *
     * @return string Path components joined without any doubled forward-slashes.
     */
    public static function pathJoin(string ...$paths)
    {
        // This array stores the components of the final path.
        $result = [];

        $addSlash = (strpos($paths[0], '/') === 0);

        foreach ($paths as $part) {
            // Remove all leading forward-slashes from $part.
            $part = ltrim($part, '/');
            // Remove trailing forward-slashes from $part.
            while (mb_substr($part, -1) === '/') {
                $part = rtrim($part, '/');
            }
            $result[] = $part;
        }

        // If the first part began with a front-slash, add it back
        return ($addSlash ? '/' : '') . implode('/', $result);
    }

    /**
     * Convert 'null' strings from FormData object to NULL
     *
     * @param array $formData The received FormData object.
     *
     * @return array The parsed FormData object.
     */
    public static function parseFormData(array $formData) : array
    {
        foreach ($formData as $key => $val) {
            if ($formData[$key] === 'null') {
                $formData[$key] = null;
            }
        }
        return $formData;
    }

    /**
     * Update the candidate_diagnosis_evolution_rel diagnosis confirmation status
     *
     * @param SessionID $sessionID  The sessionID that has been approved
     * @param bool      $isApproved Specifies if session approval is set to pass
     *
     * @return void
     */
    static function updateDiagnosisConfirmationStatus(
        SessionID $sessionID,
        bool $isApproved
    ) : void {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $status  = $isApproved ? 'Y' : 'N';

        $dxToUpdate = $DB->pselect(
            "SELECT cde.CandID, cde.DxEvolutionID
            FROM candidate_diagnosis_evolution_rel cde 
            JOIN diagnosis_evolution de USING (DxEvolutionID)
            JOIN session s ON (cde.CandID=s.CandID AND s.Visit_label=de.visitLabel)
            WHERE s.ID=:sid",
            ['sid' => $sessionID]
        );

        foreach ($dxToUpdate as $row) {
            $DB->update(
                'candidate_diagnosis_evolution_rel',
                ['Confirmed' => $status],
                [
                    'CandID'        => $row['CandID'],
                    'DxEvolutionID' => $row['DxEvolutionID']
                ]
            );
        }
    }
}
