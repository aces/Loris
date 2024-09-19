<?php declare(strict_types=1);
/**
 * This file contains a class which is a wrapper around the concept
 * of a candidate in Loris.
 *
 * @license GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

use LORIS\StudyEntities\Candidate\CandID;
use LORIS\StudyEntities\Candidate\EntityType;
use LORIS\StudyEntities\Candidate\Sex;

/* Define constants used by the file */
// error codes
define('CANDIDATE_INVALID', 1);
define('PSCID_NOT_SPECIFIED', 2);
define('PSCID_NOT_UNIQUE', 3);
define('PSCID_INVALID_STRUCTURE', 4);
define('EDC_NOT_SPECIFIED', 5);
define('DOB_NOT_SPECIFIED', 6);
define('DOB_INVALID', 7);
define('EDC_INVALID', 8);

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
class Candidate implements \LORIS\StudyEntities\AccessibleResource,
    \LORIS\StudyEntities\SiteHaver
{
    var $candidateInfo;

    protected $data;

    /**
     * Construct a new Candidate object optionally populated by
     * the given DTO.
     *
     * @param ?CandidateData $data a Candidate DTO object to bypass
     *                             the singleton constructor.
     */
    public function __construct(?CandidateData $data=null)
    {
        $this->data = $data;
    }
    /**
     * This returns a single Candidate object for the given
     * candID, and will only ever instantiate one object in
     * the event that it's called multiple times.
     *
     * @param CandID $candID A 6 digit Loris CandID that matches
     *                       a candidate in the candidate table
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

        $CandArray = ['Candidate' => (string) $candID];

        // make a local reference to the Database object
        $db = $factory->database();

        // get candidate data from database
        $query = "SELECT c.RegistrationCenterID, c.CandID, c.PSCID, c.DoB,
            c.EDC, c.Sex, c.Entity_type,
            p.Name AS PSC, c.Ethnicity,
            c.Active, u1.Real_name as RegisteredBy, 
            c.UserID, c.RegistrationProjectID
            FROM candidate as c
            LEFT JOIN psc as p ON (p.CenterID=c.RegistrationCenterID)
            LEFT JOIN users as u1 ON (u1.UserID = c.RegisteredBy)
            WHERE c.CandID=:Candidate AND c.Active = 'Y'";

        $row = $db->pselectRow($query, $CandArray);

        if ($row === null) {
            throw new \LorisException(
                "Could not select Candidate data from the database (DCCID: $candID)",
                CANDIDATE_INVALID
            );
        }

        // We need to refer to these when instantiating the CandidateData
        // object after Timepoints have been selected, but by then $row
        // will have been overwritten, so put them in other variables.
        // Initialize them to null, they should get set in the foreach loop.
        $registrationProjectID = null;
        $registrationCenterID  = null;

        // store user data in object property
        foreach ($row as $key=>$value) {
            switch ($key) {
            case 'Sex':
                $this->candidateInfo[$key] = empty($value) ? null : new Sex($value);
                break;
            case 'Entity_type':
                $this->candidateInfo[$key] = new EntityType($value);
                break;
            case 'RegistrationProjectID':
                $registrationProjectID     = \ProjectID::singleton($value);
                $this->candidateInfo[$key] = $registrationProjectID;
                break;
            case 'RegistrationCenterID':
                $registrationCenterID      = \CenterID::singleton($value);
                $this->candidateInfo[$key] = $registrationCenterID;
                break;
            case 'CandID':
                $this->candidateInfo[$key] = new CandID(strval($value));
                break;
            default:
                $this->candidateInfo[$key] = $value;
            }
        }

        $headerSetting = $config->getSetting('HeaderTable');
        if (!empty($headerSetting)) {
            $params = [];
            $parameterCandSettings = $headerSetting['parameter_candidate'];
            if (!is_array($parameterCandSettings)) {
                $parameterCandSettings = [$parameterCandSettings];
            }
            foreach ($parameterCandSettings as $parameter_type) {
                $row = $db->pselectRow(
                    "SELECT Value, pt.Description
                    FROM candidate c
                    JOIN parameter_candidate pc ON (pc.CandID=c.CandID)
                    LEFT JOIN parameter_type pt ON
                    (pc.ParameterTypeID=pt.ParameterTypeID)
                    WHERE c.CandID=:Candidate AND pt.Name=:PTName",
                    [
                        'Candidate' => $candID,
                        'PTName'    => $parameter_type,
                    ]
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
                throw new \LorisException("IDs do not match");
            }
        }

        // get Time Point SessionIDs for the $candID
        $query = "SELECT s.ID, s.ProjectID, s.CenterID FROM session as s
            WHERE s.CandID=:Candidate AND s.Active='Y'
            ORDER BY ID";
        $row   = $db->pselect($query, $CandArray);

        // store user data in object property
        $timepoints = [];
        foreach ($row as $value) {
            $timepoints[] = new TimePoint(
                new TimePointData(
                    new SessionID(strval($value["ID"])),
                    ProjectID::singleton($value["ProjectID"]),
                    CenterID::singleton($value["CenterID"]),
                )
            );
        }

        $this->data = new CandidateData(
            $candID,
            $registrationProjectID,
            $registrationCenterID,
            $timepoints,
        );
        $this->candidateInfo['ProjectTitle'] = $this->getProjectTitle();
    }

    /**
     * Creates a new candidate, assigning CandID and PSCID.
     *
     * FIXME Ideally the signature of this function should be changed so that
     * $useEDC is the second-to-last parameter. This would add some clarity as
     * it is an optional parameter based on configuration
     * settings. However, this will not be backward compatiable.
     *
     * @param CenterID    $centerID              centerID of the site to which the
     *                                           candidate will belong
     * @param string|null $dateOfBirth           date of birth written as YYYY-MM-DD
     * @param string|null $edc                   estimated date of confinement
     *                                           written as YYYY-MM-DD. Value
     *                                           should be null unless the
     *                                           useEDC setting is configured
     *                                           to be true.
     * @param Sex         $sex                   An instance of the Sex class.
     * @param string|null $PSCID                 PSCID specified by the user,
     *                                           if available
     * @param ?ProjectID  $registrationProjectID The project ID, if available
     *
     * @return CandID   $candID      candidate id of the new candidate
     * @throws Exception
     * @static
     */
    static public function createNew(
        CenterID $centerID,
        ?string $dateOfBirth,
        ?string $edc,
        Sex $sex,
        ?string $PSCID = null,
        ProjectID $registrationProjectID = null
    ): CandID {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $site = \Site::singleton($centerID);

        $project = \Project::getProjectFromID($registrationProjectID);

        $user = \User::singleton($_SESSION['State']->getUsername());

        // figure out how to generate PSCID
        $config        = $factory->config();
        $PSCIDSettings = $config->getSetting('PSCID');
        $useEDC        = $config->getSetting('useEDC');

        // Get expected format from config
        $dobFormat = $config->getSetting('dobFormat');
        $dobFormat = '!' . implode("-", str_split($dobFormat, 1));

        if (($useEDC === '1' || $useEDC === 'true')) {
            if (empty($edc)) {
                throw new \LorisException(
                    "EDC must be specified",
                    EDC_NOT_SPECIFIED
                );
            } else {
                // Check valid format
                $edcDate = DateTime::createFromFormat($dobFormat, $edc);
                if ($edcDate === false) {
                    throw new InvalidArgumentException(
                        "EDC is invalid (expected format: YYYY-MM-DD)",
                        EDC_INVALID
                    );
                }

                // Add day as mid of the month if Y-m dob format
                // This allows insert into sql candidate table
                if ($dobFormat === '!Y-m') {
                    $edc .= '-15';
                }
            }
        }

        if (empty($dateOfBirth)) {
            // DoB not required if useEDC is on
            if (!($useEDC === '1' || $useEDC === 'true')) {
                throw new InvalidArgumentException(
                    "Date of Birth must be specified",
                    DOB_NOT_SPECIFIED
                );
            } else {
                $dateOfBirth = null;
            }
        } else {
            $dob = DateTime::createFromFormat($dobFormat, $dateOfBirth);
            if ($dob === false) {
                throw new InvalidArgumentException(
                    "Date of Birth is invalid (expected format: YYYY-MM-DD)",
                    DOB_INVALID
                );
            }

            // Add day as mid of the month if Y-m dob format
            // This allows insert into sql candidate table
            if ($dobFormat === '!Y-m') {
                $dateOfBirth .= '-15';
            }
        }

        if ($PSCIDSettings['generation'] == 'user') {
            // check pscid is specified
            if (empty($PSCID)) {
                throw new Exception(
                    "PSCID must be specified",
                    PSCID_NOT_SPECIFIED
                );
            }

            // check pscid uniqueness
            $existing = $db->pselectOne(
                'SELECT
                  COUNT(*)
                 FROM candidate
                 WHERE PSCID = :v_pscid
                 GROUP BY
                   PSCID
                ',
                ['v_pscid' => $PSCID]
            );

            if ($existing > 0) {
                throw new \ConflictException(
                    "PSCID must be unique",
                    PSCID_NOT_UNIQUE
                );
            }

            // check pscid structure
            if (!Candidate::validatePSCID(
                $PSCID,
                $site->getSiteAlias(),
                $project->getAlias()
            )
            ) {
                throw new LorisException(
                    "PSCID has an invalid structure",
                    PSCID_INVALID_STRUCTURE
                );
            }

        } else {
            $PSCID = (new \PSCIDGenerator(
                $site->getSiteAlias(),
                $project->getAlias()
            )
            )->generate();
        }

        // Insert the new candidate into the database if everything is fine.
        $setArray = [
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
        ];

        if ($config->getSetting('useExternalID') === 'true') {
            $externalID = (new \ExternalIDGenerator(
                $site->getSiteAlias(),
                $project->getAlias()
            ))->generate();
            $setArray['ExternalID'] = $externalID;
        }

        // Generate a new CandID and insert it into the database.
        $generator = new \CandIDGenerator();
        // declare the variable to avoid static analysis warnings
        $attemptcount = 0;

        $db = \NDB_Factory::singleton()->database();
        do {
            // Reset on each iteration
            $invalidID = false;
            // Generate candid and insert into setArray
            $candID = $generator->generate();
            $setArray['CandID'] = (string) $candID;
            try {
                $db->insert('candidate', $setArray);
            } catch (\DatabaseException | \DomainException $e) {
                // Occurs in the case of a race condition where another CandID
                // with the same value has been inserted into the DB before this
                // one.
                $invalidID = true;
                $attemptcount++;
                if ($attemptcount > 2) {
                    throw $e;
                }
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

        $candidateIDs = [
            ':candidate_id' => $candID,
            ':pscid'        => $PSCID,
        ];

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
    function getListOfTimePoints(): array
    {
        return array_map(
            function ($timepoint) {
                return intval(
                    strval($timepoint->getSessionID())
                );
            },
            $this->data->timepoints,
        );
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
        $timepoints = $this->data->timepoints;
        if (isset($timepoints[$visitNo-1]) ) {
            return intval(
                strval($timepoints[$visitNo-1]->getSessionID())
            );
        }

        return null;
    }

    /**
     * Return a piece of data about this candidate
     *
     * @param string|null $var The type of data about the Candidate
     *                         to be returned
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
     *                       new value(s).
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
        }
        $this->candidateInfo = array_merge($this->candidateInfo, $newData);

        \NDB_Factory::singleton()->database()->update(
            'candidate',
            $newData,
            [
                'CandID' => $this->getCandID(),
            ]
        );
        return true;
    }


    /**
     * Returns the ProjectID for the current candidate
     *
     * @return \ProjectID RegistrationProjectID of candidate
     */
    function getProjectID(): \ProjectID
    {
        return $this->data->registrationProjectID;
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
        return $ProjectList[$this->getProjectID()->__toString()] ?? '';
    }

    /**
     * Returns the CandID of this candidate
     *
     * @return CandID
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
     * @return CenterID The numeric ID of the candidate's site
     */
    function getCenterID(): CenterID
    {
        return $this->data->registrationCenterID;
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
     * Returns the way that the DoB should be displayed for this
     * candidate to a user on the frontend.
     *
     * @return ?array{label:string,value:string}
     */
    function getDisplayDoB(): ?array
    {
        if ($this->getCandidateDob() === null) {
            return null;
        }

        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $dobFormat = $config->getSetting('dobFormat');

        $dobDate = new DateTimeImmutable($this->getCandidateDoB());
        switch ($dobFormat) {
        case 'Ym':
            return [
                'label' => 'Date of Birth',
                'value' => $dobDate->format('Y-m'),
            ];
        case 'Ymd':
            return [
                'label' => 'Date of Birth',
                'value' => $dobDate->format('Y-m-d'),
            ];
        default:
            throw new Exception("Unhandled DoB format: $dobFormat");
        }
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
     * @return ?Sex
     */
    function getCandidateSex(): ?Sex
    {
        return $this->candidateInfo["Sex"];
    }

    /**
     * Return the candidate's entity type.
     *
     * @return ?EntityType
     */
    function getEntityType(): ?EntityType
    {
        return $this->candidateInfo["Entity_type"];
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
        $visitLabelArray = [];

        $candID = $this->getCandID();

        // make a local reference to the Database object
        //
        $db = $factory->database();

        $query  = "SELECT ID, Visit_label FROM session
            WHERE CandID=:Candidate AND Active='Y' ORDER BY ID";
        $result = $db->pselect($query, ['Candidate' => $candID]);

        // map the array [VisitNo]=>Visit_label
        foreach ($result as $row) {
            $visitLabelArray[$row["ID"]] = $row["Visit_label"];
        }
        return $visitLabelArray;
    }

    /**
     * Generates list of valid cohorts for a the selected Candidate's
     * project
     *
     * @return array Array of the form CohortID => CohortID
     *               or NULL if none exist
     * @throws DatabaseException
     */
    public function getValidCohorts(): array
    {
        $subprojList = [];

        $projID  = $this->getProjectID();
        $query   = "SELECT CohortID
                    FROM project_cohort_rel
                    WHERE ProjectID = :prj";
        $params  = ['prj' => $projID];
        $subproj = \NDB_Factory::singleton()
            ->database()
            ->pselect($query, $params);

        foreach ($subproj as $row) {
            foreach ($row as $key =>$val) {
                if ($key == 'CohortID') {
                    $subprojList[$val] = $val;
                }
            }
        }

        return $subprojList;
    }

    /**
     * Returns the CohortID and cohort title of the candidate's last visit
     * based on Date_visit
     *
     * @return array|null Array with values CohortID and title
     *                    for the candidate's last visit or NULL if none exist
     */
    public function getCohortForMostRecentVisit(): ?array
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $candID = $this->getCandID();
        $query  = "SELECT CohortID, title FROM session
          LEFT JOIN cohort USING (CohortID)
          WHERE CandID=:cid AND Date_visit IS NOT NULL
          ORDER BY Date_visit DESC LIMIT 1";
        $where  = ['cid' => $candID];
        $result = $db->pselectRow($query, $where);

        if (empty($result)) {
            return null;
        }
        return $result;
    }

    /**
     * Returns first visit for a candidate based on VisitNo
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
        $where  = ['cid' => $candID];
        try {
            $result = $db->pselectOne($query, $where);
        } catch (DomainException $ex) {
            throw new LorisException(
                "CandID: $candID has multiple first visits ".
                "recorded whereas only 1 is expected."
            );
        }
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
        $result = $db->pselectOne($query, ['CaID' => $this->getCandID()]);

        if ($result === null) {
            return 1;
        }
        return intval($result);
    }

    /**
     * Returns DateInterval between candidate's date of birth and a given date,
     * or today if no date given.
     *
     * @param ?DateTime $refDate The reference date from which to calculate the age,
     *                           or null if not provided
     *
     * @return DateInterval Between DoB and $refDate
     */
    public function getAge(?DateTime $refDate = null): DateInterval
    {
        if (!$refDate) {
            $refDate = new DateTime();
        }

        $dob = new DateTime($this->candidateInfo["DoB"]);

        return $dob->diff($refDate);
    }

    /**
     * Returns the candidate's calculated age today in int years
     *
     * @return int The candidate's age today as years
     */
    public function getAgeInYears(): int
    {
        return (int)$this->getAge()->format('%y');
    }

    /**
     * Returns the candidate's calculated age today in total number of months
     *
     * @return int The candidate's age today in months
     */
    public function getAgeInMonths(): int
    {
        return (int)$this->getAge()->format('%m') +
            12 * $this->getAgeInYears();
    }

    /**
     * Returns the candidate's calculated age today in total number of days
     *
     * @return int The candidate's age today in days
     */
    public function getAgeInDays(): int
    {
        return (int)$this->getAge()->days;
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

        $query = "SELECT ConsentID, Name, Status, DateGiven, DateWithdrawn, Label
            FROM candidate_consent_rel cc JOIN consent c USING (ConsentID)
            WHERE CandidateID=:cid";
        $where = ['cid' => $candID];
        $key   = "ConsentID";

        $consentList = $db->pselectWithIndexKey($query, $where, $key);

        return $consentList;
    }

    /**
     * Validate's that a PSCID matches the format defined by project
     * config
     *
     * @param string $PSCID         The PSCID to validate
     * @param string $siteAbbrev    The site of the candidate
     *                              being validated to check
     *                              against appropriate parts
     *                              of PSCID definition
     * @param string $projectAbbrev The project of the candidate
     *                              being validated to check against appropriate
     *                              parts of PSCID definition
     *
     * @return boolean True if PSCID is valid, false otherwise
     */
    static public function validatePSCID(
        string $PSCID,
        string $siteAbbrev,
        string $projectAbbrev
    ): bool {

        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $PSCIDSettings = $config->getSetting('PSCID');
        $regex         = self::structureToPCRE(
            $PSCIDSettings['structure'],
            $siteAbbrev,
            $projectAbbrev
        );
        //preg_match returns 1 on success.
        return preg_match($regex, $PSCID) === 1;
    }

    /**
     * Gets the participant_status options from participant_status_options table
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    static function getParticipantStatusOptions(): array
    {
        $DB           = \NDB_Factory::singleton()->database();
        $options      = $DB->pselect(
            "SELECT ID,Description
            FROM participant_status_options
            WHERE parentID IS NULL",
            []
        );
        $option_array = [];
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
        $DB           = \NDB_Factory::singleton()->database();
        $options      = $DB->pselect(
            "SELECT ID,Description
            FROM participant_status_options
            WHERE parentID=:pid",
            ['pid' => $parentID]
        );
        $option_array = [];
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

    /**
     * Implements the AccessibleResource interface. A candidate can
     * be accessed by a user if it shares the same registration project
     * and site or it has access to any of the timepoints.
     *
     * @param \User $user The user whose access should be validated.
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        $projMatch   = in_array($this->getProjectID(), $user->getProjectIDs());
        $centerMatch = $user->hasCenter($this->getCenterID());

        // The candidate is accessible based on its registration
        // project/center
        if ($projMatch && $centerMatch) {
            return true;
        }

        // If we can't access due the registration, check if we
        // have access to any timepoints.
        foreach ($this->data->timepoints as $timepoint) {
            if ($timepoint->isAccessibleBy($user)) {
                return true;
            }
        }

        // No Registration Project/Center match and no accessible
        // timepoints, so no access.
        return false;
    }

    /**
     * Return a human readable description of the participant status for this
     * candidate.
     *
     * @param \Database $db The database to get the description from
     *
     * @return string
     */
    public function getParticipantStatusDescription(\Database $db) : string
    {
        $res = $db->pselectRow(
            "SELECT pso.Description
             FROM participant_status ps
                JOIN participant_status_options pso ON (ps.participant_status=pso.ID)
             WHERE CandID=:candid",
            ['candid' => $this->getCandID()],
        );
        return $res['Description'] ?? '';
    }

    /**
     * Returns the candidate's latest diagnosis defined by
     * the configured diagnosis trajectory. Based on input, can return
     * the confirmed or unconfirmed latest diagnosis. A confirmed
     * diagnosis is one that has been pulled from a session that has
     * Approval = 'Pass'
     *
     * @param ProjectID $projectID   ProjectID
     * @param bool      $isConfirmed Specifies whether to select latest
     *
     * @return array|null JSON of the candidate's latest diagnosis
     *                    as depicted by the configured diagnosis
     *                    evolution ordering.
     */
    function getLatestDiagnosis(
        ProjectID $projectID,
        bool $isConfirmed = false
    ) : ?array {
        $DB = \NDB_Factory::singleton()->database();

        // Define where clauses
        $whereConfirmed = $isConfirmed ?
            " AND Confirmed='Y'" : "";

        $latestDx = $DB->pselectRow(
            "SELECT DxEvolutionID,
                ProjectID,
                CandID,
                Name,
                Diagnosis,
                Confirmed,
                LastUpdate,
                OrderNumber
            FROM diagnosis_evolution 
            JOIN candidate_diagnosis_evolution_rel USING (DxEvolutionID)
            WHERE OrderNumber IN (
                SELECT MAX(orderNumber) AS OrderNumber 
                FROM diagnosis_evolution de2
                JOIN candidate_diagnosis_evolution_rel cde USING (DxEvolutionID)
                WHERE CandID=:candID
                AND ProjectID=:projID"
                . $whereConfirmed .
            " )
            AND CandID=:candID
            AND ProjectID=:projID"
            . $whereConfirmed,
            [
                'candID' => $this->getCandID(),
                'projID' => $projectID
            ]
        );

        return $latestDx ?? null;
    }

    /**
     * Returns the DxEvolutionID for which the latest diagnosis
     * of the specified project is based on.
     *
     * @param ProjectID $projectID   ProjectID
     * @param bool      $isConfirmed Specifies whether to select latest
     *
     * @return string|null the DxEvolutionID that LatestDiagnosis is based on
     */
    function getLatestDiagnosisSource(
        ProjectID $projectID,
        bool $isConfirmed = false
    ) {
        $latestDx = $this->getLatestDiagnosis($projectID, $isConfirmed);
        return $latestDx['DxEvolutionID'] ?? null;
    }

    /**
     * Transforms a config structure (such as in PSCID) into a
     * Perl-compatible regex expression for validation
     *
     * @param array       $structure     the structure root
     * @param string|null $siteAbbrev    the site abbreviation, sometimes used as
     *                                   part of the PSCID
     * @param string|null $projectAbbrev the project abbreviation
     *
     * @return string the regex pattern
     *
     * @note    This should probably be moved to the Candidate class, since it's
     *       only used there to validate the PSCID
     * @cleanup
     */
    static function structureToPCRE(
        array $structure,
        ?string $siteAbbrev = null,
        ?string $projectAbbrev = null
    ): string {
        $seqs = $structure['seq'];
        // handle the situation where there exists only one seq
        if (isset($seqs['#'])) {
            $seqs = [$seqs];
        }
        $regex = "";
        foreach ($seqs AS $seq) {
            $unit = "";

            switch ($seq['@']['type']) {
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
            case 'projectAbbrev':
                $unit .= $projectAbbrev;
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
}
