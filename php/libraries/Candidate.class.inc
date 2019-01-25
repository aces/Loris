<?php
/**
 * This file contains a class which is a wrapper around the concept
 * of a candidate in Loris.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/* Define constants used by the file */
// error codes
define('CANDIDATE_INVALID', 1);
define('PSCID_NOT_SPECIFIED', 2);
define('PSCID_NOT_UNIQUE', 3);
define('PSCID_INVALID_STRUCTURE', 4);
define('EDC_NOT_SPECIFIED', 5);

// id ranges...
define('CANDIDATE_MIN_CANDID', 100000);
define('CANDIDATE_MAX_CANDID', 999999);
define('CANDIDATE_MIN_PSCID', 1000);
define('CANDIDATE_MAX_PSCID', 9999);

/**
 * Wrapper around a candidate in Loris. Mostly, it gets information
 * from the candidate table, but this class is abstract enough that
 * it could get information from other places too such as parameter_candidate
 * if relevant.
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Candidate
{
    var $candidateInfo;
    var $listOfTimePoints;

    /**
     * This returns a single Candidate object for the given
     * candID, and will only ever instantiate one object in
     * the event that it's called multiple times.
     *
     * @param integer $candID A 6 digit Loris CandID that matches
     *                        a candidate in the candidate table
     *
     * @return Candidate the Candidate object
     * @static
     */
    static public function &singleton($candID)
    {
        $candidateList =& $GLOBALS['__candidateObjects'];
        if (!isset($candidateList[$candID])) {
            $candidateList[$candID] = new Candidate();
            $candidateList[$candID]->select($candID);
        }

        return $candidateList[$candID];
    }

    /**
     * This does the work of selecting the candidate and related
     * information from the database and populating it into the
     * Candidate object. Used by singleton method.
     *
     * @param integer $candID The 6 digit Loris CandID
     *
     * @return null As a side-effect loads candidate into current
     *              object
     * @throws DatabaseException | LorisException
     */
    public function select($candID)
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $candID    = trim($candID);
        $CandArray = array('Candidate' => $candID);

        // make a local reference to the Database object
        $db = $factory->database();

        // get candidate data from database
        $query = "SELECT c.CenterID, c.CandID, c.PSCID, c.DoB, 
            c.EDC, c.Gender, c.Entity_type,
            p.Name AS PSC, c.Ethnicity,
            c.Active, u1.Real_name as RegisteredBy, c.UserID, c.ProjectID
            FROM candidate as c
            LEFT JOIN psc as p USING (CenterID)
            LEFT JOIN users as u1 ON (u1.UserID = c.RegisteredBy)
            WHERE c.CandID=:Candidate AND c.Active = 'Y'";

        $row = $db->pselectRow($query, $CandArray);

        if (!is_array($row) || sizeof($row) == 0) {
            throw new LorisException(
                "Could not select Candidate data from the database (DCCID: $candID)",
                CANDIDATE_INVALID
            );
        }

        // store user data in object property
        foreach ($row AS $key=>$value) {
            $this->candidateInfo[$key] = $value;
        }

        if ($config->getSetting('useProjects') === 'true') {
            $this->candidateInfo['ProjectTitle'] = $this->getProjectTitle();
        }

        $headerSetting = $config->getSetting('HeaderTable');
        if (!empty($headerSetting)) {
            $params = array();
            $parameterCandSettings = $headerSetting['parameter_candidate'];
            if (!is_array($parameterCandSettings)) {
                $parameterCandSettings = array($parameterCandSettings);
            }
            foreach ($parameterCandSettings as $parameter_type) {
                $row = $db->pselectRow(
                    "SELECT Value, pt.Description
                    FROM candidate c
                    JOIN parameter_candidate pc ON (pc.CandID=c.CandID)
                    LEFT JOIN parameter_type pt ON
                    (pc.ParameterTypeID=pt.ParameterTypeID)
                    WHERE c.CandID=:Candidate AND pt.Name=:PTName",
                    array(
                     'Candidate' => $candID,
                     'PTName'    => $parameter_type,
                    )
                );
                // Sanitize values coming from the parameter_candidate table
                // before injecting them into the HTML table.
                if (!empty($row['Value'])) {
                    $params[$row['Description']] = htmlentities(
                        $row['Value'],
                        ENT_QUOTES,
                        'UTF-8'
                    );
                }
            }

            $this->candidateInfo['DisplayParameters'] = $params;
        }

        // check that PSCID matches CandID when entered into the boxes
        // on the candidate_list form (and is therefore trying to open
        // the timepoint_list page, which is why the if statement checks
        // for timepoint_list instead of candidate_list)
        //
        // Since other pages (ie. the filter in the conflicts_resolve page)
        // might include an element named PSCID, we also need to check that
        // the test_name matches before throwing the error.
        if (isset($_REQUEST['PSCID'])
            && (isset($_REQUEST['test_name'])
            && $_REQUEST['test_name']=='timepoint_list')
        ) {
            if (strtolower(
                trim($_REQUEST['PSCID'])
            ) != strtolower($this->getPSCID())
            ) {
                throw new LorisException("IDs do not match");
            }
        }

        // get Time Point SessionIDs for the $candID
        // select ALL of them - later you can filter out cancelled and inactive ones
        $query = "SELECT s.ID FROM session as s
            WHERE s.CandID=:Candidate AND s.Active='Y'
            ORDER BY ID";
        $row   = $db->pselect($query, $CandArray);

        // store user data in object property
        foreach ($row AS $value) {
            $this->listOfTimePoints[] = $value["ID"];
        }

    }

    /**
     * Creates a new candidate, assigning CandID and PSCID
     *
     * @param int    $centerID    centerID of the site to which the candidate will
     *                            belong
     * @param string $dateOfBirth date of birth written as YYYY-MM-DD
     * @param string $edc         estimated date of confinement written as YYYY-MM-DD
     * @param string $gender      gender, either 'Male' or 'Female'
     * @param string $PSCID       PSCID specified by the user, if available
     *
     * @return int   $candID      candidate id of the new candidate
     * @throws Exception
     * @static
     */
    static public function createNew(
        $centerID, $dateOfBirth, $edc, $gender, $PSCID = null
    ) {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $site =& Site::singleton($centerID);

        $user =& User::singleton($_SESSION['State']->getUsername());

        // generate candid
        $candID = Candidate::_generateCandID();

        // figure out how to generate PSCID
        $config        = $factory->config();
        $PSCIDSettings = $config->getSetting('PSCID');
        $useEDC        = $config->getSetting('useEDC');

        if (($useEDC === '1' || $useEDC === 'true') && empty($edc)) {
            throw new \LorisException(
                "EDC must be specified",
                EDC_NOT_SPECIFIED
            );
        }

        if ($PSCIDSettings['generation'] == 'user') {
            // check pscid is specified
            if (empty($PSCID)) {
                throw new Exception(
                    "PSCID must be specified",
                    PSCID_NOT_SPECIFIED
                );
            }

            // check pscid structure
            if (!Candidate::validatePSCID($PSCID, $site->getSiteAlias())) {
                throw new LorisException(
                    "PSCID has an invalid structure",
                    PSCID_INVALID_STRUCTURE
                );
            }

            // check pscid uniqueness
            if ($db->pselectOne(
                "SELECT count(PSCID) FROM candidate WHERE PSCID=:PID",
                array('PID' => $PSCID)
            ) > 0
            ) {
                throw new Exception("PSCID not unique", PSCID_NOT_UNIQUE);
            }
        } else {
            $PSCID = Candidate::_generatePSCID($site->getSiteAlias());
        }

        // insert the new candidate into the database
        $setArray = array(
                     'CandID'          => $candID,
                     'CenterID'        => $centerID,
                     'PSCID'           => $PSCID,
                     'DoB'             => $dateOfBirth,
                     'EDC'             => $edc,
                     'Gender'          => $gender,
                     'Date_active'     => date('Y-m-d'),
                     'Date_registered' => date('Y-m-d'),
                     'Entity_type'     => 'Human',
                     'RegisteredBy'    => $user->getUsername(),
                     'UserID'          => $user->getUsername(),
                    );

        if ($config->getSetting('useExternalID') === 'true') {
            $externalID = Candidate::_generateExternalID();
            $setArray['ExternalID'] = $externalID;
        }

        $db->insert('candidate', $setArray);

        // return the new candid
        return $candID;
    }

    /**
     * Checks if candidate exist given a candidate ID and PSCID
     * Used to check that PSCID matches CandID when entered into the boxes
     * on the candidate_list form
     *
     * @param int    $candID 6 digit Loris CandID
     * @param string $PSCID  project study center ID
     *
     * @return bool TRUE if candidate is found (in candidate table), FALSE otherwise
     * @throws DatabaseException
     */
    static function candidateExists($candID, $PSCID)
    {
        // make a local reference to the Database object
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $candidateIDs = array(
                         ':candidate_id' => $candID,
                         ':pscid'        => $PSCID,
                        );

        // get candidate data from database
        $query = "SELECT CandID
            FROM candidate
            WHERE CandID = :candidate_id AND PSCID = :pscid
            AND Active = 'Y'";

        $row = $db->pselectRow($query, $candidateIDs);

        return $row !== null;
    }

    /**
     * Get a list of timepoints that this Candidate has registered
     *
     * @return array Non-associative array of SessionIDs 1st Time Point
     *               indexed to 0
     */
    function getListOfTimePoints()
    {
        return $this->listOfTimePoints;
    }

    /**
     * Returns the sessionID for this Candidate's nth visit
     *
     * @param integer $visitNo The visit number for which you
     *                         want the SessionID
     *
     * @return int SessionID of candidate's nth visit, NULL if none found
     */
    function getSessionID($visitNo)
    {
        if (isset($this->listOfTimePoints[$visitNo-1]) ) {
            return $this->listOfTimePoints[$visitNo-1];
        }

        return null;
    }

    /**
     * Return a piece of data about this candidate
     *
     * @param string $var The type of data about the Candidate
     *                    to be returned
     *
     * @return mixed The info requested
     */
    public function getData($var = null)
    {
        if (is_null($var)) {
            return $this->candidateInfo;
        } else {
            if (isset($this->candidateInfo[$var])) {
                return $this->candidateInfo[$var];
            }
            return null;
        }
    }

    /**
     * Sets some data about the candidate and saves it into the
     * database
     *
     * @param string $var   The variable to be set
     * @param mixed  $value The value to be set to
     *
     * @return true on success
     * @throws DatabaseException
     */
    public function setData($var, $value=null)
    {
        if (!is_array($var)) {
            $setData = array($var => $value);
        } else {
            $setData = $var;
        }

        $this->candidateInfo = array_merge($this->candidateInfo, $setData);

        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $db->update(
            'candidate',
            $setData,
            array('CandID' => $this->getData('CandID'))
        );
        return true;
    }


    /**
     * Returns the ProjectID for the current candidate
     *
     * @return integer CandID of candidate
     */
    function getProjectID()
    {
        return $this->candidateInfo["ProjectID"];
    }

    /**
     * Returns the name of the candidate's project from the
     * config file
     *
     * @return string Project name
     */
    function getProjectTitle()
    {
        $ProjectList = Utility::getProjectList();
        return $ProjectList[$this->getProjectID()] ?? '';
    }

    /**
     * Returns the CandID of this candidate
     *
     * @return integer 6 digit CandID
     */
    function getCandID()
    {
        return $this->candidateInfo["CandID"];
    }


    /**
     * Returns the PSCID of this candidate
     *
     * @return string The PSCID identifier for candidate
     */
    function getPSCID()
    {
        return $this->candidateInfo["PSCID"];
    }

    /**
     * Returns the site of this candidate
     *
     * @return string Site name of this candidate's site
     */
    function getCandidateSite()
    {
        return $this->candidateInfo["PSC"];
    }


    /**
     * Returns the ID of this candidate's site
     *
     * @return integer The numeric ID of the candidate's site
     */
    function getCenterID()
    {
        return $this->candidateInfo["CenterID"];
    }

    /**
     * Returns the date of birth of this candidate
     *
     * @return string The DoB in YYYY-MM-DD format
     */
    function getCandidateDoB()
    {
        return $this->candidateInfo["DoB"];
    }

    /**
     * Returns the expect date of confinement (due date)
     * of this candidate.
     *
     * @return string The DoB in YYYY-MM-DD format
     */
    function getCandidateEDC()
    {
        return $this->candidateInfo["EDC"];
    }

    /**
     * Return the candidate's gender
     *
     * @return string Male|Female String describing the gender
     */
    function getCandidateGender()
    {
        return $this->candidateInfo["Gender"];
    }

    /**
     * Return the candidate's ethnicity
     *
     * @return     string The ethnicity of candidate
     * @deprecated
     */
    function getCandidateEthnicity()
    {
        return $this->candidateInfo["Ethnicity"];
    }

    /**
     * Return whether the candidate is active
     *
     * @return string Y|N|null Active flag for this candidate
     */
    function isActive()
    {
        return $this->candidateInfo["Active"];
    }

    /**
     * Return the user that registered (created) this candidate
     *
     * @return string UserID of user who created this candidate.
     */
    function registeredBy()
    {
        return $this->candidateInfo["RegisteredBy"];
    }

    /**
     * Return the user who last changed this candidate
     *
     * @return string UserID of user who last changed this candidate
     */
    function lastRecordChangeBy()
    {
        return $this->candidateInfo["UserID"];
    }

    /**
     * Returns the list of visit labels w/ corresponding SessionID as key
     *
     * @return array Associative array in the format SessionID=>Visit_label
     * @throws DatabaseException
     */
    public function getListOfVisitLabels()
    {
        $factory = NDB_Factory::singleton();
        //make sure it returns an array
        $visitLabelArray = array();

        $candID = $this->getCandID();

        // make a local reference to the Database object
        //
        $db = $factory->database();

        $query  = "SELECT ID, Visit_label FROM session
            WHERE CandID=:Candidate AND Active='Y' ORDER BY ID";
        $result = $db->pselect($query, array('Candidate' => $candID));

        // map the array [VisitNo]=>Visit_label
        foreach ($result as $row) {
            $visitLabelArray[$row["ID"]] = $row["Visit_label"];
        }
        return $visitLabelArray;
    }

    /**
     * Return the next visit number for the time point you are
     * trying to register
     *
     * @return     integer Next visit number for candidate
     * @deprecated
     */
    function getNextVisitNo()
    {
        $candID = $this->getCandID();

        // make a local reference to the Database object
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $query  = "SELECT IFNULL(max(VisitNo)+1, 1) AS nextVisitNo
            FROM session
            WHERE CandID=:CaID AND (Active='Y' OR Active is null)
            GROUP BY CandID";
        $result = $db->pselectRow($query, array('CaID' => $candID));

        //return the next visit No
        return $result["nextVisitNo"];
    }

    /**
     * Generates list of valid subprojects for a the selected Candidate's
     * project
     *
     * @return array Array of the form SubprojectID => SubprojectID
     *               or NULL if none exist
     * @throws DatabaseException
     */
    public function getValidSubprojects()
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $subprojList = null;

        $projID  = $this->getProjectID();
        $query   = "SELECT SubprojectID from project_rel where ProjectID = :prj";
        $params  = array('prj' => $projID);
        $subproj = $db->pselect($query, $params);

        foreach ($subproj as $row) {
            foreach ($row as $key =>$val) {
                if ($key == 'SubprojectID') {
                    $subprojList[$val] = $val;
                }
            }
        }

        return $subprojList;
    }
    /**
     * Returns first visit for a candidate based on Date_visit
     *
     * @return string The visit label for the candidate's first visit
     */
    public function getFirstVisit()
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $candID = $this->getCandID();
        $query  = "SELECT Visit_label FROM session 
          WHERE CandID = :cid AND Date_visit IS NOT NULL 
          ORDER BY Date_visit, ID ASC LIMIT 1";
        $where  = array('cid' => $candID);
        $result = $db->pselectCol($query, $where);

        return is_array($result) ? array_shift($result) : '';
    }

    /**
     * Returns list of consents and their respective statuses for this candidate
     *
     * @return array List of consents and their associated values for this candidate
     *               The keys of the arrays are the IDs of the consents
     */
    public function getConsents()
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $candID = $this->getCandID();

        $query = "SELECT ConsentID, Name, Status, DateGiven, DateWithdrawn
            FROM candidate_consent_rel cc JOIN consent c USING (ConsentID)
            WHERE CandidateID=:cid";
        $where = array('cid' => $candID);
        $key   = "ConsentID";

        $consentList = $db->pselectWithIndexKey($query, $where, $key);

        return $consentList;
    }

    /**
    * Generates a new random CandID
    *
    * @return integer An unused random 6 digit candidate id
    */
    static function _generateCandID()
    {
        // get a database connection
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        // generate a candidate id
        $candID = random_int(CANDIDATE_MIN_CANDID, CANDIDATE_MAX_CANDID);

        // make sure the cand id is not used
        while ($db->pselectOne(
            "SELECT count(CandID) FROM candidate WHERE CandID=:CaID",
            array('CaID' => $candID)
        ) > 0) {
            // pick a new candidate id
            $candID = random_int(CANDIDATE_MIN_CANDID, CANDIDATE_MAX_CANDID);
        }

        return $candID;
    }

    /**
    * Generates a new PSCID in the format defined by the config file
    *
    * @param string $prefix The prefix to use for the PSCID
    *
    * @return string Project candidate id in format defined by config.xml
    */
    static function _generatePSCID($prefix)
    {
        // get a database connection
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $config = $factory->config();

        $PSCIDSettings = $config->getSetting('PSCID');
        $pscidArrays   = Candidate::generateArrays($PSCIDSettings, $prefix);

        // run one first time, then loop until the pscid is not used
        do {
            // pick a new pscid
            if ($PSCIDSettings['generation'] == 'sequential') {
                if (!empty($pscid)) {
                    $pscid++;
                } else {
                    $pscid = Candidate::generateFirstStringFromArrays($pscidArrays);
                }
            } else {
                $pscid = Candidate::generateRandomStringFromArrays($pscidArrays);
            }

            if ($pscid == '') {
                throw new LorisException(
                    "Well this is embarrassing, our automated PSCID generator "
                    . "is about to enter an infinite loop."
                );
            }

            // check if the pscid is used
        } while (
            $db->pselectOne(
                "SELECT count(PSCID) FROM candidate WHERE PSCID=:PID",
                array('PID' => $pscid)
            ) > 0
        );

        return $pscid;
    }

    /**
     * Generates a new ExternalID in the format defined by the config file.
     * This is based on _generatePSCID.
     *
     * @return string Anonymized ExternalID for distributing data
     */
    static function _generateExternalID()
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $ExternalIDSettings = $config->getSetting('ExternalID');
        $ExternalIDArrays   = Candidate::generateArrays($ExternalIDSettings);

        $db = $factory->database();

        do {
            // generate a new external ID
            if ($ExternalIDSettings['generation'] == 'sequential') {
                if (!empty($externalID)) {
                    $externalID++;
                } else {
                    $externalID = Candidate::generateFirstStringFromArrays(
                        $ExternalIDArrays
                    );
                }
            } else {
                $externalID = Candidate::generateRandomStringFromArrays(
                    $ExternalIDArrays
                );
            }

            // check if the external ID is used
        } while (
            $db->pselectOne(
                "SELECT count(ExternalID) FROM candidate WHERE ExternalID=:EID",
                array('EID' => $externalID)
            )  > 0
        );

        return $externalID;
    }

    /**
     * Validate's that a PSCID matches the format defined by project
     * config
     *
     * @param string $PSCID      The PSCID to validate
     * @param string $siteAbbrev (optional) The site of the candidate
     *                           being validated to check against appropriate
     *                           parts of PSCID definition
     *
     * @return boolean True if PSCID is valid
     */
    static public function validatePSCID($PSCID, $siteAbbrev=null)
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $PSCIDSettings = $config->getSetting('PSCID');
        $regex         = Utility::structureToPCRE(
            $PSCIDSettings['structure'],
            $siteAbbrev
        );
        return preg_match($regex, $PSCID);
    }


    /**
     * Helper function used to generate PSCID. This generates a random
     * number if generation is not "sequential"
     *
     * @param array $arrays Array specifying format of random
     *                      string to be generated
     *
     * @return string A random string matching format from arrays
     */
    static function generateRandomStringFromArrays($arrays)
    {
        $string = "";
        foreach ($arrays AS $array) {
            if (is_array($array)) {
                $string .= $array[array_rand($array)];
            } else {
                $string .= $array;
            }
        }
        return $string;
    }

    /**
     * Helper function used to generate PSCID. Generate the string for the first
     * numeric part of the PSCID if generation type is "sequential" and pads with
     * an appropriate numbers.
     *
     * @param array $arrays An array config file specifying format of number
     *
     * @return string The first string to be used for the PSCID
     */
    static function generateFirstStringFromArrays($arrays)
    {
        $string = "";
        foreach ($arrays AS $array) {
            $string .= array_shift($array);
        }
        return $string;
    }

    /**
     * Helper function used for generating PSCID.
     * This parses the PSCID format in the config file into a format that
     * can be converted into a regex for validation.
     *
     * @param array  $idStructure The structure defined in the config file in the
     *                            array format returned by NDB_Config.
     * @param string $siteAbbrev  The candidate being validate's site abbreviation,
     *                            so that it can be inserted into relevant "site"
     *                            parts of the regex generated.
     *
     * @return array An array of regular expressions defining each section of
     *               the PSCID as defined in config.xml
     */
    static function generateArrays($idStructure, $siteAbbrev=null)
    {
        $idStructure = $idStructure['structure']['seq'];

        if (!$idStructure[0]) {
            // There's only one seq tag so the param format
            // needs to be fixed
            $temp        = array();
            $temp[]      = $idStructure;
            $idStructure = $temp;
        }

        $arrays = array();
        foreach ($idStructure AS $seq) {
            if (isset($seq['@']['length'])) {
                $length = $seq['@']['length'];
            } elseif (isset($seq['@']['minLength'])) {
                $length = $seq['@']['minLength'];
            } else {
                $length = 1;
            }

            for ($i=0; $i<$length; $i++) {
                switch($seq['@']['type']) {
                case 'alpha':
                    $arrays[] = range('a', 'z');
                    break;

                case 'alphanumeric':
                    $arrays[] = array_merge(range(0, 9), range('a', 'z'));
                    break;

                case 'numeric':
                    $arrays[] = range(0, 9);
                    break;

                case 'static':
                    $arrays[] = array($seq['#']);
                    break;

                case 'set':
                    if (strpos($seq['#'], '|') !== false) {
                        $arrays[] = explode('|', $seq['#']);
                    } else {
                        $arrays[] = str_split($seq['#']);
                    }
                    break;

                case 'siteAbbrev':
                    $arrays[] = array($siteAbbrev);
                    break;
                }
            }
        }

        return $arrays;
    }

    /**
     * Gets the participant_status options from participant_status_options table
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    static function getParticipantStatusOptions()
    {
        $DB           =& Database::singleton();
        $options      = $DB->pselect(
            "SELECT ID,Description
            FROM participant_status_options
            WHERE parentID IS NULL",
            array()
        );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

    /**
     * Gets the participant_status options suboptions from participant_status_options
     *
     * @param int $parentID parent ID of the participant status option
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    static function getParticipantStatusSubOptions($parentID)
    {
        $DB           =& Database::singleton();
        $options      = $DB->pselect(
            "SELECT ID,Description 
            FROM participant_status_options 
            WHERE parentID=:pid",
            array('pid' => $parentID)
        );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

}
?>
