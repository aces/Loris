<?php declare(strict_types=1);

/**
 * Candidate parameters form handler
 *
 * Handles form update actions received from a front-end ajax call
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

$tab = $_POST['tab'] ?? '';
if ($tab === '') {
    header("HTTP/1.1 400 Bad Request");
    exit(0);
}

$user = \User::singleton();
if (($tab == 'candidateDOB')
    && (!$user->hasPermission('candidate_dob_edit'))
) {
    header("HTTP/1.1 403 Forbidden");
    exit(0);
} elseif (($tab == 'candidateDOD')
    && (!$user->hasPermission('candidate_dod_edit'))
) {
    header("HTTP/1.1 403 Forbidden");
    exit(0);
} elseif (($tab != 'candidateDOB')
    && ($tab != 'candidateDOD')
    && !$user->hasPermission('candidate_parameter_edit')
) {
    header("HTTP/1.1 403 Forbidden");
    exit(0);
}

$db = \NDB_Factory::singleton()->database();

switch ($tab) {
case 'candidateInfo':
    editCandInfoFields($db);
    break;

case 'probandInfo':
    editProbandInfoFields($db);
    break;

case 'familyInfo':
    editFamilyInfoFields($db);
    break;

case 'deleteFamilyMember':
    deleteFamilyMember($db);
    break;

case 'participantStatus':
    editParticipantStatusFields($db);
    break;

case 'consentStatus':
    editConsentStatusFields($db);
    break;

case 'candidateDOB':
    editCandidateDOB($db);
    break;

case 'candidateDOD':
    editCandidateDOD($db);
    break;

default:
    header("HTTP/1.1 404 Not Found");
    exit(0);
}

/**
 * Handles the updating of Candidate Info
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editCandInfoFields(\Database $db)
{

    $candID = $_POST['candID'];

    // Process posted data
    $caveatEmptor = isset($_POST['flaggedCaveatemptor']) ?
        $_POST['flaggedCaveatemptor'] : null;
    $reason       = isset($_POST['flaggedReason']) ?
        $_POST['flaggedReason'] : null;
    $other        = null;

    $options = $db->pselect("SELECT ID, Description FROM caveat_options", []);
    foreach ($options as $row) {
        if ($row['Description'] === "Other" && $row['ID'] === $reason) {
            if (isset($_POST['flaggedOther'])) {
                $other = $_POST['flaggedOther'];
            }
        };
    }

    $updateValues = [
        'flagged_caveatemptor' => $caveatEmptor,
        'flagged_reason'       => $reason,
        'flagged_other'        => $other,
    ];

    $db->update('candidate', $updateValues, ['CandID' => $candID]);
    $candidateID = $db->pselectOne(
        "SELECT ID FROM candidate WHERE CandID=:candID",
        ['candID' => $candID]
    );
    foreach (array_keys($_POST ?? []) as $field) {
        if (!empty($_POST[$field])) {
            if (substr($field, 0, 4) === 'PTID') {
                $ptid = substr($field, 4);

                $updateValues = [
                    'ParameterTypeID' => $ptid,
                    'CandidateID'     => $candidateID,
                    'Value'           => $_POST[$field],
                    'InsertTime'      => time(),
                ];

                $result = $db->pselectOne(
                    'SELECT * FROM parameter_candidate
                    WHERE CandidateID=:cid
                    AND ParameterTypeID=:ptid',
                    [
                        'cid'  => $candidateID,
                        'ptid' => $ptid,
                    ]
                );

                if (empty($result)) {
                    $db->insert('parameter_candidate', $updateValues);
                } else {
                    $db->update(
                        'parameter_candidate',
                        $updateValues,
                        [
                            'CandidateID'     => $candidateID,
                            'ParameterTypeID' => $ptid,
                        ]
                    );
                }
            }
        }
    }
}

/**
 * Handles the updating of Proband Info
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editProbandInfoFields(\Database $db)
{
    //Sanitizing the post data
    $sanitize = array_map('htmlentities', $_POST);
    $candID   = $sanitize['candID'];

    // Process posted data
    $sex = $sanitize['ProbandSex'] ?? null;
    $dob = $sanitize['ProbandDoB'] ?? null;

    $updateValues = [
        'ProbandSex' => $sex,
        'ProbandDoB' => $dob,
    ];

    $db->update('candidate', $updateValues, ['CandID' => $candID]);
    $candidateID = $db->pselectOne(
        "SELECT ID FROM candidate WHERE CandID=:candID",
        ['candID' => $candID]
    );
    foreach (array_keys($sanitize) as $field) {
        if (!empty($sanitize[$field])) {
            if (substr($field, 0, 4) === 'PTID') {
                $ptid = substr($field, 4);

                $updateValues = [
                    'ParameterTypeID' => $ptid,
                    'CandidateID'     => $candidateID,
                    'Value'           => $_POST[$field],
                    'InsertTime'      => time(),
                ];

                $result = $db->pselectOne(
                    'SELECT CandidateID from parameter_candidate
                    WHERE CandidateID=:cid
                    AND ParameterTypeID=:ptid',
                    [
                        'cid'  => $candidateID,
                        'ptid' => $ptid,
                    ]
                );

                if (empty($result)) {
                    $db->insert('parameter_candidate', $updateValues);
                } else {
                    $db->update(
                        'parameter_candidate',
                        $updateValues,
                        [
                            'CandidateID'     => $candidateID,
                            'ParameterTypeID' => $ptid,
                        ]
                    );
                }
            }
        }
    }

}

/**
 * Handles the updating of Family Info
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editFamilyInfoFields(\Database $db)
{
    $candID = $_POST['candID'];

    // Process posted data
    $siblingCandID = isset($_POST['FamilyCandID']) ?
        $_POST['FamilyCandID'] : null;
    $relationship  = isset($_POST['Relationship_type']) ?
        $_POST['Relationship_type'] : null;

    $familyID = $db->pselectOne(
        "SELECT FamilyID from family f
                JOIN candidate c ON c.ID=f.CandidateID
                WHERE c.CandID=:candid",
        ['candid' => $candID]
    );

    // Add new candidate
    if ($siblingCandID != null) {
        $siblingCandidateID = $db->pselectOne(
            "SELECT ID FROM candidate WHERE CandID=:candID",
            ['candID' => $siblingCandID]
        );
        $updateValues       = [
            'CandidateID'       => $siblingCandidateID,
            'Relationship_type' => $relationship,
            'FamilyID'          => $familyID,
        ];

        if ($familyID != null) {

            $siblingID = $db->pselectOne(
                "SELECT ID FROM family
                    WHERE CandidateID=:candid and FamilyID=:familyid",
                [
                    'candid'   => $siblingCandidateID,
                    'familyid' => $familyID,
                ]
            );

            if ($siblingID == null) {
                $db->insert('family', $updateValues);
            } else {
                $db->update('family', $updateValues, ['ID' => $siblingID]);
            }
        } else {
            $familyID    = $db->pselectOneInt(
                "SELECT max(FamilyID) from family",
                []
            );
            $newFamilyID = $familyID + 1;

            $updateValues['FamilyID'] = $newFamilyID;
            $db->insert('family', $updateValues);

            $updateValues['Candidate'] = $candID;
            $db->insert('family', $updateValues);
        }
    }

    // Update existing candidates
    $i            = 1;
    $familyCandID = 'FamilyCandID' . $i;
    $relationshipType = 'Relationship_type' . $i;
    $siblingCandID    = isset($_POST[$familyCandID]) ?
        $_POST[$familyCandID] : null;
    $relationship     = isset($_POST[$relationshipType]) ?
        $_POST[$relationshipType] : null;

    if ($siblingCandID != null ) {
        $siblingCandidateID = $db->pselectOne(
            "SELECT ID FROM candidate WHERE CandID=:candID",
            ['candID' => $siblingCandID]
        );
        $siblingID          = $db->pselectOne(
            "SELECT ID from family WHERE CandidateID=:candid and FamilyID=:familyid",
            [
                'candid'   => $siblingCandidateID,
                'familyid' => $familyID,
            ]
        );

        $updateValues = [
            'CandidateID'       => $siblingCandidateID,
            'Relationship_type' => $relationship,
            'FamilyID'          => $familyID,
        ];

        $db->update('family', $updateValues, ['ID' => $siblingID]);
    }
}

/**
 * Handles the deletion of a family member
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function deleteFamilyMember(\Database $db)
{
    $candID         = $_POST['candID'];
    $familyMemberID = $_POST['familyDCCID'];

    // TODO: What is this?

    $familyID = $db->pselectOne(
        'SELECT FamilyID
        FROM family f
        JOIN candidate c ON c.ID=f.CandidateID
        WHERE c.CandID=:cid',
        ['cid' => $candID]
    );

    $where = [
        'FamilyID'  => $familyID,
        'Candidate' => $familyMemberID,
    ];

    $db->delete('family', $where);

}

/**
 * Handles the updating of Participant Status
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editParticipantStatusFields(\Database $db)
{
    $candID = $_POST['candID'];

    // Process posted data
    $status    = isset($_POST['participantStatus']) ?
        $_POST['participantStatus'] : null;
    $suboption = isset($_POST['participantSuboptions']) ?
        $_POST['participantSuboptions'] : null;
    $reason    = isset($_POST['reasonSpecify']) ?
        $_POST['reasonSpecify'] : null;

    $id = null;
    if (!(is_null($_SESSION['State']))) {
        $currentUser =& User::singleton($_SESSION['State']->getUsername());
        $id          = $currentUser->getUsername();
    }

    $candidateID = $db->pselectOne(
        "SELECT ID FROM candidate WHERE CandID=:candID",
        ['candID' => $candID]
    );

    $updateValues = [
        'participant_status'     => $status,
        'participant_suboptions' => $suboption,
        'reason_specify'         => $reason,
        'CandidateID'            => $candidateID,
        'entry_staff'            => $id,
    ];

    $exists = $db->pselectOne(
        "SELECT * from participant_status WHERE CandidateID=:candid",
        ['candid' => $candidateID]
    );

    if ($exists === null || empty($exists)) {
        $db->insert('participant_status', $updateValues);
    } else {
        $db->update(
            'participant_status',
            $updateValues,
            ['CandidateID' => $candidateID]
        );
    }

    $db->insert('participant_status_history', $updateValues);
}

/**
 * Handles the updating of Consent Status
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editConsentStatusFields(\Database $db)
{
    // Get CandID
    $candIDParam = $_POST['candID'];
    if (!isset($candIDParam) || $candIDParam === 'null') {
        http_response_code(400);
        die(json_encode(["error" => "You must supply a CandID."]));
    }
    $candID      = new CandID($candIDParam);
    $candidate   = \Candidate::singleton($candID);
    $currentUser = \User::singleton();
    $uid         = $currentUser->getUsername();

    // Get PSCID
    $pscid = $candidate->getPSCID();

    // Get list of all consent types
    $consentDetails = \Utility::getConsentList();
    // Get list of consents for candidate
    $candidateConsent = $candidate->getConsents();

    foreach ($consentDetails as $consentID=>$consent) {
        $consentName  = $consent['Name'];
        $consentLabel = $consent['Label'];

        // Process posted data
        // Empty strings and type null are not passed (null is passed as a string)
        $status     = (isset($_POST[$consentName]) &&
                          $_POST[$consentName] !== 'null') ?
                          $_POST[$consentName] : null;
        $date       = (isset($_POST[$consentName . '_date']) &&
                          $_POST[$consentName . '_date'] !== 'null') ?
                          $_POST[$consentName . '_date'] : null;
        $withdrawal = (isset($_POST[$consentName . '_withdrawal']) &&
                          $_POST[$consentName . '_withdrawal'] !== 'null') ?
                          $_POST[$consentName . '_withdrawal'] : null;

        $updateStatus  = [
            'CandidateID'   => $candidate->candidateInfo['ID'],
            'ConsentID'     => $consentID,
            'Status'        => $status,
            'DateGiven'     => $date,
            'DateWithdrawn' => $withdrawal,
        ];
        $updateHistory = [
            'PSCID'         => $pscid,
            'ConsentName'   => $consentName,
            'ConsentLabel'  => $consentLabel,
            'Status'        => $status,
            'DateGiven'     => $date,
            'DateWithdrawn' => $withdrawal,
            'EntryStaff'    => $uid,
        ];

        // Validate data
        $recordExists  = array_key_exists($consentID, $candidateConsent);
        $oldStatus     = $candidateConsent[$consentID]['Status'] ?? null;
        $oldDate       = $candidateConsent[$consentID]['DateGiven'] ?? null;
        $oldWithdrawal = $candidateConsent[$consentID]['DateWithdrawn'] ?? null;
        $validated     = false;

        switch ($status) {
        case 'yes':
            // Giving "yes" status requires consent date and empty withdrawal date
            if (!empty($date) && empty($withdrawal)) {
                $validated = true;
            } else {
                http_response_code(400);
                echo('Data failed validation. Resolve errors and try again.');
                return;
            }
            break;
        case 'no':
            // Giving 'no' status requires consent date and empty withdrawal date if
            // record does not already exist
            if (!$recordExists) {
                if (!empty($date) && empty($withdrawal)) {
                    $validated = true;
                } else {
                    http_response_code(400);
                    echo('Answering no to a consent type for the first time
                          requires only the date of consent.');
                    return;
                }
            } else { // If no status stays no or record existed as NULL
                    // consent date required and withdrawal date unchanged
                if (($oldStatus === null || $oldStatus === 'no') && !empty($date)
                    && ((empty($oldWithdrawal) && empty($withdrawal))
                    || (!empty($oldWithdrawal) && !empty($withdrawal)))
                ) {
                    $validated = true;
                } else if ($oldStatus === 'yes' && !empty($date)
                    && !empty($withdrawal)
                ) { // Withdrawing from 'yes' status required consent date
                    // and withdrawal date
                    $validated = true;
                } else if ($oldStatus === 'not_applicable' && !empty($date)
                    && empty($withdrawal)
                ) { // Add N/A option
                    $validated = true;
                } else {
                    http_response_code(400);
                    echo('Data failed validation. Resolve errors and try again.');
                    return;
                }
            }
            break;
        case 'not_applicable':
            // If status is N/A, date is not required.
            if (empty($date) && empty($withdrawal)
                && ($oldStatus !== 'yes' || $oldStatus !== 'no')
            ) {
                $validated = true;
            } else {
                http_response_code(400);
                echo('Answering not applicable to a consent type
                      does not require a date of consent.');
                return;
            }
            break;
        default:
            // If status is empty, and date fields are also empty,
            // validated is still false
            // If status is empty but at least one of the date fields
            // are filled, throw an error
            if (!empty($date) || !empty($withdrawal)) {
                http_response_code(400);
                echo('A status is missing for at least one consent type.
                      Please select a valid status for all consent types.');
                return;
            } elseif (!empty($oldStatus)
                || !empty($oldDate)
                || !empty($oldWithdrawal)
            ) {
                // Only update empty fields if they were not already empty
                $validated = true;
            }

            break;
        }

        // Submit data
        if ($validated) {
            if ($recordExists) {
                $db->update(
                    'candidate_consent_rel',
                    $updateStatus,
                    [
                        'CandidateID' => $candidate->candidateInfo['ID'],
                        'ConsentID'   => $consentID,
                    ]
                );
            } else {
                $db->insert('candidate_consent_rel', $updateStatus);
            }
            $db->insert('candidate_consent_history', $updateHistory);
        }
    }
}

/**
 * Handles the updating of candidate's date of birth.
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editCandidateDOB(\Database $db): void
{
    $candID       = new CandID($_POST['candID']);
    $dob          = $_POST['dob'];
    $strippedDate = null;
    if (!empty($dob)) {
        $config    = \NDB_Config::singleton();
        $dobFormat = $config->getSetting('dobFormat');
        if ($dobFormat === 'Ym') {
            $strippedDate = date("Y-m", strtotime($dob))."-01";
        }
        $db->update(
            'candidate',
            ['DoB' => $strippedDate ?? $dob],
            ['ID' => $candID->__toString()]
        );
    }
}

/**
 * Handles the updating of candidate's date of death.
 *
 * @param Database $db database object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editCandidateDOD(\Database $db): void
{
    $candID       = new CandID($_POST['candID']);
    $dod          = new DateTime($_POST['dod']);
    $strippedDate = null;
    $dodString    = null;

    if (!$dod) {
        throw new \LorisException('Date not valid.');
    }

    if (!empty($dod)) {
        $config    = \NDB_Config::singleton();
        $dodFormat = $config->getSetting('dodFormat');
        if ($dodFormat === 'Ym') {
            $strippedDate = $dod->format('Y-m-01');
        } else {
            $dodString = $dod->format('Y-m-d');
        }
        $db->update(
            'candidate',
            ['DoD' => $strippedDate ?? $dodString],
            ['ID' => $candID->__toString()]
        );
    }
}
