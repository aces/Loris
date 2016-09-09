<?php

if (isset($_GET['data'])) {
    $data = $_GET['data'];
    if ($data == "candidateInfo") {
        echo json_encode(getCandInfoFields());
    }
    else if ($data == "probandInfo") {
        echo json_encode(getProbandInfoFields());
    }
    else if ($data == "familyInfo") {
        echo json_encode(getFamilyInfoFields());
    }
    else if ($data == "participantStatus") {
        echo json_encode(getParticipantStatusFields());
    }
    else if ($data == "consentStatus") {
        echo json_encode(getConsentStatusFields());
    }
    else {
        header("HTTP/1.1 404 Not Found");
        exit;
    }
}

function getCandInfoFields() {
    $candID = $_GET['candID'];

    $db =& Database::singleton();

    // get caveat options
    $caveat_options = [];
    $options = $db->pselect(
        "SELECT ID, Description FROM caveat_options",
        array()
    );
    foreach($options as $row) {
        $caveat_options[$row['ID']] = $row['Description'];
    }

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate WHERE CandID = :candid',
        array('candid' => $candID)
    );

    $flag = $db->pselectOne(
        'SELECT flagged_caveatemptor FROM candidate WHERE CandID = :candid',
        array('candid' => $candID)
    );

    $reason = $db->pselectOne(
        'SELECT flagged_reason FROM candidate WHERE CandID = :candid',
        array('candid' => $candID)
    );

    $other = $db->pselectOne(
        'SELECT flagged_other FROM candidate WHERE CandID = :candid',
        array('candid' => $candID)
    );

    $extra_parameters = $db->pselect("SELECT pt.ParameterTypeID, pt.Name, pt.Type, pt.Description 
                     FROM parameter_type pt
                     JOIN parameter_type_category_rel ptcr USING (ParameterTypeID) 
                     JOIN parameter_type_category ptc USING (ParameterTypeCategoryID)
                     WHERE ptc.Name='Candidate Parameters'
                     ORDER BY pt.ParameterTypeID, pt.name ASC",
        array()
    );

    $fields = $db->pselect(
        "SELECT ParameterTypeID, Value FROM parameter_candidate WHERE CandID=:cid",
        array('cid' => $candID)
    );

    $parameter_values = [];
    foreach ($fields as $row) {
        $parameter_values[$row['ParameterTypeID']] = $row['Value'];
    }

    $result = [
        'pscid' => $pscid,
        'candID' => $candID,
        'caveatReasonOptions' => $caveat_options,
        'flagged_caveatemptor' => $flag,
        'flagged_reason' => $reason,
        'flagged_other' => $other,
        'extra_parameters' => $extra_parameters,
        'parameter_values' => $parameter_values
    ];

    return $result;
}

function getProbandInfoFields() {
    $candID = $_GET['candID'];

    $db =& Database::singleton();

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate where CandID = :candid',
        array('candid' => $candID)
    );

    $gender = $db->pselectOne(
        'SELECT ProbandGender FROM candidate where CandID = :candid',
        array('candid' => $candID)
    );

    $dob = $db->pselectOne(
        'SELECT ProbandDoB FROM candidate where CandID = :candid',
        array('candid' => $candID)
    );

    // Calculate age difference
    $ageDifference = "Could not calculate age";
    $candidateDOB = $db->pselectOne(
        "SELECT DoB FROM candidate WHERE CandID=:CandidateID",
        array('CandidateID' => $candID));
    if (!empty($candidateDOB) && !empty($dob)) {
        $age = Utility::calculateAge($dob, $candidateDOB);

        if ($age !== null) {
            $ageDifference = $age['year'] * 12 + $age['mon'] + round($age['day'] / 30, 2);
        }
    }

    $result = [
        'pscid' => $pscid,
        'candID' => $candID,
        'ProbandGender' => $gender,
        'ProbandDoB' => $dob,
        'ageDifference' => $ageDifference
    ];

    return $result;
}

