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

    $data['titles'] = $titles;
    $data['varsOfInterest'] = $varsOfInterest;
    return $data;
}