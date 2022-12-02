#!/usr/bin/env php
<?php

/**
 * This script deletes all the data associated with an EEG file
 *
 * Delete all table rows for a given EEG file
 * "Usage: php delete_physiological_file.php PhysiologicalFileID";
 * "Example: php delete_physiological_file.php 25";
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/../../../vendor/autoload.php";
require_once __DIR__ . "/../../generic_includes.php";

/**
 * This script deletes the specified physiological file information.
 *
 * Delete all table rows for a given physiological file
 * "Usage: php delete_physiological_file.php PhysiologicalFileID [confirm] [tosql]";
 * "Example: php delete_physiological_file.php 25";
 * "Example: php delete_physiological_file.php 25 confirm";
 * "Example: php delete_physiological_file.php 25 tosql";
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

const MIN_NUMBER_OF_ARGS = 2;

//define the command line parameters
if (count($argv) < MIN_NUMBER_OF_ARGS
    || $argv[1] == 'help'
) {
    showHelp();
}

// set default arguments
$physioFileID = $argv[1];
$confirm      = false;

// SQL output
$printToSQL = false;
$output     = "";

// get the rest of the arguments
if (!empty($argv[2]) && $argv[2] == 'confirm') {
    $confirm = true;
} else if (!empty($argv[2]) && $argv[2] == 'tosql') {
    $printToSQL = true;
} else if (empty($argv[1])) {
    showHelp();
}

$DB = \NDB_Factory::singleton()->database();

/*
 * Perform validations on arguments
 */

$fileExists = $DB->pselectOneInt(
    "SELECT COUNT(*)
      FROM `physiological_file`
      WHERE PhysiologicalFileID = :pfid",
    ['pfid' => $physioFileID]
);
if ($fileExists == 0) {
    echo "\nThe physiological file with PhysiologicalFileID : $physioFileID does ".
        "not exist in the database.\n\n";
    die();
}

deletePhysiologicalFile($physioFileID, $confirm, $printToSQL, $DB, $output);

/**
 * Prints the usage and example help text and stop program
 *
 * @return void
 */
function showHelp()
{
    echo <<<USAGE
*** Delete Physiological File Info ***

Usage: php delete_physiological_file.php PhysiologicalFileID [confirm] [tosql]
Example: php delete_physiological_file.php 25
Example: php delete_physiological_file.php 25 confirm
Example: php delete_physiological_file.php 25 tosql

When the 'tosql' function is used, the SQL file exported will be located
under the following path:
    loris_root/project/tables_sql/DELETE_PhysiologicalFile_physioFileID.sql
USAGE;
    die;
}

/**
 * All tables with entries to be deleted with relations to `physiological_file`.
 *
 * @param int      $physioFileID Identifying the physiological file
 * @param string   $confirm      Whether to execute the script
 * @param string   $printToSQL   Whether to print the results
 * @param Database $DB           The database to connect to
 * @param string   $output       The string containing the statements to execute
 *
 * @return void
 */
