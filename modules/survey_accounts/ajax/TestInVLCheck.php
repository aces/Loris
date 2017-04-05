<?php
/**
 * Check if given test is part of given visit label
 *
 * PHP Version 5
 *
 * @category Survey
 * @package  Loris
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

$user =& User::singleton();
if (!$user->hasPermission('user_accounts')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB = Database::singleton();

$test_name = $_REQUEST['test_name'];
$vl = $_REQUEST['VL'];

$result = $DB->pselect(
    "SELECT * FROM test_battery ".
    "WHERE test_name=:TN AND Visit_label=:VL",
    array(
     "TN" => $test_name,
     "VL" => $vl
    )
);

if (!$result) {
    $warning_msg = "WARNING: $test_name is not normally administered at visit $vl.";
    echo json_encode(
        array(
         "warning_msg" => $warning_msg
        )
    );
    exit;
}

exit;