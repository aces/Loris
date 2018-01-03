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
require_once 'generic_includes.php';

$config   = NDB_Config::singleton();
$database = $config->getSetting('database');

$instruments = Utility::getAllInstruments();

$confirm =false;
if (!empty($argv[1]) && $argv[1] == 'confirm') {
    $confirm = true;
}

$incorrectAges = array();
$nullAges      = array();

foreach ($instruments as $inst=>$fullName) {

    if (!$DB->tableExists($inst)) {
        echo $inst." does not have a table in the Database\n";
        continue;
    } else if (strpos('_proband', $inst) !== false) {
        echo $inst." is a Proband instrument and should be handled seperately.\n";
        continue;
    }

    //Get instrument SQL table
    $DBInstTable = $DB->pselect(
        "SELECT * 
         FROM $inst i 
            LEFT JOIN flag f ON (i.commentID=f.CommentID)
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
         WHERE c.Active='Y' AND s.Active='Y'",
        array()
    );

    // Break if Date taken does not exist
    if (!$DB->columnExists($inst, 'Date_taken')) {
        echo $inst." does not use a `Date_taken` field and should be handled seperately.\n";
        continue;
    }

    foreach ($DBInstTable as $k => $row) {
        // Get Instrument Instance
        try {
            $instrument = NDB_BVL_Instrument::factory($inst, $row['CommentID'], '', false);
        } catch (LorisException $e) {
            echo "$inst instrument row with CommentID: ".$row['CommentID']." was ".
                " Ignored for one of the following reasons:\n".
                "  - The candidate is inactive.\n".
                "  - The session is inactive.\n\n";
            continue;
        }
        if (!$instrument) {
            // instrument does not exist
            echo $inst." for CommentID:$row[CommentID] could not be instantiated.\n";
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
                //                $date = explode('-', $row['Date_taken']);
                //                $dateArray = array ('Y' => $date[0], 'M' => $date[1], 'd' => $date[2]);
                echo "Fixing age in instrument: ".$inst." for CommentID: ".$commentID."\n";
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
