#!/usr/bin/env php
<?php declare(strict_types=1);

namespace LORIS;
require_once __DIR__ . "/generic_includes.php";
require_once 'RedcapCSVParser.class.inc';
require_once __DIR__ . '/../modules/redcap/php/client/models/redcapdictionaryrecord.class.inc';
require_once __DIR__ . '/../modules/redcap/php/client/redcapprops.class.inc';

use \SplFileInfo;
global $lorisInstance;

$redcapCSV = new SplFileInfo('redcap.csv');
$redcapParser = new \LORIS\RedcapCSVParser($redcapCSV);
$parsedCSV = $redcapParser->parseDictionaryCSV($lorisInstance);
$instruments = $redcapParser::convertDictionaryCSVToLINST($parsedCSV);
$redcapParser::createLINSTFiles($instruments, '.');

