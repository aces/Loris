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

use LORIS\StudyEntities\Candidate\CandID;
/* Define constants used by the file */
// error codes
define('CANDIDATE_INVALID', 1);
define('PSCID_NOT_SPECIFIED', 2);
define('PSCID_NOT_UNIQUE', 3);
define('PSCID_INVALID_STRUCTURE', 4);
define('EDC_NOT_SPECIFIED', 5);

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
    /**
     * The ID of the Site where the candidate was registered.
     *
     * @var int
     */
    var $registrationCenterID;
    /**
     * The ID of the Project where the candidate was registered.
     *
     * @var int
     */
    var $registrationProjectID;
    /**
     * The identifer for this Candidate.
     *
     * @var CandID
     */
    var $candID;
    /**
     * The PSCID (user-friendly ID) for this Candidate.
     *
     * @var CandID
     */
    var $pscID;
    /**
     * The date of birth of the candidate.
     *
     * @var string FIXME This should be a DateTime.
     */
    var $dateOfBirth;
    /**
     * The estimated date of confiment for the candidate.
     *
     * @var string FIXME This should be a DateTime.
     */
    var $estimatedDateOfConfinement;
    /**
     * The sex of the candidate. 'Male' or 'Female'.
     *
     * @var string
     */
    var $sex;
    /**
     * The site of the candidate. `Name` from the `psc` table.
     */
    var $site;
    /**
     * Whether a candidate is active in the study. 'Y' or 'N'.
     *
     * @var string FIXME This should be a bool.
     */
    var $isActive;
    /**
     * The user that has last modified candidate information in the database.
     * `UserID` in the `candidate` table.
     *
     * @var string FIXME This should be a User object.
     */
    var $lastModifiedBy;

    /**
     * An array of SessionIDs for which this candidate has TimePoints.
     *
     * @var int[] FIXME This should be an array of SessionID objects.
     */
    var $listOfTimePoints;


    /**
     * This returns a single Candidate object for the given
     * candID, and will only ever instantiate one object in
     * the event that it's called multiple times.
     *
     * @param CandID $candID A 6 digit Loris CandID that matches
     *                        a candidate in the candidate table
     *
     * @return Candidate the Candidate object
     * @static
     */
    static public function &singleton(CandID $candID)
    {
        $candidateList =& $GLOBALS['__candidateObjects'];
        if (!isset($candidateList[strval($candID)])) {
            $candidateList[strval($candID)] = new Candidate();
            $candidateList[strval($candID)]->select($candID);
        }

        return $candidateList[strval($candID)];
    }

    /**
     * This does the work of selecting the candidate and related
     * information from the database and populating it into the
     * Candidate object. Used by singleton method.
     *
     * @param CandID $candID The 6 digit Loris CandID
     *
     * @return void As a side-effect loads candidate into current
     *              object
     * @throws DatabaseException | LorisException
     */
    public function select(CandID $candID): void
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $db = $factory->database();

        // get candidate data from database
        $query = <<<QUERY
