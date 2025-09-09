<?php declare(strict_types=1);

/**
 * This script runs the instrument data parser
 *
 * "Usage: php parse_instrument_data.php instrument fileLocation userID examinerID"
 * "Ex: php parse_instrument_data.php bmi /data/uploads/bmi_data.csv admin admin";
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

require_once __DIR__ . "/generic_includes.php";
use LORIS\InstrumentDataParser;

global $lorisInstance;

if (count($argv) != 5) {
    echo "Failed to process request. Contact administrator";
    exit(1);
}

$instrumentName    = $argv[1];
$fileLocation      = $argv[2];
$createNonexistent = $argv[3] == 'true';
$multiInstrument   = $argv[4] == 'true';
$userID            = $argv[5];
$examinerID        = $argv[6];

$result = [];

try {
    $fileInfo   = new SplFileInfo($fileLocation);
    $dataParser = new InstrumentDataParser($fileInfo);
    if ($multiInstrument) {
        $result = $dataParser->parseCSVMulti(
            $this->loris,
            explode('{@}', $instrumentName),
            $userID,
            $createNonexistent
        );
    } else {
        $data      = $dataParser->parseCSV(
            $lorisInstance,
            $instrumentName,
            $createNonexistent
        );
        $validData = $dataParser::validateData(
            $data,
            [
                'UserID'   => $userID,
                'Examiner' => $examinerID,
            ],
            $createNonexistent
        );

        if (count($validData['errors']) > 0) {
            echo json_encode($validData['errors']);
            exit(2);    // Invalid Data Error(s)
        }

        $result = $dataParser::insertInstrumentData(
            $lorisInstance,
            $validData['data'],
            $instrumentName,
            $fileInfo->getFilename()
        );
    }
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
