#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . '/cli_helper.class.inc';

define('MINIMUM_PHP_VERSION', 7.3);
$helper = new CLI_Helper();
$helper->enableLogging(basename($argv[0]));

// Make sure the right PHP version is used.
PHP_VERSION >= MINIMUM_PHP_VERSION ?
    $helper->printSuccess("PHP Version requirement met.")
    : $helper->printError(
        sprintf(
            "PHP minimum version not met (found: %s. required: %s)",
            PHP_VERSION,
            MINIMUM_PHP_VERSION
        )
    );

// Check "web paths". This is a data type found in the ConfigSettings table.
// Settings with this Data Type are expected to exist on the file system and
// should be writable by the current user.
$username = $helper->getUsername();
$helper->printLine("Checking web path settings...");
$query = <<<QUERY
SELECT 
cs.Name, c.Value as Path
FROM Config c 
LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) 
JOIN ConfigSettings csp ON (c.ConfigID = csp.ID) 
WHERE csp.DataType='web_path';
QUERY;
$result = $DB->pselect($query, []);

foreach ($result as $setting) {
    $name = $setting['Name'];
    $path = $setting['Path'];

    // If the path is an empty string, print a warning.
    if ($path === "") {
        $helper->printWarning(
            "Setting `$name` is has no value associated with it. This may "
            . " affect the functionality of LORIS."
        );
        continue;
    }
    // If the path does not exist on the system, print a warning.
    // It is not required that all paths are set as some projects may not use
    // certain paths.
    if (!is_dir($path)) {
        $helper->printWarning(
            "Setting `$name` has the value `$path` which does not exist on "
            . " the filesystem."
        );
        continue;
    }

    // If the path exists but is not writable, print an error. All web paths
    // should be writable by Apache if they are configured.
    if (!is_writeable($path)) {
        $helper->printError(
            "Setting `$name` has the value `$path` which is not writable "
            . "by user `$username`."
        );
    }
}

exit;
