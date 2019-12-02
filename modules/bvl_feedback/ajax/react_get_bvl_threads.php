<?php
/**
 * Used by react on initial load to load the thread state.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\bvl_feedback;
use \LORIS\StudyEntities\Candidate\CandID;
header("content-type:application/json");
ini_set('default_charset', 'utf-8');

set_include_path(
    __DIR__ . "/../../../project/libraries:" .
    __DIR__ . "/../../../php/libraries:"
);

require_once __DIR__ . "/../../../vendor/autoload.php";

$username = \User::singleton()->getUsername();


if (isset($_POST['candID']) && !(isset($_POST['sessionID']))) {
    $candID         = new CandID($_POST['candID']);
    $feedbackThread =& \NDB_BVL_Feedback::Singleton($username, $candID);
} elseif (isset($_POST['candID']) && isset($_POST['sessionID'])
    && !(isset($_POST['commentID']))
) {
    $candID         = new CandID($_POST['candID']);
    $feedbackThread =&
        \NDB_BVL_Feedback::Singleton(
        $username,
        $candID,
        $_POST['sessionID']
    );
} elseif (isset($_POST['candID']) && isset($_POST['sessionID'])
    && isset($_POST['commentID'])
) {
    $candID         = new CandID($_POST['candID']);
    $feedbackThread =&
        \NDB_BVL_Feedback::Singleton(
        $username,
        $candID,
        $_POST['sessionID'],
        $_POST['commentID']
    );
}

$feedbackThreadList = $feedbackThread->getThreadList();
echo json_encode($feedbackThreadList);

exit();
