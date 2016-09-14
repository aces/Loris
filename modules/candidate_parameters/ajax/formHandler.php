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
    if ($tab == "candidateInfo") {
        editCandInfoFields();
    } else if ($tab == "probandInfo") {
        editProbandInfoFields();
    } else if ($tab == "familyInfo") {
        editFamilyInfoFields();
    } else if ($tab == "deleteFamilyMember") {
        deleteFamilyMember();
    } else if ($tab == "participantStatus") {
        editParticipantStatusFields();
    } else if ($tab == "consentStatus") {
        editConsentStatusFields();
    } else {
        header("HTTP/1.1 404 Not Found");
        exit;
    }
}

$db   =& Database::singleton();
$user =& User::singleton();

/**
 * Handles the updating of Candidate Info
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editCandInfoFields()
{
    if (!$this->user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID = $_POST['candID'];

    // Process posted data
    $caveatEmptor = isset($_POST['flagged_caveatemptor']) ?
        $_POST['flagged_caveatemptor'] : null;
    $reason       = isset($_POST['flagged_reason']) ?
        $_POST['flagged_reason'] : null;
    $other        = isset($_POST['flagged_other']) ?
        $_POST['flagged_other'] : null;

    $updateValues = [
                     'flagged_caveatemptor' => $caveatEmptor,
                     'flagged_reason'       => $reason,
                     'flagged_other'        => $other,
                    ];

    $this->db->update('candidate', $updateValues, ['CandID' => $candID]);

    foreach (array_keys($_POST) as $field) {
        if (!empty($_POST[$field])) {
            if (substr($field, 0, 4) === 'PTID') {
                $ptid = substr($field, 4);

                $updateValues = [
                                 'ParameterTypeID' => $ptid,
                                 'CandID'          => $candID,
                                 'Value'           => $_POST[$field],
                                 'InsertTime'      => time(),
                                ];

                $result = $this->db->pselectOne(
                    'SELECT * from parameter_candidate 
                    WHERE CandID=:cid 
                    AND ParameterTypeID=:ptid',
                    array(
                     'cid'  => $candID,
                     'ptid' => $ptid,
                    )
                );

                if (empty($result)) {
                    $this->db->insert('parameter_candidate', $updateValues);
                } else {
                    $this->db->update(
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
 * @throws DatabaseException
 *
 * @return void
 */
