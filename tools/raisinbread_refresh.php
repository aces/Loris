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
DO NOT RUN THIS SCRIPT ON PRODUCTION.


INFO;

echo $info;

try {
    require_once 'generic_includes.php';

    $dbInfo = $config->getSettingFromXML('database');
    $dbname = $dbInfo['database'];
    $host = $dbInfo['host'];
    $username = $dbInfo['username'];

    $urlConfigSetting = $config->getSetting('url');
    $baseConfigSetting = $config->getSetting('base');
    $hostConfigSetting = $config->getSetting('host');

    echo 'Please enter the name of your database to continue.' . PHP_EOL;
} catch (\DatabaseException $e) {
    echo 'Could not connect to the database in the Config file.' .
        'It\'s possible that the LORIS tables have been dropped already.' .
        PHP_EOL;
} catch (Exception $e) {
    die("Could not load project/config.xml");
}

$input = trim(fgets(STDIN));

if ($input !== $dbname) {
    die(
        "Input did not match the name of the database in the config.xml file "
        . "`$dbname`. Exiting as a precaution to prevent data loss."
        . PHP_EOL
    );
}

// Create a connection to mysql via bash. All credentials are supplied via 
// command line arguments except for the password which must be entered manually.
$mysqlCommand = "mysql -A \"$dbname\" -u \"$username\" -h \"$host\" -p ";

// Drop tables
echo PHP_EOL .'Dropping LORIS tables....' . PHP_EOL;
echo 'You will be prompted for your database password.' . PHP_EOL;
$dropCommand = <<<DROP
cat raisinbread/instruments/instrument_sql/9999-99-99-drop_instrument_tables.sql \
    SQL/9999-99-99-drop_tables.sql | $mysqlCommand
DROP;

runCommand($dropCommand);

// Source LORIS core tabes
echo <<<INFO
Creating LORIS core tables.... '
You will be prompted for your database password.'

INFO;
$createTablesCommand = <<<CMD
for n in SQL/0000-*.sql; do echo \$n; ${mysqlCommand} < \$n || break; done;
CMD;
runCommand($createTablesCommand);

// Create instrument tables
echo PHP_EOL .'Creating instrument tables.... ' .
    'This may take some time.' . PHP_EOL;
echo 'You will be prompted for your database password.' . PHP_EOL;
$createInstrumentTablesCommand = <<<CMD
for n in raisinbread/instruments/instrument_sql/*.sql; do echo \$n; ${mysqlCommand} < \$n || break; done;
CMD;
runCommand($createInstrumentTablesCommand);

// Import Raisinbread data
echo PHP_EOL .'Import Raisinbread data.... This may take some time' . PHP_EOL;
echo 'You will be prompted for your database password.' . PHP_EOL;
$importCommand = <<<CMD
for n in raisinbread/instruments/instrument_sql/*.sql; do echo \$n; ${mysqlCommand} < \$n || break; done;
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
exec('php tools/resetpassword.php admin');


// END SCRIPT


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
    echo "Restoring config setting `$name` to value `$setting`"
        . PHP_EOL . PHP_EOL;
    try {
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
