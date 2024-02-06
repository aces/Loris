#!/usr/bin/env php
<?php declare(strict_types=1);
require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/generic_includes.php";

/**
 * This script is used to get configuration settings from LORIS db.
 * "Usage: php get_config.php configName"
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

const MIN_NUMBER_OF_ARGS = 2;
if (count($argv) < MIN_NUMBER_OF_ARGS) {
    throw new Exception('Missing config name');
}

$configName  = $argv[1];
$configValue = $config->getSetting($configName);
echo json_encode($configValue, JSON_THROW_ON_ERROR);
