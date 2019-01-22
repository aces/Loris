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

define('CANDIDATE_MIN_CANDID', 100000);
define('CANDIDATE_MAX_CANDID', 999999);
define('CANDID_LENGTH', 6);
define('PSCID_LENGTH', 3);

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

        $site = \Site::singleton($centerID);

        $user = \User::singleton($_SESSION['State']->getUsername());

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
            $PSCID = Candidate::_generatePSCID(
                \Candidate::_getIDSetting('PSCID', 'prefix')
                ?? $site->getSiteAlias()
            );
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
        $existingIDs = \Candidate::_getExistingIDs('CandID');
        /* Generate new random values for a CandID until we find one that's
         * unused.
         */
        do {
            $id = random_int(CANDIDATE_MIN_CANDID, CANDIDATE_MAX_CANDID);
        } while (in_array($id, $existingIDs, true));
        return $id;
    }

    /**
    * Generates a new PSCID in the format defined by the config file.
    *
    * @param string $prefix The prefix to use for the PSCID
    *
    * @return string Project candidate id in format defined by config.xml
    */
    static function _generatePSCID(string $prefix): string
    {
        return \Candidate::_generateID('PSCID', $prefix);

    }

    /**
     * Generates a new ExternalID in the format defined by the config file.
     *
     * @return string De-identified ExternalID used for data sharing.
     */
    static function _generateExternalID(): string
    {
        return \Candidate::_generateID(
            'ExternalID',
            \Candidate::_getIDSetting(
                'ExternalID',
                'prefix'
            )
        );
    }


    /**
     * Generate a new ID based on configuration settings for PSCID or
     * ExternalID.
     *
     * @param string $kind   One of 'PSCID or 'ExternalID'
     * @param string $prefix The prefix to an ID. Usually a Site abbreviation
     * such as MON for Montreal but can be a static value.
     *
     * @return string A new ID with prefix $prefix.
     */
    static function _generateID(string $kind, string $prefix = '')
    {
        // Validation
        if (!in_array($kind, array('PSCID', 'ExternalID', 'CandID'), true)) {
            throw new LorisException(
                'Invalid value passed for parameter "kind". Must be one of: ' .
                '"PSCID", "ExternalID".'
            );
        }
        // Query database for existing IDs to prevent duplicates.
        $existingIDs = \Candidate::_getExistingIDs($kind, $prefix);

        /* Read config settings from project/config.xml to retrieve the
         * alphabet, length, and generation method (sequential or random) used
         * to create new IDs.
         */
        $alphabet   = \Candidate::_getIDSetting($kind, 'alphabet');
        $length     = \Candidate::_getIDSetting($kind, 'length')
            ?? PSCID_LENGTH;
        $generation = \Candidate::_getIDSetting($kind, 'generation');

        // Initialize minimum and maximum allowed values for IDs. Set the values
        // to the lowest/highest character in $alphabet repeated $length times
        // if the min or max is not configured in project/config.xml.
        $min = \Candidate::_getIDSetting($kind, 'min') ??
            str_repeat(strval($alphabet[0]), $length);
        $max = \Candidate::_getIDSetting($kind, 'max') ??
            str_repeat(strval($alphabet[count($alphabet) - 1]), $length);

        // Check that the number of existing IDs does not exceed the range of
        // possible values (given by the size of the alphabet to the power of
        // number of characters in the ID).
        if (count($existingIDs) >= (count($alphabet) ** $length)) {
            throw new \LorisException(
                'Cannot create new identifier because all valid identifiers ' .
                'are in use!'
            );
        }

        switch ($generation) {
        case 'sequential':
            /* If there are no existing IDs, create a new string
             * with the first character of the alphabet repeated $length
             * times.
             */
            if (count($existingIDs) < 1) {
                $id = $min;
            } else {
                $id = \Candidate::_nextValueInSequence(
                    $existingIDs,
                    $alphabet,
                    $length,
                    $min,
                    $max
                );
            }
            break;
        case 'random':
            $id = \Candidate::_generateNewRandomID($alphabet, $length);
            // If the random ID is already in use, increment it until we find
            // an unused value.
            if (in_array(
                str_pad(
                    $id,
                    $length,
                    strval($alphabet[0]),
                    STR_PAD_LEFT
                ),
                $existingIDs,
                true
            )
            ) {
                $id = \Candidate::_nextValueInSequence(
                    $existingIDs,
                    $alphabet,
                    $length,
                    $min,
                    $max,
                    $id
                );
            }
            break;
        }

        return $prefix . str_pad(
            $id,
            $length,
            strval($alphabet[0]),
            STR_PAD_LEFT
        );
    }

    /**
     * Queries the database for PSCIDs starting with a prefix. This is used to
     * get all existing IDs for a given site. The prefix will be stripped from
     * the IDs as the calling code will be interested in and aware of the Site
     * corresponding to the prefix. Returning the bare IDs allows for easier
     * processing.
     *
     * @param string $kind   One of 'CandID', 'PSCID', or 'ExternalID'.
     * @param string $prefix A site abbreviation, e.g. MON for Montreal.
     *
     * @return string[] The PSCIDs retrieved from the database with the prefix
     *                      stripped. E.g. MON1234 becomes 1234.
     */
    static function _getExistingIDs(string $kind, string $prefix = ''): array
    {
        // CandIDs have no prefix so the result of the query can be returned
        // immediately.
        if ($kind === 'CandID') {
            return \Database::singleton()->pselectCol(
                'SELECT CandID from candidate',
                array()
            );
        }

        // Must be present to prevent SQLi possibility.
        if ($kind !== 'PSCID' && $kind !== 'ExternalID') {
            throw new LorisException(
                'Argument for "kind" variable must be either "PSCID", ' .
                '"ExternalID", or "CandID"'
            );
        }
        $result = \Database::singleton()->pselectCol(
            // $kind and $prefix are not user-controllable.
            "SELECT substring($kind, LENGTH('$prefix') +1) 
            from candidate 
            WHERE $kind LIKE '$prefix%'",
            array()
        );

        return $result;
    }

    /**
     * Given a list of IDs, generates the next ID in the sequence by
     * incrementing the maximum value. Works for alphabetical and numeric IDs.
     *
     * @param array   $existingIDs An array of existing IDs.
     * @param array   $alphabet    The character set for IDs. Used for padding.
     * @param int     $length      The number of characters in the ID.
     * @param string  $min         The minimum allowed value.
     * @param string  $max         The maximum allowed value.
     * @param ?string $id          An optional starting point in the sequence
     *                              from which to increment. The default
     *                              behaviour is to increment the highest value
     *                              in $existingIDs.
     *
     * @return string The next ID in sequence and in bounds.
     */
    static function _nextValueInSequence(
        array $existingIDs,
        array $alphabet,
        int $length,
        string $min,
        string $max,
        ?string $id = null
    ): string {
        if (count($existingIDs) < 1) {
            throw new \LorisException(
                'Cannot generate new sequential ID because the sequence ' .
                'provided is empty.'
            );
        }
        $newID = $id ?? max($existingIDs);
        // Increment newID until we find an unused value within the boundaries
        // of $min and $max.
        do {
            // Make sure $newID is greater than or equal to minimum and less
            // than or equal to maximum.
            if (strcmp(strval(++$newID), $min) < 0) {
                // If newID is less than the minimum, increment again.
                continue;
            }
            if (strcmp(strval($newID), $max) > 0) {
                // If newID has exceeded the maximum, wrap back around to the
                // minimum possible value. We know that there is a free ID
                // available somewhere in the range of possible IDs or else
                // _generateID above will have thrown an exception. This allows
                // us to increment $newID until we find a free space.
                $newID = $min;
            }
        } while (
            in_array(
                str_pad(
                    strval($newID),
                    $length,
                    strval($alphabet[0]),
                    STR_PAD_LEFT
                ),
                $existingIDs,
                true
            )
        );

        return strval($newID);
    }

    /**
     * Generates a new random string using a given alphabet and with a given
     * length.
     *
     * @param array $alphabet A series of valid characters to be used in the ID.
     * @param int   $length   The length of ID to generate.
     *
     * @return string The new ID.
     */
    static function _generateNewRandomID(
        array $alphabet,
        int $length
    ): string {
        $id = '';
        while (strlen($id) < $length) {
            $id .= $alphabet[random_int(0, count($alphabet) - 1)];
        }
        return strval($id);
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
     * @param string $kind    One of 'CandID' or 'ExternalID'
     * @param string $setting One of 'generation', 'minLength', 'alphabet',
     *
     * @return array|int|string|null
     */
    static function _getIDSetting(
        string $kind,
        string $setting
    ) {
        if ($kind !== 'PSCID' && $kind !== 'ExternalID') {
            throw new LorisException(
                'Argument for "kind" variable must be either "PSCID" or ' .
                '"ExternalID".'
            );
        }
        // The generation setting can be easily extracted and returned.
        if ($setting == 'generation') {
            return \NDB_Factory::singleton()
                ->config()
                ->getSetting($kind)['generation'];
        }

        // Values other than 'generation' are found within 'seq' elements and
        // require more complex processing.
        $idStructure = \NDB_Factory::singleton()
            ->config()
            ->getSetting($kind)['structure']['seq'];

        if (!$idStructure[0]) {
            // There's only one seq tag so the param format
            // needs to be fixed
            $temp        = array();
            $temp[]      = $idStructure;
            $idStructure = $temp;
        }

        try {
            $seqValue = \Candidate::_getSeqAttribute($idStructure, $setting);
        } catch (\ConfigurationException $e) {
            /* Throw a new exception so that we can inform developers whether
             * the ConfigurationException arose due to ExternalID or PSCID
             * settings.
             */
            throw new LorisException(
                "Cannot create new candidate because of a configuration " .
                "error in settings for $kind structure. Details: "
                . $e->getMessage()
            );
        }
        if ($setting === 'alphabet') {
            switch ($seqValue) {
            case 'alpha':
                return range('A', 'Z');
            case 'numeric':
                return range(0, 9);
            case 'alphanumeric':
                return array_merge(range(0, 9), range('A', 'Z'));
            }
        }

        if ($setting === 'prefix') {
            if ($seqValue === 'static') {
                // The 'static' seq attribute must also include a value which
                // will be a fixed string prefix to be prepended to IDs in
                // LORIS. This must be extracted manually.
                foreach ($idStructure as $seq) {
                    if ($seq['@']['type'] === 'static') {
                        // This index stores the prefix.
                        return $seq['#'];
                    }
                }
            } else {
                // The other option, 'siteAbbrev', indicates that the calling
                // code should prepend a Site Alias to the ID. Since the config
                // file does not know what this will be, return null.
                return null;
            }
        }
        // Min, max, and length values should be returned as integers or as
        // null if they are not set.
        return is_null($seqValue) ? $seqValue: intval($seqValue);
    }

    /**
     * Iterate over each 'seq' value and return its setting if its value is
     * configured. Do error handling to make sure that there is exactly one
     * value corresponding to the requested setting.
     *
     * @param array  $idStructure Settings concerning ID structure extracted
     *                  from project/config.sml
     * @param string $setting     The name of the variable for which we want the
     *                  value.
     *
     * @throws ConfigurationException
     *
     * @return ?string
     */
    static function _getSeqAttribute(
        array $idStructure,
        string $setting
    ): ?string {
        /* Do validation on 'prefix' and 'alphabet' since they both are found in
         * 'type' attributes within 'seq' elements. See project/config.xml for
         * examples.
         */
        switch($setting) {
        case 'alphabet':
            $seqAttributes = array_filter(
                \Candidate::_extractSeqAttribute($idStructure, 'type'),
                function ($x) {
                    return $x === 'alpha'
                        || $x === 'alphanumeric'
                        || $x === 'numeric';
                }
            );
            break;
        case 'prefix':
            $seqAttributes = array_filter(
                \Candidate::_extractSeqAttribute($idStructure, 'type'),
                function ($x) {
                    return $x === 'static' || $x === 'siteAbbrev';
                }
            );
            break;
        default:
            /* Other settings (i.e. 'length', 'min', 'max') can be extracted
             * directly as they are stored within distinct attributes.
             */
            $seqAttributes = \Candidate::_extractSeqAttribute(
                $idStructure,
                $setting
            );
            break;
        }

        // Validation
        if (count($seqAttributes) > 1) {
            throw new \ConfigurationException(
                'Too many values found for config setting: ' . $setting
            );
        }
        return array_pop($seqAttributes);
    }

    /**
     * Traverse the $idStructure array and collect all values that exist
     * for $setting.
     *
     * @param array  $idStructure Settings concerning ID structure extracted
     *                  from project/config.sml
     * @param string $setting     The name of the variable for which we want the
     *                  value.
     *
     * @return array The value(s) corresponding to $setting.
     */
    static function _extractSeqAttribute(
        array $idStructure,
        string $setting
    ): array {
        $seqAttributes = array();
        foreach ($idStructure as $seq) {
            if (isset($seq['@'][$setting])) {
                $seqAttributes[] = $seq['@'][$setting];
            }
        }
        return $seqAttributes;
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

