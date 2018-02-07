<?php
/**
 * This script is written for a one time use only to normalise the consent feature of the
 * candidate parameters module and populate the normalised tables with existing
 * data from the participant_status and consent_info_history tables in the database.
 * 
 * The old tables and columns should be deleted after running this script. Follow the prompts at the end.
 * 
 * affected tables:
 * - participant_status
 * - consent_info_history
 * - consent_type
 * - candidate_consent_type_rel
 * _ candidate_consent_type_history
 * 
 * PHP Version 7
 * 
 * @category Main 
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
// TO CHECK: 
// 1. 1 for each loop for consent data, 1 for history
// 2. print array at the end of first for each loop
// 3. check consents in config has row in old table
// 4. check if column in tables is in config (leave till the end)
// 5. check if consent null but there are still dates
// 6. check for zero dates, be explicit in errors - run zerodates php script if they want to remove those because 0 dates cannot be inserted) 
// 7. for every consent, check that all 3 columns in old table exists
// 8. every time I check for null, check for empty for consent status values including dates
// 9. check 'useConsent' and insert into ConfigSettings;
// TO DO:
// 1. Check config.xml for consents in /projects/ - DONE
// 2. Reiterate through <ConsentModule> and put <Consent> <name> and <label> into array i.e. $consentTypes - DONE
// 3. Populate array into consent_type table - DONE
// 4. For each CandID in participant_status, and for each consent i.e. $consentTypes[key] where the entry !== NULL OR EMPTY STRING, put into array $consentValues entries from columns consent_name, consent_name_date, and consent_name_withdrawal. Between the two for loops, add print saying these are the things going into database, and have a confirm flag (argument to the script).
// 5. Populate into candidate_consent_type_rel CandidateID, ConsentTypeID where Name=$consentTypes[key], select consent_name, consent_name_date, consent_name_withdrawal - DONE
// 6. Select * from consent_info_history and put in array
// 7. Populate candidate_consent_type_history:
//          i) for each unique ID entry in consent_info_history, let PSCID = PSCID where CandID = CandID in
//             consent_info_history
//         ii) for each $consentTypes[key] as column/field name where entry !== null, insert consent_name in
//             ConsentName of candidate_consent_type_history, and Consent Label of ConsentTypeID where 'Name'=c
//             onsent_name
//        iii) put in array all values under column where not null, along with consent_name_date, and
//             consent_name_withdrawal, entry_staff, entry_date

require_once 'generic_includes.php';

//$client = new NDB_Client();
//$client->makeCommandLine();
//$client->initialize("../project/config.xml");
$config = NDB_Config::singleton();
$db     =& Database::singleton();

// Get consent info form Config.xml
$consentConfig = $config->getSettingFromXML('ConsentModule');
$useConsent = $consentConfig['useConsent'];
$consents = $consentConfig['Consent'];
print_r($consentConfig);

//update ConfigSetting with value of 'useConsent' if true
$configID = $db->pselect(
              'SELECT ID FROM ConfigSettings WHERE Name="useConsent"',
              array()
            );
/*
if ($useConsent === true) {
  $updateValue = ['Value' => $useConsent];
  $db->update(
       'Config',
       $updateValue,
       array (
         'ConfigID' => $configID 
       )
  );
} */
// start import of consent status information into new tables
$consentType = [];
foreach ($consents as $key=>$consent) {

  // populate consent_type table with consents from Config.xml
  $consentName  = $consent['name'];
  $consentLabel = $consent['label'];
  $consentType[$key+1] = $consentName; //create array of consents to use later

 /* $db->insert('consent_type',
              array(
                 'Name'  => $consentName,
                 'Label' => $consentLabel,
              )
       );*/

  //check that consent column exists in old table
  $columnQuery = 'SHOW COLUMNS FROM participant_status LIKE "' . $consentName . '"';
  $columnExists = $db->pselect($columnQuery, array());
  // print_r($columnExists);
  if (!empty($columnExists)) {
    //get all data where the consent status has a value
    $psData = $db->pselect(
                 'SELECT * FROM participant_status WHERE ' . $consentName . ' IS NOT NULL OR ' . $consentName . ' != ""',
                 array()
               );
    // print_r($psData);
    //populate candidate_consent_type_rel with data
    foreach ($psData as $entry) {
      $consentValues = [
          'CandidateID'   => $entry['CandID'],
          'ConsentTypeID' => $key+1,               //follow-up: should this be queried from the database?
          'Status'        => $entry[$consentName],
          'DateGiven'     => $entry[$consentName . '_date'],
          'DateWithdrawn' => $entry[$consentName . '_withdrawal'],
          ];
      print_r($consentValues);
    //$db->insert('candidate_consent_type_rel', $consentValues);
    }
  }
}
print_r($consentType);
// 6. Select * from consent_info_history and put in array
// 7. Populate candidate_consent_type_history:
//          i) for each unique ID entry in consent_info_history, let PSCID = PSCID where CandID = CandID in
//             consent_info_history
//         ii) for each $consentTypes[key] as column/field name where entry !== null, insert consent_name in
//             ConsentName of candidate_consent_type_history, and Consent Label of ConsentTypeID where 'Name'=c
//             onsent_name
//        iii) put in array all values under column where not null, along with consent_name_date, and
//             consent_name_withdrawal, entry_staff, entry_date


// Select consent history and import into new history table
$consentHistory = $db->pselect(
    'SELECT * FROM consent_info_history',
    array()
);
print_r($consentHistory);
var_dump($consentHistory);
foreach ($consentHistory as $entry) {
  $candID = $entry['CandID'];
  $pscid = $db->pselect(
             'SELECT PSCID FROM candidate WHERE CandID=:cid',
              array ('cid' => $candID)
           );
  foreach ($entry as $column=>$value) {
    if(in_array($column, $consentType)) {
      $consentName = $column;
    
    }
  }     
/* 
$formattedHistory = [
        'PSCID'         => $pscid
        'ConsentName'   => $
        'ConsentLabel'  =>
        'Status'        => 
        'DateGiven'     =>
        'DateWithdrawn' =>
        'EntryStaff'    =>
        'EntryDate'     =>
        ];
*/
}

?>
