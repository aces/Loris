<?php
/**
 * This script is written for a one time use only to migrate the
 * 'Data_entry_completion_status' field from the instrument table /
 * Data column of the flag table to it's own column in the flag table
 * called "Required_elements_completed".
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @licence  Loris license
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

echo "\n*** Set Data_entry_completion_satus in flag table***

This script is to be run for one time use only to migrate and rename the 
Data_entry_completion_status field. 

If the instrument has a valid table in the database, Data_entry_completion_status 
will be taken for back-population from the instrument table. Otherwise, it will be 
taken from the data column of the flag table. An update on the flag table will set 
the Required_elements_completed column to the Data_entry_completion_status. 

After running this script, run Remove_Data_entry_completion_status_instr_column.php 
to generate a DROP COLUMN patch to remove the old column from instrument tables.
\n";
$DB = \Database::singleton();

$loris = new \LORIS\LorisInstance(
    \NDB_Factory::singleton()->database(),
    \NDB_Factory::singleton()->config(),
    [
        "project/modules",
        "modules",
    ]
);

// Get all data from flag to back-populate
$flagData = $DB->pselectWithIndexKey(
    "SELECT Data, CommentID, Test_name 
                FROM flag",
    [],
    'CommentID'
);

$mismatched = [];

foreach ($flagData as $cmid => $data) {
    print_r("Migrating Data_entry_completion_status for {$cmid}.\n");

    // instantiate instrument
    try {
        $instrument = NDB_BVL_Instrument::factory(
            $loris,
            $data['Test_name'],
            $cmid,
            ''
        );
    } catch (Exception $e) {
        echo "Could not instantiate {$data['Test_name']} for {$cmid}.\n";
        continue;
    }

    $jsonData = json_decode($data['Data'], true);

    if (!$instrument->usesJSONData()) {
        // Get previously existing DECS either from instrument or flag data
        $instrDECS = $DB->pselectOne(
            "SELECT Data_entry_completion_status 
            FROM {$data['Test_name']} WHERE CommentID=:cmid",
            ["cmid" => $cmid]
        );
    }
    $jsonDECS = $jsonData['Data_entry_completion_status'] ?? null;
    $existingDECS = $instrDECS ?? $jsonDECS;
    // determine and set required elements completed
    $recf = $instrument->_determineRequiredElementsCompletedFlag();
    if (
        ($recf === 'Y' && $existingDECS !== 'Complete') ||
        ($recf === 'N' && $existingDECS !== 'Incomplete')
    ) {
        $mismatched[$cmid] = [
            'Data entry completion status' => $existingDECS,
            'New Required elements completed flag' => $recf
        ];
    }

    // $instrument->_setRequiredElementsCompletedFlag($recf);

    // Unset Data_entry_completion_status so that it is not
    // saved to data column
    if (isset($jsonData['Data_entry_completion_status'])) {
        unset($jsonData['Data_entry_completion_status']);

        // $instrument->save() is not used here in order to explicitly REMOVE the
        // Data_entry_completion_status field from the JSON string saved in the Data
        // column in flag.
        // unsafeUpdate is used here as it is in _save() function from
        // NDB_BVL_Instrument so that html characters are not escaped
        // $DB->unsafeUpdate(
        //     'flag',
        //     ['Data' => json_encode($jsonData)],
        //     ['CommentID' => $cmid]
        // );
    }
}

echo "\nThe following CommentIDs reflect cases where the existing 
    Data entry completion status does not match the determined 
    Required elements completed:\n";
print_r($mismatched);

