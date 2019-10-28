#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * This script is intended for developers working with test data. It DROPs all
 * LORIS core tables as well as "Raisinbread" test instrument tables.
 * For this reason, it should obviously not be run on any server with live data.
 *
 * The `sandbox` flag in config.xml is checked for this very reason. The script
 * will abort if it is not set to 1.
 *
 * After dropping the tables, the script will source the Raisinbread test data 
 * using the commands found in raisinbread/README.md.
 *
 * The script also restores the url, base, and host config settings to their 
 * pre-drop values. This prevents an issue where a developer will need to 
 * manually change these values in a MySQL shell when they are not hosting a 
 * LORIS on localhost.
 *
 * Finally, the script runs tools/resetpassword.php so that the default admin
 * password with the Raisinbread data set is not used.
 *
 * In order to prevent accidental data loss, the script prompts the user to
 * manually type the exact name of the database which will be affected.
 *
 * In normal cases, the database connection will be established via the 
 * credentials in the config file. However, if the database tables have already
 * been deleted then this will not work. In this case it is still possible to
 * import Raisinbread data if the user has properly set up a MySQL configuration
 * file and provides the name of their LORIS database.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

$info = <<<INFO
This script is used by LORIS developers to DELETE DATA and replace
them with new test data.


INFO;

echo $info;

echo "\e[0;31;40m*** WARNING this will result in the LOSS OF DATA ***\e[0m\n";

$cwd = getcwd();
if (substr_compare($cwd, 'tools', mb_strlen($cwd) - mb_strlen('tools')) !== 0) {
    die('Please run this script from the tools/ directory.' . PHP_EOL);
}

try {
    require_once 'generic_includes.php';

    $dbInfo = $config->getSettingFromXML('database');

    if (! $config->getSetting('dev')['sandbox']) {
        throw new \LorisException(
            "Config file indicates that this is not a sandbox. Aborting to " .
            "prevent accidental data loss."
        );
    }
    $dbname = $dbInfo['database'];
    $host = $dbInfo['host'];
    $username = $dbInfo['username'];
    $password = $dbInfo['password'];

    $urlConfigSetting = $config->getSetting('url');
    $baseConfigSetting = $config->getSetting('base');
    $hostConfigSetting = $config->getSetting('host');

} catch (\DatabaseException $e) {
    echo 'Could not connect to the database in the Config file.' .
        'It\'s possible that the LORIS tables have already been dropped.' .
        PHP_EOL;
    echo 'Continue attempting to install Raisinbread database? (yN)' . PHP_EOL;
    $input = trim(fgets(STDIN));

    if (mb_strtolower($input) !== 'y') {
        die;
    }
    echo PHP_EOL . 'Please enter the name of your database:' . PHP_EOL;
    $dbname = trim(fgets(STDIN));
} catch (\LorisException $e) {
    die($e->getMessage());
} catch (Exception $e) {
    die("Could not load project/config.xml");
}


echo <<<CONFIRMATION
Please type the database name `$dbname` to confirm you wish to drop tables
and import test data: 
CONFIRMATION;

$input = trim(fgets(STDIN));
if ($input !== $dbname) {
    die('Input did not match database name. Exiting.');
}

// Create a connection to mysql via bash. All credentials are supplied via 
// command line arguments except for the password which must be entered manually.
$mysqlCommand = "mysql -A \"$dbname\"";

// Drop tables
echo PHP_EOL .'Dropping LORIS tables....' . PHP_EOL;
dropTables();


// Source LORIS core tabes
echo <<<INFO
[*] Creating LORIS core tables.... 

INFO;
$coreTables = glob("../SQL/0000-*.sql"); 
array_walk($coreTables, 'runPatch');

// Create instrument tables
echo <<<INFO
[*] Creating instrument tables.... 

INFO;
$rbInstrumentTables = glob("../raisinbread/instruments/instrument_sql/*.sql"); 
array_walk($rbInstrumentTables, 'runPatch');

// Import Raisinbread data
echo <<<INFO
[*] Importing Raisinbread data....

INFO;
$rbData= glob("../raisinbread/RB_files/*.sql");
array_walk($rbData, 'runPatch');

// Restore config settings if they were successfully found before.
if (isset($urlConfigSetting)) {
    restoreConfigSetting('url', $urlConfigSetting);
}
if (isset($baseConfigSetting)) {
    restoreConfigSetting('base', $baseConfigSetting);
}
if (isset($hostConfigSetting)) {
    restoreConfigSetting('host', $hostConfigSetting);
}

// Trigger a password reset because the password for `admin` in the Raisinbread
// database is public.
echo 'Please choose a new password for the admin user:' . PHP_EOL;
runCommand('php resetpassword.php admin');


// END SCRIPT


/**
 * Drops core LORIS tables as well as Raisinbread instrument tables
 */
function dropTables(): void
{
    runPatch(
        '../raisinbread/instruments/instrument_sql/9999-99-99-drop_instrument_tables.sql'
        );
    runPatch('../SQL/9999-99-99-drop_tables.sql');
}

function runPatch(string $file): void
{
    global $mysqlCommand;
    runCommand(
        "cat $file | $mysqlCommand"
    );
}

/**
 * A wrapper around `exec()` built-in function with basic error reporting.
 *
 * @param string $command Bash command to be executed by `exec()`
 *
 * @return void. Causes script to exit on non-successful status code.
 */
function runCommand(string $command): void
{
    echo "Running command: `$command`" . PHP_EOL;
    echo shell_exec($command);
}

/**
 * Update a config setting in LORIS to $value.
 *
 * @param string $name Name of config setting in ConfigSettings table.
 * @param string $value Value to be changed in the Config table.
 *
 * @return void
 *
 * @throws \DatabaseException
 */
function restoreConfigSetting(string $name, string $value): void 
{
    echo "Restoring config setting `$name` to value `$value`"
        . PHP_EOL . PHP_EOL;
    try {
        global $DB;
        $DB->run(
            "UPDATE Config c 
            SET c.Value='$value'
            WHERE c.ConfigID
            IN (SELECT cs.ID FROM ConfigSettings cs WHERE cs.Name = '$name')"
        );
    } catch (\DatabaseException $e) {
        echo "Couldn't config setting. " .
            "This may need to be manually if your LORIS is not hosted at " .
            "localhost." .
            PHP_EOL;
    }
}
