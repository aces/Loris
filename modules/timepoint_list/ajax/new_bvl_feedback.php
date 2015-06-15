<?php

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

$client = new NDB_Client;
$client->initalize();

$DB = Database::singleton();

//Creating a new array to pass the set values into the DB. 
$newThreadValues = array();


$feedbackThread =& NDB_BVL_Feedback::Singleton($user,$candID);


if(isset($_POST['comment'])){
    echo json_encode(($POST_['comment']));
}


?>