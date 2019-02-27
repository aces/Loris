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

if (isset($_POST['feedbackID']) && isset($_POST['candID'])) {
    $feedbackThread->openThread($_POST['feedbackID']);
}

exit();
