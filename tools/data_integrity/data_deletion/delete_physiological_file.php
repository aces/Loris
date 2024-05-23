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
    $archives = $DB->pselectCol(
        'SELECT FilePath
        FROM physiological_archive
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($archives);

    echo "\nPhysiological File\n";
    echo "----------------------------\n";
    $eeg_files = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_file
        JOIN `physiological_output_type` USING(PhysiologicalOutputTypeID)
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($eeg_files);

    echo "\nPhysiological Metadata File\n";
    echo "----------------------------\n";
    $metadata_files = $DB->pselectCol(
        'SELECT DISTINCT ppf.Value AS FilePath
        FROM physiological_parameter_file as ppf
        LEFT JOIN parameter_type as pt USING (ParameterTypeID)
        WHERE PhysiologicalFileID=:pfid
        AND pt.Name = "eegjson_file"',
        ['pfid' => $physioFileID]
    );
    print_r($metadata_files);

    echo "\nChannels\n";
    echo "----------------------------\n";
    $channels = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_channel
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($channels);

    echo "\nElectrodes\n";
    echo "----------------------------\n";
    $electrodes = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_electrode
        JOIN physiological_coord_system_electrode_rel
        USING (PhysiologicalElectrodeID)
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($electrodes);

    echo "\nCoordinate Systems\n";
    echo "----------------------------\n";
    $coordinate_systems = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_coord_system
        JOIN physiological_coord_system_electrode_rel
        USING (PhysiologicalCoordSystemID)
        WHERE PhysiologicalFileID=:pfid
        AND FilePath IS NOT NULL',
        ['pfid' => $physioFileID]
    );
    print_r($coordinate_systems);

    echo "\nEvent Files\n";
    echo "----------------------------\n";
    $event_files = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_event_file
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($event_files);

    echo "\nEvent Archives\n";
    echo "----------------------------\n";
    $event_archives = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_event_archive
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($event_archives);

    echo "\nAnnotations Files\n";
    echo "----------------------------\n";
    $annotations_files = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_annotation_file
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($annotations_files);

    echo "\nAnnotations Archives\n";
    echo "----------------------------\n";
    $annotations_archives = $DB->pselectCol(
        'SELECT DISTINCT FilePath
        FROM physiological_annotation_archive
        WHERE PhysiologicalFileID=:pfid',
        ['pfid' => $physioFileID]
    );
    print_r($annotations_archives);

    echo "\nChunks\n";
    echo "----------------------------\n";
    $chunks = $DB->pselectCol(
        'SELECT ppf.Value AS FilePath
        FROM physiological_parameter_file as ppf
        LEFT JOIN parameter_type as pt USING (ParameterTypeID)
        WHERE PhysiologicalFileID=:pfid
        AND pt.Name = "electrophysiology_chunked_dataset_path"',
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
            $files[] = $data_path . $archive;
        }

        foreach ($eeg_files as $eeg_file) {
            $files[] = $data_path . $eeg_file;
        }

        foreach ($metadata_files as $metadata_file) {
            $files[] = $data_path . $metadata_file;
        }

        foreach ($channels as $channel) {
            $files[] = $data_path . $channel;
        }

        foreach ($electrodes as $electrode) {
            $files[] = $data_path . $electrode;
        }

        foreach ($coordinate_systems as $coordinate_system) {
            $files[] = $data_path . $coordinate_system;
        }

        foreach ($event_files as $event_file) {
            $files[] = $data_path . $event_file;
        }

        foreach ($event_archives as $event_archive) {
            $files[] = $data_path . $event_archive;
        }

        foreach ($annotations_files as $annotation_file) {
            $files[] = $data_path . $annotation_file;
        }

        foreach ($annotations_archives as $annotations_archive) {
            $files[] = $data_path . $annotations_archive;
        }

        foreach ($files as $file) {
            echo "Deleting $file\n";
            try {
                unlink($file);
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }
        }

        foreach ($chunks as $chunk) {
            deleteDirectory(dirname($data_path . $chunk));
        }

        echo "\nDeleting DB entries\n";
        echo "----------------------------\n";

        print("Delete physiological_event_parameter_category_level\n");
        // delete from the physiological_event_parameter_category_level table
        $EventParameterIDs = $DB->pselectCol(
            'SELECT EventParameterID
            FROM physiological_event_parameter
            JOIN physiological_event_file USING(EventFileID)
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        if (!empty($EventParameterIDs)) {
            foreach ($EventParameterIDs as $EventParameterID) {
                $DB->delete(
                    "physiological_event_parameter_category_level",
                    ["EventParameterID" => $EventParameterID]
                );
            }
        }

        print("Delete physiological_event_parameter\n");
        // delete from the physiological_event_parameter table
        $EventFileIDs = $DB->pselectCol(
            'SELECT EventFileID
            FROM physiological_event_file
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        if (!empty($EventFileIDs)) {
            foreach ($EventFileIDs as $EventFileID) {
                $DB->delete(
                    "physiological_event_parameter",
                    ["EventFileID" => $EventFileID]
                );
            }
        }

        print("Delete physiological_annotation_*\n");
        // delete from the physiological_annotation_* tables
        $AnnotationFileIDs = $DB->pselectCol(
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
                $DB->delete(
                    "physiological_annotation_rel",
                    ["AnnotationTSV" => $AnnotationFileID]
                );
                $DB->delete(
                    "physiological_annotation_rel",
                    ["AnnotationJSON" => $AnnotationFileID]
                );
                $DB->delete(
                    "physiological_annotation_parameter",
                    ["AnnotationFileID" => $AnnotationFileID]
                );
            }
        }

        print("Delete physiological_annotation_file\n");
        // delete from the physiological_annotation_file table
        $DB->delete(
            "physiological_annotation_file",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_annotation_archive\n");
        // delete from the physiological_annotation_archive table
        $DB->delete(
            "physiological_annotation_archive",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_channel\n");
        // delete from the physiological_channel table
        $DB->delete(
            "physiological_channel",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_electrode\n");
        // delete from the physiological_electrode table
        $PhysiologicalElectrodeIDs = $DB->pselectCol(
            'SELECT PhysiologicalElectrodeID
            FROM physiological_coord_system_electrode_rel
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        print("Delete physiological_coord_system_point_3d_rel\n");
        // delete all couple from `physiological_coord_system_point_3d_rel`
        // that are linked to the selected physiological file
        $CoordSystemPointRel = $DB->pselect(
            'SELECT ppr.PhysiologicalCoordSystemID, ppr.Point3DID
            FROM physiological_coord_system_point_3d_rel AS ppr
                INNER JOIN physiological_coord_system AS p
                    USING (PhysiologicalCoordSystemID)
                INNER JOIN physiological_coord_system_electrode_rel AS per
                    USING (PhysiologicalCoordSystemID)
            WHERE per.PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );
        if (!empty($CoordSystemPointRel)) {
            foreach ($CoordSystemPointRel as $row) {
                $DB->delete(
                    "physiological_coord_system_point_3d_rel",
                    [
                        "PhysiologicalCoordSystemID" =>
                            $row["PhysiologicalCoordSystemID"],
                        "Point3DID"                  =>
                            $row["Point3DID"]
                    ]
                );
            }
        }

        print("Delete point_3d\n");
        // delete from `point_3d` not linked to any `physiological_electrode`
        // and `physiological_coord_system_point_3d_rel`
        $Point3DIDs = $DB->pselectCol(
            'SELECT Point3DID
            FROM point_3d
            WHERE Point3DID NOT IN (
                SELECT Point3DID FROM physiological_coord_system_point_3d_rel
            ) AND Point3DID NOT IN (
                SELECT Point3DID FROM physiological_electrode
            )',
            []
        );
        if (!empty($Point3DIDs)) {
            foreach ($Point3DIDs as $Point3DID) {
                $DB->delete(
                    "point_3d",
                    ["Point3DID" => $Point3DID]
                );
            }
        }

        print("Delete physiological_coord_system\n");
        // delete `physiological_coord_system` if not linked to any other
        // `physiological_coord_system_electrode_rel`
        // or `physiological_coord_system_point_3d_rel`
        $PhysiologicalCoordSystemIDs = $DB->pselectCol(
            'SELECT PhysiologicalCoordSystemID
            FROM physiological_coord_system
            WHERE PhysiologicalCoordSystemID NOT IN (
                SELECT PhysiologicalCoordSystemID
                FROM physiological_coord_system_point_3d_rel
            ) AND PhysiologicalCoordSystemID NOT IN (
                SELECT PhysiologicalCoordSystemID
                FROM physiological_coord_system_electrode_rel
            )',
            []
        );
        if (!empty($PhysiologicalCoordSystemIDs)) {
            foreach ($PhysiologicalCoordSystemIDs as $PhysiologicalCoordSystemID) {
                $DB->delete(
                    "physiological_coord_system",
                    ["PhysiologicalCoordSystemID" => $PhysiologicalCoordSystemID]
                );
            }
        }

        print("Delete physiological_coord_system_electrode_rel\n");
        // delete from the physiological_coord_system_electrode_rel table
        $DB->delete(
            "physiological_coord_system_electrode_rel",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_electrode\n");
        // delete from the physiological_electrode table
        if (!empty($PhysiologicalElectrodeIDs)) {
            foreach ($PhysiologicalElectrodeIDs as $PhysiologicalElectrodeID) {
                $DB->delete(
                    "physiological_electrode",
                    ["PhysiologicalElectrodeID" => $PhysiologicalElectrodeID]
                );
            }
        }

        print("Delete physiological_parameter_file\n");
        // delete from the physiological_parameter_file table
        $DB->delete(
            "physiological_parameter_file",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_archive\n");
        // delete from the physiological_archive table
        $DB->delete(
            "physiological_archive",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_event_archive\n");
        // delete from the physiological_event_archive table
        $DB->delete(
            "physiological_event_archive",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_task_event_opt\n");
        // delete from the physiological_task_event_opt table
        $PhysiologicalTaskEventIDs = $DB->pselectCol(
            'SELECT PhysiologicalTaskEventID
            FROM physiological_task_event
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        if (!empty($PhysiologicalTaskEventIDs)) {
            foreach ($PhysiologicalTaskEventIDs as $PhysiologicalTaskEventID) {
                $DB->delete(
                    "physiological_task_event_opt",
                    ["PhysiologicalTaskEventID" => $PhysiologicalTaskEventID]
                );
            }
        }

        print("Delete physiological_task_event\n");
        // delete from the physiological_task_event table
        $DB->delete(
            "physiological_task_event",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_event_file\n");
        // delete from the physiological_event_file table
        $DB->delete(
            "physiological_event_file",
            ["PhysiologicalFileID" => $physioFileID]
        );

        print("Delete physiological_file\n");
        // delete from the physiological_file table
        $DB->delete(
            "physiological_file",
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

        // delete from the physiological_task_event_opt table
        $PhysiologicalTaskEventIDs = $DB->pselectCol(
            'SELECT PhysiologicalTaskEventID
            FROM physiological_task_event
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        if (!empty($PhysiologicalTaskEventIDs)) {
            foreach ($PhysiologicalTaskEventIDs as $PhysiologicalTaskEventID) {
                _printResultsSQL(
                    "physiological_task_event_opt",
                    ["PhysiologicalTaskEventID" => $PhysiologicalTaskEventID],
                    $output,
                    $DB
                );
            }
        }

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

        // delete all couple from `physiological_coord_system_point_3d_rel`
        // that are linked to the selected physiological file
        $CoordSystemPointRel = $DB->pselect(
            'SELECT ppr.PhysiologicalCoordSystemID, ppr.Point3DID
            FROM physiological_coord_system_point_3d_rel AS ppr
                INNER JOIN physiological_coord_system AS p
                    USING (PhysiologicalCoordSystemID)
                INNER JOIN physiological_coord_system_electrode_rel AS per
                    USING (PhysiologicalCoordSystemID)
            WHERE per.PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );
        if (!empty($CoordSystemPointRel)) {
            foreach ($CoordSystemPointRel as $row) {
                _printResultsSQL(
                    "physiological_coord_system_point_3d_rel",
                    [
                        "PhysiologicalCoordSystemID" =>
                            $row["PhysiologicalCoordSystemID"],
                        "Point3DID"                  =>
                            $row["Point3DID"]
                    ],
                    $output,
                    $DB
                );
            }
        }

        // delete from `point_3d` not linked to any `physiological_electrode`
        // and `physiological_coord_system_point_3d_rel`
        $Point3DIDs = $DB->pselectCol(
            'SELECT Point3DID
            FROM point_3d
            WHERE Point3DID NOT IN (
                SELECT Point3DID FROM physiological_coord_system_point_3d_rel
            ) AND Point3DID NOT IN (
                SELECT Point3DID FROM physiological_electrode
            )',
            []
        );
        if (!empty($Point3DIDs)) {
            foreach ($Point3DIDs as $Point3DID) {
                _printResultsSQL(
                    "point_3d",
                    ["Point3DID" => $Point3DID],
                    $output,
                    $DB
                );
            }
        }

        // delete from the physiological_coord_system_electrode_rel table
        _printResultsSQL(
            "physiological_coord_system_electrode_rel",
            ["PhysiologicalFileID" => $physioFileID],
            $output,
            $DB
        );

        // delete from the physiological_electrode table
        $PhysiologicalElectrodeIDs = $DB->pselectCol(
            'SELECT PhysiologicalElectrodeID
            FROM physiological_coord_system_electrode_rel
            WHERE PhysiologicalFileID=:pfid',
            ['pfid' => $physioFileID]
        );

        if (!empty($PhysiologicalElectrodeIDs)) {
            foreach ($PhysiologicalElectrodeIDs as $PhysiologicalElectrodeID) {
                _printResultsSQL(
                    "physiological_electrode",
                    ["PhysiologicalElectrodeID" => $PhysiologicalElectrodeID],
                    $output,
                    $DB
                );
            }
        }

        // delete `physiological_coord_system` if not linked to any other
        // `physiological_coord_system_electrode_rel`
        // or `physiological_coord_system_point_3d_rel`
        $PhysiologicalCoordSystemIDs = $DB->pselectCol(
            'SELECT PhysiologicalCoordSystemID
            FROM physiological_coord_system
            WHERE PhysiologicalCoordSystemID NOT IN (
                SELECT PhysiologicalCoordSystemID
                    FROM physiological_coord_system_point_3d_rel
            ) AND PhysiologicalCoordSystemID NOT IN (
                SELECT PhysiologicalCoordSystemID
                    FROM physiological_coord_system_electrode_rel
            )',
            []
        );
        if (!empty($PhysiologicalCoordSystemIDs)) {
            foreach ($PhysiologicalCoordSystemIDs as $PhysiologicalCoordSystemID) {
                _printResultsSQL(
                    "physiological_coord_system",
                    ["PhysiologicalCoordSystemID" => $PhysiologicalCoordSystemID],
                    $output,
                    $DB
                );
            }
        }

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
        try {
            return unlink($dir);
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
            return false;
        }
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
