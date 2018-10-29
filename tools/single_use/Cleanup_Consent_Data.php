<?php
/**
 * This script is written for a one time use only to clean up existing data in the 'candidate_consent_rel' table to conform to the new front-end validation for entering consent.
 *
 * PHP Version 7
 *
 * @category Main
 * @package Loris
 * @author Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @licence Loris license
 * @link https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

$db     = \Database::singleton();
$errors = array();

$query       = "SELECT CandidateID, ConsentID, Status, DateGiven, DateWithdrawn
                FROM candidate_consent_rel";
$consentData = $db->pselect($query, array());

foreach($consentData as $key => $entry) {
    $candID         = $entry['CandidateID'];
    $consentID      = $entry['ConsentID'];
    $status         = $entry['Status'];
    $consentDate    = $entry['DateGiven'];
    $withdrawalDate = $entry['DateWithdrawn'];
    $row            = $key + 1;

    switch ($status) {
        case '':
            array_push($errors, "An entry with a NULL consent status should not exist. Entry $row with CandidateID=$candID and ConsentID=$consentID has a NULL consent status. Please clear the entry or change the consent to either 'yes' or 'no'. \n\n");
            break;
        case 'no':
            if (empty($consentDate)) {
              array_push($errors, "A consent date is now required for both a 'yes' and 'no' consent status. 'DateGiven' is missing for entry $row with CandidateID=$candID and ConsentID=$consentID. Please fill in missing date of consent or clear the entry. \n\n");
            }
            break;
        case 'yes':
            if (empty($consentDate)) {
              array_push($errors, "A consent date is now required for both a 'yes' and 'no' answer to consent. The 'DateGiven' column is missing for entry $row with CandidateID=$candID and ConsentID=$consentID. Please fill in missing date of consent or clear the entry. \n\n");
            } else if (!empty($withdrawalDate)) {
              array_push($errors, "An entry with a consent status 'yes' should not have a date of withdrawal. 'DateWithdrawn' exists for entry $row with CandidateID=$candID and ConsentID=$consentID. Please remove date of withdrawal or change the consent to 'no'. \n\n");
            }
            break;
    }
}
print_r($errors);
