<?php declare(strict_types=1);
/**
 * This file contains a class which is a wrapper around the concept
 * of a candidate in Loris.
 *
 * PHP Version 7
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
    static public function &singleton(int $candID)
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
     * @return void As a side-effect loads candidate into current
     *              object
     * @throws DatabaseException | LorisException
     */
    public function select(int $candID): void
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $CandArray = array('Candidate' => $candID);

        // make a local reference to the Database object
        $db = $factory->database();

        // get candidate data from database
        $query = "SELECT c.RegistrationCenterID, c.CandID, c.PSCID, c.DoB, 
            c.EDC, c.Sex, c.Entity_type,
            p.Name AS PSC, c.Ethnicity,
            c.Active, u1.Real_name as RegisteredBy, c.UserID, c.ProjectID
            FROM candidate as c
            LEFT JOIN psc as p ON (p.CenterID=c.RegistrationCenterID)
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
            $this->listOfTimePoints[] = intval($value["ID"]);
        }

    }

    /**
     * Creates a new candidate, assigning CandID and PSCID.
     *
     * FIXME Ideally the signature of this function should be changed so that
     * $useEDC is the second-to-last parameter. This would add some clarity as
     * both it and $useProjects are optional parameters based on configuration
     * settings. However, this will not be backward compatiable.
     *
     * @param int         $centerID    centerID of the site to which the
     *                                  candidate will belong
     * @param string      $dateOfBirth date of birth written as YYYY-MM-DD
     * @param string|null $edc         estimated date of confinement written as
     *                                      YYYY-MM-DD. Value should be null
     *                                      unless the useEDC setting is
     *                                      configured to be true.
     * @param string      $sex         sex, either 'Male' or 'Female'
     * @param string|null $PSCID       PSCID specified by the user, if available
     * @param int|null    $projectID   The project ID, if available
     *
     * @return int   $candID      candidate id of the new candidate
     * @throws Exception
     * @static
     */
    static public function createNew(
        int $centerID,
        string $dateOfBirth,
        ?string $edc,
        string $sex,
        ?string $PSCID = null,
        ?int $projectID = null
    ): int {
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
                     'CandID'               => $candID,
                     'RegistrationCenterID' => $centerID,
                     'PSCID'                => $PSCID,
                     'DoB'                  => $dateOfBirth,
                     'EDC'                  => $edc,
                     'Sex'                  => $sex,
                     'ProjectID'            => $projectID,
                     'Date_active'          => date('Y-m-d'),
                     'Date_registered'      => date('Y-m-d'),
                     'Entity_type'          => 'Human',
                     'RegisteredBy'         => $user->getUsername(),
                     'UserID'               => $user->getUsername(),
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
    static function candidateExists(int $candID, string $PSCID): bool
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
     * @return array|null Non-associative array of SessionIDs 1st Time Point
     *               indexed to 0
     */
    function getListOfTimePoints(): ?array
    {
        return $this->listOfTimePoints;
    }

    /**
     * Returns the sessionID for this Candidate's nth visit
     *
     * @param integer $visitNo The visit number for which you
     *                         want the SessionID
     *
     * @return int|null SessionID of candidate's nth visit, NULL if none found
     */
    function getSessionID(int $visitNo): ?int
    {
        if (isset($this->listOfTimePoints[$visitNo-1]) ) {
            return intval($this->listOfTimePoints[$visitNo-1]);
        }

        return null;
    }

    /**
     * Return a piece of data about this candidate
     *
     * @param string|null $var The type of data about the Candidate
     *                    to be returned
     *
     * @return mixed The info requested
     */
    public function getData(?string $var = null)
    {
        if (is_null($var)) {
            return $this->candidateInfo;
        } else {
            return $this->candidateInfo[$var] ?? null;
        }
    }

    /**
     * Sets some data about the candidate and saves it into the
     * database.
     *
     * @param array $newData Key-value pair(s) of the field(s) to change and the
     *                              new value(s).
     *
     * @return bool
     *
     * @throws DatabaseException
     * @throws LorisException
     */
    public function setData(array $newData): bool
    {
        /* $newData should be in the form: array($key => $value). Count should
         * equal 1 if this is the case.
         */
        if (empty($newData)) {
            throw new LorisException(
                'Candidate::setData() cannot be called with an empty array!'
            );
            return false;
        }
        $this->candidateInfo = array_merge($this->candidateInfo, $newData);

        \NDB_Factory::singleton()->database()->update(
            'candidate',
            $newData,
            array(
             'CandID' => $this->getData('CandID'),
            )
        );
        return true;
    }


    /**
     * Returns the ProjectID for the current candidate
     *
     * @return integer CandID of candidate
     */
    function getProjectID(): int
    {
        return intval($this->candidateInfo["ProjectID"]);
    }

    /**
     * Returns the name of the candidate's project from the
     * config file
     *
     * @return string Project name
     */
    function getProjectTitle(): string
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
    function getPSCID(): string
    {
        return $this->candidateInfo["PSCID"];
    }

    /**
     * Returns the site of this candidate
     *
     * @return string Site name of this candidate's site
     */
    function getCandidateSite(): string
    {
        return $this->candidateInfo["PSC"];
    }


    /**
     * Returns the ID of this candidate's site
     *
     * @return integer The numeric ID of the candidate's site
     */
    function getCenterID(): int
    {
        return $this->candidateInfo["RegistrationCenterID"];
    }

    /**
     * Returns the date of birth of this candidate
     *
     * @return string|null The DoB in YYYY-MM-DD format
     */
    function getCandidateDoB(): ?string
    {
        return $this->candidateInfo["DoB"];
    }

    /**
     * Returns the expect date of confinement (due date)
     * of this candidate.
     *
     * @return string|null The DoB in YYYY-MM-DD format
     */
    function getCandidateEDC(): ?string
    {
        return $this->candidateInfo["EDC"];
    }

    /**
     * Return the candidate's sex
     *
     * @return string Male|Female String describing the sex
     */
    function getCandidateSex(): string
    {
        return $this->candidateInfo["Sex"];
    }

    /**
     * Return the candidate's ethnicity
     *
     * @return     string The ethnicity of candidate
     * @deprecated
     */
    function getCandidateEthnicity(): string
    {
        return $this->candidateInfo["Ethnicity"];
    }

    /**
     * Return whether the candidate is active
     *
     * @return string Y|N|null Active flag for this candidate
     */
    function isActive(): string
    {
        return $this->candidateInfo["Active"];
    }

    /**
     * Return the user that registered (created) this candidate
     *
     * @return string UserID of user who created this candidate.
     */
    function registeredBy(): string
    {
        return $this->candidateInfo["RegisteredBy"];
    }

    /**
     * Return the user who last changed this candidate
     *
     * @return string UserID of user who last changed this candidate
     */
    function lastRecordChangeBy(): string
    {
        return $this->candidateInfo["UserID"];
    }

    /**
     * Returns the list of visit labels w/ corresponding SessionID as key
     *
     * @return array Associative array in the format SessionID=>Visit_label
     * @throws DatabaseException
     */
    public function getListOfVisitLabels(): array
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
    function getNextVisitNo(): int
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
    public function getValidSubprojects(): array
    {
        $subprojList = array();

        $projID  = $this->getProjectID();
        $query   = "SELECT SubprojectID from project_rel where ProjectID = :prj";
        $params  = array('prj' => $projID);
        $subproj = \NDB_Factory::singleton()
            ->database()
            ->pselect($query, $params);

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
    public function getFirstVisit(): string
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $candID = $this->getCandID();
        $query  = "SELECT Visit_label FROM session 
          LEFT JOIN candidate USING (CandID)
          WHERE CandID = :cid AND VisitNo = 1
          AND Entity_type <> 'Scanner'";
        $where  = array('cid' => $candID);
        $result = $db->pselectOne($query, $where);
        return $result ?? '';
    }

    /**
     * Returns list of consents and their respective statuses for this candidate
     *
     * @return array List of consents and their associated values for this candidate
     *               The keys of the arrays are the IDs of the consents
     */
    public function getConsents(): array
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
    static function _generateCandID(): int
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
    static function _generatePSCID(string $prefix): string
    {
        $alphabet = \Candidate::_getPSCIDSetting('alphabet');
        $length = \Candidate::_getPSCIDSetting('length');
        $generation = \Candidate::_getPSCIDSetting('generation');

        // Get all existing PSCIDs for this Site.
        $existingPSCIDs = \Candidate::_getPSCIDsHavingPrefix($prefix);
        print_r($existingPSCIDs);
        // Generate new IDs until we find one that's unused.
        while (true) {
            $id = ($generation == 'sequential') ?
                Candidate::_generateNewSequentialID($prefix):
                Candidate::_generateNewRandomID($alphabet, $length);

            // If this ID is not being used, return the new ID.
            if (
                !in_array(
                    $id, 
                    $existingPSCIDs,
                    true
                )
            ) {
                return $prefix . $id;
            }
        }

    }

    static function _getPSCIDsHavingPrefix(string $prefix): array {
        $result = \Database::singleton()->pselectCol(
            "SELECT PSCID from candidate WHERE PSCID LIKE '$prefix%'",
            array()
        );
        // Filter off Site prefix so that we just get the IDs.
        $PSCIDs = array();
        foreach($result as $id) {
            $PSCIDs[] = substr($id, strlen($prefix));
        }
        return $PSCIDs;
    }

    /**
     * Generates a new ExternalID in the format defined by the config file.
     * This is based on _generatePSCID.
     *
     * @return string Anonymized ExternalID for distributing data
     */
    static function _generateExternalID(): string
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
     * Queries the database for all PSCIDs with a given Site prefix and 
     * generates the next ID in the sequence. Works for numeric, alphabetical,
     * and alphanumeric IDs.
     *
     * @param string $prefix The Site prefix used for querying.
     *
     * @return string The next ID in sequence.
     */
    static function _generateNewSequentialID(
        string $prefix
    ): string {
        $max = max(\Candidate::_getPSCIDsHavingPrefix($prefix));
        $max++;
        return $max;
    }

    static function _generateNewRandomID(
        string $type,
        int $length
    ): string {
        $alphabet = array();
        switch($type) {
        case 'alpha':
            $alphabet = range('a', 'z');
            break;
        case 'alphanumeric':
            $alphabet = array_merge(range(0, 9), range('a', 'z'));
            break;
        case 'numeric':
            $alphabet = range(0, 9);
            break;
        }
        $id = '';
        while (strlen($id) < $length) {
            $id .= $alphabet[random_int(0, count($alphabet) - 1)];
        }
        return $id;
    }

    /**
     * Validate's that a PSCID matches the format defined by project
     * config
     *
     * @param string      $PSCID      The PSCID to validate
     * @param string|null $siteAbbrev (optional) The site of the candidate
     *                           being validated to check against appropriate
     *                           parts of PSCID definition
     *
     * @return boolean True if PSCID is valid, false otherwise
     */
    static public function validatePSCID(
        string $PSCID,
        ?string $siteAbbrev = null
    ): bool {

        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $PSCIDSettings = $config->getSetting('PSCID');
        $regex         = Utility::structureToPCRE(
            $PSCIDSettings['structure'],
            $siteAbbrev
        );
        //preg_match returns 1 on success.
        return preg_match($regex, $PSCID) === 1;
    }

    /**
     * Helper function used for extracting the values from the config
     * settings relating to the PSCID structure.
     *
     * @return string[]|int
     */
    static function _getPSCIDSetting(
        string $setting
    ) {
        if ($setting == 'generation') {
            return \NDB_Factory::singleton()
                ->config()
                ->getSetting('PSCID')['generation'];
        }

        // Values other than 'generation' are found within 'seq' elements.
        $idStructure = \NDB_Factory::singleton()
            ->config()
            ->getSetting('PSCID')['structure']['seq'];

        if (!$idStructure[0]) {
            // There's only one seq tag so the param format
            // needs to be fixed
            $temp        = array();
            $temp[]      = $idStructure;
            $idStructure = $temp;
        }

        /* Iterate over each 'seq' value and extract minimum length or length
         * if their values are set. Return a length of 1 by default.
         */
        if ($setting == 'length') {
            foreach ($idStructure as $seq) {
                $length = $seq['@']['minLength'] ?? $seq['@']['length'];
                if (isset($length)) {
                    return $length;
                }
            }
            return 1;
        }
        /* Iterate over each 'seq' value and extract the 'type' value. This is
         * needed to figure out which alphabet a PSCID will use.
         */
        if ($setting == 'alphabet') {
            $seqTypes = array();
            foreach ($idStructure as $seq) {
                if (isset($seq['@']['type'])) {
                    $seqTypes[] = $seq['@']['type'];
                }
            }
            // Remove seq values that do not correspond to PSCID alphabets.
            $alphabet = array_filter($seqTypes, function ($type) {
                return in_array(
                    $type,
                    array('numeric', 'alphanumeric', 'alpha'),
                    true
                );
            });
            if (count($alphabet) > 1) {
                throw new \ConfigurationException(
                    'Too many values specified for PSCID seq types'
                );
            }
            // The only element should correspond to the PSCID alphabet.
            return array_pop($alphabet);
        }
    }

    /**
     * Gets the participant_status options from participant_status_options table
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    static function getParticipantStatusOptions(): array
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
    static function getParticipantStatusSubOptions(int $parentID): array
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

