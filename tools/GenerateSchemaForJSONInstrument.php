<?php

require_once __DIR__ . "/../vendor/autoload.php";

$filePath = $argv[1];
$json = file_get_contents($filePath);

$linstString = JSONInstrumentToLINSTConverter::convert($json, 'en-ca');
$sqlString = GenerateTableSQLFromLINST::generate($linstString);

echo $sqlString;
