#!/usr/bin/php
<?php
use LORIS\electrophysiology_browser\Model\ElectrophysioAnnotations;
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";


/**
 * Update any derivative files that are not up to date
 * with the data in the database
 */

$db = \NDB_Factory::singleton()->database();

// TODO : update the query to use LastWritten

//Get all file IDs that must be updated
$physioFileIDs = $db->pselect(
    "SELECT DISTINCT paf.PhysiologicalFileID
    FROM physiological_annotation_file AS paf
    WHERE paf.LastWritten <= paf.LastUpdate",
    []
);

foreach ($physioFileIDs as $id) {
    (new ElectrophysioAnnotations(intval($id['PhysiologicalFileID'])))
        ->updateFiles();
}