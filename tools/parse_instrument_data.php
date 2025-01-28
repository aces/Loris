<?php declare(strict_types=1);

/**
 * This script runs the instrument data parser
 *
 * "Usage: php parse_instrument_data.php instrument fileLocation userID examinerID"
 * "Ex: php parse_instrument_data.php bmi /data/uploads/bmi_data.csv admin admin";
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

require_once __DIR__ . "/generic_includes.php";
use LORIS\InstrumentDataParser;

global $lorisInstance;

if (count($argv) != 5) {
    echo "Failed to process request. Contact administrator";
    exit(1);
}

$instrument   = $argv[1];
$fileLocation = $argv[2];
$userID       = $argv[3];
$examinerID   = $argv[4];

$result = [];

try {
    $fileInfo   = new SplFileInfo($fileLocation);
    $dataParser = new InstrumentDataParser(
        $instrument,
        $fileInfo,
    );
    $data       = $dataParser->parseCSV($lorisInstance);
    $validData  = $dataParser->validateData(
        $data,
        [
            'UserID'   => $userID,
            'Examiner' => $examinerID,
        ]
    );

    if (count($validData['errors']) > 0) {
        echo json_encode($validData['errors']);
        exit(2);    // Invalid Data Error(s)
    }

    $result = $dataParser->insertInstrumentData(
        $lorisInstance,
        $validData['data']
    );
} catch (\Exception $e) {
    echo $e->getMessage();
    exit(3);        // Database or Unexpected Error
}

if (!$result['success']) {
    echo json_encode($result['message']);
    exit(4);        // Data Insertion Error(s)
}

echo $result['message'];
exit(0);    // Success
