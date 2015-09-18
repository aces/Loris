<?php

ini_set('default_charset', 'utf-8');
require_once "bvl_panel_ajax.php";

if (isset($_POST['feedbackID']) && isset($_POST['candID'])){
    $feedbackThread->openThread($_POST['feedbackID']);   
}

exit();
