<?php
/**
 * Created by PhpStorm.
 * User: evanmcilroy
 * Date: 15-05-26
 * Time: 3:16 PM
 */

/**
 * This file is used by the Dashboard to get the data for
 * the recruitment bar chart via AJAX
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

//THIS IS IMPORATANT TO CHANGE WHEN LAUNCHING, PATHS RELATIVE TO SANDBOX
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
$genderData    = array();
$list_of_sites = Utility::getAssociativeSiteList(true, false);

function func1($data){
    $threadEntries = NDB_BVL_Feedback::getThreadEntries($data);
    print json_encode($threadEntries);
}

if (isset($_POST['callFunc1'])) {
    echo func1($_POST['callFunc1']);
}

exit();

?>
