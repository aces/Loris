<?php declare(strict_types=1);

/**
 * Candidate parameters data fetch
 *
 * Gets data to populate the front-end form fields
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Stella L. <slee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */
use \LORIS\StudyEntities\Candidate\CandID;

$user      = \NDB_Factory::singleton()->user();
$candID    = new CandID($_GET['candID']);
$candidate = \Candidate::singleton($candID);

if (!$user->hasPermission('access_all_profiles')
    && !($user->hasAnyPermission(
        [
            'candidate_parameter_edit',
            'candidate_parameter_view'
        ]
    ) && $user->hasCenter($candidate->getCenterID()))
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$data = $_GET['data'] ?? '';
if ($data == '') {
    header("HTTP/1.1 400 Bad Request");
    exit;
}

switch ($data) {
case 'candidateInfo':
    echo json_encode(getCandInfoFields());
    exit;
case 'probandInfo':
    echo json_encode(getProbandInfoFields());
    exit;
case 'familyInfo':
    echo json_encode(getFamilyInfoFields());
    exit;
case 'participantStatus':
    echo json_encode(getParticipantStatusFields());
    exit;
case 'consentStatus':
    echo json_encode(getConsentStatusFields());
    exit;
case 'candidateDOB':
    echo json_encode(getDOBFields());
    exit;
case 'candidateDOD':
    echo json_encode(getDODFields());
    exit;
case 'diagnosisEvolution':
    echo json_encode(getDiagnosisEvolutionFields());
    exit;
default:
    header("HTTP/1.1 404 Not Found");
    exit;
}
/**
 * Handles the fetching of Candidate Info fields
 *
 * @throws DatabaseException
 *
 * @return array
 */
function getCandInfoFields()
{
    $candID = new CandID($_GET['candID']);

    $db = \NDB_Factory::singleton()->database();

    // get caveat options
    $caveat_options = [];
    $options        = $db->pselect(
        "SELECT ID, Description FROM caveat_options",
        []
    );
    foreach ($options as $row) {
        $caveat_options[$row['ID']] = $row['Description'];
    }

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate WHERE CandID = :candid',
        ['candid' => $candID]
    );

    $flag = $db->pselectOne(
        'SELECT flagged_caveatemptor FROM candidate WHERE CandID = :candid',
        ['candid' => $candID]
    );

    $reason = $db->pselectOne(
        'SELECT flagged_reason FROM candidate WHERE CandID = :candid',
        ['candid' => $candID]
    );

    $other = $db->pselectOne(
        'SELECT flagged_other FROM candidate WHERE CandID = :candid',
        ['candid' => $candID]
    );

    $extra_parameters = $db->pselect(
        "SELECT CONCAT('PTID', pt.ParameterTypeID) AS ParameterTypeID, pt.Name, 
        pt.Type, pt.Description 
        FROM parameter_type pt
        JOIN parameter_type_category_rel ptcr USING (ParameterTypeID) 
        JOIN parameter_type_category ptc USING (ParameterTypeCategoryID)
        WHERE ptc.Name='Candidate Parameters'
        ORDER BY pt.ParameterTypeID, pt.name ASC",
        []
    );

    $fields = $db->pselect(
        "SELECT CONCAT('PTID', ParameterTypeID) AS ParameterTypeID, Value 
        FROM parameter_candidate WHERE CandID=:cid",
        ['cid' => $candID]
    );

    $parameter_values = [];
    foreach ($fields as $row) {
        $parameter_values[$row['ParameterTypeID']] = $row['Value'];
    }

    $result = [
        'pscid'                => $pscid,
        'candID'               => $candID->__toString(),
        'caveatReasonOptions'  => $caveat_options,
        'flagged_caveatemptor' => $flag,
        'flagged_reason'       => $reason,
        'flagged_other'        => $other,
        'extra_parameters'     => $extra_parameters,
        'parameter_values'     => $parameter_values,
    ];

    return $result;
}

/**
 * Handles the fetching of Proband Info fields
 *
 * @throws DatabaseException
 *
 * @return array
 */
