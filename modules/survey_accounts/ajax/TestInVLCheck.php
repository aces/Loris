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
$vl        = $_REQUEST['VL'];

$test_has_VL = $DB->pselect(
    "SELECT * FROM test_battery ".
    "WHERE test_name=:TN AND Visit_label IS NOT NULL",
    array("TN" => $test_name)
);

$test_in_VL = $DB->pselect(
    "SELECT * FROM test_battery ".
    "WHERE test_name=:TN AND Visit_label=:VL",
    array(
     "TN" => $test_name,
     "VL" => $vl,
    )
);

if (!$test_in_VL && $test_has_VL) {
    $full_name   = $DB->pselectOne(
        "SELECT Full_name FROM test_names ".
        "WHERE Test_name=:TN",
        array("TN" => $test_name)
    );
    $warning_msg = "WARNING: $full_name is not normally administered at visit $vl.";
    echo json_encode(
        array("warning_msg" => $warning_msg)
    );
    exit;
}

exit;