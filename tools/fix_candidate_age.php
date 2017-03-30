<?php

/**
 * inititalize
 */
require_once 'generic_includes.php';

$config   = NDB_Config::singleton();
$database = $config->getSetting('database');

$instruments = Utility::getAllInstruments();

$confirm=false;
if (!empty($argv[1]) && $argv[1] == 'confirm') {
    $confirm = true;
}

$incorrectAges = array();
$nullAges      = array();

foreach ($instruments as $inst=>$fullName) {

    if (!$DB->tableExists($inst)) {
        echo $inst." does not have a table in the Database\n";
        continue;
    }

    //Get instrument SQL table
    $DBInstTable = $DB->pselect(
        "SELECT * FROM $inst",
        array()
    );

    // Break if Date taken does not exist
    if (!$DB->columnExists($inst, 'Date_taken')) {
        continue;
    }

    foreach ($DBInstTable as $k => $row) {
        // Get Instrument Instance
        try {
            $instrument = NDB_BVL_Instrument::factory($inst, $row['CommentID'], null, false);
        } catch (LorisException $e) {
            echo "$inst instrument row with CommentID: ".$row['CommentID']." was skipped since Candidate is not active!\n";
            continue;
        }
        if (!$instrument) {
            // instrument does not exist
            continue;
        }

        $dateTaken = $row['Date_taken'];
        $commentID = $row['CommentID'];

        // Flag for problem with date
        $trouble=false;
        if (!empty($row['Date_taken'])) {
            // Check if age is null OR if wrong age
            if (empty($row['Candidate_Age'])) {
                // Null age
                $nullAges[$inst][$commentID] = $row;
                $trouble=true;
            } else {
                // get Age from instrument class
                $calculatedAge = $instrument->getCandidateAge();
                $agemonths = $calculatedAge['year'] * 12 + $calculatedAge['mon'] + ($calculatedAge['day'] / 30);
                $calculatedAgeMonths = (round($agemonths*10) / 10.0);
                //Compare age to value saved in the instrument table
                $DBAge = $instrument->getFieldValue('Candidate_Age');

                if ($calculatedAgeMonths != $DBAge) {
                    //$incorrectAges[] = $row;
                    $incorrectAges[$inst][$commentID] = array('cal'=>$calculatedAgeMonths, 'db'=>$DBAge);
                    $trouble=true;
                }
            }

            //Fix the saved values if confirm and trouble flags enabled
            if ($trouble && $confirm) {
//                $date = explode('-', $row['Date_taken']);
//                $dateArray = array ('Y' => $date[0], 'M' => $date[1], 'd' => $date[2]);
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
