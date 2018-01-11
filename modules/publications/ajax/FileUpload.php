<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    if ($action === 'getData') {
        echo json_encode(array());
    } elseif ($action === 'upload') {
        uploadPublication();
    } elseif($action === 'getProjectData') {
        echo json_encode(getProjectData());
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}

function getProjectData() {
    $id = $_GET['id'];

    $db = Database::singleton();

    $result = $db->pselectRow(
        'SELECT Title, Description, Date_proposed, '.
        'Lead_investigator, Lead_investigator_email, Approval_status '.
        'FROM publications WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    if (!$result) {
        showError('Invalid publication ID!');
        return;
    } else {
        return array(
            'title' => $result['Title'],
            'description' => $result['Description'],
            'leadInvestigator' => $result['Lead_investigator'],
            'leadInvestigatorEmail' => $result['Lead_investigator_email'],
            'status' => $result['Approval_status']
        );
    }
}

function uploadPublication() {
    $db = Database::singleton();

    $today = date('Y-m-d');

    $fields = array(
        'Title'                   => $_REQUEST['title'],
        'Description'             => $_REQUEST['description'],
        'Lead_investigator'       => $_REQUEST['leadInvestigator'],
        'Lead_investigator_email' => $_REQUEST['leadInvestigatorEmail'],
        'Date_proposed'           => $today
    );

    $db->insert('publications', $fields);

    $keywords = json_decode($_REQUEST['keywords']);
    foreach ($keywords as $kw) {
        // check if keyword exists
        $kwID = $db->pselectOne(
            'SELECT KeywordID '.
            'FROM publication_keywords '.
            'WHERE Label=:kw',
            array('kw' => $kw)
        );
        // if it doesn't, add it to keyword table and retrieve ID
        if (!$kwID) {
            $kwInsert = array('Label' => $kw);
            $db->insert('publication_keywords', $kwInsert);
            $kwID = $db->pselectOne(
                'SELECT KeywordID '.
                'FROM publication_keywords '.
                'WHERE Label=:kw',
                array('kw' => $kw)
            );
        }
        // add it pub_kw_rel table
        // get publication ID
        $pubID = $db->pselectOne(
            'SELECT PublicationID '.
            'FROM publications '.
            'WHERE Title=:t',
            array('t' => $_REQUEST['title'])
        );
        $pubKWRelInsert = array(
            'PublicationID' => $pubID,
            'KeywordID' => $kwID,
        );

        $db->insert('publications_keywords_rel', $pubKWRelInsert);
    }
    echo $keywords;
}