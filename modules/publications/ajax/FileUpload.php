<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    error_log($action);
    if ($action === 'getData') {
        echo json_encode(array());
    } elseif ($action === 'upload') {
        $title = isset($_POST['title']) ? $_POST['title'] : ":(";
        error_log($title);
    } else {
        echo "invalid action";
    }
} else {
    echo "no action";
}