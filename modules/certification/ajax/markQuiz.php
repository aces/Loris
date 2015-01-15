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

print_r($_POST);

/*
$answers = $DB->pselectOne(
    "SELECT QuizAnswers FROM certification_training WHERE TestID=:TID",
    array('TID' => $instrumentID)
);

// iterate over instruments
$quizCorrect = 1;

if ($quizCorrect == 1) {
    
}
*/

print 0;
?>