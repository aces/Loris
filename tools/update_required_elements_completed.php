<?php declare(strict_types=1);

/**
 * This script recalculates the Required Elements Completed flag for an instrument.
 * A CSV file can be provided where the first column is the CommentID.
 *
 * Usage: php update_required_elements_completed.php -instrumentName [Test_name]
 * Usage: php update_required_elements_completed.php -csv [csv_file]
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Saagar Arya
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once "generic_includes.php";

if ($argc != 3 || !in_array($argv[1], ['-instrumentName', '-csv'])) {
    echo "Usage: php update_required_elements_completed.php [-instrumentName Test_name]/[-csv csv_file]\n";
    exit(1);
}

// Generate the log file name with the current date and time
$logFileName = './logs/required_elements_update_' . date('m_d_Y_H_i') . '.csv';

// Open CSV file for logging
$header = ['CommentID', 'Test_name', 'oldValue', 'newValue'];
$logfile = fopen($logFileName, 'w');
fputcsv($logfile, $header);

$CommentIDs = [];

if ($argv[1] === '-csv') {
    if ($argc < 3) {
        echo "Error: CSV file not provided.\n";
        exit(1);
    }
    $csvFile = $argv[2];
    if (!file_exists($csvFile)) {
        echo "Error: File not found - $csvFile\n";
        exit(1);
    }
    
    $file = fopen($csvFile, 'r');
    $headerSkipped = false;
    while (($row = fgetcsv($file)) !== false) {
        if (!$headerSkipped) {
            $headerSkipped = true;
            continue; // Skip header
        }
        $CommentIDs[] = $row[0];
    }
    fclose($file);
} else {
    $Test_name = $argv[2];
    $CommentIDs = $DB->pselectCol(
        "SELECT CommentID FROM flag
            JOIN test_names on flag.TestID = test_names.ID
        WHERE Test_name=:test_name",
        ['test_name' => $Test_name]
    );
}

foreach ($CommentIDs as $CommentID) {
    $instrumentName = ($argv[1] == '-csv')
        ? NDB_BVL_Battery::getInstrumentNameForCommentId($CommentID)
        : $Test_name;

    $oldValue = $DB->pselectOne(
        "SELECT Required_Elements_Completed FROM flag WHERE CommentID = :CommentID",
        ['CommentID' => $CommentID]
    );
    
    $instrument = NDB_BVL_Instrument::factory($lorisInstance, $instrumentName, $CommentID, '');
    $instrument->updateRequiredElementsCompletedFlag();
    
    $newValue = $DB->pselectOne(
        "SELECT Required_Elements_Completed FROM flag WHERE CommentID = :CommentID",
        ['CommentID' => $CommentID]
    );
    
    // Append the data to the CSV file
    fputcsv($logfile, [$CommentID, $instrumentName, $oldValue, $newValue]);
    
    
    if ($oldValue != $newValue) {
        echo "Updated CommentID: $CommentID $instrumentName, Old: $oldValue -> New: $newValue\n";
    } else {
        echo "No change for CommentID: $CommentID, $instrumentName\n";
    }
}
fclose($logfile);

echo "Update process complete. Log saved to $logFileName\n";
