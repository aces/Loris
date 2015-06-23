<?php
header("content-type:text/html");
//header("content-type:application/json");
ini_set('default_charset', 'utf-8');
hj
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

$newEntryValues = array();

if(isset($_POST['comment']) && isset($_POST['feedbackID'])){

    NDB_BVL_Feedback::createEntry($_POST['feedbackID'], $_POST['comment'],$username);
    $newEntryValues['user'] = $username;
    $newEntryValues['comment'] = $_POST['comment'];
}

else{
    print json_encode('error');
    exit();
}

print json_encode($newEntryValues);

exit();

?>
