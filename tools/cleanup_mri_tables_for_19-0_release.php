<?php
/** Script to clean up orphan entries in the imaging tables.
 *
 * WARNING!!
 *  This script should be run before applying the following SQL patch
 *  2017-11-29-Add_foreign_key_constraint_to_MRI_violation_tables.sql
 *  located in SQL/Archive/19.0
 *
 * NOTES: affected "table (foreign key)" affected by the patch are:
 *   - MRICandidateErrors (TarchiveID reference to tarchive.TarchiveID)
 *   - mri_violations_log (TarchiveID reference to tarchive.TarchiveID)
 *   - files (TarchiveSource reference to tarchive.TarchiveID)
 *   - files_qcstatus (FileID reference to files.FileID)
 *   - mri_upload (TarchiveID reference to tarchive.TarchiveID)
 *   - mri_upload (SessionID reference to session.ID)
 *   - mri_protocol_checks (Scan_type reference to mri_scan_type.ID)
 *   - tarchive (SessionID reference to session.ID)
 *
 * What does the script do?
 *  1) Select and display orphan entries in the imaging tables (either rows
 *     with a TarchiveID that does not exists in the tarchive table or rows
 *     with a FileID that does not exists in the files table
 *  2) Ask the user whether he/she wants to delete and archive those entries
 *       - if YES, then will backup the entries in a sql file and delete them
 *         from the MySQL database
 *       - if NO, then will set the TarchiveID (or FileID) in the table to NULL
 *         so the patch can create successfully the foreign key TarchiveID
 *         and FileID
 *  3) Congratulations!! You are ready to run the SQL patch!
 *
 */

require_once 'generic_includes.php';
require_once 'Database.class.inc';

$table_array = array(
    'MRICandidateErrors' => array(
        'table1'   => 'MRICandidateErrors',
        'table2'   => 'tarchive',
        'FK_name1' => 'TarchiveID',
        'FK_name2' => 'TarchiveID'
    ),
    'mri_violations_log' => array(
        'table1'   => 'mri_violations_log',
        'table2'   => 'tarchive',
        'FK_name1' => 'TarchiveID',
        'FK_name2' => 'TarchiveID'
    ),
    'files' => array(
        'table1'   => 'files',
        'table2'   => 'tarchive',
        'FK_name1' => 'TarchiveSource',
        'FK_name2' => 'TarchiveID'
    ),
    'files_qcstatus' => array(
        'table1'   => 'files_qcstatus',
        'table2'   => 'files',
        'FK_name1' => 'FileID',
        'FK_name2' => 'FileID'
    ),
    'mri_upload_tarchive' => array(
        'table1'   => 'mri_upload',
        'table2'   => 'tarchive',
        'FK_name1' => 'TarchiveID',
        'FK_name2' => 'TarchiveID'
    ),
    'mri_upload_session' => array(
        'table1'   => 'mri_upload',
        'table2'   => 'session',
        'FK_name1' => 'SessionID',
        'FK_name2' => 'ID'
    ),
    'mri_protocol_checks' => array(
        'table1'   => 'mri_protocol_checks',
        'table2'   => 'mri_scan_type',
        'FK_name1' => 'Scan_type',
        'FK_name2' => 'ID'
    ),
    'tarchive' => array(
        'table1'   => 'tarchive',
        'table2'   => 'session',
        'FK_name1' => 'SessionID',
        'FK_name2' => 'ID'
    )
);

iterate($table_array);

/**
 * iterate through the array of tables to look for orphan entries
 *
 * @param array $table_array tables and fields array to use to look for orphans
 *
 * @return nothing
 */
function iterate($table_array)
{
    foreach ($table_array as &$table_fields) {
        $table1 = $table_fields['table1'];
        $table2 = $table_fields['table2'];
        $FK1    = $table_fields['FK_name1'];
        $FK2    = $table_fields['FK_name2'];

        $select_all = createSelect($table1, $table2, $FK1, $FK2, '*');
        $select_IDs = createSelect($table1, $table2, $FK1, $FK2, $FK1);

        main($select_all, $table1, $FK1, $select_IDs);
    }
}