function getFamilyInfoFields() {
    $candID = $_GET['candID'];

    $db =& Database::singleton();

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate where CandID = :candid',
        array('candid' => $candID)
    );

    $candidatesList  = $db->pselect(
        "SELECT CandID FROM candidate ORDER BY CandID",
        array()
    );

    $siblingsList = $db->pselect(
        "SELECT CandID FROM family WHERE FamilyID=(SELECT FamilyID FROM family WHERE CandID=:candid)",
        array('candid' => $candID)
    );

    $siblings = array();
    foreach ($siblingsList as $key => $siblingArray) {
        foreach ($siblingArray as $ID) {
            array_push($siblings, $ID);
        }
    }

    $candidates = array();
    // Remove own ID and sibling IDs from list of possible family members
    foreach ($candidatesList as $key => $candidate) {
        foreach ($candidate as $ID) {
            if ($ID == $candID || in_array($ID, $siblings)) {
                unset($candidatesList[$key]);
            }
            else {
                $candidates[$ID] = $ID;
            }
        }
    }

    $familyCandIDs = $db->pselect(
        "SELECT CandID FROM family WHERE FamilyID=(SELECT FamilyID FROM family WHERE CandID = :candid) AND CandID <> :candid2 ORDER BY CandID",
        array('candid' => $candID, 'candid2' => $candID)
    );

    $relationships = $db->pselect(
        "SELECT Relationship_type FROM family WHERE FamilyID=(SELECT FamilyID FROM family WHERE CandID = :candid) AND CandID <> :candid2 ORDER BY CandID",
        array('candid' => $candID, 'candid2' => $candID)
    );

    $result = [
        'pscid' => $pscid,
        'candID' => $candID,
        'candidates' => $candidates,
        'familyCandIDs' => $familyCandIDs,
        'Relationship_types' => $relationships
    ];

    return $result;
}

function getParticipantStatusFields() {
    include_once __DIR__
        . "/../../candidate_parameters/php/"
        . "NDB_Form_candidate_parameters.class.inc";

    $candID = $_GET['candID'];

    $db =& Database::singleton();

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate where CandID = :candid',
        array('candid' => $candID)
    );

    $statusOptions = NDB_Form_candidate_parameters::getParticipantStatusOptions();
    $reasonOptions = array();

    $required = $db->pselect('SELECT ID from participant_status_options where Required=1', array());
    $parentIDs = $db->pselect('SELECT distinct(parentID) from participant_status_options', array());
    $parentIDMap = array();

    foreach ($parentIDs as $ID) {
        $reasonOptions = array();
        foreach ($ID as $parentID) {
            if ($parentID != null) {
                $options = $db->pselect(
                    "SELECT ID, Description FROM participant_status_options WHERE parentID=:pid",
                    array('pid' => $parentID)
                );
                foreach ($options as $option) {
                    $reasonOptions[$option['ID']] = $option['Description'];
                }
                $parentIDMap[$parentID] = $reasonOptions;
            }
        }
    }

    $status = $db->pselectOne("SELECT participant_status FROM participant_status WHERE CandID=:candid", array('candid' => $candID));
    $suboption = $db->pselectOne("SELECT participant_suboptions FROM participant_status WHERE CandID=:candid", array('candid' => $candID));
    $reason = $db->pselectOne("SELECT reason_specify FROM participant_status WHERE CandID=:candid", array('candid' => $candID));

    $history = getParticipantStatusHistory($candID);

    $result = [
        'pscid' => $pscid,
        'candID' => $candID,
        'statusOptions' => $statusOptions,
        'required' => $required,
        'reasonOptions' => $reasonOptions,
        'parentIDs' => $parentIDMap,
        'participant_status' => $status,
        'participant_suboptions' => $suboption,
        'reason_specify' => $reason,
        'history' => $history
    ];

    return $result;
}

