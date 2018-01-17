<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    if ($action === 'getData') {
        echo json_encode(getData());
    } elseif ($action === 'upload') {
        uploadPublication();
    } elseif($action === 'getProjectData') {
        echo json_encode(getPublicationData());
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}

// Gets publication data from database
// for now just titles to ensure uniqueness upon submission
function getData() {
    $db = Database::singleton();

    $data = array();
    $titles = $db->pselectCol(
        'SELECT Title FROM publication',
        array()
    );

    $varsOfInterest = $db->pselect(
        "SELECT pt.Name, pt.SourceField, pt.SourceFrom FROM parameter_type pt ".
        "JOIN test_names tn ON tn.Test_name=pt.SourceFrom ORDER BY pt.SourceFrom",
        array()
    );


    $data['titles'] = $titles;
    $data['varsOfInterest'] = $varsOfInterest;
    return $data;
}


// Gets Data for a specific PublicationID
function getPublicationData() {
    $id = $_GET['id'];

    $db = Database::singleton();

    $result = $db->pselectRow(
        'SELECT Title, Description, Date_proposed, '.
        'LeadInvestigator, LeadInvestigatorEmail, Label '.
        'FROM publication p '.
        'LEFT JOIN publication_status ps '.
        'ON p.PublicationStatusID=ps.PublicationStatusID '.
        'WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    if (!$result) {
        showError('Invalid publication ID!');
        return;
    } else {
        return array(
            'title' => $result['Title'],
            'description' => $result['Description'],
            'leadInvestigator' => $result['LeadInvestigator'],
            'leadInvestigatorEmail' => $result['LeadInvestigatorEmail'],
            'status' => $result['Label']
        );
    }
}

function uploadPublication() {
    $db = Database::singleton();

    // back end validation for title uniqueness constraint
    $exists = $db->pselectOne(
        "SELECT PublicationID FROM publication WHERE Title=:t",
        array('t' => $_REQUEST['title'])
    );

    if ($exists) {
        throw new LorisException('Submitted title already exists');
    }
    $today = date('Y-m-d');
    $fields = array(
        'Title'                 => $_REQUEST['title'],
        'Description'           => $_REQUEST['description'],
        'LeadInvestigator'      => $_REQUEST['leadInvestigator'],
        'LeadInvestigatorEmail' => $_REQUEST['leadInvestigatorEmail'],
        'DateProposed'          => $today
    );

    $db->insert('publication', $fields);

    $keywords = json_decode($_REQUEST['keywords']);
    foreach ($keywords as $kw) {
        // check if keyword exists
        $kwID = $db->pselectOne(
            'SELECT PublicationKeywordID '.
            'FROM publication_keyword '.
            'WHERE Label=:kw',
            array('kw' => $kw)
        );
        // if it doesn't, add it to keyword table and retrieve ID
        if (!$kwID) {
            $kwInsert = array('Label' => $kw);
            $db->insert('publication_keyword', $kwInsert);
            $kwID = $db->pselectOne(
                'SELECT PublicationKeywordID '.
                'FROM publication_keyword '.
                'WHERE Label=:kw',
                array('kw' => $kw)
            );
        }
        // add it pub_kw_rel table
        // get publication ID
        $pubID = $db->pselectOne(
            'SELECT PublicationID '.
            'FROM publication '.
            'WHERE Title=:t',
            array('t' => $_REQUEST['title'])
        );
        $pubKWRelInsert = array(
            'PublicationID' => $pubID,
            'PublicationKeywordID' => $kwID,
        );

        $db->insert('publication_keyword_rel', $pubKWRelInsert);
    }
    echo $keywords;
}