/**
 * creates the select query based on the table and foreign names given as input
 *
 * @param string $table1        name of table 1 to use in the select
 * @param string $table2        name of table 2 to use in the select (join part)
 * @param string $FK1           name of the foreign key in table 1
 * @param string $FK2           name of the foreign key in table 2
 * @param string $select_fields fields to select (either * or $FK1)
 *
 * @return string  query to be used for the select statements
 */
function createSelect($table1, $table2, $FK1, $FK2, $select_fields)
{
    // create the select query
    $select_query = "
      SELECT $table1.$select_fields 
      FROM $table1 LEFT JOIN $table2 ON ($table1.$FK1=$table2.$FK2)
      WHERE $table2.$FK2 IS NULL AND $table1.$FK1 IS  NOT NULL
    ";

    // return the select query
    return $select_query;
}

/**
 * main function with wrapper of actions to execute for each table
 *
 * @param string $select_all_query select all query
 * @param string $table_name       table name
 * @param string $FK_field         foreign key name
 * @param string $select_ID_query  select (foreign key) ID query
 *
 * @return nothing
 */
function main($select_all_query, $table_name, $FK_field, $select_ID_query)
{
    // get the list of orphans to be displayed in the terminal
    $orphan_list = selectOrphan($select_all_query);

    // if no entries found, return to continue to the next table
    if ( empty($orphan_list) ) {
        print "Congratulations! No orphans found in $table_name! \n";
        return;
    }

    // print the list of orphans found in $table_name
    printOrphan($table_name, $orphan_list);

    // asks the user whether he/she wants to delete or update the orphan entries
    $delete_answer = askToDelete(
        $table_name,
        $FK_field
    );

    // check that the user did answer one of these possibilities: (y, Y, n, N)
    // if user did not answer probably, ask again the question
    while (! preg_match("/^y|n$/i", $delete_answer)) {
        $delete_answer = askToDelete(
            $table_name,
            $FK_field
        );
    }

    // if user wants to delete orphan entries, back it back in a text file
    if (preg_match("/^y$/i", $delete_answer)) {
        backupEntries($select_ID_query, $table_name, $FK_field);
    }


    // clean up the table $table_name based on answer provided by the user
    cleanTable(
        $table_name,
        $FK_field,
        $select_ID_query,
        $delete_answer
    );
    
}

/**
 * selects orphan entries base on select query
 *
 * @param string $query query to use to select orphans
 *
 * @return array result of the select query
 *
 */
function selectOrphan($query)
{
    $db = Database::singleton();

    $result = $db->pselect($query, []);

    return $result;
}

/**
 * prints the list of found orphan entries in the table
 *
 * @param string $table_name  name of the table
 * @param array  $orphan_list array with the list of orphan entries found]
 *
 * @return nothing
 */
function printOrphan($table_name, $orphan_list)
{
    print "\n\n\nList of orphan entries for " . $table_name . "\n";
    print "__________________________________________________\n";
    print_r($orphan_list);
}

/**
 * ask whether the user wants to delete orphans from the table
 *
 * @param string $table_name name of the table in which to delete orphans
 * @param string $FK_field   foreign key to set to null if don't want to delete
 * orphans
 *
 * @return string  answer from the user to the question
 */
function askToDelete($table_name, $FK_field)
{
    // create question to be printed in the terminal
    $message = "\nDo you want to delete the orphan entries from $table_name?
      'Y' to delete from database and keep a copy in a .sql file 
      'N' to keep the entry but set $FK_field to NULL \n";
    print $message;

    // grep answer from stdin and remove carriage return from it
    $handle = fopen("php://stdin", "r");
    $answer = fgets($handle);
    $answer = str_replace("\n", "", $answer);
    $answer = str_replace("\r", "", $answer);

    // return user's answer
    return $answer;
}

/**
 * backup the orphan entries into a text file
 *
 * @param string $selectID   select IDs query
 * @param string $table_name name of the table to backup
 * @param string $FK_field   name of the ID field to use backup
 *
 * @return nothing
 */
