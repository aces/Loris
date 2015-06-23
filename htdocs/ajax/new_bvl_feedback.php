<?php

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

//FIXME : these are sandbox relative
set_include_path(
    __DIR__ . "/../../project/libraries:" .
    __DIR__ . "/../../php/libraries:" .
    "/usr/share/pear:"
);
include ("../main.php");
require_once __DIR__ . "/../../vendor/autoload.php";
require_once "NDB_Client.class.inc";

$user =& User::singleton();
$username = $user->getUsername();

//Creating a new array to pass the set values into the DB. 
$newThreadValues = array();
//Date we are creating the new bvl_feedback
$today = date("Y-m-d");

if(isset($_POST['comment']) && isset($_POST['candID'])){
    $feedbackThread =& NDB_BVL_Feedback::Singleton($username,$_POST['candID']);
    $feedbackLevel = $feedbackThread->_feedbackLevel;
    $feedbackThread->createThread(1,$_POST['comment'],'Y');
    //Now setting the array to return as json
    $newThreadValues['date'] = $today;
    $newThreadValues['user'] = $username;
    print json_encode($today);
}

exit();

?>