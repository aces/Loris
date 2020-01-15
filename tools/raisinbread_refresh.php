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

require_once 'generic_includes.php';
$info = <<<INFO
This script is used by LORIS developers to DELETE DATA and replace
them with new test data.


INFO;

echo $info;

echo "\e[0;31m*** Executing this script will result in the LOSS OF DATA! ***\e[0m\n";

$cwd = getcwd();
if (substr_compare($cwd, 'tools', mb_strlen($cwd) - mb_strlen('tools')) !== 0) {
    die('Please run this script from the tools/ directory.' . PHP_EOL);
}

try {
    $dbInfo = $config->getSettingFromXML('database');

    if (! $config->getSetting('dev')['sandbox']) {
        throw new \LorisException(
            "Config file indicates that this is not a sandbox. Aborting to " .
            "prevent accidental data loss." . PHP_EOL
        );
    }
    $dbname = $dbInfo['database'];
    $host   = $dbInfo['host'];
    // The admin user and password should be configured to a user with DROP
    // and CREATE permissions for the database.
    $username = $dbInfo['adminUser'];
    $password = $dbInfo['adminPassword'];

    $urlConfigSetting  = $config->getSetting('url');
    $baseConfigSetting = $config->getSetting('base');
    $hostConfigSetting = $config->getSetting('host');

    echo <<<CONFIRMATION
    Please type the database name `$dbname` to confirm you wish to drop tables
    and import test data: 
CONFIRMATION;

    $input = trim(fgets(STDIN));
    if ($input !== $dbname) {
        die('Input did not match database name. Exiting.');
    }

} catch (\DatabaseException $e) {
    echo 'Could not connect to the database in the Config file.' .
        'It\'s possible that the LORIS tables have already been dropped.' .
        PHP_EOL;
    echo 'Continue attempting to install Raisinbread database? (y/N)' . PHP_EOL;
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


$mysqlCommand = <<<CMD
mysql -A $dbname
CMD;

// Test whether a connection to MySQL is possible via a MySQL config file.
// If not, read DB information from the config file. This method is not as
// preferable because it generates MySQL warnings due to the password being
// supplied via a command-line argument.
exec($mysqlCommand . ' -e "show tables;" 2>&1 1>/dev/null', $output, $status);
if ($status != 0) {
    $mysqlCommand = <<<CMD
mysql -A "$dbname" -u "$username" -h "$host" -p$password
CMD;
}

// Drop tables
echo printHeader('Dropping LORIS tables.');
dropTables();

// Print the names of remaining tables, if any. Some tables may remain if they
// have been created at a different time during development and are not
// deleted by the above script. Issues with e.g. foreign keys can be a source
// of error and so it is useful to know what tables remain.
exec(
    "$mysqlCommand -e 'SHOW TABLES;'",
    $tables,
    $status
);
array_shift($tables); // remove the column name
if (count($tables) > 0) {
    echo "\e[33mWARNING: Untracked tables still exist in the database:\e[0m\n";
    array_walk($tables, 'printBulletPoint');

    echo "Do you want to delete them now? (y/N)" . PHP_EOL;
    $input = trim(fgets(STDIN));
    if (mb_strtolower($input) === 'y') {
        dropRemainingTables($tables);
    }
}

// Source LORIS core tabes
printHeader('Creating LORIS core tables...');

$coreTables = glob("../SQL/0000-*.sql");
array_walk($coreTables, 'runPatch');

// Create instrument tables
printHeader('Creating instrument tables...');

$rbInstrumentTables = glob("../raisinbread/instruments/instrument_sql/*.sql");
array_walk($rbInstrumentTables, 'runPatch');

// Import Raisinbread data
printHeader('Importing Raisinbread data...');
$rbData = glob("../raisinbread/RB_files/*.sql");

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
printHeader('Changing the admin password...');
echo 'Please choose a new password for the admin user:' . PHP_EOL;
runCommand('php resetpassword.php admin');

printHeader('Test data successfully installed.');


// END SCRIPT


/**
 * Drops core LORIS tables as well as Raisinbread instrument tables
 *
 * @return void
 */
function dropTables(): void
{
    runPatch(
        '../raisinbread/instruments/instrument_sql/'
        . '9999-99-99-drop_instrument_tables.sql'
    );
    runPatch('../SQL/9999-99-99-drop_tables.sql');
}

/**
 * Wrapper for runCommand() that pipes the content of an SQL file to an CLI
 * instance of MySQL.
 *
 * @param string $file The name of the file to run.
 *
 * @return void
 */
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
    global $password;
    // Hide password from output
    $output = str_replace($password, str_repeat('*', 10), $command);
    echo "Running command: `$output`" . PHP_EOL;
    exec($command, $output, $status);
    // If a non-zero exit code is given, then an error has occurred.
    // In this case, print the output.
    if ($status) {
        foreach ($output as $line) {
            echo $line . PHP_EOL;
        }
    }
}

/**
 * Update a config setting in LORIS to $value.
 *
 * @param string $name  Name of config setting in ConfigSettings table.
 * @param string $value Value to be changed in the Config table.
 *
 * @return void
 *
 * @throws \DatabaseException
 */
function restoreConfigSetting(string $name, string $value): void
{
    printHeader('Restoring config settings...');
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
        echo "Couldn't restore config setting $name." .
            "This may need to be set manually if your LORIS is not hosted at " .
            "localhost." .
            PHP_EOL;
    }
}

/**
 * Drops tables that exist in the database after DROP tables scripts have been
 * executed.
 *
 * @param string[] $tables The name of tables in the database.
 *
 * @return void
 */
function dropRemainingTables(array $tables): void
{
    global $mysqlCommand;
    $commands = ["SET FOREIGN_KEY_CHECKS = 0;"];
    foreach ($tables as $table) {
        $commands[] = "DROP TABLE IF EXISTS $table;";
    }
    $commands[] = "SET FOREIGN_KEY_CHECKS = 1;";
    $script     = <<<SCRIPT
$mysqlCommand -e '%s'
SCRIPT;
    exec(sprintf($script, implode("\n", $commands)));
}

/**
 * Print a formatted and indented bullet point.
 *
 * @param string $line The output.
 *
 * @return void
 */
function printBulletPoint(string $line): void
{
    echo "\t* $line\n";
}

/**
 * Print the input formatted as a header for outut.
 *
 * @param string $line The output.
 *
 * @return void
 */
function printHeader(string $line): void
{
    // Takes 'input', prints '[*] input' in green text.
    fwrite(STDOUT, PHP_EOL . "\e[32m[*] $line\e[0m" . PHP_EOL);
}
