<?php

ini_set('default_charset', 'utf-8');
//FIXME fix these paths
set_include_path(
    __DIR__ . "/../../project/libraries:" .
    __DIR__ . "/../../php/libraries:" .
    __DIR__ . "../../modules:" .
    "/usr/share/pear:"
);

require_once __DIR__ . "/../../vendor/autoload.php";
require_once "bvl_panel_ajax.php";

$username = $user->getUsername();

if (isset($_POST['feedbackID']) && isset($_POST['candID'])){
    $feedbackThread->openThread($_POST['feedbackID']);   
}

exit();
