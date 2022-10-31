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

echo "\n*** Set Data_entry_completion_satus in flag table ***

####################################################################################
This script is to be run for one time use only to update and rename the 
Data_entry_completion_status field. 

Without being run with 'confirm', the script only reports mismatching data. If run 
with 'confirm', the new Required_elements_completed flag is updated by using the 
_determineRequiredElementsCompletedFlag and _setRequiredElementsCompletedFlag 
functions. A previous Data_entry_completion_status value that does not match the 
newly determined Required_elements_completed value will be overwritten.

An array is printed at the end of the script that lists all the cases 
where the new Required_elements_completed flag does not match the old 
Data_entry_completion_status. If the Required_elements_completed flag is not updated
through this script or through instrument saving, it's default is 'N'.

After running this script with 'confirm', run 
Remove_Data_entry_completion_status_instr_column.php to generate a DROP COLUMN patch
to remove the old column from instrument tables.
####################################################################################

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

$confirm = isset($argv[1]) && strtolower($argv[1]) === 'confirm';

// Get all data from flag to back-populate
$flagData = $DB->pselectWithIndexKey(
    "SELECT Data, CommentID, Test_name 
                FROM flag",
    [],
    'CommentID'
);

$mismatched = [];

foreach ($flagData as $cmid => $data) {
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

    $instrDECS = null;
    // Get previously existing DECS either from instrument or flag data
    if (!$instrument->usesJSONData()) {
        $instrDECS = $DB->pselectOne(
            "SELECT Data_entry_completion_status 
            FROM {$instrument->table} WHERE CommentID=:cmid",
            ["cmid" => $cmid]
        );
    }
    $jsonDECS     = $jsonData['Data_entry_completion_status'] ?? null;
    $existingDECS = $instrDECS ?? $jsonDECS;
    $rec          = $instrument->_determineRequiredElementsCompletedFlag();
    // Compare DECS and REC to see if it mismatches
    if (($rec === 'N' && $existingDECS === 'Complete')
        || ($rec === 'Y' && $existingDECS !== 'Complete')
    ) {
        $mismatched[$cmid] = [
            'Data entry completion status'         => $existingDECS,
            'New Required elements completed flag' => $rec
        ];
    }

    if ($confirm) {
        // set the new required elements complete flag
        $instrument->_setRequiredElementsCompletedFlag($rec);

        // Unset Data_entry_completion_status so that it is not
        // saved to data column
        if (isset($jsonData['Data_entry_completion_status'])) {
            unset($jsonData['Data_entry_completion_status']);

            // $instrument->save() is not used here in order to explicitly REMOVE the
            // Data_entry_completion_status field from the JSON string saved in the
            // Data column in flag.
            // unsafeUpdate is used here as it is in _save() function from
            // NDB_BVL_Instrument so that html characters are not escaped
            $DB->unsafeUpdate(
                'flag',
                ['Data' => json_encode($jsonData)],
                ['CommentID' => $cmid]
            );
        }
    }
}

echo "\nThe following CommentIDs reflect cases where the existing 
    Data entry completion status does not match the determined 
    Required elements completed:\n";
print_r($mismatched);


if (!$confirm) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
    "perform the changes\n\n";
}
