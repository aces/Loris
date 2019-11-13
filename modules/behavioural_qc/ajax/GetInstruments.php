<?php
/**
 * This is a file called used by the behavioural qc browser
 * and called from it's js file. When a visit is selected
 * from the dropdown, it's corresponding instruments are
 * retrieved and rendered in the instrument dropdown.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

ini_set('default_charset', 'utf-8');
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';

$user =& User::singleton();
if (!$user->hasPermission('quality_control')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();
header("content-type:application/json");

require_once "Utility.class.inc";

//Array containing the JSON information to return.
$flattened_result = array();
//gets the given visit_label and returns the instrument

//If all visits are selected return all visits
if ($_REQUEST['visit_label'] == 'All Visits') {
    $instruments = Utility::getAllInstruments();
    array_unshift($instruments, "All Instruments");

    $counter = 0;
    foreach ($instruments as $k => $v) {
        $flattened_result[$counter] = $v;
        $counter++;
    }

    print json_encode($flattened_result);
    exit();
} else {
    $instruments = Utility::getVisitInstruments($_REQUEST['visit_label']);
    //flattening the array result for proper json encoding
    if ($instruments == null) {
        $flattened_result[0] = "No instruments for this visit";
        print json_encode($flattened_result);
        exit();
    } else {
        foreach ($instruments as $k => $v) {
            $flattened_result[$k] = $v['Test_name_display'];
        }
        array_unshift($flattened_result, "All Instruments");
        print json_encode($flattened_result);
        exit();
    }
}


