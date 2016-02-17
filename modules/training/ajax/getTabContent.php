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

$user =& User::singleton();
if (!$user->hasPermission('training')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

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
} else if ($tabInformation['TrainingType'] == 'vimeo') {
    $oembed_endpoint = 'http://vimeo.com/api/oembed';
    $video_url = 'http://vimeo.com/' . $tabInformation['Content'];
    //$json_url = $oembed_endpoint . '.json?url=' . rawurlencode($video_url);
    $video_options = '&portrait=0&autoplay=1&badge=0&byline=0&width=800';
    $xml_url = $oembed_endpoint . '.xml?url=' . rawurlencode($video_url) . $video_options;
    $oembed = simplexml_load_string(curl_get($xml_url));

    $tabHTML = createTabHTML(
        'vimeo',
        $tabInformation['Title'],
        html_entity_decode($oembed->html),
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

// Curl helper function
function curl_get($url) {
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    $return = curl_exec($curl);
    curl_close($curl);
    return $return;
}
?>