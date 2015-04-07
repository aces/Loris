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

require_once __DIR__ . "/../../../vendor/autoload.php";

$DB = Database::singleton();

$instrumentID = $_REQUEST['instrument'];
$tabID        = $_REQUEST['tabNumber'];
$type         = $_REQUEST['type'];

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

$instrument = $DB->pselectOne(
    "SELECT Test_name FROM test_names WHERE ID=:IID",
    array('IID' => $instrumentID)
);

// Create the html based on the tab type
if ($tabInformation['TrainingType'] == 'text') {
    $tabHTML = createTabHTML(
        'text',
        $tabInformation['Title'],
        $tabInformation['Content'],
        $type
    );
} else if ($tabInformation['TrainingType'] == 'pdf') {
    $tabHTML = createTabHTML(
        'pdf',
        $tabInformation['Title'],
        $instrument . '.pdf',
        $type
    );
} else if ($tabInformation['TrainingType'] == 'video') {
    $tabHTML = createTabHTML(
        'video',
        $tabInformation['Title'],
        $instrument . '.mp4',
        $type
    );
} else if ($tabInformation['TrainingType'] == 'quiz') {
    $tabHTML = createTabHTML(
        'quiz',
        $tabInformation['Title'],
        getQuizData($instrumentID),
        $type
    );
}

print $tabHTML;

exit();

/**
 * Gets the training quiz informations from the database
 *
 * @param string $instrumentID The ID of the instrument
 *
 * @return string
 */
function getQuizData($instrumentID)
{
    $DB = Database::singleton();
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

    return $questions;
}

/**
 * Creates the HTML for a new tab and its content.
 *
 * @param boolean $contentType  Tab content type
 * @param string  $title        Title of the tab
 * @param string  $tabVariables Template variables
 * @param string  $type         Type of the request: training/review
 *
 * @return string
 */
function createTabHTML($contentType, $title, $tabVariables, $type)
{
    $tpl_data['contentType']  = $contentType;
    $tpl_data['title']        = $title;
    $tpl_data['tabVariables'] = $tabVariables;
    $tpl_data['type']         = $type;
    $smarty = new Smarty_NeuroDB('training');
    $smarty->assign($tpl_data);
    $html = $smarty->fetch('training.tpl');

    return $html;
}
?>