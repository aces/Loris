<?php
/**
 * File that returns the summary of the feedback for a given candidate,
 * timepoint and instrument.
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

$feedbackThreadSummary = $feedbackThread->getSummaryOfThreads();
echo json_encode($feedbackThreadSummary);

exit();