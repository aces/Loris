<?php
/**
 * This AJAX request serves the purpose of getting the entries for a given
 * bvl_feedback thread.
 *
 * Currently used in the bvl_feedback popup.
 *
 * @author:  Evan McIlroy <evanmciroy@gmail.com>
 * @returns: JSON object containing entries for a given bvl_feedback thread.
 * Date: 15-05-26
 */

header("content-type:application/json");
require "bvl_panel_ajax.php";

if (isset($_GET['feedbackID']) && !Empty($_GET['feedbackID'])) {
    $threadEntries = NDB_BVL_Feedback::getThreadEntries($_GET['feedbackID']);
    print json_encode($threadEntries);
}

exit();