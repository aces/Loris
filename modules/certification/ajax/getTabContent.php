<?php
/**
 * Certification module....
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
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

// Get the ID for the instrument that was selected
$instrumentID = $_REQUEST['instrument'];
$tabID = $_REQUEST['tabNumber'];

// Check the tabs and their titles
$tabInformation = $DB->pselect(
    "SELECT Content, TrainingType FROM certification_training WHERE TestID=:TID AND OrderNumber=:TNO",
    array('TID' => $instrumentID, 'TNO' => $tabID)
);

$tabContent = $tabInformation[0]['Content'];

if ($tabInformation[0]['TrainingType'] == 'text') {
    $tabContent = '<div class="training-instructions"><p>Please read the following:</p></div>' . '<div class="training-content">' . $tabContent . '</div>' . '<div class="well well-sm training-complete">I have completed reading this section of the training module. <button class="btn btn-default btn-agree" type="button">Agree</button></div>';
}
else if ($tabInformation[0]['TrainingType'] == 'video') {
    $tabContent = '<div class="training-instructions"><p>Please watch the following:</p></div>' . '<div class="training-content">' . $tabContent . '</div>' . '<div class="well well-sm training-complete">I have completed watching this section of the training module. <button class="btn btn-default btn-agree" type="button">Agree</button></div>';
}

print $tabContent;
?>