<?php

/**
 *
 *
 * PHP version 5
 *
 *
 * @author Evan McIlroy <evanmcilroy@gmail.com>
 *
 */


header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require_once "bvl_panel_ajax.php";

//Creating a new array to pass the set values into the DB.
$newThreadValues = array();

//For profile level feedback
if (isset($_POST['comment']) && isset($_POST['candID']) && (!isset($_POST['sessionID']) || empty($_POST['sessionID']) && !isset($_POST['commentID']))){
    $feedbackLevel  = $feedbackThread->_feedbackLevel;

    $newEntryValues = $feedbackThread->createThread($_POST['input_type'], $_POST['comment'], 'Y');
    //Now setting the array to return as json
    print json_encode($newEntryValues);
}

if (isset($_POST['comment']) && isset($_POST['candID']) && isset($_POST['sessionID']) && !isset($_POST['commentID'])) {
    $feedbackLevel  = $feedbackThread->_feedbackLevel;

    $newEntryValues = $feedbackThread->createThread($_POST['input_type'], $_POST['comment'], 'Y');
    //Now setting the array to return as json
    print json_encode($newEntryValues);
}

if (isset($_POST['comment']) && isset($_POST['candID']) && isset($_POST['sessionID']) && isset($_POST['commentID'])) {
    $feedbackLevel = $feedbackThread->_feedbackLevel;

    $newEntryValues = $feedbackThread->createThread($_POST['input_type'], $_POST['comment'], 'Y',$_POST['field_name']);
    print json_encode($newEntryValues);
}

    exit();