function getProbandInfoFields()
{
    $candID = new CandID($_GET['candID']);

    $db = \NDB_Factory::singleton()->database();

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate where CandID = :candid',
        ['candid' => $candID]
    );

    $sex = $db->pselectOne(
        'SELECT ProbandSex FROM candidate where CandID = :candid',
        ['candid' => $candID]
    );

    $dob = $db->pselectOne(
        'SELECT ProbandDoB FROM candidate where CandID = :candid',
        ['candid' => $candID]
    );

    $extra_parameters = $db->pselect(
        "SELECT CONCAT('PTID', pt.ParameterTypeID) AS ParameterTypeID, pt.Name, 
        pt.Type, pt.Description 
        FROM parameter_type pt
        JOIN parameter_type_category_rel ptcr USING (ParameterTypeID) 
        JOIN parameter_type_category ptc USING (ParameterTypeCategoryID)
        WHERE ptc.Name='Candidate Parameters Proband'
        ORDER BY pt.ParameterTypeID, pt.name ASC",
        []
    );

    $fields = $db->pselect(
        "SELECT CONCAT('PTID', ParameterTypeID) AS ParameterTypeID, Value 
         FROM parameter_candidate WHERE CandID=:cid",
        ['cid' => $candID]
    );

    $parameter_values = [];
    foreach ($fields as $row) {
        $parameter_values[$row['ParameterTypeID']] = $row['Value'];
    }

    // Calculate age difference
    $ageDifference = "Could not calculate age";
    $candidateDOB  = $db->pselectOne(
        "SELECT DoB FROM candidate WHERE CandID=:CandidateID",
        ['CandidateID' => $candID]
    );
    if (!empty($candidateDOB) && !empty($dob)) {
        $age = \Utility::calculateAge($dob, $candidateDOB);

        if ($age !== null) {
            $ageDifference = $age['year'] * 12
                + $age['mon']
                + round($age['day'] / 30, 2);
        }
    }

    $result = [
        'pscid'            => $pscid,
        'candID'           => $candID->__toString(),
        'ProbandSex'       => $sex,
        'ProbandDoB'       => $dob,
        'ageDifference'    => $ageDifference,
        'extra_parameters' => $extra_parameters,
        'parameter_values' => $parameter_values,
        'sexOptions'       => \Utility::getSexList(),
    ];

    return $result;
}

/**
 * Handles the fetching of Family Info fields
 *
 * @throws DatabaseException
 *
 * @return array
 */
function getFamilyInfoFields()
{
    $candID = new CandID($_GET['candID']);

    $db = \NDB_Factory::singleton()->database();

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate where CandID = :candid',
        ['candid' => $candID]
    );

    $candidatesList = iterator_to_array(
        $db->pselect(
            "SELECT CandID FROM candidate ORDER BY CandID",
            []
        )
    );

    $siblingsList = iterator_to_array(
        $db->pselect(
            "SELECT f1.CandID 
        FROM family f1 JOIN family f2
        ON f1.FamilyID=f2.FamilyID WHERE f2.CandId=:candid GROUP BY f1.CandID",
            ['candid' => $candID]
        )
    );

    $siblings = [];
    foreach (array_values($siblingsList) as $siblingArray) {
        foreach ($siblingArray as $ID) {
            array_push($siblings, $ID);
        }
    }

    $candidates = [];
    // Remove own ID and sibling IDs from list of possible family members
    foreach ($candidatesList as $key => $candidate) {
        foreach ($candidate as $ID) {
            if ($ID == $candID || in_array($ID, $siblings)) {
                unset($candidatesList[$key]);
            } else {
                $candidates[$ID] = $ID;
            }
        }
    }

    $familyMembers = $db->pselect(
        "SELECT f1.CandID as FamilyCandID, f1.Relationship_type 
        FROM family f1 JOIN family f2 ON f1.FamilyID=f2.FamilyID
        WHERE f2.CandID = :candid AND f1.CandID <> :candid2 
          ORDER BY f1.CandID",
        [
            'candid'  => $candID,
            'candid2' => $candID,
        ]
    );

    $result = [
        'pscid'                 => $pscid,
        'candID'                => $candID->__toString(),
        'candidates'            => $candidates,
        'existingFamilyMembers' => $familyMembers,
    ];

    return $result;
}

