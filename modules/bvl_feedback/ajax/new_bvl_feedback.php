<?php
/**
 * This file creates a new bvl feedback thread via the feedback panel.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require_once "bvl_panel_ajax.php";

//Creating a new array to pass the set values into the DB.
$newThreadValues = array();

//For profile level feedback
if (isset($_POST['comment']) && isset($_POST['candID'])
    && (!isset($_POST['sessionID']) || empty($_POST['sessionID'])
    && !isset($_POST['commentID']))
) {
    $feedbackLevel = $feedbackThread->_feedbackLevel;


    $newEntryValues = $feedbackThread->createThread(
        $feedbackLevel,
        $_POST['inputType'],
        $_POST['comment'],
        'Y'
    );

    //Now setting the array to return as json
    print json_encode($newEntryValues);
}

if (isset($_POST['comment']) && isset($_POST['candID'])
    && isset($_POST['sessionID']) && !isset($_POST['commentID'])
) {
    $feedbackLevel = $feedbackThread->_feedbackLevel;

    $newEntryValues = $feedbackThread->createThread(
        $feedbackLevel,
        $_POST['inputType'],
        $_POST['comment'],
        'Y'
    );

    //Now setting the array to return as json
    print json_encode($newEntryValues);
}

if (isset($_POST['comment']) && isset($_POST['candID'])
    && isset($_POST['sessionID']) && isset($_POST['commentID'])
) {
    $feedbackLevel = $feedbackThread->_feedbackLevel;

    $newEntryValues = $feedbackThread->createThread(
        $feedbackLevel,
        $_POST['inputType'],
        $_POST['comment'],
        'Y',
        $_POST['fieldName']
    );

    print json_encode($newEntryValues);
}

    exit();
