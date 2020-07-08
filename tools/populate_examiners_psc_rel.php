#!/usr/bin/env php
<?php
/**
 * This script is written for a one time use only to populate the examiners_psc_rel
 * table in the database after decoupling the examiners from the CenterID.
 *
 * affected tables:
 *  - all instrument tables
 *  - examiners
 *  - examiners_psc_rel
 *  - certification
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once 'generic_includes.php';

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../project/config.xml");
$config = NDB_Config::singleton();
$db     =& Database::singleton();

$examinersRows = $db->pselect(
    "SELECT * FROM examiners",
    array()
);

//get all instruments to update examiner fields
$instruments = Utility::getAllInstruments();

$examinersOrganized =array();

// ASSERT DB state
// Make sure there is no cause for errors
$errorPRE =false;
///////// examiners.centerID not in psc.CenterID
$pscCheck = $db->pselect(
    "SELECT * FROM examiners WHERE centerID NOT IN (SELECT centerID FROM psc)",
    array()
);
if (!empty($pscCheck)) {
    $errorPRE =true;
    foreach ($pscCheck as $k=>$row) {
        echo "examiners table contains site ID: ".$row['centerID']." which does not exist in the database (psc).\n";
    }
}
///////// examiners.centerID is null
$pscNullCheck = $db->pselect(
    "SELECT * FROM examiners WHERE centerID IS NULL",
    array()
);
if (!empty($pscNullCheck)) {
    $errorPRE =true;
    foreach ($pscNullCheck as $k=>$row) {
        echo "examiners table contains NULL sites for examinerID: $row[examinerID]\n";
    }
}
///////// examiners.full_name is null
$nameNullCheck = $db->pselect(
    "SELECT * FROM examiners WHERE full_name IS NULL OR full_name =''",
    array()
);
if (!empty($nameNullCheck)) {
    $errorPRE =true;
    foreach ($nameNullCheck as $k=>$row) {
        echo "examiners table contains NULL names for examinerID: $row[examinerID]\n";
    }
}
///////// examiners.full_name is null
$activeNullCheck = $db->pselect(
    "SELECT * FROM examiners WHERE active IS NULL OR active =''",
    array()
);
if (!empty($activeNullCheck)) {
    $errorPRE =true;
    foreach ($activeNullCheck as $k=>$row) {
        echo "examiners table contains NULL active statuses for examinerID: $row[examinerID]\n";
    }
}
///////// examiners.full_name is null
$pendingNullCheck = $db->pselect(
    "SELECT * FROM examiners WHERE pending_approval IS NULL OR pending_approval =''",
    array()
);
if (!empty($pendingNullCheck)) {
    $errorPRE =true;
    foreach ($pendingNullCheck as $k=>$row) {
        echo "examiners table contains NULL pending approval statuses for examinerID: $row[examinerID]\n";
    }
}
///////// certification.examinerID NOT in examiners.examinerID
$certCheck = $db->pselect(
    "SELECT DISTINCT examinerID FROM certification WHERE examinerID NOT IN (SELECT examinerID FROM examiners)",
    array()
);
if (!empty($certCheck)) {
    $errorPRE =true;
    foreach ($certCheck as $k=>$row) {
        echo "Certification table contains examiner ID: ".$row['examinerID']." which does not exist in the database (examiners).\n";
    }
}
///////// instrument.Examiner NOT IN examiners.examinerID
foreach ($instruments as $table=>$name) {
    if ($db->tableExists($table) && $db->columnExists($table, 'Examiner')) {
        $instCheck = $db->pselect(
            "SELECT * FROM ".$table." WHERE Examiner NOT IN (SELECT examinerID FROM examiners)",
            array()
        );
        if (!empty($instCheck)) {
            $errorPRE =true;
            foreach ($instCheck as $k=>$row) {
                echo "Instrument $table contains examiner ID: ".$row['Examiner']." which does not exist in the database (examiners).\n";
            }
        }
    }
}
///////// final_radiological_review.Final_Examiner2 final_radiological_review.Final_Examiner NOT in examiners.examinerID
$frrCheck = $db->pselect(
    "SELECT * FROM final_radiological_review 
      WHERE Final_Examiner2 NOT IN (SELECT examinerID FROM examiners) 
          OR Final_Examiner NOT IN (SELECT examinerID FROM examiners) ",
    array()
);
if (!empty($frrCheck)) {
    $errorPRE =true;
    foreach ($frrCheck as $k=>$row) {
        echo "Table final_radiological_review contains Final_Examiner IDs: ".$row['Final_Examiner']." and ".$row['Final_Examiner2']." which do not exist in the database (examiners).\n";
    }
}

if ($errorPRE) {
    echo "\n\nSome errors were detected, this script will now terminate.\nPlease Fix errors and try running script again.\n\n";
    die();
}

foreach ($examinersRows as $k=>$row) {
    $item = array(
             'examinerID'       => $row['examinerID'],
             'centerID'         => $row['centerID'],
             'active'           => $row['active'],
             'pending_approval' => $row['pending_approval'],
            );
    // Compare without spaces, without cases
    $examinersOrganized[strtolower(str_replace(' ','',$row['full_name']))][] = $item;
}

print_r($examinersOrganized);

echo "\nA copy of the `examiners` table has been created as `examiners_17.0`. \n\n";


foreach ($examinersOrganized as $name=>$data_array) {
    echo "Changes for Examiner: ".$name."\n";
    // the first value will be maintained as the final examiner entry
    echo "    -> Site ".$data_array[0]['centerID']." added\n";
    $db->insert('examiners_psc_rel', $data_array[0]);
    $finalExaminerID =$data_array[0]['examinerID'];
    unset($data_array[0]);


    // all other entries for this examiner will be deleted
    // certification table and instruments will be updated
    foreach ($data_array as $k=>$dupData) {
        // replace old EID by final one
        $oldExaminerID         =$dupData['examinerID'];
        $dupData['examinerID'] =$finalExaminerID;

        //INSERT into examiners_psc_rel
        echo "    -> Site ".$dupData['centerID']." added\n";
        $db->insertIgnore('examiners_psc_rel', $dupData);

        // UPDATE certification table
        echo "        -> Updating Certification examinerIDs: ".$oldExaminerID."=>".$finalExaminerID."\n";
        $db->update('certification', array('examinerID' => $finalExaminerID), array('examinerID' => $oldExaminerID));

        // UPDATE final_radiological_review
        echo "        -> Updating final radiological review examinerIDs: ".$oldExaminerID."=>".$finalExaminerID."\n";
        $db->update('final_radiological_review', array('Final_Examiner' => $finalExaminerID), array('Final_Examiner' => $oldExaminerID));
        $db->update('final_radiological_review', array('Final_Examiner2' => $finalExaminerID), array('Final_Examiner2' => $oldExaminerID));
        // UPDATE instrument tables
        foreach ($instruments as $table=>$name) {
            if ($db->tableExists($table) && $db->columnExists($table, 'Examiner')) {
                echo "        -> Updating Instrument ".$table." examinerIDs: ".$oldExaminerID."=>".$finalExaminerID."\n";
                $db->update($table, array('Examiner' => $finalExaminerID), array('Examiner' => $oldExaminerID));
            }
        }
        // DELETE examiners additional entries
        echo "    -> DELETING duplicate examinerID: ".$oldExaminerID."\n\n";
        $db->delete('examiners', array('examinerID' => $oldExaminerID));
    }
}

echo "\n\nThe script ran successfully, make sure to run the clean-up commands available in the SQL/Archive/18.0/clean-up directory. \n
These commands will drop the now redundant fields and add new constraints to the examiner tables.\n\n";