/**
 * Handles the fetching of Participant Status fields
 *
 * @throws DatabaseException
 *
 * @return array
 */
function getParticipantStatusFields()
{
    global $loris;

    $loris->getModule('candidate_parameters')->registerAutoloader();
    $candID = new CandID($_GET['candID']);

    $db = \NDB_Factory::singleton()->database();

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate where CandID = :candid',
        ['candid' => $candID]
    );

    $statusOptions = \Candidate::getParticipantStatusOptions();
    $reasonOptions = [];

    $req      = $db->pselect(
        'SELECT ID from participant_status_options where Required=1',
        []
    );
    $required = [];
    foreach ($req as $k=>$row) {
        $required[$k] = $row['ID'];
    }
    $parentIDs   = $db->pselect(
        'SELECT distinct(parentID) from participant_status_options',
        []
    );
    $parentIDMap = [];
    foreach ($parentIDs as $ID) {
        $reasonOptions = [];
        foreach ($ID as $parentID) {
            if ($parentID != null) {
                $options = $db->pselect(
                    "SELECT ID, Description 
                    FROM participant_status_options 
                    WHERE parentID=:pid",
                    ['pid' => $parentID]
                );
                foreach ($options as $option) {
                    $reasonOptions[$option['ID']] = $option['Description'];
                }
                $parentIDMap[$parentID] = $reasonOptions;
            }
        }
    }

    $query = "SELECT participant_status, participant_suboptions, 
    reason_specify FROM participant_status WHERE CandID=:candid";
    $row   = $db->pselectRow($query, ['candid' => $candID]);

    $status    = !empty($row['participant_status']) ? $row['participant_status']
        : null;
    $suboption = !empty($row['participant_suboptions'])
        ? $row['participant_suboptions'] : null;
    $reason    = !empty($row['reason_specify']) ? $row['reason_specify'] : null;

    $history = getParticipantStatusHistory($candID);

    $result = [
        'pscid'                 => $pscid,
        'candID'                => $candID->__toString(),
        'statusOptions'         => $statusOptions,
        'required'              => $required,
        'reasonOptions'         => $reasonOptions,
        'parentIDs'             => $parentIDMap,
        'participantStatus'     => $status,
        'participantSuboptions' => $suboption,
        'reasonSpecify'         => $reason,
        'history'               => $history,
    ];
    return $result;
}

/**
 * Handles the fetching of Participant Status History
 *
 * @param CandID $candID current candidate's ID
 *
 * @throws DatabaseException
 *
 * @return array
 */
function getParticipantStatusHistory(CandID $candID)
{
    $db = \NDB_Factory::singleton()->database();
    $unformattedComments = $db->pselect(
        "SELECT entry_staff, data_entry_date,
            (SELECT Description 
              FROM participant_status_options pso 
              WHERE ID=psh.participant_status) AS status, 
            (SELECT Description from participant_status_options pso 
              WHERE ID=psh.participant_subOptions) 
              AS suboption,  reason_specify 
            FROM participant_status_history psh WHERE CandID=:cid",
        ['cid' => $candID]
    );

    return iterator_to_array($unformattedComments);
}


/**
 * Handles the fetching of Consent Status fields
 *
 * @throws DatabaseException
 *
 * @return array
 */
