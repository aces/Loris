#!/usr/bin/env php
<?php declare(strict_types=1);

require('UbuntuBootstrapper.php');
$b = new UbuntuBootstrapper($argv);

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
    $report[] = "These may be installed by running this script with the " .
        "--install flag.";
}

// Print results
echo implode(PHP_EOL, $report);

// Install packages if requested to by user.
if (isset($argv[1])
    && $argv[1] === '--install') 
{
    $b->installPackages($missingPackages);
}

/* END SCRIPT */

