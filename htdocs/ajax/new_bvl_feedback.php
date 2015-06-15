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

$client = new NDB_Client;
$client->initalize();

$DB = Database::singleton();

//Creating a new array to pass the set values into the DB. 
$newThreadValues = array();

$feedbackThread =& NDB_BVL_Feedback::Singleton($user,$candID);



?>