<?php
/**
 * File to open a BVL feedback thread via the BVL feedback panel.
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
require_once "bvl_panel_ajax.php";

$feedbackid = $_POST['feedbackID'] ?? '';

if (empty($feedbackid) || !is_numeric($feedbackID)) {
    header("HTTP/1.1 400 Bad Request");
    header("Content-Type: application/json");
    print json_encode(
        array('error' => 'feedbackId missing or invalid')
    );
    exit;
}

// This is realy powerfull; it allows to reopen any feedbackthread as long as the
// feedbackid exists. It doesn`t need to be related to this feedbackThread.
// It should probably be fixed...
$openedthreadcount = $feedbackThread->openThread((int) $feedbackID);

if ($openedthreadcount === 0) {
    header("HTTP/1.1 500 Internal Server Error");
    header("Content-Type: application/json");
    print json_encode(
        array('error' => 'No feedback thread updated')
    );
    exit;
}

header("HTTP/1.1 204 No Content");
exit;

