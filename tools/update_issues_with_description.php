#!/usr/bin/php
<?php
/**
 * The script update_issues_with_description.php creates a new field
 * called "description" in the issues table and copies the first comment
 * by timestamp (dateAdded) in issues_comments table matching based on the issueID
 *
 * Usage: php update_issues_with_description.php
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/generic_includes.php";

$tablename = "issues";
$filename  = __DIR__ . "/../project/tables_sql/".$tablename.".sql";
$output    = "ALTER TABLE $tablename ADD description longtext DEFAULT NULL;\n";
$output   .= "SET FOREIGN_KEY_CHECKS=0;\n";
$output   .= "UPDATE $tablename
    SET description = (
        SELECT issueComment
        FROM issues_comments ic
        WHERE ic.issueID = issues.issueID
        ORDER BY ic.dateAdded ASC
        LIMIT 1
    )
    WHERE issueID IN (
        SELECT issueID
        FROM issues_comments
    );\n";
$output   .= "ALTER TABLE issues_history MODIFY fieldChanged
enum('assignee','status','comment','sessionID','centerID','title','category',
'module','lastUpdatedBy','priority','candID', 'description') NOT NULL DEFAULT
'comment';\n";
$dirname   = dirname($filename);
if (!is_dir($dirname)) {
    mkdir($dirname, 0755, true);
}
$fp = fopen($filename, "w");
fwrite($fp, $output);
fclose($fp);

$issueQueries = glob(__DIR__ . "/../project/tables_sql/issues.sql");
array_walk($issueQueries, 'runPatch');
echo "\n $tablename table updation complete\n";

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
    $config       = \NDB_Factory::singleton()->config();
    $dbInfo       = $config->getSettingFromXML('database');
    $dbname       = $dbInfo['database'];
    $host         = $dbInfo['host'];
    $username     = $dbInfo['adminUser'];
    $password     = $dbInfo['adminPassword'];
    $mysqlCommand = sprintf(
        "mysql -A %s -u %s -h %s -p%s",
        escapeshellarg($dbname),
        escapeshellarg($username),
        escapeshellarg($host),
        escapeshellarg($password)
    );
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
    echo "Running update queries...";
    exec($command, $output, $status);
    // If a non-zero exit code is given, then an error has occurred.
    // In this case, print the output.
    if ($status) {
        foreach ($output as $line) {
            echo $line . PHP_EOL;
        }
    }
}