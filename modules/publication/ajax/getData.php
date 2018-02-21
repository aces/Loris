<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    if ($action === 'getData') {
        echo json_encode(getData());
    } elseif($action === 'getProjectData') {
        echo json_encode(getPublicationData());
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

    // for selecting variables of interest
    $varsOfInterest = $db->pselect(
        "SELECT pt.Name, pt.SourceFrom FROM parameter_type pt ".
        "JOIN test_names tn ON tn.Test_name=pt.SourceFrom ORDER BY pt.SourceFrom",
        array()
    );

    $uploadTypeRaw = $db->pselect(
        "SELECT * FROM publication_upload_type",
        array()
    );

    $uploadType = [];

    foreach($uploadTypeRaw as $type){
        $uploadType[$type['PublicationUploadTypeID']] = $type['Label'];
    }
    $data['uploadType'] = $uploadType;
    $data['titles'] = $titles;
    $data['varsOfInterest'] = $varsOfInterest;
    return $data;
}

// Gets Data for a specific PublicationID
function getPublicationData() {
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
        showError('Invalid publication ID!');
        return;
    } else {
        // separate queries for keywords & VOIs
        // to work around GROUP_CONCAT char limit
        $vois = array();
        $data = $db->pselect(
            'SELECT pt.Name AS Name, pt.SourceFrom AS Source '.
            'FROM parameter_type pt '.
            'LEFT JOIN publication_parameter_type_rel pptr '.
            'ON pptr.ParameterTypeID=pt.ParameterTypeID '.
            'WHERE pptr.PublicationID=:pid',
            array('pid' => $id)
        );

        foreach($data as $d) {
            if (array_key_exists($d['Source'], $vois)) {
                $vois[$d['Source']][] = $d['Name'];
            } else {
                $vois[$d['Source']] = array($d['Name']);
            }
        }

        $result['VOIs'] = $vois;

        $kws = $db->pselectCol(
            'SELECT pk.Label FROM publication_keyword pk '.
            'LEFT JOIN publication_keyword_rel pkr '.
            'ON pkr.PublicationKeywordID=pk.PublicationKeywordID '.
            'WHERE pkr.PublicationID=:pid',
            array('pid' => $id)
        );

        $result['Keywords'] = $kws;

        $rawStatus = $db->pselectCol(
            'SELECT Label FROM publication_status',
            array()
        );

        $statusOpts = array();
        foreach ($rawStatus as $rs) {
            $statusOpts[$rs] = $rs;
        }
        // allow edit access for user if user is original proposer
        $user = \User::singleton();
        $userCanEdit = $user->getId() === $result['UserID'];
        return array(
            'title' => $result['Title'],
            'description' => $result['Description'],
            'leadInvestigator' => $result['LeadInvestigator'],
            'leadInvestigatorEmail' => $result['LeadInvestigatorEmail'],
            'status' => $result['Label'],
            'voi' => $result['VOIs'],
            'keywords' => $result['Keywords'],
            'statusOpts' => $statusOpts,
            'userCanEdit' => $userCanEdit
        );
    }
}