function getConsentStatusFields()
{
    $candID = new CandID($_GET['candID']);

    $candidate = \Candidate::singleton($candID);

    // get pscid
    $pscid = $candidate->getPSCID();

    $consentList    = [];
    $status         = [];
    $date           = [];
    $withdrawalDate = [];

    // Get consent groups
    $consentGroups = \Utility::getConsentGroups();

    // Get list of all consent types
    $consentDetails = \Utility::getConsentList();
    // Get list of consents for candidate
    $candidateConsent = $candidate->getConsents();

    // Set only specified consentID if coming from consent module
    if (array_key_exists('consent', $_GET) && !is_null($_GET['consent'])) {
        $id = $_GET['consent'];
        $consentDetails   = [
            $id => $consentDetails[$id]
        ];
        $candidateConsent = [
            $id => $candidateConsent[$id]
        ];
    }

    $comments = [];

    foreach ($consentDetails as $consentID=>$consent) {
        $consentName = $consent['Name'];
        $consentList[$consentName] = $consent['Label'];
        $groupID = $consent['ConsentGroupID'];

        // Append consent as a child to its group
        $consentGroups[$groupID]['Children'][] = $consentName;

        if (isset($candidateConsent[$consentID])) {
            $candidateConsentID     = $candidateConsent[$consentID];
            $status[$consentName]   = $candidateConsentID['Status'];
            $comments[$consentName] = $candidateConsentID['Comment'];

            // Process dates from datetime to date
            $dateGiven = '';
            if (!empty($candidateConsentID['DateGiven'])) {
                $dateGiven = strtotime($candidateConsentID['DateGiven']);
                $dateGiven = date('Y-m-d', $dateGiven);
            }
            $dateWithdrawn = '';
            if (!empty($candidateConsentID['DateWithdrawn'])) {
                $dateWithdrawn = strtotime($candidateConsentID['DateWithdrawn']);
                $dateWithdrawn = date('Y-m-d', $dateWithdrawn);
            }
            $date[$consentName]           = $dateGiven;
            $withdrawalDate[$consentName] = $dateWithdrawn;
        } else {
            $status[$consentName]         = null;
            $date[$consentName]           = null;
            $withdrawalDate[$consentName] = null;
            $comments[$consentName]       = null;
        }
    }
    $history = getConsentStatusHistory($pscid);

    $result = [
        'pscid'           => $pscid,
        'candID'          => $candID->__toString(),
        'consentStatuses' => $status,
        'consentDates'    => $date,
        'withdrawals'     => $withdrawalDate,
        'consents'        => $consentList,
        'history'         => $history,
        'consentGroups'   => $consentGroups,
        'comments'        => $comments,
    ];

    return $result;
}

/**
 * Handles the fetching of Consent Status history
 *
 * @param string $pscid current candidate's PSCID
 *
 * @throws DatabaseException
 *
 * @return array
 */
