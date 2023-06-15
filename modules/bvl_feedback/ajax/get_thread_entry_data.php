<?php
/**
 * This AJAX request serves the purpose of getting the entries for a given
 * bvl_feedback thread.
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
require "bvl_panel_ajax.php";

$user     =& User::singleton();
$username = $user->getUsername();

if (isset($_GET['feedbackID']) && !Empty($_GET['feedbackID'])) {
    $threadEntries = NDB_BVL_Feedback::getThreadEntries($_GET['feedbackID']);
    // add username to threadentries
    foreach ($threadEntries as $key => $value) {
        $threadEntries[$key]['current_user'] = $username;
        $threadEntries[$key]['editComment']  = false;
    }
    print json_encode($threadEntries);
}

exit();