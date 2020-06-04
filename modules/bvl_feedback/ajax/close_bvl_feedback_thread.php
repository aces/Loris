<?php
/**
 * File to close a BVL feedback thread via the BVL feedback panel.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

ini_set('default_charset', 'utf-8');
require "bvl_panel_ajax.php";

$user     =& User::singleton();
$username = $user->getUsername();

try {
    $candid = new \LORIS\StudyEntities\Candidate\CandID($_POST['candID'] ?? '');
} catch (\DomainException $e) {
    header("HTTP/1.1 400 Bad Request");
    header("Content-Type: application/json");
    print json_encode(array('error' => 'invalid candID'));
    exit;
}

if (!isset($_POST['feedbackID'])) {
    header("HTTP/1.1 400 Bad Request");
    header("Content-Type: application/json");
    print json_encode(array('error' => 'Missing FeedbackID'));
    exit;
}

$feedbackid = $_POST['feedbackID'];

try {
    $feedbackThread =& NDB_BVL_Feedback::Singleton($username, $candid);

    // FIXME This allows to close any thread as long as the feedbackid
    //       exists. It does not have to be related to this feedbackthread.
    $closethreadcount = $feedbackThread->closeThread((int) $feedbackid);
} catch (\Exception $e) {
    error_log($e->getMessage());
    header("HTTP/1.1 404 Not Found");
    header("Content-Type: application/json");
    print json_encode(
        array('error' => 'The requested feedback thread can`t be found')
    );
    exit;
}

if ($closethreadcount === 0) {
    header("HTTP/1.1 500 Internal Server Error");
    header("Content-Type: application/json");
    print json_encode(
        array('error' => 'No feedback thread updated')
    );
    exit;
}

header("HTTP/1.1 204 No Content");
exit;


