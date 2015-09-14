<?php
header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require "bvl_panel_ajax.php";

$user =& User::singleton();
$username = $user->getUsername();

$newEntryValues = array();

if(isset($_POST['comment']) && isset($_POST['feedbackID'])){
    $newEntryValues = $feedbackThread->createEntry($_POST['feedbackID'], $_POST['comment'], $username);
}

else{
    print json_encode('error');
    exit();
}

print json_encode($newEntryValues);

exit();

?>
