#!/usr/bin/env php
<?php

set_include_path(
    get_include_path().":".
    __DIR__."/../project/tools:".
    __DIR__."/../php/tools:"
);

use LORIS\electrophysiology_browser\Models\ElectrophysioAnnotations;
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once __DIR__
    . "/../modules/electrophysiology_browser/php/models/"
    . "electrophysioannotations.class.inc";

/**
 * Update any derivative files that are not up to date
 * with the data in the database
 */

$db = \NDB_Factory::singleton()->database();

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