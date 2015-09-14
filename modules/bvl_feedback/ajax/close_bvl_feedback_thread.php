<?php
/**
 * Created by PhpStorm.
 * User: evanmcilroy
 * Date: 15-06-18
 * Time: 2:07 PM
 */

ini_set('default_charset', 'utf-8');
require "bvl_panel_ajax.php";

$user =& User::singleton();
$username = $user->getUsername();

if (isset($_POST['feedbackID']) && isset($_POST['candID'])){
    $feedbackThread =& NDB_BVL_Feedback::Singleton($username,$_POST['candID']);
    $feedbackThread->closeThread($_POST['feedbackID']);
}

exit();

?>