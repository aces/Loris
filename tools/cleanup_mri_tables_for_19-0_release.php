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

$MRICandidateErrors_orphan_select_all_query = '
    SELECT MRICandidateErrors.* 
    FROM MRICandidateErrors LEFT JOIN tarchive USING (TarchiveID)
    WHERE tarchive.TarchiveID IS NULL 
      AND MRICandidateErrors.TarchiveID IS NOT NULL
';

$MRICandidateErrors_orphan_select_ID_query = '
    SELECT MRICandidateErrors.TarchiveID 
    FROM MRICandidateErrors LEFT JOIN tarchive USING (TarchiveID)
    WHERE tarchive.TarchiveID IS NULL 
      AND MRICandidateErrors.TarchiveID IS NOT NULL
';

//TODO write the other queries

//TODO from here create a function to loop through the different tables and FK
$MRICandidateErrors_orphan_list = select_orphan(
    $MRICandidateErrors_orphan_select_all_query
);

print_orphan('MRICandidateErrors', $MRICandidateErrors_orphan_list);
$delete = ask_to_delete(
    'MRICandidateErrors',
    'TarchiveID'
);

if ($delete == "Y") {
    print "Y";
    delete(
        'MRICandidateErrors',
        'TarchiveID',
        $MRICandidateErrors_orphan_select_ID_query
    );
} elseif ($delete == "NO") {
    print "N";
    //nullify(); //TODO create a function to update the FK field to null
} else {
    print "todo"; //TODO repeat the question with the options
}

//TODO, implement the call to the delete below
//delete(
//    'MRICandidateErrors',
//    'TarchiveID',
//    $MRICandidateErrors_orphan_select_ID_query
//);

function select_orphan($query)
{
    $db = Database::singleton();

    $result = $db->pselect($query, []);

    return $result;
}

function print_orphan($table_name, $orphan_list)
{
    print "\n\n\nList of orphan entries for " . $table_name . "\n";
    print "__________________________________________________\n";
    print_r($orphan_list);
}

function ask_to_delete($table_name, $FK_field)
{
    $message = "\nDo you want to delete the orphan entries from $table_name?
      'Y' to delete from database and keep a copy in a .sql file 
      'N' to keep the entry but set $FK_field to NULL \n";

    print $message;
    $handle = fopen("php://stdin", "r");
    $answer = fgets($handle);
    $answer = str_replace("\n", "", $answer);
    $answer = str_replace("\r", "", $answer);

    return $answer;
}

function delete($table_name, $FK_field, $selectID)
{
    // database connection
    $db = Database::singleton();

    //TODO create the INSERT query to insert into a file so that user can go
    // back if they want to.

    // grep the IDs to delete from the database based on query
    // stored in $selectID
    $result = $db->pselect($selectID, []);
    print_r($result);

    // loop through the IDs and create a string out of it to be used for the
    // delete statement
    $IDs = "";
    foreach ($result as $row) {
        if ($IDs == ""){
            $IDs = $row[$FK_field];
        } else {
            $IDs .= ", $row[$FK_field]";
        }
    }

    // delete from table in $table_name where the foreign key $FK_field is in
    // the list of IDs identified by the select above
    $db->run("DELETE FROM $table_name WHERE $FK_field IN ($IDs)");
}

?>