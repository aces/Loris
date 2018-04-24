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

    $uploadTypeRaw = $db->pselect(
        "SELECT * FROM publication_upload_type",
        array()
    );

    $uploadTypes = [];

    foreach($uploadTypeRaw as $type){
        $uploadTypes[$type['PublicationUploadTypeID']] = $type['Label'];
    }

    $usersRaw = $db->pselect(
        "SELECT UserID, Real_name FROM users ".
        "WHERE Active='Y' AND Pending_approval='N' ".
        "ORDER BY Real_name",
        array()
    );

    $users = array();
    foreach($usersRaw as $u) {
        $users[$u['UserID']] = $u['Real_name'];
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
        'LeadInvestigator, LeadInvestigatorEmail, Label, UserID '.
        'FROM publication p '.
        'LEFT JOIN publication_status ps '.
        'ON p.PublicationStatusID=ps.PublicationStatusID '.
        'WHERE p.PublicationID=:pid '.
        'GROUP BY p.PublicationID';
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
        $userIDs = $db->pselect(
            'SELECT pu.UserID as ID, u.UserID as Username '.
            'FROM publication_users_edit_perm_rel pu '.
            'JOIN users u ON pu.UserID=u.ID '.
            'WHERE PublicationID=:p',
            array('p' => $id)
        );

        $userCanEdit = (
            $user->getId() === $result['UserID'] ||
            in_array($user->getId(), array_column($userIDs, 'ID'))
        );

        $usersWithEditPerm = array_column($userIDs, 'Username');

        $pubData = array(
            'title'                 => $result['Title'],
            'description'           => $result['Description'],
            'leadInvestigator'      => $result['LeadInvestigator'],
            'leadInvestigatorEmail' => $result['LeadInvestigatorEmail'],
            'status'                => $result['Label'],
            'voi'                   => $result['VOIs'],
            'keywords'              => $result['Keywords'],
            'collaborators'         => $result['collaborators'],
            'files'                 => $result['files'],
            'usersWithEditPerm'     => $usersWithEditPerm,
            'userCanEdit'           => $userCanEdit,
        );

        if ($user->hasPermission('publication_approve')) {
            $pubData['statusOpts'] = getStatusOptions();
        }

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
    $data = $db->pselect(
        'SELECT pt.Name AS field, pt.SourceFrom AS inst '.
        'FROM parameter_type pt '.
        'LEFT JOIN publication_parameter_type_rel pptr '.
        'ON pptr.ParameterTypeID=pt.ParameterTypeID '.
        'WHERE pptr.PublicationID=:pid',
        array('pid' => $id)
    );

    foreach($data as $d) {
        if (array_key_exists($d['inst'], $vois)) {
            $vois[$d['inst']]['Fields'][] = $d['field'];
        } else {
            $vois[$d['inst']] = array(
                'Fields' => array($d['field']),
                'IsFullSet' => false,
            );
        }
    }

    // determine if set of instrument fields is equivalent to full set
    foreach ($vois as $inst => $v) {
        $fullSet = $db->pselectCol(
            'SELECT Name FROM parameter_type WHERE SourceFrom=:inst',
            array('inst' => $inst)
        );

        // use loose comparison since element ordering may be different
        if ($fullSet == $v['Fields']) {
            $vois[$inst]['IsFullSet'] = true;
        }
    }

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
        'LEFT JOIN publication p ON p.PublicationID=pcr.PublicationID '.
        'WHERE p.PublicationID=:pid',
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
