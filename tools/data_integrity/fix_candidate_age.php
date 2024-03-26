<?php

/**
 * This script fixes all candidate ages in the database by recalculating the
 * difference between the saved DOB and the saved Date_taken fields. The script uses
 * the NDB_BVL_Instrument::_saveValues() function to safely make changes to ages.
 *
 * Usage
 *  - php fix_candidate_age.php check;
 *  - php fix_candidate_age.php confirm;
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . '/../generic_includes.php';

$instruments = \NDB_BVL_Instrument::getInstrumentsList($lorisInstance);

if (empty($argv[1])
    || (!empty($argv[1])
    && ($argv[1] === 'help' || ($argv[1] !== 'check' && $argv[1] !== 'confirm')))
    || in_array('-h', $argv, true)
    || !empty($argv[2])
) {
    showHelp();
}

$confirm = false;
if ($argv[1] == 'confirm') {
    $confirm = true;
}

$incorrectAges       = [];
$nullAges            = [];
$verifiedInstruments = [];

foreach ($instruments as $testName=>$instrument) {

    $fullName = $instrument->getFullName();
    //Check what database table is associated with this instrument
    echo "Instrument: $testName ($fullName)\n";

    if (in_array($testName, $verifiedInstruments, true)) {
        echo "\tInstrument $testName has already been verified. skipping.\n";
        continue;
    } else {
        //Add table name to repertoire to make sure it is not checked again
        //in case 2+ instruments use the same table
        $verifiedInstruments[] = $testName;
    }

    if (strpos('_proband', $testName) !== false) {
        echo "\t$testName is a Proband instrument and should be handled ".
            "separately.\n";
        continue;
    }

    $form = array_keys($instrument->form->form);
    // Skip if Date taken does not exist
    if (!in_array('Date_taken', $form)) {
        echo "\t"
        . "$testName does not use a `Date_taken` field and should be ".
            "handled separately."
        . "\n";
        continue;
    }
    // Skip if Candidate Age does not exist
    if (!in_array('Candidate_Age', $form)) {
        echo "\t"
        . "$testName does not use a `Candidate_Age` field "
        . "and should be handled separately.\n";
        continue;
    }

    //Get CommentID list
    $CommentIDs = $DB->pselectCol(
        "SELECT f.CommentID FROM flag f
            JOIN session s ON s.ID=f.SessionID
            JOIN candidate c ON c.CandID=s.CandID
        WHERE c.Active='Y' AND s.Active='Y'
        AND f.Test_name=:tn",
        ['tn' => $testName]
    );

    $instrumentInstances = $instrument->bulkLoadInstanceData($CommentIDs);

    foreach ($instrumentInstances as $instrumentInstance) {
        $data      = $instrumentInstance->getInstanceData();
        $commentID = $instrumentInstance->getCommentID();
        $dateTaken = $data['Date_taken'] ?? null;

        // Flag for problem with date
        $trouble =false;
        if (!empty($dateTaken)) {
            // Check if age is null OR if wrong age
            if (empty($data['Candidate_Age'])) {
                // Null age
                $nullAges[$testName][$commentID] = $commentID;
                $trouble =true;
            } else {
                // get Age from instrument class
                $calculatedAge       = $instrumentInstance->getCandidateAge();
                $calculatedAgeMonths = $instrumentInstance->calculateAgeMonths(
                    $calculatedAge
                );
                //Compare age to value saved in the instrument table
                $DBAge = $data['Candidate_Age'];

                if ($calculatedAgeMonths != $DBAge) {
                    $incorrectAges[$testName][$commentID] = [
                        'cal' => $calculatedAgeMonths,
                        'db'  => $DBAge,
                    ];
                    $trouble =true;
                }
            }

            //Fix the saved values if confirm and trouble flags enabled
            if ($trouble && $confirm) {
                echo "\tFixing age for CommentID: ".$commentID."\n";
                $instrumentInstance->_saveValues(['Date_taken' => $dateTaken]);
            }
        }
    }
}


if (!empty($nullAges)) {
    echo "\n\n#######################################################\n" .
        "########               NULL AGES               ########\n" .
        "#######################################################\n";
    print_r($nullAges);
}

if (!empty($incorrectAges)) {
    echo "\n\n#######################################################\n" .
        "########             INCORRECT AGES            ########\n" .
        "#######################################################\n";
    print_r($incorrectAges);
}

if (!$confirm) {
    echo "\n\n"
    . "Run this tool again with the argument 'confirm' to perform the changes"
    . "\n\n";
}

/**
 * Prints the usage and example help text and stop program
 *
 * @return void
 */
function showHelp()
{
    echo "*** Fix Candidate Age ***\n\n";

    echo "Usage: php fix_candidate_age.php [confirm | check | help | -h]\n";
    echo "Example: php fix_candidate_age.php help\n";
    echo "Example: php fix_candidate_age.php check\n";
    echo "Example: php fix_candidate_age.php confirm\n\n";

    echo "When the 'check' option is used, the script only detects and reports
    miscalculated and NULL ages.
    Using the 'confirm' option will apply the necessary corrections to the data."
    . "\n\n";

    die();
}