function getConsentStatusHistory($pscid)
{
    $db = (\NDB_Factory::singleton())->database();

    // Set only specified consentID if coming from consent module
    if (array_key_exists('consent', $_GET) && !is_null($_GET['consent'])) {
        $id     = $_GET['consent'];
        $query  = "SELECT
            cch.EntryDate,
            cch.DateGiven,
            cch.DateWithdrawn,
            cch.PSCID,
            cch.ConsentName,
            cch.ConsentLabel,
            cch.Status,
            cch.EntryStaff,
            cch.Comment,
            dch.Request_status AS requestStatus,
            dch.version
         FROM candidate_consent_history cch
         JOIN consent c ON c.Name=cch.ConsentName 
         LEFT JOIN direct_consent_history dch
            ON dch.DirectConsentHistoryID=cch.DirectConsentHistoryID
         WHERE cch.PSCID=:pscid 
         AND c.ConsentID=:cid
         ORDER BY EntryDate ASC";
        $params = [
            'pscid' => $pscid,
            'cid'   => $id
        ];

        $directQuery = "SELECT 
            dch.UserID AS EntryStaff, 
            dch.EntryDate, 
            dch.PSCID, 
            cg.Label AS ConsentLabel, 
            dch.Request_status AS requestStatus, 
            dch.version
        FROM direct_consent_history dch 
        JOIN consent_group cg ON dch.ConsentGroupID=cg.ConsentGroupID
        WHERE dch.PSCID=:pscid
        AND dch.ConsentGroupID=(
            SELECT ConsentGroupID
            FROM consent
            WHERE ConsentID=:cid
        )";
    } else {
        $query  = "SELECT
            cch.EntryDate,
            cch.DateGiven,
            cch.DateWithdrawn,
            cch.PSCID,
            cch.ConsentName,
            cch.ConsentLabel,
            cch.Status,
            cch.EntryStaff,
            cch.Comment,
            dch.Request_status,
            dch.version
         FROM candidate_consent_history cch
         LEFT JOIN direct_consent_history dch
            ON dch.DirectConsentHistoryID=cch.DirectConsentHistoryID
         WHERE cch.PSCID=:pscid 
         ORDER BY cch.EntryDate ASC";
        $params = ['pscid' => $pscid];

        $directQuery = "SELECT
            dch.UserID AS EntryStaff,
            dch.EntryDate,
            dch.PSCID,
            cg.Label AS ConsentLabel,
            dch.Request_status AS requestStatus,
            dch.version
        FROM direct_consent_history dch 
        JOIN consent_group cg ON dch.ConsentGroupID=cg.ConsentGroupID
        WHERE dch.PSCID=:pscid";
    }

    // Get regular consent history data
    // as well as direct consent history data
    $historyData = $db->pselect(
        $query,
        $params
    );

    $directHistoryData = $db->pselect(
        $directQuery,
        $params
    );

    $historyData = is_array($historyData) ? $historyData : iterator_to_array($historyData);
    $directHistoryData = is_array($directHistoryData) ? $directHistoryData : iterator_to_array($directHistoryData);

    $allHistory = array_merge($historyData, $directHistoryData);

    $formattedHistory = [];
    foreach ($historyData as $entry) {
          $formattedHistory[] = [
              'data_entry_date' => array_key_exists('EntryDate', $entry) ?
                    $entry['EntryDate'] : null,
              'entry_staff'     => array_key_exists('EntryStaff', $entry) ?
                    $entry['EntryStaff'] : null,
              'consentStatus'   => array_key_exists('Status', $entry) ?
                    $entry['Status'] : null,
              'date'            => array_key_exists('DateGiven', $entry) ?
                    $entry['DateGiven'] : null,
              'withdrawal'      => array_key_exists('DateWithdrawn', $entry) ?
                    $entry['DateWithdrawn'] : null,
              'label'           => array_key_exists('ConsentLabel', $entry) ?
                    $entry['ConsentLabel'] : null,
              'consentType'     => array_key_exists('ConsentName', $entry) ?
                    $entry['ConsentName'] : null,
              'requestStatus'   => array_key_exists('requestStatus', $entry) ?
                    $entry['requestStatus'] : null,
              'version'         => array_key_exists('version', $entry) ?
                    $entry['version'] : null,
              'Comment'         => array_key_exists('Comment', $entry) ?
                    $entry['Comment'] : null,
          ];
    }
    return $formattedHistory;
}

/**
 * Handles the fetching of candidate's date of birth.
 *
 * @return array
 */
function getDOBFields(): array
{
    $candID = new CandID($_GET['candID']);
    $db     = \NDB_Factory::singleton()->database();
    // Get PSCID
    $candidateData = $db->pselectRow(
        'SELECT PSCID,DoB FROM candidate where CandID =:candid',
        ['candid' => $candID->__toString()]
    );
    $pscid         = $candidateData['PSCID'] ?? null;
    $dob           = $candidateData['DoB'] ?? null;

    // Get DoB format
    $factory = \NDB_Factory::singleton();
    $config  = $factory->config();

    $dobFormat = $config->getSetting('dobFormat');

    $dobProcessedFormat = implode("-", str_split($dobFormat, 1));
    $dobDate            = DateTime::createFromFormat('Y-m-d', $dob);
    $formattedDate      = $dobDate ? $dobDate->format($dobProcessedFormat) : null;

    $result = [
        'pscid'     => $pscid,
        'candID'    => $candID->__toString(),
        'dob'       => $formattedDate,
        'dobFormat' => $dobFormat,
    ];
    return $result;
}

