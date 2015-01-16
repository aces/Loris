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

// iterate over instruments
$quizCorrect = 1;

foreach ($_POST as $question => $answer) {
    if (is_numeric($question)) {
        if (correct($instrumentID, $question, $answer) == 0) {
            $quizCorrect = 0;
            break;
        }
    }
}

if ($quizCorrect == 1) {
    print 1;
}
else {
    print 0;
}

exit();

function correct($instrumentID, $question, $answer) {
    $DB = Database::singleton();
    $correctAnswer = $DB->pselectOne(
        "SELECT a.OrderNumber as Answer 
         FROM certification_training_quiz_questions q 
         LEFT JOIN certification_training_quiz_answers a
         ON (q.ID=a.QuestionID)
         WHERE q.TestID=:TID AND a.Correct=1 AND q.OrderNumber=:QNO",
        array('TID' => $instrumentID, 'QNO' => $question)
    );
    if ($correctAnswer == $answer) {
        return 1;
    }
    else {
        return 0;
    }
}
?>