SELECT c.CandID as candID, 
c.PSCID as pscID, 
c.DoB as dateOfBirth, 
c.EDC as estimatedDateOfConfinement, 
c.Sex as sex, 
p.Name as site, 
c.Active as isActive, 
u1.Real_name as registeredBy, 
c.UserID as lastModifiedBy, 
c.RegistrationCenterID as registrationCenterID, 
c.RegistrationProjectID as registrationProjectID
FROM candidate as c
LEFT JOIN psc as p ON (p.CenterID=c.RegistrationCenterID)
LEFT JOIN users as u1 ON (u1.UserID = c.RegisteredBy)
WHERE c.CandID=:candID AND c.Active = 'Y'"
QUERY;

        $row = $db->pselectRow($query, array('candID' => (string) $candID));

        if (!is_array($row) || sizeof($row) == 0) {
            throw new \LorisException(
                "Could not select Candidate data from the database (DCCID: $candID)",
                CANDIDATE_INVALID
            );
        }

        // Populate class variables with data from the database
        foreach ($row as $key => $value) {
            $this->$key = $value;
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

        // get TimePoint SessionIDs for the $candID
        // select ALL of them - later you can filter out cancelled and inactive ones
        $query = "SELECT s.ID FROM session as s
            WHERE s.CandID=:Candidate AND s.Active='Y'
            ORDER BY ID";
        $row   = $db->pselect($query, $CandArray);

        // store user data in object property
        foreach ($row as $value) {
            $this->listOfTimePoints[] = intval($value["ID"]);
        }
    }

    /**
     * Creates a new candidate, assigning CandID and PSCID.
     *
     * FIXME Ideally the signature of this function should be changed so that
     * $useEDC is the second-to-last parameter. This would add some clarity as
     * it is an optional parameter based on configuration
     * settings. However, this will not be backward compatiable.
     *
     * @param int         $centerID              centerID of the site to which the
     *                                           candidate will belong
     * @param string      $dateOfBirth           date of birth written as YYYY-MM-DD
     * @param string|null $edc                   estimated date of confinement
     *                                           written as YYYY-MM-DD. Value should
     *                                           be null unless the useEDC setting
     *                                           is configured to be true.
     * @param string      $sex                   sex, either 'Male' or 'Female'
     * @param string|null $PSCID                 PSCID specified by the user,
     *                                           if available
     * @param int|null    $registrationProjectID The project ID, if available
     *
     * @return CandID   $candID      candidate id of the new candidate
     * @throws Exception
     * @static
     */
    static public function createNew(
        int $centerID,
        string $dateOfBirth,
        ?string $edc,
        string $sex,
        ?string $PSCID = null,
        int $registrationProjectID = null
    ): CandID {
        $factory = NDB_Factory::singleton();

        $site = \Site::singleton($centerID);

        $user = \User::singleton($_SESSION['State']->getUsername());

        // figure out how to generate PSCID
        $config        = $factory->config();
        $PSCIDSettings = $config->getSetting('PSCID');

        if ($config->settingEnabled('useEDC') && empty($edc)) {
            throw new \LorisException(
                "EDC must be specified",
                EDC_NOT_SPECIFIED
            );
        }

        switch ($PSCIDSettings['generation']) {
        case 'user' :
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
            break;
        default:
            $PSCID = (new \PSCIDGenerator($site->getSiteAlias()))->generate();
            break;
        }

        // Insert the new candidate into the database if everything is fine.
        $setArray = array(
                     'RegistrationCenterID'  => $centerID,
                     'PSCID'                 => $PSCID,
                     'DoB'                   => $dateOfBirth,
                     'EDC'                   => $edc,
                     'Sex'                   => $sex,
                     'RegistrationProjectID' => $registrationProjectID,
                     'Date_active'           => date('Y-m-d'),
                     'Date_registered'       => date('Y-m-d'),
                     'Entity_type'           => 'Human',
                     'RegisteredBy'          => $user->getUsername(),
                     'UserID'                => $user->getUsername(),
                    );

        if ($config->getSetting('useExternalID') === 'true') {
            $externalID = (new \ExternalIDGenerator())->generate();
            $setArray['ExternalID'] = $externalID;
        }

        // Generate a new CandID and insert it into the database.
        $generator = new \CandIDGenerator();
        // declare the variable to avoid static analysis warnings
        $invalidID = false;
        do {
            // Reset on each iteration
            $invalidID = false;
            // Generate candid and insert into setArray
            $candID = $generator->generate();
            $setArray['CandID'] = (string) $candID;
            try {
                \Database::singleton()->insert('candidate', $setArray);
            } catch (\DatabaseException | \DomainException $e) {
                // Occurs in the case of a race condition where another CandID
                // with the same value has been inserted into the DB before this
                // one.
                $invalidID = true;
            }
        } while ($invalidID);

        // Return the new CandID
        return $candID;
    }

    /**
     * Checks if candidate exist given a candidate ID and PSCID
     * Used to check that PSCID matches CandID when entered into the boxes
     * on the candidate_list form
     *
     * @param CandID $candID 6 digit Loris CandID
     * @param string $PSCID  project study center ID
     *
     * @return bool TRUE if candidate is found (in candidate table), FALSE otherwise
     * @throws DatabaseException
     */
    static function candidateExists(CandID $candID, string $PSCID): bool
    {
        // make a local reference to the Database object
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $candidateIDs = array(
                         ':candID' => $candID,
                         ':pscid'  => $PSCID,
                        );

        // get candidate data from database
        $query = "SELECT CandID
            FROM candidate
            WHERE CandID = :candID AND PSCID = :pscid
            AND Active = 'Y'";

        return ! is_null($db->pselectRow($query, $candidateIDs));
    }

    /**
     * Get a list of timepoints that this Candidate has registered
     *
     * @return int[]|null Non-associative array of SessionIDs 1st Time Point
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
     * @return     mixed The info requested
     * @deprecated
     */
    public function getData(?string $var = null)
    {
        throw new \DeprecationException(
            'Please use more specific accessor methods instead of this function'
        );
    }


    /**
     * Returns the ProjectID for the current candidate
     *
     * @return integer CandID of candidate
     */
    function getProjectID(): int
    {
        return intval($this->registrationProjectID);
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
        return $this->candID;
    }


    /**
     * Returns the PSCID of this candidate
     *
     * @return string The PSCID identifier for candidate
     */
    function getPSCID(): string
    {
        return $this->pscID;
    }

    /**
     * Returns the site of this candidate
     *
     * @return string Site name of this candidate's site
     */
    function getCandidateSite(): string
    {
        return $this->site;
    }


    /**
     * Returns the ID of this candidate's site
     *
     * @return integer The numeric ID of the candidate's site
     */
    function getCenterID(): int
    {
        return intval($this->candidateInfo["RegistrationCenterID"]);
    }

    /**
     * Returns the date of birth of this candidate
     *
     * TODO Convert this to use a DateTime object instead of a string.
     *
     * @return string|null The DoB in YYYY-MM-DD format
     */
    function getCandidateDoB(): ?string
    {
        return $this->dateOfBirth;
    }

    /**
     * Returns the expect date of confinement (due date)
     * of this candidate.
     *
     * TODO Convert this to use a DateTime object instead of a string.
     *
     * @return string|null The DoB in YYYY-MM-DD format
     */
    function getCandidateEDC(): ?string
    {
        return $this->estimatedDateOfConfinement;
    }

    /**
     * Return the candidate's sex
     *
     * @return string|null Male|Female String describing the sex
     *                     and null if scanner
     */
    function getCandidateSex(): ?string
    {
        return $this->sex;
    }

    /**
     * Return the candidate's ethnicity
     *
     * @return     string The ethnicity of candidate
     * @deprecated
     */
    function getCandidateEthnicity(): string
    {
        throw new DeprecatedException('This field is deprecated');
    }

    /**
     * Return whether the candidate is active
     *
     * FIXME This property should be a bool and calling code should populate
     * display values based on its value.
     *
     * @return string Y|N|null Active flag for this candidate
     */
    function isActive(): string
    {
        return $this->isActive;
    }

    /**
     * Return the user that registered (created) this candidate
     *
     * @return string UserID of user who created this candidate.
     */
    function registeredBy(): string
    {
        return $this->registeredBy;
    }

    /**
     * Return the name of the user account that last changed this candidate.
     *
     * @return string UserID of user who last changed this candidate.
     */
    function lastRecordChangeBy(): string
    {
        return $this->userID;
    }

    /**
     * Returns the list of visit labels w/ corresponding SessionID as key
     *
     * @return array<int,string> Associative array in the format
     *                              SessionID=>Visit_label
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
     * Generates list of valid subprojects for a the selected Candidate's
     * project
     *
     * @return ?array<int,int> Array of the form SubprojectID => SubprojectID
     *
     * @throws DatabaseException
     */
    public function getValidSubprojects(): array
    {
        $subprojList = array();

        $projID  = $this->getProjectID();
        $query   = "SELECT SubprojectID 
                    FROM project_subproject_rel 
                    WHERE ProjectID = :prj";
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
     * Returns the Visit_label for a subject's first TimePoint.
     *
     * @return string The visit label for the candidate's first visit.
     *                  Returns an empty string if one doesn't exist.
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
     * Returns the next visit number that should be created for this
     * candidate.
     *
     * @return int The next visit number
     */
    public function getNextVisitNo() : int
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $query  = "SELECT MAX(s.VisitNo)+1
                    FROM candidate AS c
                        LEFT JOIN session AS s USING (CandID)
                    WHERE c.CandID=:CaID AND s.Active='Y' AND c.Active='Y'";
        $result = $db->pselectOne($query, array('CaID' => $this->getCandID()));

        if ($result === null) {
            return 1;
        }
        return intval($result);
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

        $query = "SELECT ConsentID, Name, Status, DateGiven, DateWithdrawn
            FROM candidate_consent_rel cc JOIN consent c USING (ConsentID)
            WHERE CandidateID=:cid";
        $where = array('cid' => $this->candID);
        $key   = "ConsentID";

        $consentList = $db->pselectWithIndexKey($query, $where, $key);

        return $consentList;
    }

    /**
     * Gets the participant_status options from participant_status_options table
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    static function getParticipantStatusOptions(): array
    {
        $options      = \NDB_Factory::singleton()->database()->pselect(
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
     * @return string[] Options array suitable for use in QuickForm select
     *               element
     */
    static function getParticipantStatusSubOptions(int $parentID): array
    {
        $options      = \NDB_Factory::singleton()->database()->pselect(
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
            throw new InvalidArgumentException(
                'Candidate::setData() cannot be called with an empty array!'
            );
        }

        \NDB_Factory::singleton()->database()->update(
            'candidate',
            $newData,
            array(
             'CandID' => $this->getCandID(),
            )
        );
        return true;
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
}

