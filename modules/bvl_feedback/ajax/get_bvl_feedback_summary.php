<?php

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require "bvl_panel_ajax.php";

$feedbackThreadSummary = $feedbackThread->getSummaryOfThreads();
echo json_encode($feedbackThreadSummary);

exit();