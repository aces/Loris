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
    $hostConfigSetting = $config->getSetting('host');

    echo 'Please enter the name of your database to continue.' . PHP_EOL;
} catch (\DatabaseException $e) {
    echo 'Could not connect to the database in the Config file.' .
        'It\'s possible that the LORIS tables have been dropped already.' .
        PHP_EOL;
}

$input = trim(fgets(STDIN));

if ($input !== $dbname) {
    die(
        "Input did not match the name of the database in the config.xml file "
        . "`$dbname`. Exiting as a precaution to prevent data loss."
        . PHP_EOL
    );
}

// Drop tables
echo PHP_EOL .'Dropping LORIS tables....' . PHP_EOL;
echo 'You will be prompted for your database password.' . PHP_EOL;
$dropCommand = <<<DROP
cat raisinbread/instruments/instrument_sql/9999-99-99-drop_instrument_tables.sql \
    SQL/9999-99-99-drop_tables.sql | mysql -A "$dbname" -u "$username" -h "$host" -p
DROP;
exec($dropCommand, $output, $exitStatus);
if ($exitStatus) {
    echo 'An error occurred when trying to drop tables' . PHP_EOL;
    print_r($output);
    die;
}

// Source Raisinbread tables
echo PHP_EOL .'Importing Raisinbread tables into database.... ' .
    'This may take some time.' . PHP_EOL;
echo 'You will be prompted for your database password.' . PHP_EOL;
$importCommand = <<<IMPORT
cat SQL/0000-00-00-schema.sql \
    SQL/0000-00-01-Permission.sql \
    SQL/0000-00-02-Menus.sql \
    SQL/0000-00-03-ConfigTables.sql \
    SQL/0000-00-04-Help.sql \
    SQL/0000-00-05-ElectrophysiologyTables.sql \
    raisinbread/instruments/instrument_sql/aosi.sql \
    raisinbread/instruments/instrument_sql/bmi.sql \
    raisinbread/instruments/instrument_sql/medical_history.sql \
    raisinbread/instruments/instrument_sql/mri_parameter_form.sql \
    raisinbread/instruments/instrument_sql/radiology_review.sql \
    raisinbread/RB_files/*.sql | mysql -A "$dbname" -u "$username" -h "$host" -p
IMPORT;
exec($importCommand, $output, $exitStatus);
if ($exitStatus) {
    echo 'An error occurred when trying to import tables' . PHP_EOL;
    print_r($output);
    die;
}


if (isset($urlConfigSetting, $hostConfigSetting)) {
    echo "Restoring URL to `$urlConfigSetting` and host to $hostConfigSetting"
        . PHP_EOL . PHP_EOL;
    try {
        $DB->run(
            "UPDATE Config c 
            SET c.Value='$urlConfigSetting'
            WHERE c.ConfigID
            IN (SELECT cs.ID FROM ConfigSettings cs WHERE cs.Name = 'url')"
        );
        $DB->run(
            "UPDATE Config c 
            SET c.Value='$hostConfigSetting'
            WHERE c.ConfigID
            IN (SELECT cs.ID FROM ConfigSettings cs WHERE cs.Name = 'host')"
        );
    } catch (\DatabaseException $e) {
        echo "Couldn't restore url and host config settings. " .
            "This may need to be manually if your LORIS is not hosted at " .
            "localhost." .
            PHP_EOL;
    }
}

echo 'Please choose a new password for the admin user:' . PHP_EOL;
exec('php tools/resetpassword.php admin');
    


