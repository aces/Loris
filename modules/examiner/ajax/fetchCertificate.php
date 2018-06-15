<?php
/**
 * Examiner module: Form used to update examiner certification status
 *
 * Fetches default certification form values from the database.
 * Creates the certification history table ("Change Log").
 *
 * @return array of default form values
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 *           Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

if (empty($_REQUEST['identifier'])) {
    throw new LorisException(
        "Incorrect URL: No examiner ID provided."
    );
}

// Get examiner ID
$examinerID = $_REQUEST['identifier'];
$config  = \NDB_Config::singleton();
$factory = \NDB_Factory::singleton();
$DB      = $factory->database();

// Get the examiner name and site name, to be added to the form panel header
$nameResult = $DB->pselectRow(
    "SELECT e.full_name
     FROM examiners e
     WHERE e.examinerID=:EID",
    array('EID' => $examinerID)
);
$examinerName = $nameResult['full_name'];
// Create values array that will eventually be returned
$values['examinerName'] = $examinerName;

// Get min and max year for date field
$values['minYear'] = $config->getSetting('startYear');
$values['maxYear'] = $config->getSetting('endYear');

// Get the list of certification instruments
$instruments = LORIS\examiner\EditExaminer::getCertificationInstruments();

// For each instrument listed in Config, get certification data
foreach($instruments as $key=>$row) {
    $cert[$key] = $DB->pselectRow(
        "SELECT pass, date_cert, comment 
         FROM certification
         WHERE examinerID=:EID
         AND testID=:TID",
        array('EID' => $examinerID,
              'TID' => $key,
        )
    );
    $cert[$key]['name'] = $row;
}
$values['instruments'] = $cert;
// Get the certification history from the database
$certification_history = $DB->pselect(
    "SELECT ch.userID, ch.changeDate, ch.old, ch.old_date,
     tn.Full_name as Measure, ch.primaryVals, ch.new, ch.new_date
     FROM certification_history ch
     LEFT JOIN test_names tn ON (ch.testID=tn.ID)
     LEFT JOIN certification c ON (c.certID=ch.primaryVals)
     WHERE c.examinerID=:EID
     ORDER BY changeDate DESC",
    array('EID' => $examinerID)
);
$values['certification_history'] = $certification_history;

echo json_encode($values);
?>