function getParticipantStatusHistory($candID) {
    $db =& Database::singleton();
    $unformattedComments = $db->pselect(
        "SELECT (SELECT Description FROM participant_status_options pso WHERE ID=psh.participant_status) AS status, (SELECT Description from participant_status_options pso WHERE ID=psh.participant_subOptions) AS suboption, entry_staff, data_entry_date, reason_specify FROM participant_status_history psh WHERE CandID=:cid",
        array('cid' => $candID)
    );

    $commentHistory = '';
    foreach ($unformattedComments as $comment) {
        $commentString = '';
        $commentString .= '[' . $comment['data_entry_date'] . '] ';
        $commentString .= '<i>Updated by ' . $comment['entry_staff'] . '. </i>';
        $commentString .= '<b>Status:</b> ' . $comment['status'] . '.';
        if (!empty($comment['suboption'])) {
            $commentString .= ' <b>Details:</b> ' . $comment['suboption'] . '.';
        }
        if (!empty($comment['reason_specify'])) {
            $commentString .= ' <b>Comments:</b> ' . $comment['reason_specify'];
        }
        $commentHistory .= $commentString . '<br/>';
    }

    return $commentHistory;
}

function getConsentStatusFields() {
    $candID = $_GET['candID'];

    $db =& Database::singleton();

    // get pscid
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate where CandID = :candid',
        array('candid' => $candID)
    );

    $config  =& NDB_Config::singleton();
    $consent = $config->getSetting('ConsentModule');
    $consents = [];
    $consentStatus = [];
    $date = [];
    $withdrawal = [];
    foreach (Utility::asArray($consent['Consent']) as $consentType) {
        $consents[$consentType['name']] = $consentType['label'];
        $consentStatus[$consentType['name']] = $db->pselectOne('SELECT ' . $db->escape($consentType['name']) . ' FROM participant_status WHERE CandID=:candid', array('candid' => $candID));
        $date[$consentType['name']] = $db->pselectOne('SELECT ' . $db->escape($consentType['name'] . '_date') . ' FROM participant_status WHERE CandID=:candid', array('candid' => $candID));
        $withdrawal[$consentType['name']] = $db->pselectOne('SELECT ' . $db->escape($consentType['name'] . '_withdrawal') . ' FROM participant_status WHERE CandID=:candid', array('candid' => $candID));
    }

    $history = getConsentStatusHistory($candID, $consents);

    $result = [
        'pscid' => $pscid,
        'candID' => $candID,
        'consentStatuses' => $consentStatus,
        'consentDates'   => $date,
        'withdrawals'   => $withdrawal,
        'consents' => $consents,
        'history' => $history
    ];

    return $result;
}

function getConsentStatusHistory($candID, $consents) {
    $db =& Database::singleton();

    $commentHistory = '';

    foreach ($consents as $consent => $label) {
        $unformattedComments = $db->pselect(
            "SELECT entry_staff, data_entry_date, " . $db->escape($consent) . ", " . $db->escape($consent . '_date') . ", " . $db->escape($consent . '_withdrawal') ." FROM consent_info_history WHERE CandID=:cid",
            array('cid' => $candID)
        );

        foreach ($unformattedComments as $comment) {
            $commentString = '';
            $commentString .= '[' . $comment['data_entry_date'] . '] ';
            $commentString .= '<i>Updated by ' . $comment['entry_staff'] . '. </i>';
            $commentString .= "<b>$label Status:</b> " . $comment[$consent] . '.';
            if (!empty($comment[$consent . '_date'])) {
                $commentString .= ' <b>Date of Consent:</b> ' . $comment[$consent . '_date'];
            }
            if (!empty($comment[$consent . '_withdrawal'])) {
                $commentString .= '<b>Date of Withdrawal:</b> ' . $comment[$consent . '_withdrawal'];
            }
            $commentHistory .= $commentString . '<br/>';
        }
    }

    return $commentHistory;
}