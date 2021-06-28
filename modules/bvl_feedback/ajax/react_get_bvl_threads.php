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

if (isset($_POST['candID']) && !empty($_POST['candID'])) {
    $candID    = new CandID($_POST['candID']);
    $sessionID = null;
    $commentID = null;

    if (isset($_POST['sessionID']) && !empty($_POST['sessionID'])) {
        $sessionID = new \SessionID($_POST['sessionID']);
    }

    if (isset($_POST['commentID']) && !empty($_POST['commentID'])) {
        $commentID = $_POST['commentID'];
    }

    $feedbackThread =& \NDB_BVL_Feedback::Singleton(
        $username,
        $candID,
        $sessionID,
        $commentID
    );
}

$feedbackThreadList = $feedbackThread->getThreadList();
echo json_encode($feedbackThreadList);

exit();

