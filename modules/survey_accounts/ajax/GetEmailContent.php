<?php
/**
 * This is used by the Loris survey module to retrieve the email
 * template for the current instrument. It is used in the survey_accounts
 * page via AJAX to update the email template with the current page
 *
 * PHP Version 5
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
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

$result = $DB->pselectOne(
    "SELECT DefaultEmail FROM participant_emails WHERE Test_name=:TN",
    array('TN' => $_REQUEST['test_name'])
);
if (empty($result)) {
    print "";
} else {
    print $result;

}