function deletePhysiologicalFile($physioFileID, $confirm, $printToSQL, $DB, &$output)
{

    // Passing argument to delete session script
    $outputType = "";
    if ($printToSQL) {
        $outputType ="tosql";
    } elseif ($confirm) {
        $outputType ="confirm";
    }

    echo "\nArchives\n";
    echo "----------------------------\n";
    $archives = $DB->pselect(
        'SELECT FilePath, InsertTime
        FROM physiological_archive
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($archives);

    echo "\nPhysiological File\n";
    echo "----------------------------\n";
    $file = $DB->pselectRow(
        'SELECT FilePath, OutputTypeName, SessionID
        FROM physiological_file
        JOIN `physiological_output_type` USING(PhysiologicalOutputTypeID)
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($file);

    echo "\nPhysiological Metadata File\n";
    echo "----------------------------\n";
    $metadata_file = $DB->pselectRow(
        'SELECT ppf.Value AS FilePath
        FROM physiological_parameter_file as ppf
        LEFT JOIN parameter_type as pt USING (ParameterTypeID)
        WHERE PhysiologicalFileID=:pfid
        AND pt.Name = "eegjson_file"',
        ['pfid' => $physioFileID]
    );
    print_r($metadata_file);

    echo "\nChannels\n";
    echo "----------------------------\n";
    $channels = $DB->pselect(
        'SELECT DISTINCT FilePath
        FROM physiological_channel
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($channels);

    echo "\nElectrodes\n";
    echo "----------------------------\n";
    $electrodes = $DB->pselect(
        'SELECT DISTINCT FilePath
        FROM physiological_electrode
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($electrodes);

    echo "\nEvents\n";
    echo "----------------------------\n";
    $events = $DB->pselect(
        'SELECT DISTINCT FilePath
        FROM physiological_task_event
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($events);

    echo "\nAnnotations Files\n";
    echo "----------------------------\n";
    $annotations_files = $DB->pselect(
        'SELECT DISTINCT FilePath
        FROM physiological_annotation_file
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($annotations_files);

    echo "\nAnnotations Archives";
    echo "----------------------------\n";
    $annotations_archives = $DB->pselect(
        'SELECT DISTINCT FilePath
        FROM physiological_annotation_archive
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($annotations_archives);

    echo "\nChunks\n";
    echo "----------------------------\n";
    $chunks = $DB->pselect(
        'SELECT ppf.Value AS FilePath
        FROM physiological_parameter_file as ppf
        LEFT JOIN parameter_type as pt USING (ParameterTypeID)
        WHERE PhysiologicalFileID=:pfid
        AND pt.Name = "electrophyiology_chunked_dataset_path"',
        ['pfid' => $physioFileID]
    );
    print_r($chunks);

    // IF CONFIRMED, DELETE ENTRIES AND FILES
    if ($confirm) {
        echo "\nDropping all DB entries and files on disk for physiological file: " .
        $physioFileID . "\n";

        echo "\nDeleting files\n";
        echo "----------------------------\n";

        $data_path = \NDB_Config::singleton()->getSetting("dataDirBasepath");

        $files = [];
        foreach ($archives as $archive) {
            $files[] = $data_path . $archive['FilePath'];
        }

        $files[] = $data_path . $file['FilePath'];
        $files[] = $data_path . $metadata_file['FilePath'];

        foreach ($channels as $channel) {
            $files[] = $data_path . $channel['FilePath'];
        }

        foreach ($electrodes as $electrode) {
            $files[] = $data_path . $electrode['FilePath'];
        }

        foreach ($events as $event) {
            $files[] = $data_path . $event['FilePath'];
        }

        foreach ($annotations_files as $annotation_file) {
            $files[] = $data_path . $annotation_file['FilePath'];
        }

        foreach ($annotations_archives as $annotations_archive) {
            $files[] = $data_path . $annotations_archive['FilePath'];
        }

        foreach ($files as $file) {
            echo "Deleting $file\n";
            unlink($file);
        }

        foreach ($chunks as $chunk) {
            deleteDirectory(dirname($data_path . $chunk['FilePath']));
        }

        echo "\Deleting DB entries\n";
        echo "----------------------------\n";

        // delete from the physiological_archive table
        $DB->delete(
            "physiological_archive",
            ["PhysiologicalFileID" => $physioFileID]
        );

        // delete from the physiological_file table
        $DB->delete(
            "physiological_file",
            ["PhysiologicalFileID" => $physioFileID]
        );

        // delete from the physiological_task_event table
        $DB->delete(
            "physiological_task_event",
            ["PhysiologicalFileID" => $physioFileID]
        );

        // delete from the physiological_annotation_instance table
        $AnnotationFileIDs = $DB->pselect(
            'SELECT AnnotationFileID
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        if (!empty($AnnotationFileIDs)) {
            foreach ($AnnotationFileIDs as $AnnotationFileID) {
                $DB->delete(
                    "physiological_annotation_instance",
                    ["AnnotationFileID" => $AnnotationFileID]
                );
            }
        }

        // delete from the physiological_annotation_file table
        $DB->delete(
            "physiological_annotation_file",
            ["PhysiologicalFileID" => $physioFileID]
        );

        // delete from the physiological_annotation_archive table
        $DB->delete(
            "physiological_annotation_archive",
            ["PhysiologicalFileID" => $physioFileID]
        );

        // delete from the physiological_channel table
        $DB->delete(
            "physiological_channel",
            ["PhysiologicalFileID" => $physioFileID]
        );

        // delete from the physiological_electrode table
        $DB->delete(
            "physiological_electrode",
            ["PhysiologicalFileID" => $physioFileID]
        );

        // delete from the physiological_parameter_file table
        $DB->delete(
            "physiological_parameter_file",
            ["PhysiologicalFileID" => $physioFileID]
        );
    } elseif ($printToSQL) {
        echo "Generating all DELETE statements for physiological file: " .
             $physioFileID . "\n";

        //delete from the physiological_archive table
        _printResultsSQL(
            "physiological_archive",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        //delete from the physiological_file table
        _printResultsSQL(
            "physiological_file",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        //delete from the physiological_task_event table
        _printResultsSQL(
            "physiological_task_event",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        // delete from the physiological_annotation_instance table
        $AnnotationFileIDs = $DB->pselect(
            'SELECT AnnotationFileID
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        if (!empty($AnnotationFileIDs)) {
            foreach ($AnnotationFileIDs as $AnnotationFileID) {
                _printResultsSQL(
                    "physiological_annotation_instance",
                    ["AnnotationFileID" => $AnnotationFileID],
                    $output,
                    $DB
                );
            }
        }

        // delete from the physiological_annotation_file table
        _printResultsSQL(
            "physiological_annotation_file",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        //delete from the physiological_channel table
        _printResultsSQL(
            "physiological_channel",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        //delete from the physiological_electrode table
        _printResultsSQL(
            "physiological_electrode",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        //delete from the physiological_parameter_file table
        _printResultsSQL(
            "physiological_parameter_file",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        _exportSQL($output, $physioFileID);
    }
}

/**
 * Format delete statements.
 *
 * @param string    $table  The name of a LORIS table.
 * @param string    $where  The where clause of the SQl statement
 * @param string    $output A reference to the string to append to.
 * @param \Database $DB     The database to connect to.
 *
 * @return void
 */
function _printResultsSQL($table, $where, &$output, $DB)
{
    $query  = "DELETE FROM $table WHERE ";
    $where  = $DB->_implodeWithKeys(' AND ', $where);
    $query .= $where;
    $query .= ";\n";

    $output .=$query;
}

/**
 * Write SQL commands to file.
 *
 * @param string $output       SQL statements to write to file.
 * @param string $physioFileID The physiological file to be deleted.
 *
 * @return void
 */
function _exportSQL($output, $physioFileID)
{
    //export file
    $filename = __DIR__ .
                "/../../../project/tables_sql/" .
                "DELETE_PhysiologicalFile_$physioFileID.sql";
    $fp       = fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

if ($confirm === false && $printToSQL === false) {
    echo "\n\nRun this tool again with the argument 'confirm' or 'tosql' to ".
        "perform the changes or export them as an SQL patch\n\n";
}

/**
 * Delete directory
 *
 * @param string $dir The directory to delete.
 *
 * @return void
 */
function deleteDirectory($dir)
{
    if (!file_exists($dir)) {
        return true;
    }

    if (!is_dir($dir)) {
        return unlink($dir);
    }

    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }

    }

    return rmdir($dir);
}
