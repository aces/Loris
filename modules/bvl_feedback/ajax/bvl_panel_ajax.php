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

