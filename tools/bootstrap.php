#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * This file contains a script used to set-up a developer instance of LORIS by
 * validating that the system has the required software installed.
 *
 * PHP Version 7
 *
 * @category Set-up
 * @package  Tools
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once 'CLI_Helper.class.inc';
$helper = new CLI_Helper($argv);
$distro = $helper->getDistro();

// Create boostrap object based on operating system
switch ($distro) {
case 'Ubuntu':
    include 'UbuntuBootstrapper.php';
    $b = new UbuntuBootstrapper($argv ?? array());
    break;
default:
    exit(
        "Bootstrapping is not supported for your distribution ($distro)"
        . PHP_EOL
    );
}

// Generate a report detailing the status of the user's development
// environment.
$report = array();

// Check PHP
if (!$b->phpRequirementSatisfied()) {
    $report[] = sprintf(
        "LORIS requires at least PHP version %s, but %s is installed.",
        $b->PHP_MAJOR_VERSION_REQUIRED . '.' . $b->PHP_MINOR_VERSION_REQUIRED,
        PHP_VERSION
    );
}
// Check Apache -- note that this is a "soft" requirement as development can
// be done using a local PHP server instead of using Apache.
if (!$b->apacheRequirementSatisfied()) {
    $report[] = "LORIS requires at least Apache version "
        . $b->APACHE_MAJOR_VERSION_REQUIRED
        . '.'
        . $b->APACHE_MINOR_VERSION_REQUIRED;
    $report[] = 'Development is possible using a local server but Apache ' .
        'cannot be used.';
}

// Check Apache -- note that this is a "soft" requirement as development can
// be done using a local PHP server instead of using Apache.
if (!$b->nodeJSRequirementSatisfied()) {
    $report[] = "LORIS requires at least nodejs version "
        . $b->NODEJS_MAJOR_VERSION_REQUIRED;
}

// Check "packages" -- apt, MySQL extensions, and other misc. tools
$missingPackages = $b->getMissingPackages();
if (count($missingPackages) > 0) {
    if (!installMode($helper)) {
        $report[] = "Found missing packages required by LORIS:";
        foreach ($missingPackages as $name) {
            $report[] = "\t- $name";
        }
        $report[] = "These may be installed by running this script with the " .
            "--install flag.";
    } else {
        echo '[*] Installing requirements...' . PHP_EOL;
        $b->installPackages($missingPackages);
    }
}

// Print results
if (empty($report)) {
    $report[] = "All requirements satisfied.";
}
echo implode(PHP_EOL, $report) . PHP_EOL;

/* END SCRIPT */

/**
 * Whether this script is in "install mode" as determined by a command-line flag.
 *
 * @param CLI_Helper $helper An object containing a copy of the arguments passed
 * to this script.
 *
 * @return bool True if '-i' or '--install' is present in CLI arguments.
 */
function installMode(CLI_Helper $helper): bool
{
    return in_array('-i', $helper->args, true)
        || in_array('--install', $helper->args, true);
}

