<?php
/**
 * Created by PhpStorm.
 * User: evanmcilroy
 * Date: 15-06-18
 * Time: 2:07 PM
 */

ini_set('default_charset', 'utf-8');
//FIXME fix these paths
set_include_path(
    __DIR__ . "/../../project/libraries:" .
    __DIR__ . "/../../php/libraries:" .
    __DIR__ . "../../modules:" .
    "/usr/share/pear:"
);
include ("../main.php");
require_once __DIR__ . "/../../vendor/autoload.php";
require_once "NDB_Client.class.inc";

$user =& User::singleton();
$username = $user->getUsername();

if (isset($_POST['feedbackID']) && isset($_POST['candID'])){
    $feedbackThread =& NDB_BVL_Feedback::Singleton($username,$_POST['candID']);
    $feedbackThread->closeThread($_POST['feedbackID']);
}

exit();

?>