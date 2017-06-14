<?php
require_once __DIR__ . '/../../../vendor/autoload.php';

header('Content-type: application/json');
ob_start();

$api = new \LORIS\API\EntryPoint();
$api->run();

ob_end_flush();
exit;
