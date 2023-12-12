<?php
/**
 * File to be included in AJAX scripts for the bvl_feedback panel.
 * These files should initialize a user, a candidate and a feedback object.
 *
 * These files are intended to be used at the timepoint list,
 * instrument list and on individual instruments.
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

