<?php
/**
 * This AJAX request serves the purpose of getting the entries for a given
 * bvl_feedback thread.
 *
 * Currently used in the bvl_feedback popup.
 *
 * @author: Evan McIlroy <evanmciroy@gmail.com>
 * @returns: JSON object containing entries for a given bvl_feedback thread.
 * Date: 15-05-26
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
