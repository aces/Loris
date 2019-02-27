#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * This file contains a script used to set-up a developer instance of LORIS by
 * validating that the system has the required software installed.
 */

require_once('CLI_Helper.class.inc');
$helper = new CLI_Helper($argv);
$distro = $helper->getDistro();

// Create boostrap object based on operating system
switch ($distro) {
case 'Ubuntu':
    require('UbuntuBootstrapper.php');
    $b = new UbuntuBootstrapper($argv);
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
// Check Apache
if (!$b->apacheRequirementSatisfied()) {
    $report[] = sprintf(
        "LORIS requires at least Apache version %s, but %s is installed.",
        $b->APACHE_MAJOR_VERSION_REQUIRED . '.' . $b->APACHE_MINOR_VERSION_REQUIRED,
        PHP_VERSION
    );
}

// Check "packages" -- apt, MySQL extensions, and other misc. tools
$missingPackages = $b->getMissingPackages();
if (count($missingPackages) > 0) {
    $report[] = "Found missing packages required by LORIS:";
    foreach($missingPackages as $name) {
        $report[] = "\t- $name";
    }
    if (!installMode()) {
        $report[] = "These may be installed by running this script with the " .
            "--install flag.";
    }
}

// Print results
echo implode(PHP_EOL, $report) . PHP_EOL;

// Install packages if requested to by user.
if (installMode()) {
    echo '[*] Installing requirements...' . PHP_EOL;
    $b->installPackages($missingPackages);
}

/* END SCRIPT */

function installMode(): bool {
    return isset($argv[1]) && ($argv[1] === '--install');
}

