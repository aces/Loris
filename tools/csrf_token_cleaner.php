<?php
/**
 * Script to remove out-of-date csrf tokens from the database.
 * Ideally this should be run as a cron job to keep the Database from getting
 * too full.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Tools
 * @author   John Saigle <john.saigle@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

require_once __DIR__ . "/../vendor/autoload.php";
error_reporting(E_ALL);

// Create db connection.
$config    = \NDB_Config::singleton();
$db_config = $config->getSetting('database');
$db        = \Database::singleton(
    $db_config['database'],
    $db_config['username'],
    $db_config['password'],
    $db_config['host']
);
// Delete all tokens more than 2 days old.
$queryTime = date('Y-m-d', strtotime("-2 day"));
$query     = 'SELECT * FROM csrf_tokens WHERE CreatedAt < :queryTime';
try {
    $result = $db->pselect($query, array('queryTime' => $queryTime));
    foreach ($result as $row) {
        $db->delete('csrf_tokens', array('CsrfTokenID' => $row['CsrfTokenID']));
    }
} catch (\DatabaseException $e) {
    die("Deleting csrf tokens failed: $e");
}
