<?php
/**
 * Used to create a new entry on a specific thread via the bvl feedback
 * panel.
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

require "bvl_panel_ajax.php";

$user     =& User::singleton();
$username = $user->getUsername();

$newEntryValues = array();

if (isset($_POST['comment']) && isset($_POST['feedbackID'])) {
    $newEntryValues = $feedbackThread->createEntry(
        $_POST['feedbackID'],
        $_POST['comment'],
        $username
    );
} else {
    print json_encode('error');
    exit();
}

print json_encode($newEntryValues);

exit();


