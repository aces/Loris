<?php
/**
 * This file represents the main entry point into Loris. It does
 * the setup required for every page, and then dispatches to the
 * appropriate Loris module.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}
require_once __DIR__ . "/../vendor/autoload.php";
ini_set('default_charset', 'utf-8');

ob_start('ob_gzhandler');

// load the client
$client    = new NDB_Client;
$anonymous = $client->initialize() === false;

if ($anonymous === false) {
    $TestName = $_REQUEST['test_name'] ?? 'dashboard';
} else {
    $TestName = $_REQUEST['test_name'] ?? 'login';
}
$subtest = $_REQUEST['subtest'] ?? '';

$caller    =& NDB_Caller::singleton();
$workspace = $caller->load($TestName, $subtest, '', null, $anonymous);
print $workspace;
ob_end_flush();
