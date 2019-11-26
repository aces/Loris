<?php declare(strict_types=1);
/**
 * This script generates data-only dumps for all tables in the currently active database.
 * Each table in the database gets dumped into a single file in the following location :
 *  BASE_PATH_TO_LORIS/test/RBfiles/RB_TABLE_NAME.sql
 *
 * This script was primarily written to simplify contributions to the raisinbread dataset.
 * Each file contains data TRUNCATION, table LOCKING, and individual INSERTS for each
 * row. This is done by design to allow for an easier review of the changes through
 * a VCS system.
 *
 *
 *
 * note: this script currently depends on the existence of a mysql configuration file
 * allowing to dump data using only the database name. The functionality to input
 * credentials interactively should be added.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.abou-haidar@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . '/../generic_includes.php';

$config = NDB_Config::singleton();
$databaseInfo = $config->getSetting('database');

// Get all tables in the database
$tableNames = $DB->pselectCol("
                      SELECT TABLE_NAME 
                      FROM INFORMATION_SCHEMA.TABLES
                      WHERE TABLE_SCHEMA =:dbn",
    array("dbn"=>$databaseInfo['database'])
);

$adminUser = $databaseInfo["adminUser"];
$adminPassword = $databaseInfo["adminPassword"];
$dbHost = $databaseInfo["host"];

if (empty($dbUser) || empty($dbPassword) || empty($dbHost)) {
    echo "\n\n Some database credentials are missing, please ensure administrator 
    credentials (adminUser, adminPassword) and a host value are available in your 
    configuration file. \n\n";
    die();
}

/*
 * Definitions of the flags used in the command below (ORDERING is IMPORTANT):
 * --complete-insert -> Use complete INSERT statements that include column names
 * --no-create-db    -> Do not write CREATE DATABASE statements
 * --no-create-info  -> Do not write CREATE TABLE statements that re-create each
 *                      dumped table
 * --skip-opt        -> Do not add any of the --opt options (--opt is shorthand for:
 *                      --add-drop-table --add-locks --create-options --disable-keys
 *                      --extended-insert --lock-tables --quick --set-charset)
 * --compact         -> This option enables the --skip-add-drop-table,
 *                      --skip-add-locks, --skip-comments, --skip-disable-keys,
 *                      and --skip-set-charset
 * --add-locks       -> To undo part of --compact. Surround each table dump with
 *                      LOCK TABLES and UNLOCK TABLES statements
 * --verbose         -> Print more information about what the program does.
 * --skip-tz-utc     -> This option prevents MySQL from modifying TIMESTAMP
 *                      values to accommodate for timezone differences.
 */


// Loop through all tables to generate insert statements for each.
foreach ($tableNames as $tableName) {
    $paths = \NDB_Config::singleton()->getSetting('paths');
    $filename = $paths['base'] . "/raisinbread/RB_files/RB_$tableName.sql";
    exec('mysqldump -u '.escapeshellarg($dbUser).' -p'.escapeshellarg($dbPassword).' -h '.escapeshellarg($dbHost).' '.
        escapeshellarg($databaseInfo['database']).' '.
        '--complete-insert '.
        '--no-create-db '.
        '--no-create-info '.
        '--skip-opt '.
        '--compact '.
        '--add-locks '.
        '--verbose '.
        '--skip-tz-utc '.
        $tableName .
        ' | sed -E \'s/LOCK TABLES (`[^`]+`)/SET FOREIGN_KEY_CHECKS=0;\nTRUNCATE TABLE \1;\nLOCK TABLES \1/g\''.
        ' > '. $filename .
        '&& echo "SET FOREIGN_KEY_CHECKS=1;" >> '. $filename
    );
}
