<?php
/**
 * File to be included in AJAX scripts for the bvl_feedback panel.
 * These files should initialize a user, a candidate and a feedback object.
 *
 * These files are intended to be used at the timepoint list, instrument list and 
 * on individual instruments. 
 *
 * Created by PhpStorm.
 * User: evanmcilroy
 * Date: 15-06-25
 * Time: 3:13 PM
 */

$client = new NDB_Client;
$client->initialize();

$user     =& User::singleton();
$username = $user->getUsername();

if (isset($_POST['candID']) && !(isset($_POST['sessionID']))) {
$feedbackThread =& NDB_BVL_Feedback::Singleton($username, $_POST['candID']);
}
elseif (isset($_POST['candID']) && isset($_POST['sessionID'])){
    $feedbackThread =& NDB_BVL_Feedback::Singleton($username, $_POST['candID'], $_POST['sessionID']);
}