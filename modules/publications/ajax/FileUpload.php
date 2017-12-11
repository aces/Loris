<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    error_log($action);
    if ($action === 'getData') {
        echo json_encode(array());
    } elseif ($action === 'upload') {
        uploadPublication();
    } else {
        echo "invalid action";
    }
} else {
    echo "no action";
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
}