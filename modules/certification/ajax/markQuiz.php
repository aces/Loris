<?php
/**
 * Certification training: Checks if the answers given for training quiz are correct.
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

if ($quizCorrect == 0) {
    print 0;
    exit();
} else {
    /*
    $user =& User::singleton();
    if (PEAR::isError($user)) {
        return PEAR::raiseError("User Error: " .$user->getMessage());
    }

    $userFullName = $user->getFullname();
    $userCenter   = $user->getCenterID();
    $examinerID   = $DB->pselectOne(
        "SELECT examinerID 
         FROM examiners
         WHERE full_name=:FN AND centerID=:CID",
        array(
         'FN' => $userFullName,
         'CID' => $userCenter,
        )
    );
    $date = date("Y") . '-' . date("m") . '-' . date("d");
    
    $DB->replace(
        "certification",
        array('examinerID' => $examinerID, 'date_cert' => $date, 'testID' => $instrumentID, 'pass' => 'certified')
    );
    */
    print 1;
    exit();
}

/**
 * Determines if an answer is correct for a question from the training quiz
 *
 * @param string $instrumentID The ID of the instrument
 * @param string $question     The question number
 * @param string $answer       The answer number provided by the user
 *
 * @return int
 */
function correct($instrumentID, $question, $answer)
{
    $DB            = Database::singleton();
    $correctAnswer = $DB->pselectOne(
        "SELECT a.OrderNumber as Answer 
         FROM certification_training_quiz_questions q 
         LEFT JOIN certification_training_quiz_answers a
         ON (q.ID=a.QuestionID)
         WHERE q.TestID=:TID AND a.Correct=1 AND q.OrderNumber=:QNO",
        array(
         'TID' => $instrumentID,
         'QNO' => $question,
        )
    );
    if ($correctAnswer == $answer) {
        return 1;
    } else {
        return 0;
    }
}
?>