<?php
/**
 * Certification training: Creates the html for the requested training tab
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

$instrumentID = $_REQUEST['instrument'];
$tabID        = $_REQUEST['tabNumber'];

// Get the tab's title, content and type in order to generate the correct html
$tabInformation = $DB->pselectRow(
    "SELECT Title, Content, TrainingType
     FROM certification_training 
     WHERE TestID=:TID AND OrderNumber=:TNO",
    array(
     'TID' => $instrumentID,
     'TNO' => $tabID,
    )
);

// Create the html based on the tab type
if ($tabInformation['TrainingType'] == 'text') {
    $tabHTML = createTabHTML(
        false,
        'Please read the following:',
        $tabInformation['Title'],
        $tabInformation['Content'],
        'Agree',
        'I have completed reading this section of the training module.'
    );
} else if ($tabInformation['TrainingType'] == 'video') {
    $tabHTML = createTabHTML(
        false,
        'Please watch the following:',
        $tabInformation['Title'],
        $tabInformation['Content'],
        'Agree',
        'I have completed watching this section of the training module.'
    );
} else if ($tabInformation['TrainingType'] == 'quiz') {
    $tabHTML = createTabHTML(
        true,
        'Please complete the quiz below in order to receive certification:',
        $tabInformation['Title'],
        createQuiz($instrumentID),
        'Submit',
        'Submit your answers to the quiz. 
         If any answers are incorrect, 
         you will be prompted to repeat the certification training.'
    );
}

print $tabHTML;

exit();

/**
 * Creates the HTML for a radio button for one multiple choice answer.
 *
 * @param string $questionNumber The question number in the training quiz
 * @param string $answerNumber   The order number of the answer 
 * @param string $answer         The text to be displayed as the answer
 *
 * @return string
 */
function createQuizRadio($questionNumber, $answerNumber, $answer)
{
    return '<div class="radio"><label><input type="radio" name="'
           . $questionNumber
           . '" id="q'
           . $questionNumber
           . '-'
           . $answerNumber
           . '" value="'
           . $answerNumber
           . '">'
           . $answer
           . '</label></div>';
}

/**
 * Creates the HTML for a multiple choice quiz.
 *
 * @param string $instrumentID The ID of the instrument
 *
 * @return string
 */
function createQuiz($instrumentID)
{
    $DB =& Database::singleton();
    // Get the questions
    $questions = $DB->pselect(
        "SELECT Question, OrderNumber, ID 
         FROM certification_training_quiz_questions 
         WHERE TestID=:TID 
         ORDER BY OrderNumber",
        array('TID' => $instrumentID)
    );

    // Add the array of answers to each question
    foreach ($questions as $i => $question) {
        $questions[$i]['answers'] = $DB->pselect(
            "SELECT a.Answer, a.OrderNumber
             FROM certification_training_quiz_answers a
             LEFT JOIN certification_training_quiz_questions q
             ON (a.QuestionID=q.ID) 
             WHERE q.TestID=:TID AND a.QuestionID=:QID
             ORDER BY OrderNumber",
            array(
             'TID' => $instrumentID,
             'QID' => $question['ID'],
            )
        );
    }

    // Create the quiz html
    $quizHTML = '';
    foreach ($questions as $question) {
        $quizHTML .= '<p><b>'
                  . $question['OrderNumber']
                  . '. '
                  . $question['Question']
                  . '</b></p>';
        foreach ($question['answers'] as $answer) {
            $quizHTML .= createQuizRadio(
                $question['OrderNumber'],
                $answer['OrderNumber'],
                $answer['Answer']
            );
        }
    }
    return $quizHTML;
}

/**
 * Creates the HTML for a new tab and its content.
 *
 * @param boolean $quiz         Tab contains a quiz
 * @param string  $instructions Instructions to be displayed at the top of the page
 * @param string  $title        Title of the tab
 * @param string  $tabContent   Content to be displayed on the tab
 * @param string  $button       Message on the button at the bottom of the tab
 * @param string  $message      Message beside the button
 *
 * @return string
 */
function createTabHTML($quiz, $instructions, $title, $tabContent, $button, $message)
{
    $instructionPanel = '<div class="panel panel-default training-instructions">'
                      . '<div class="panel-body">'
                      . $instructions
                      . '</div></div>';
    $mainContent      = '<div class="training-content"><h3>'
                      . $title
                      . '</h3>'
                      . ($quiz == true ? '<form id="quiz">' : '')
                      . $tabContent
                      . ($quiz == true ? '</form>' : '')
                      . '</div>';
    $buttonPanel      = '<div class="well well-sm training-complete"><button '
                      . ($quiz == true ? 'id="quizSubmit" form="quiz"' : '')
                      . 'class="btn btn-default '
                      . ($quiz == false ? 'btn-agree ' : '')
                      . 'btn-success" type="'
                      . ($quiz == false ? 'button' : 'submit')
                      . '">'
                      . $button
                      . '</button> '
                      . $message
                      . '</div>';
    $html             = $instructionPanel . $mainContent . $buttonPanel;

    return $html;
}
?>