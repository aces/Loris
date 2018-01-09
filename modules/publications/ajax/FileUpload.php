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
    $keywords = $_REQUEST['keywords'];
    echo $keywords;
    $fields = array(
        'Title'                   => $_REQUEST['title'],
        'Description'             => $_REQUEST['description'],
        'Lead_investigator'       => $_REQUEST['leadInvestigator'],
        'Lead_investigator_email' => $_REQUEST['leadInvestigatorEmail'],
        'Date_proposed'           => $today
    );

    $db->insert('publications', $fields);
}