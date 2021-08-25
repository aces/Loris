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
$data     = \Utility::parseFormData($_POST);

if (isset($data['candID']) && !empty($data['candID'])) {
    $candID    = new CandID($data['candID']);
    $sessionID = null;
    $commentID = null;

    if (isset($data['sessionID']) && !empty($data['sessionID'])) {
        $sessionID = new \SessionID($data['sessionID']);
    }

    if (isset($data['commentID']) && !empty($data['commentID'])) {
        $commentID = $data['commentID'];
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

