<?php
/**
 * This script is written for a one time use only to iterate through
 * instruments and generate a patch to remove the Data_entry_completion_status
 * field from instrument tables. To be run after Set_Data_entry_completion_status_flag.php
 *
 * PHP Version 7
 *
 * @category Main
 * @package Loris
 * @author Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @licence Loris license
 * @link https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';


$DB     = \Database::singleton();
print_r("This script will generate a drop column patch.\n");
print_r("Getting instrument list...\n");

// Get instrument names
$instrument_arr = $DB->pselectCol("SELECT Test_name FROM test_names", []);

$instruments       = array_filter(
    $instrument_arr,
    [$DB, 'tableExists']
);

$dropColumnPatch = "";

// Generate drop column statement for each instrument
foreach ($instruments as $instrument) {
    print_r("Generating patch for $instrument\n");

    $dropColumnPatch = $dropColumnPatch . "-- Drop Data_entry_completion_status for $instrument\n".
        "ALTER TABLE $instrument \n".
        "\tDROP COLUMN Data_entry_completion_status;\n\n";
}

// Write to patch
$filename = __DIR__ . "/../../SQL/Cleanup_patches/Remove_Data_entry_completion_status.sql";
$fp       = fopen($filename, "w");
fwrite($fp, $dropColumnPatch);
fclose($fp);

print_r("\nComplete. See ". __DIR__ ."../../SQL/Cleanup_patches/Remove_Data_entry_completion_status.sql for patch.\n");