/**
 * Handles the fetching of candidate's date of death.
 *
 * @return array
 */
function getDODFields(): array
{
    $candID = new CandID($_GET['candID']);
    $db     = \NDB_Factory::singleton()->database();

    $candidateData = $db->pselectRow(
        'SELECT PSCID,DoD, DoB FROM candidate where CandID =:candid',
        ['candid' => $candID]
    );
    if ($candidateData === null) {
        throw new \LorisException("Invalid candidate");
    }

    $factory = \NDB_Factory::singleton();
    $config  = $factory->config();

    // Get formatted dod
    $dodFormat = $config->getSetting('dodFormat');

    $dodProcessedFormat = implode("-", str_split($dodFormat, 1));
    $dodDate            = DateTime::createFromFormat('Y-m-d', $candidateData['DoD']);
    $dod = $dodDate ? $dodDate->format($dodProcessedFormat) : null;

    // Get formatted dob
    $dobFormat = $config->getSetting('dobFormat');

    $dobProcessedFormat = implode("-", str_split($dobFormat, 1));
    $dobDate            = DateTime::createFromFormat('Y-m-d', $candidateData['DoB']);
    $dob = $dobDate ? $dobDate->format($dobProcessedFormat) : null;

    $result = [
        'pscid'     => $candidateData['PSCID'],
        'candID'    => $candID->__toString(),
        'dod'       => $dod,
        'dob'       => $dob,
        'dodFormat' => $config->getSetting('dodFormat'),
    ];
    return $result;
}

/**
 * Handles the fetching of candidate's diagnosis evolution.
 *
 * @return array
 */
function getDiagnosisEvolutionFields(): array
{
    $candID = new CandID($_GET['candID']);
    $db     = \NDB_Factory::singleton()->database();

    $pscid = $db->pselectOne(
        "SELECT PSCID FROM candidate
        WHERE CandID=:candID",
        ['candID' => $candID]
    );

    $candidateDiagnosisEvolution = $db->pselect(
        "SELECT 
            de.Name AS TrajectoryName,
            p.Name AS Project,
            visitLabel, 
            instrumentName,
            sourceField,
            Diagnosis,
            Confirmed,
            LastUpdate,
            OrderNumber
        FROM candidate_diagnosis_evolution_rel
        JOIN diagnosis_evolution de USING (DxEvolutionID)
        JOIN Project p USING (ProjectID)
        WHERE CandID=:candID",
        ['candID' => $candID]
    );

    $projectList = \Utility::getProjectList();

    // Get all candidate's project affiliations
    $candProjIDs = $db->pselectCol(
        "SELECT DISTINCT ProjectID 
        FROM session
        WHERE CandID=:candID",
        ['candID' => $candID]
    );

    $candProjects    = [];
    $candidate       = \Candidate::singleton($candID);
    $latestDiagnosis = [];
    $latestConfirmedDiagnosis = [];
    foreach ($candProjIDs as $projectID) {
        $candProjects[$projectID]   = $projectList[$projectID];
        $latestDiagnosis[]          = $candidate->getLatestDiagnosis(
            \ProjectID::singleton(intval($projectID)),
            false
        );
        $latestConfirmedDiagnosis[] = $candidate->getLatestDiagnosis(
            \ProjectID::singleton(intval($projectID)),
            true
        );
    }

    // remove null results and re-index
    $latestDiagnosis          = array_values(array_filter($latestDiagnosis));
    $latestConfirmedDiagnosis = array_values(
        array_filter($latestConfirmedDiagnosis)
    );

    $result = [
        'pscid'                           => $pscid,
        'candID'                          => $candID,
        'diagnosisEvolution'              => $candidateDiagnosisEvolution,
        'latestProjectDiagnosis'          => $latestDiagnosis,
        'latestConfirmedProjectDiagnosis' => $latestConfirmedDiagnosis,
        'projects'                        => $candProjects
    ];
    return $result;
}

