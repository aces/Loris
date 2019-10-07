#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * This script is intended for developers working with test data. It DROPs all
 * LORIS core tables as well as "Raisinbread" test instrument tables.
 * For this reason, it should obviously not be run on any server wil live data.
 *
 * After dropping the tables, it will source the Raisinbread test data using
 * the commands found in raisinbread/README.md.
 *
 * The script also restores the url and host config settings to their pre-drop
 * values. This prevents an issue where a developer will need to manually
 * change these values in a MySQL shell when they are not hosting a LORIS
 * on localhost.
 *
 * Finally, the script runs tools/resetpassword.php so that the default admin
 * password with the Raisinbread data set is not used.
 *
 * In order to prevent accidental data loss, the script prompts the user to
 * manually type the exact name of the database which will be affected. It
 * also requires the user to manually enter their database password before
 * dropping and importing.
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
This script is used by LORIS developers to empty their databases and replace
them with new test data.


INFO;

echo $info;

$cwd = getcwd();
if (substr_compare($cwd, 'tools', strlen($cwd) - strlen('tools')) !== 0) {
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

    if (strtolower($input) !== 'y') {
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
Please re-type the database name `$dbname` to confirm you wish to drop tables
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
$dropCommand = <<<DROP
cat ../raisinbread/instruments/instrument_sql/9999-99-99-drop_instrument_tables.sql \
    ../SQL/9999-99-99-drop_tables.sql | $mysqlCommand
DROP;

runCommand($dropCommand);


// Source LORIS core tabes
echo <<<INFO
Creating LORIS core tables.... 

INFO;
$createTablesCommand = <<<CMD
for n in ../SQL/0000-*.sql; do echo \$n; ${mysqlCommand} < \$n || break; done;
CMD;
runCommand($createTablesCommand);

// Create instrument tables
echo <<<INFO
Creating instrument tables.... 

INFO;
$createInstrumentTablesCommand = <<<CMD
for n in ../raisinbread/instruments/instrument_sql/*.sql; do echo \$n; ${mysqlCommand} < \$n || break; done;
CMD;
runCommand($createInstrumentTablesCommand);

// Import Raisinbread data
echo <<<INFO
Importing Raisinbread data....

INFO;
$importCommand = <<<CMD
for n in ../raisinbread/instruments/instrument_sql/*.sql; do echo \$n; ${mysqlCommand} < \$n || break; done;
CMD;
runCommand($importCommand);


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
exec('php resetpassword.php admin');


// END SCRIPT

function dropTables($mysqlCommand) {

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
    exec($command, $output, $exitStatus);
    if ($exitStatus) {
        echo 'An error occurred: ' . PHP_EOL;
        print_r($output);
        die;
    }
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
