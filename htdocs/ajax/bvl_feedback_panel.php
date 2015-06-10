<?php
/**
 * Created by PhpStorm.
 * User: evanmcilroy
 * Date: 15-06-09
 * Time: 3:29 PM
 */

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

//FIXME: These paths are relative to my sandbox. Clean up before launching.
set_include_path(
    __DIR__ . "/../../project/libraries:" .
    __DIR__ . "/../../php/libraries:" .
    "/usr/share/pear:"
);

require_once __DIR__ . "/../../vendor/autoload.php";
require_once "NDB_Client.class.inc";
//require_once "../feedback_bvl_popup.php";

$client = new NDB_Client;
$client->initialize();

$DB            = Database::singleton();

$user =& User::singleton();
if (PEAR::isError($user)) {
    die("Error creating user object: ".$user->getMessage());
}

//TODO: add a more graceful exit here:
if (!$user->hasPermission('bvl_feedback')) {
    exit();
}

$data = $array();
$data['userID'] = getData('UserID');

$data['']

json_encode($data);



exit();

?> 