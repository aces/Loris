<?php

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action === 'getData') {
        echo json_encode(array());
    }
}