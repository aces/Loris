<?php
/**
 * Data Querying Module
 *
 * PHP Version 7.4
 *
 * @category Data_Querying_Module
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../project/config.xml");
header("Content-Type: application/json");
$config      = \NDB_Config::singleton();
$couchConfig = $config->getSetting('CouchDB');
$cdb         = \NDB_Factory::singleton()->couchDB(
    $couchConfig['dbName'],
    $couchConfig['hostname'],
    intval($couchConfig['port']),
    $couchConfig['admin'],
    $couchConfig['adminpass']
);
echo "Deleting a saved query in DQT.\n";

        $user = readline("Please input the author of the saved query:");
        $name = readline("Please input the name of the saved query:");
	$global = readline("If the saved query is global then input 'y':");
	if ($global) {
		$docID       = urlencode("global:".$user."_".$name);
	} else {
		$docID       = urlencode($user."_".$name);
	}
$results = $cdb->deleteDoc(
    $docID
);


	if (json_encode($results) == "true")
	{
	   echo $name." has been deleted in DQT.\n";
	} else {
	   echo "There is no query named ".$name." in DQT.\n";
	};
