#!/usr/bin/php
<?php declare(strict_types=1);
/**
 * This script sets a config setting in the database.
 *
 * It does no validation of whether the value provided
 * is a valid value for the settings, it just blindly updates
 * or inserts the value into the config table.
 *
 * This script may be useful when either the frontend
 * config admin page is unavailable because of a bad
 * config value, or when giving instructions to a user
 * in a situation where describing what to type is
 * easier than describing where to click on the frontend.
 *
 * PHP Version 7
 *
 * @category Tools
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
const MIN_NUMBER_OF_ARGS = 3;
$args = $argv;
if ($args[0] == 'php') {
	$args = array_slice($argv, 1);
}
if (count($args) < MIN_NUMBER_OF_ARGS) {
	fwrite(STDERR, "Usage: setconfig.php setting value\n");
	exit(2);
}

$setting = $args[1];
$value   = $args[2];

$config = $DB->pselectRow(
    "SELECT ID, AllowMultiple FROM ConfigSettings WHERE Name=:config",
    array('config' => $setting)
);

if (count($config ?? []) === 0) {
    die("Invalid config name");
}

$id       = $config['ID'];
$multiple = $config['AllowMultiple'];

if ($multiple == '1') {
    die(
        "Script only valid on single value settings. " .
        "Please use the LORIS frontend to change $setting."
    );
}

// Determine whether to insert or update
$newconfig = (int )$DB->pselectOne(
    "SELECT COUNT(*) FROM Config WHERE ConfigID=:id",
    array('id' => $id)
);

if($newconfig === 0) {
    $DB->insert("Config", array('Value' => $value, 'ConfigID' => $id));
} else {
    $DB->update("Config", array('Value' => $value), array('ConfigID' => $id));
}