function backupEntries($selectID, $table_name, $FK_field)
{
    // grep the IDs to backup from the database based on query stored in
    // $selectID. This will be given as an argument to mysqldump using
    // --where option
    $IDs = generateIdList($selectID, $FK_field);
    $where = $FK_field . " IN (" . $IDs . ")";

    // create directory where the back up will go if it does not exist yet
    if ( !file_exists(__DIR__."/../project/backup") ) {
        mkdir(__DIR__."/../project/backup");
    }

    // grep database connection information from NDB_Config for mysqldump
    $config = NDB_Config::singleton();
    $config->load(__DIR__."/../project/config.xml");
    $database = $config->getSettingFromXML("database");

    // prompt for mysql username
    $prompt   = "Enter MySQL username with mysqldump permission:";
    $username = readline($prompt);

    // prompt for mysql password
    echo "Enter password:";
    system('/bin/stty -echo');
    $password = trim(fgets(STDIN));
    system("/bin/stty echo");

    // create the mysqldump query to back the orphan entries to be deleted
    $sqldump = "mysqldump " .
        "-u " . escapeshellarg($username)         . " " .
        "-h " . escapeshellarg($database['host']) . " " .
        "-p"  . escapeshellarg($password)         . " " .
        escapeshellarg($database['database'])     . " " .
        escapeshellarg($table_name)               . " " .
        "--where=" . escapeshellarg($where)       . " " .
        "--compact --no-create-info"              . " " .
        ">> " . __DIR__ . "/../project/backup/backup_release_19-0_upgrade.sql";

    system($sqldump, $retval); // execute mysqldump

    // print the error of the mysqldump command and exits in case of failure
    if ($retval != 0) {
        print "\nCommand that failed execution: \n" . $sqldump . "\n";
        print "\nCommand error message:\n"          . $retval  . "\n";
        exit;
    }
}

/**
 * either delete orphans from table or update the foreign key of the orphans
 * to NULL if the user wants to keep the orphan entries in the table
 *
 * @param string $table_name    name of the table to update
 * @param string $FK_field      name of the foreign key to update
 * @param string $selectID      query to select IDs to update
 * @param string $delete_answer 'y' to delete or 'n' to update orphan entries
 *
 * @return nothing
 */
function cleanTable($table_name, $FK_field, $selectID, $delete_answer)
{
    // grep the IDs to delete from the database based on query stored in
    // $selectID
    $IDs = generateIdList($selectID, $FK_field);

    // depending on user's answer to the delete question, it will
    if (preg_match("/^y$/i", $delete_answer)) {
        // delete from table in $table_name where the foreign key $FK_field is in
        // the list of IDs identified by the select above
        $query = "DELETE FROM $table_name WHERE $FK_field IN ($IDs)";
    } else {
        // update foreign key $FK_field from table $table_name to NULL where
        // the foreign key $FK_field is in the list of IDs identified by the
        // select above
        $query = "UPDATE $table_name 
                  SET $FK_field=NULL 
                  WHERE $FK_field IN ($IDs)";
    }

    $db = Database::singleton(); // database connection
    $db->run($query); // run query
}

/**
 * generates the list of IDs to be used in a mysql where close (where ID IN ())
 *
 * @param string $selectIDs select the IDs to use in a mysql where close
 * @param string $FK_field  foreign key ID field
 *
 * @return string $IDs string of concatenated IDs found
 */
function generateIdList($selectIDs, $FK_field)
{
    //database connection
    $db = Database::singleton();

    // grep the IDs to delete from the database based on selectIDs
    // stored in $selectID
    $result = $db->pselect($selectIDs, []);

    // loop through the IDs and create a string out of it to be used for the
    // delete statement
    $IDs = "";
    foreach ($result as $row) {
        if ($IDs == "") {
            $IDs = $row[$FK_field];
        } else {
            $IDs .= ", $row[$FK_field]";
        }
    }

    return $IDs; // return sting of IDs
}

?>