function editProbandInfoFields()
{
    if (!$this->user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID = $_POST['candID'];

    // Process posted data
    $gender = isset($_POST['ProbandGender']) ? $_POST['ProbandGender'] : null;
    $dob    = isset($_POST['ProbandDoB']) ? $_POST['ProbandDoB'] : null;

    $updateValues = [
                     'ProbandGender' => $gender,
                     'ProbandDoB'    => $dob,
                    ];

    $this->db->update('candidate', $updateValues, ['CandID' => $candID]);
}

/**
 * Handles the updating of Family Info
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editFamilyInfoFields()
{
    if (!$this->user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID = $_POST['candID'];

    // Process posted data
    $siblingCandID = isset($_POST['FamilyCandID']) ?
        $_POST['FamilyCandID'] : null;
    $relationship  = isset($_POST['Relationship_type']) ?
        $_POST['Relationship_type'] : null;

    $familyID = $this->db->pselectOne(
        "SELECT FamilyID from family WHERE CandID=:candid",
        array('candid' => $candID)
    );

    // Add new candidate
    if ($siblingCandID != null) {

        $updateValues = [
                         'CandID'            => $siblingCandID,
                         'Relationship_type' => $relationship,
                         'FamilyID'          => $familyID,
                        ];

        if ($familyID != null) {

            $siblingID = $this->db->pselectOne(
                "SELECT ID from family WHERE CandID=:candid and FamilyID=:familyid",
                array(
                 'candid'   => $siblingCandID,
                 'familyid' => $familyID,
                )
            );

            if ($siblingID == null) {
                $this->db->insert('family', $updateValues);
            } else {
                $this->db->update('family', $updateValues, ['ID' => $siblingID]);
            }
        } else {
            $familyID    = $this->db->pselectOne(
                "SELECT max(FamilyID) from family",
                array()
            );
            $newFamilyID = $familyID + 1;

            $updateValues['FamilyID'] = $newFamilyID;
            $this->db->insert('family', $updateValues);

            $updateValues['CandID'] = $candID;
            $this->db->insert('family', $updateValues);
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

        $siblingID = $this->db->pselectOne(
            "SELECT ID from family WHERE CandID=:candid and FamilyID=:familyid",
            array(
             'candid'   => $siblingCandID,
             'familyid' => $familyID,
            )
        );

        $updateValues = [
                         'CandID'            => $siblingCandID,
                         'Relationship_type' => $relationship,
                         'FamilyID'          => $familyID,
                        ];

        $this->db->update('family', $updateValues, ['ID' => $siblingID]);

        $i++;
    }
}

/**
 * Handles the deletion of a family member
 *
 * @throws DatabaseException
 *
 * @return void
 */
function deleteFamilyMember()
{
    if (!$this->user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID         = $_POST['candID'];
    $familyMemberID = $_POST['familyDCCID'];

    $familyID = $this->db->pselectOne(
        'SELECT FamilyID 
        FROM family 
        WHERE CandID=:cid',
        array('cid' => $candID)
    );

    $where = [
              'FamilyID' => $familyID,
              'CandID'   => $familyMemberID,
             ];

    $this->db->delete('family', $where);

}

/**
 * Handles the updating of Participant Status
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editParticipantStatusFields()
{
    if (!$this->user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID = $_POST['candID'];

    // Process posted data
    $status    = isset($_POST['participant_status']) ?
        $_POST['participant_status'] : null;
    $suboption = isset($_POST['participant_suboptions']) ?
        $_POST['participant_suboptions'] : null;
    $reason    = isset($_POST['reason_specify']) ?
        $_POST['reason_specify'] : null;

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

    $exists = $this->db->pselectOne(
        "SELECT * from participant_status WHERE CandID=:candid",
        array('candid' => $candID)
    );

    if ($exists === null) {
        $this->db->insert('participant_status', $updateValues);
    } else {
        $this->db->update('participant_status', $updateValues, ['CandID' => $candID]);
    }

    $this->db->insert('participant_status_history', $updateValues);
}

/**
 * Handles the updating of Consent Status
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editConsentStatusFields()
{
    if (!$this->user->hasPermission('candidate_parameter_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $candID = $_POST['candID'];

    $id = null;
    if (!(is_null($_SESSION['State']))) {
        $currentUser =& User::singleton($_SESSION['State']->getUsername());
        $id          = $currentUser->getData("UserID");
    }

    $config  =& NDB_Config::singleton();
    $consent = $config->getSetting('ConsentModule');

    foreach (Utility::asArray($consent['Consent']) as $consentType) {
        $toUpdate = false;

        // Process posted data
        $consent    = isset($_POST[$consentType['name']]) ?
            $_POST[$consentType['name']] : null;
        $date       = isset($_POST[$consentType['name'] . '_date']) ?
            $_POST[$consentType['name'] . '_date'] : null;
        $withdrawal = isset($_POST[$consentType['name'] . '_withdrawal']) ?
            $_POST[$consentType['name'] . '_withdrawal'] : null;

        $updateValues = [
                         'CandID'      => $candID,
                         'entry_staff' => $id,
                        ];

        if ($consent != null) {
            $updateValues[$consentType['name']] = $consent;
            $toUpdate = true;
        }
        if ($date != null) {
            $updateValues[$consentType['name' . '_date']] = $date;
            $toUpdate = true;
        }
        if ($withdrawal != null) {
            $updateValues[$consentType['name' . '_withdrawal']] = $withdrawal;
            $toUpdate = true;
        }

        if ($toUpdate) {

            $exists = $this->db->pselectOne(
                "SELECT * from participant_status WHERE CandID=:candid",
                array('candid' => $candID)
            );

            if ($exists === null) {
                $this->db->insert('participant_status', $updateValues);
            } else {
                $this->db->update(
                    'participant_status',
                    $updateValues,
                    array('CandID' => $candID)
                );
            }

            $this->db->insert('consent_info_history', $updateValues);
        }
    }
}