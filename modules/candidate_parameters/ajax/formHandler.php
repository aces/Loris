<?php
/**
 * Candidate parameters form handler
 *
 * Handles form update actions received from a front-end ajax call
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Stella L. <slee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */
if (isset($_POST['tab'])) {
    $tab = $_POST['tab'];

    $db   =& \Database::singleton();
    $user =& \User::singleton();

    if ($tab == "candidateInfo") {
        editCandInfoFields($db, $user);
    } else if ($tab == "probandInfo") {
        editProbandInfoFields($db, $user);
    } else if ($tab == "familyInfo") {
        editFamilyInfoFields($db, $user);
    } else if ($tab == "deleteFamilyMember") {
        deleteFamilyMember($db, $user);
    } else if ($tab == "participantStatus") {
        editParticipantStatusFields($db, $user);
    } else if ($tab == "consentStatus") {
        editConsentStatusFields($db, $user);
    } else {
        header("HTTP/1.1 404 Not Found");
        exit;
    }
}



/**
 * Handles the updating of Candidate Info
 *
 * @param Database $db   database object
 * @param User     $user user object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editCandInfoFields($db, $user)
{
    if (!$user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

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

    foreach (array_keys($_POST ?? array()) as $field) {
        if (!empty($_POST[$field])) {
            if (substr($field, 0, 4) === 'PTID') {
                $ptid = substr($field, 4);

                $updateValues = [
                                 'ParameterTypeID' => $ptid,
                                 'CandID'          => $candID,
                                 'Value'           => $_POST[$field],
                                 'InsertTime'      => time(),
                                ];

                $result = $db->pselectOne(
                    'SELECT * from parameter_candidate 
                    WHERE CandID=:cid 
                    AND ParameterTypeID=:ptid',
                    [
                     'cid'  => $candID,
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
                         'CandID'          => $candID,
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
 * @param Database $db   database object
 * @param User     $user user object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editProbandInfoFields($db, $user)
{
    if (!$user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }
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
    foreach (array_keys($sanitize) as $field) {
        if (!empty($sanitize[$field])) {
            if (substr($field, 0, 4) === 'PTID') {
                $ptid = substr($field, 4);

                $updateValues = [
                                 'ParameterTypeID' => $ptid,
                                 'CandID'          => $candID,
                                 'Value'           => $_POST[$field],
                                 'InsertTime'      => time(),
                                ];

                $result = $db->pselectOne(
                    'SELECT CandID from parameter_candidate 
                    WHERE CandID=:cid 
                    AND ParameterTypeID=:ptid',
                    [
                     'cid'  => $candID,
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
                         'CandID'          => $candID,
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
 * @param Database $db   database object
 * @param User     $user user object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editFamilyInfoFields($db, $user)
{
    if (!$user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID = $_POST['candID'];

    // Process posted data
    $siblingCandID = isset($_POST['FamilyCandID']) ?
        $_POST['FamilyCandID'] : null;
    $relationship  = isset($_POST['Relationship_type']) ?
        $_POST['Relationship_type'] : null;

    $familyID = $db->pselectOne(
        "SELECT FamilyID from family WHERE CandID=:candid",
        ['candid' => $candID]
    );

    // Add new candidate
    if ($siblingCandID != null) {

        $updateValues = [
                         'CandID'            => $siblingCandID,
                         'Relationship_type' => $relationship,
                         'FamilyID'          => $familyID,
                        ];

        if ($familyID != null) {

            $siblingID = $db->pselectOne(
                "SELECT ID from family WHERE CandID=:candid and FamilyID=:familyid",
                [
                 'candid'   => $siblingCandID,
                 'familyid' => $familyID,
                ]
            );

            if ($siblingID == null) {
                $db->insert('family', $updateValues);
            } else {
                $db->update('family', $updateValues, ['ID' => $siblingID]);
            }
        } else {
            $familyID    = $db->pselectOne(
                "SELECT max(FamilyID) from family",
                []
            );
            $newFamilyID = $familyID + 1;

            $updateValues['FamilyID'] = $newFamilyID;
            $db->insert('family', $updateValues);

            $updateValues['CandID'] = $candID;
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

    while ($siblingCandID != null ) {

        $siblingID = $db->pselectOne(
            "SELECT ID from family WHERE CandID=:candid and FamilyID=:familyid",
            [
             'candid'   => $siblingCandID,
             'familyid' => $familyID,
            ]
        );

        $updateValues = [
                         'CandID'            => $siblingCandID,
                         'Relationship_type' => $relationship,
                         'FamilyID'          => $familyID,
                        ];

        $db->update('family', $updateValues, ['ID' => $siblingID]);

        $i++;
    }
}

/**
 * Handles the deletion of a family member
 *
 * @param Database $db   database object
 * @param User     $user user object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function deleteFamilyMember($db, $user)
{
    if (!$user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID         = $_POST['candID'];
    $familyMemberID = $_POST['familyDCCID'];

    $familyID = $db->pselectOne(
        'SELECT FamilyID 
        FROM family 
        WHERE CandID=:cid',
        ['cid' => $candID]
    );

    $where = [
              'FamilyID' => $familyID,
              'CandID'   => $familyMemberID,
             ];

    $db->delete('family', $where);

}

/**
 * Handles the updating of Participant Status
 *
 * @param Database $db   database object
 * @param User     $user user object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editParticipantStatusFields($db, $user)
{
    if (!$user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

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
        $id          = $currentUser->getData("UserID");
    }

    $updateValues = [
                     'participant_status'     => $status,
                     'participant_suboptions' => $suboption,
                     'reason_specify'         => $reason,
                     'CandID'                 => $candID,
                     'entry_staff'            => $id,
                    ];

    $exists = $db->pselectOne(
        "SELECT * from participant_status WHERE CandID=:candid",
        ['candid' => $candID]
    );

    if ($exists === null || empty($exists)) {
        $db->insert('participant_status', $updateValues);
    } else {
        $db->update(
            'participant_status',
            $updateValues,
            ['CandID' => $candID]
        );
    }

    $db->insert('participant_status_history', $updateValues);
}

/**
 * Handles the updating of Consent Status
 *
 * @param Database $db   database object
 * @param User     $user user object
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editConsentStatusFields($db, $user)
{
    if (!$user->hasPermission('candidate_parameter_edit')) {
        header('HTTP/1.1 403 Forbidden');
        exit;
    }

    // Get CandID
    $candIDParam = $_POST['candID'];
    $candID      = (isset($candIDParam) && $candIDParam !== 'null') ?
        $candIDParam : null;

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
        $status     = ($_POST[$consentName] !== 'null') ?
                        $_POST[$consentName] : null;
        $date       = ($_POST[$consentName . '_date'] !== 'null') ?
                        $_POST[$consentName . '_date'] : null;
        $withdrawal = ($_POST[$consentName . '_withdrawal'] !== 'null') ?
                        $_POST[$consentName . '_withdrawal'] : null;

        $updateStatus  = [
                          'CandidateID'   => $candID,
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
        $recordExists = array_key_exists($consentID, $candidateConsent);
        $oldStatus    = $candidateConsent[$consentID]['Status'] ?? null;
        $validated    = false;

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
                if (($oldStatus === null || $oldStatus === 'no') && !empty($date)
                ) {
                    $countYesStatusHistory = $db->pselectOne(
                        "SELECT COUNT(*) FROM candidate_consent_history
                        WHERE PSCID=:pscid AND ConsentName=:cn AND Status='yes'",
                        array(
                         'pscid' => $pscid,
                         'cn'    => $consentName,
                        )
                    );
                    // If consent was 'yes' at some point, withdrawal date is !empty
                    // if it was never 'yes', withdrawal date should be empty
                    // Either is valid.
                    if ((!empty($withdrawal) && $countYesStatusHistory > 0)
                        || (empty($withdrawal) && $countYesStatusHistory === 0)
                    ) {
                        $validated = true;
                    }
                } else if ($oldStatus === 'yes' && !empty($date)
                    && !empty($withdrawal)
                ) { // Withdrawing from 'yes' status required consent date
                    // and withdrawal date
                    $validated = true;
                } else {
                    http_response_code(400);
                    echo('Data failed validation. Resolve errors and try again.');
                    return;
                }
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
            }
            break;
        }

        // Submit data
        if ($validated) {
            if ($recordExists) {
                $db->update(
                    'candidate_consent_rel',
                    $updateStatus,
                    array(
                     'CandidateID' => $candID,
                     'ConsentID'   => $consentID,
                    )
                );
            } else {
                $db->insert('candidate_consent_rel', $updateStatus);
            }
            $db->insert('candidate_consent_history', $updateHistory);
        }
    }
}
