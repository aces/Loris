<?php declare(strict_types=1);

/**
 * Candidate parameters data fetch
 *
 * Gets data to populate the front-end form fields
 *
 * PHP Version 8
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
    exit(0);
}

$data = $_GET['data'] ?? '';
if ($data == '') {
    header("HTTP/1.1 400 Bad Request");
    exit(0);
}

switch ($data) {
case 'candidateInfo':
    echo json_encode(getCandInfoFields());
    exit(0);
case 'probandInfo':
    echo json_encode(getProbandInfoFields());
    exit(0);
case 'familyInfo':
    echo json_encode(getFamilyInfoFields());
    exit(0);
case 'participantStatus':
    echo json_encode(getParticipantStatusFields());
    exit(0);
case 'consentStatus':
    echo json_encode(getConsentStatusFields());
    exit(0);
case 'candidateDOB':
    echo json_encode(getDOBFields());
    exit(0);
case 'candidateDOD':
    echo json_encode(getDODFields());
    exit(0);
case 'diagnosisEvolution':
    echo json_encode(getDiagnosisEvolutionFields());
    exit(0);
default:
    header("HTTP/1.1 404 Not Found");
    exit(0);
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
        FROM parameter_candidate pc
        JOIN candidate c ON c.ID=pc.CandidateID
        WHERE c.CandID=:cid",
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
        'SELECT PSCID FROM candidate WHERE CandID = :candid',
        ['candid' => $candID]
    );

    $sex = $db->pselectOne(
        'SELECT ProbandSex FROM candidate WHERE CandID = :candid',
        ['candid' => $candID]
    );

    $dob = $db->pselectOne(
        'SELECT ProbandDoB FROM candidate WHERE CandID = :candid',
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
        FROM parameter_candidate pc
        JOIN candidate c ON c.ID=pc.CandidateID
        WHERE c.CandID=:cid",
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
        'SELECT PSCID FROM candidate WHERE CandID = :candid',
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
            "SELECT c1.CandID
                FROM family f1
                JOIN family f2 ON f1.FamilyID=f2.FamilyID
                JOIN candidate c1 ON f1.CandidateID=c1.ID
                JOIN candidate c2 ON f2.CandidateID=c2.ID
                WHERE c2.CandID=:candid
                GROUP BY c1.CandID",
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
            if (new CandID(strval($ID)) === $candID
                || in_array($ID, $siblings, true)
            ) {
                unset($candidatesList[$key]);
            } else {
                $candidates[$ID] = $ID;
            }
        }
    }

    $familyMembers = $db->pselect(
        "SELECT c1.CandID as FamilyCandidate, f1.Relationship_type
        FROM family f1
        JOIN family f2 ON f1.FamilyID=f2.FamilyID
        JOIN candidate c1 ON f1.CandidateID=c1.ID
        JOIN candidate c2 ON f2.CandidateID=c2.ID
        WHERE c2.CandID=:candid AND c1.CandID <> :candid2
        ORDER BY c1.CandID",
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
        'SELECT PSCID FROM candidate WHERE CandID = :candid',
        ['candid' => $candID]
    );

    $statusOptions = \Candidate::getParticipantStatusOptions();
    $reasonOptions = [];

    $req      = $db->pselect(
        'SELECT ID, Required, commentRequired from participant_status_options
        WHERE Required=1 OR commentRequired=1',
        []
    );
    $required = [];
    $commentRequired = [];
    foreach ($req as $_=>$row) {
        if ($row['Required'] == 1) {
            $required[] = $row['ID'];
        }
        if ($row['commentRequired'] == 1) {
            $commentRequired[] = $row['ID'];
        }
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

    $query = "SELECT participant_status, participant_suboptions, reason_specify
        FROM participant_status ps
        JOIN candidate c ON c.ID=ps.CandidateID
        WHERE c.CandID=:cid";
    $row   = $db->pselectRow($query, ['cid' => $candID]);

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
        'commentRequired'       => $commentRequired,
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
            FROM participant_status_history psh
            JOIN candidate c ON c.ID=psh.CandidateID
            WHERE c.CandID=:cid",
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

    foreach ($consentDetails as $consentID=>$consent) {
        $consentName = $consent['Name'];
        $consentList[$consentName] = $consent['Label'];
        $groupID = $consent['ConsentGroupID'];

        // Append consent as a child to its group
        $consentGroups[$groupID]['Children'][] = $consentName;

        if (isset($candidateConsent[$consentID])) {
            $candidateConsentID           = $candidateConsent[$consentID];
            $status[$consentName]         = $candidateConsentID['Status'];
            $date[$consentName]           = $candidateConsentID['DateGiven'];
            $withdrawalDate[$consentName] = $candidateConsentID['DateWithdrawn'];
        } else {
            $status[$consentName]         = null;
            $date[$consentName]           = null;
            $withdrawalDate[$consentName] = null;
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

    $historyData = $db->pselect(
        "SELECT EntryDate, DateGiven, DateWithdrawn, PSCID,
         ConsentName, ConsentLabel, Status, EntryStaff
         FROM candidate_consent_history
         WHERE PSCID=:pscid
         ORDER BY EntryDate ASC",
        ['pscid' => $pscid]
    );

    $formattedHistory = [];
    foreach ($historyData as $entry) {
          $formattedHistory[] = [
              'data_entry_date' => $entry['EntryDate'],
              'entry_staff'     => $entry['EntryStaff'],
              'consentStatus'   => $entry['Status'],
              'date'            => $entry['DateGiven'],
              'withdrawal'      => $entry['DateWithdrawn'],
              'label'           => $entry['ConsentLabel'],
              'consentType'     => $entry['ConsentName'],
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
    $dodDate            = DateTime::createFromFormat(
        'Y-m-d',
        $candidateData['DoD'] ?? ''
    );
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

    $candidateDiagnosisEvolution = iterator_to_array(
        $db->pselect(
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
            FROM candidate_diagnosis_evolution_rel cder
            JOIN diagnosis_evolution de USING (DxEvolutionID)
            JOIN Project p USING (ProjectID)
            JOIN candidate c ON c.ID=cder.CandidateID
            WHERE c.CandID=:candID",
            ['candID' => $candID]
        )
    );

    $projectList = \Utility::getProjectList();

    // Get all candidate's project affiliations
    $candProjIDs = $db->pselectCol(
        "SELECT DISTINCT ProjectID
        FROM session s
        JOIN candidate c on c.ID=s.CandidateID
        WHERE c.CandID=:candID",
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

