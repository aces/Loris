#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This script updates the event files. This includes adding/updating the
 * HED column with mappings and creating the archive downloaded from the
 * EEG browser, which bundles it with its sidecar (corresponding events.json)
 *
 * Usage: php update_event_files.php
 */

use LORIS\electrophysiology_browser\Models\ElectrophysioEvents;

require_once "generic_includes.php";
require_once __DIR__
    . "/../modules/electrophysiology_browser/php/models/"
    . "electrophysioevents.class.inc";

global $lorisInstance;

$db = \NDB_Factory::singleton()->database();

$physioFileIDs = $db->pselect(
    "SELECT DISTINCT paf.PhysiologicalFileID
    FROM physiological_event_file AS paf
    WHERE paf.LastWritten <= paf.LastUpdate",
    []
);

foreach ($physioFileIDs as $id) {
    (new ElectrophysioEvents(
        $lorisInstance,
        intval($id['PhysiologicalFileID'])
    )
    )->updateFiles();
}
