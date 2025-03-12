#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This script updates all the data associated with an EEG file
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

use LORIS\electrophysiology_browser\Models\ElectrophysioEvents;

require_once "generic_includes.php";
require_once __DIR__
    . "/../modules/electrophysiology_browser/php/models/"
    . "electrophysioevents.class.inc";

/**
 * Update any derivative files that are not up to date
 * with the data in the database
 */

global $lorisInstance;

$db = \NDB_Factory::singleton()->database();

//Get all file IDs that must be updated
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
