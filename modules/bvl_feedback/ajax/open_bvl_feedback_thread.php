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

try {
    $openedthreadcount = $feedbackThread->openThread($_POST['feedbackID']);
} catch (\Exception $e) {
    error_log($e->getMessage());
    header("HTTP/1.1 404 Not Found");
    header("Content-Type: application/json");
    print json_encode(
        array('error' => 'The requested feedback thread can`t be found')
    );
    exit;
}

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

