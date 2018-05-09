<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    if ($action === 'getData') {
        echo json_encode(getData());
    } elseif($action === 'getProjectData') {
        echo json_encode(getProjectData());
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}
// Gets publication and parameter_type data from database
function getData() {
    $db = Database::singleton();

    $data = array();
    $titles = $db->pselectCol(
        'SELECT Title FROM publication',
        array()
    );

    // for selecting variables of interest0
    $allVOIs = $db->pselect(
        "SELECT pt.Name, pt.SourceFrom FROM parameter_type pt ".
        "JOIN test_names tn ON tn.Test_name=pt.SourceFrom ORDER BY pt.SourceFrom",
        array()
    );

    // merge variables and test names into one array
    $allVOIs = array_merge(
        array_column($allVOIs, 'Name'),
        array_unique(array_column($allVOIs, 'SourceFrom'))
    );
    sort($allVOIs);

    // sets keys and values to be equal
    $allVOIs = array_combine($allVOIs, $allVOIs);

    $uploadTypeRaw = $db->pselect(
        "SELECT * FROM publication_upload_type",
        array()
    );

    $uploadTypes = [];

    foreach($uploadTypeRaw as $type){
        $uploadTypes[$type['PublicationUploadTypeID']] = $type['Label'];
    }

    $usersRaw = $db->pselect(
        "SELECT ID, Real_name FROM users ".
        "WHERE Active='Y' AND Pending_approval='N' ".
        "ORDER BY Real_name",
        array()
    );

    $users = array();
    foreach($usersRaw as $u) {
        $users[$u['ID']] = $u['Real_name'];
    }

    $data['users'] = $users;
    $data['uploadTypes'] = $uploadTypes;
    $data['existingTitles'] = $titles;
    $data['allVOIs'] = $allVOIs;
    return $data;
}

// Gets Data for a specific PublicationID
function getProjectData() {
    $id = $_REQUEST['id'];

    $db = Database::singleton();

    $query = 'SELECT Title, Description, DateProposed, '.
        'LeadInvestigator, LeadInvestigatorEmail, '.
        'PublicationStatusID, UserID, RejectedReason  '.
        'FROM publication p '.
        'WHERE p.PublicationID=:pid ';
    $result = $db->pselectRow(
        $query,
        array('pid' => $id)
    );

    if (!$result) {
        throw new LorisException('Invalid publication ID!');
    } else {
        $result['VOIs']              = getVOIs($id);
        $result['files']             = getFiles($id);
        $result['Keywords']          = getKeywords($id);
        $result['collaborators']     = getCollaborators($id);

        // allow edit access for user if user is original proposer
        $user = \User::singleton();
        $userIDs = $db->pselectCol(
            'SELECT pu.UserID as ID '.
            'FROM publication_users_edit_perm_rel pu '.
            'WHERE PublicationID=:p',
            array('p' => $id)
        );

        $userCanEdit = (
            $user->getId() === $result['UserID'] ||
            in_array($user->getId(), array_column($userIDs, 'ID'))
        );

        $usersWithEditPerm = $userIDs;

        $pubData = array(
            'title'                 => $result['Title'],
            'description'           => $result['Description'],
            'leadInvestigator'      => $result['LeadInvestigator'],
            'leadInvestigatorEmail' => $result['LeadInvestigatorEmail'],
            'status'                => $result['PublicationStatusID'],
            'rejectedReason'        => $result['RejectedReason'],
            'voi'                   => $result['VOIs'],
            'keywords'              => $result['Keywords'],
            'collaborators'         => $result['collaborators'],
            'files'                 => $result['files'],
            'usersWithEditPerm'     => $usersWithEditPerm,
            'userCanEdit'           => $userCanEdit,
            'statusOpts'            => getStatusOptions(),
        );

        // if user can edit, retrieve getData() options to allow modifications
        if ($userCanEdit) {
            return array_merge($pubData, getData());
        } else {
            return $pubData;
        }
    }
}

function getVOIs($id) {
    $db = \Database::singleton();
    $vois = array();
    $fields = $db->pselectCol(
        'SELECT pt.Name AS field ' .
        'FROM parameter_type pt '.
        'LEFT JOIN publication_parameter_type_rel pptr '.
        'ON pptr.ParameterTypeID=pt.ParameterTypeID '.
        'WHERE pptr.PublicationID=:pid',
        array('pid' => $id)
    );
    $testNames = $db->pselectCol(
        'SELECT Test_name '.
        'FROM publication_test_names_rel ptnr '.
        'LEFT JOIN test_names tn '.
        'ON tn.ID=ptnr.TestNameID '.
        'WHERE PublicationID=:pid',
        array('pid' => $id)
    );
    $vois =  array_merge($testNames, $fields);
    return $vois;
}

function getKeywords($id) {
    $db = \Database::singleton();
    $kws = $db->pselectCol(
        'SELECT pk.Label FROM publication_keyword pk '.
        'LEFT JOIN publication_keyword_rel pkr '.
        'ON pkr.PublicationKeywordID=pk.PublicationKeywordID '.
        'WHERE pkr.PublicationID=:pid',
        array('pid' => $id)
    );

    return $kws;
}

function getCollaborators($id) {
    $db = \Database::singleton();

    $collaborators = $db->pselectCol(
        'SELECT Name FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pc.PublicationCollaboratorID=pcr.PublicationCollaboratorID '.
        'WHERE pcr.PublicationID=:pid',
        array('pid' => $id)
    );

    return $collaborators;
}

function getUsersWithEditPerm($id) {
    $db = Database::singleton();
    

}

function getFiles($id) {
    $db = \Database::singleton();

    $files = $db->pselectCol(
        'SELECT URL FROM publication_upload WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    return $files;
}

function getStatusOptions() {
    $db = \Database::singleton();
    $rawStatus = $db->pselect(
        'SELECT * FROM publication_status',
        array()
    );

    $statusOpts = array();
    foreach ($rawStatus as $rs) {
        $statusOpts[$rs['PublicationStatusID']] = $rs['Label'];
    }

    return $statusOpts;
}
