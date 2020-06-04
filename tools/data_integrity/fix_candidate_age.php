<?php

/**
 * This script fixes all candidate ages in the database by recalculating the
 * difference between the saved DOB and the saved Date_taken fields. The script uses
 * the NDB_BVL_Instrument::_saveValues() function to safely make changes to ages.
 *
 * Usage
 *  - php fix_candidate_age.php;
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

$instruments = Utility::getAllInstruments();

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

$incorrectAges  = array();
$nullAges       = array();
$verifiedTables = array();

foreach ($instruments as $inst=>$fullName) {

    //Check what database table is associated with this instrument
    echo "Instrument: $inst ($fullName)\n";
    try {
        $instrument = NDB_BVL_Instrument::factory($inst, "", "");
    } catch (Exception $e) {
        echo "\t$inst does not seem to be a valid instrument.\n";
        continue;
    }

    $table = $instrument->table;

    if (in_array($table, $verifiedTables, true)) {
        echo "\tTable $table has already been verified. skipping.\n";
        continue;
    } else {
        //Add table name to repertoire to make sure it is not checked again
        //in case 2+ instruments use the same table
        $verifiedTables[] = $table;
    }

    if (!$DB->tableExists($table)) {
        echo "\tTable $table for instrument $inst does not exist in the Database\n";
        continue;
    } else if (strpos('_proband', $inst) !== false) {
        echo "\t$inst is a Proband instrument and should be handled seperately.\n";
        continue;
    }

    // Skip if Date taken does not exist
    if (!$DB->columnExists($inst, 'Date_taken')) {
        echo "\t$inst does not use a `Date_taken` field and should be handled separately.\n";
        continue;
    }
    // Skip if Date taken does not exist
    if (!$DB->columnExists($inst, 'Candidate_Age')) {
        echo "\t$inst does not use a `Candidate_Age` field and should be handled separately.\n";
        continue;
    }

    //Get instrument SQL table
    $DBInstTable = $DB->pselect(
        "SELECT i.CommentID, Date_taken, Candidate_Age
         FROM $table i 
            LEFT JOIN flag f ON (i.commentID=f.CommentID)
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
         WHERE c.Active='Y' AND s.Active='Y'",
        array()
    );

    foreach ($DBInstTable as $k => $row) {
        // Get Instrument Instance with commentID
        try {
            $instrument = NDB_BVL_Instrument::factory($inst, $row['CommentID'], '', false);
        } catch (Exception $e) {
            echo "\t$inst instrument row with CommentID: ".$row['CommentID']." was ".
                " Ignored for one of the following reasons:\n".
                "  - The candidate is inactive.\n".
                "  - The session is inactive.\n\n";
            continue;
        }

        if (!$instrument) {
            // instrument does not exist
            echo "\t$inst for CommentID:$row[CommentID] could not be instantiated.\n";
            continue;
        }

        $dateTaken = $row['Date_taken'];
        $commentID = $row['CommentID'];

        // Flag for problem with date
        $trouble =false;
        if (!empty($row['Date_taken'])) {
            // Check if age is null OR if wrong age
            if (empty($row['Candidate_Age'])) {
                // Null age
                $nullAges[$inst][$commentID] = $row['CommentID'];
                $trouble =true;
            } else {
                // get Age from instrument class
                $calculatedAge       = $instrument->getCandidateAge();
                $calculatedAgeMonths = $instrument->calculateAgeMonths($calculatedAge);
                //Compare age to value saved in the instrument table
                $DBAge = $instrument->getFieldValue('Candidate_Age');

                if ($calculatedAgeMonths != $DBAge) {
                    //$incorrectAges[] = $row;
                    $incorrectAges[$inst][$commentID] = array(
                                                         'cal' => $calculatedAgeMonths,
                                                         'db'  => $DBAge,
                                                        );
                    $trouble =true;
                }
            }

            //Fix the saved values if confirm and trouble flags enabled
            if ($trouble && $confirm) {
                echo "\tFixing age for CommentID: ".$commentID."\n";
                $instrument->_saveValues(array('Date_taken' => $dateTaken));
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
    echo "\n\nRun this tool again with the argument 'confirm' to perform the changes\n\n";
}

/*
 * Prints the usage and example help text and stop program
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
    Using the 'confirm' option will apply the necessary corrections to the data.\n\n";

    die();
}
