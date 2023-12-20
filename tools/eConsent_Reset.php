<?php

/**
 * This script parses through each eConsent form to check whether
 * it needs to be reset or not.
 * If the form needs to be reset, the progress is wiped clean
 * and the OneTimeKey is regenerated
 * Set up this script to be automatically run nightly.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/generic_includes.php";

$DB =& Database::singleton();

$eConsents = $DB->pselectWithIndexKey(
    "SELECT 
        dc.OneTimeKey,
        dc.CandidateID AS CandID,
        dc.Request_status, 
        dc.Date_sent,
        dc.Data_cleared,
        dc.ConsentGroupID,
        cd.Reset_period_days
    FROM direct_consent dc
    INNER JOIN candidate ca ON ca.CandID=dc.CandidateID
    INNER JOIN consent_display_rel cdr ON cdr.ConsentGroupID=dc.ConsentGroupID
    INNER JOIN consent_display cd ON cd.ConsentDisplayID=cdr.ConsentDisplayID
    WHERE COALESCE(cdr.CenterID, 'X') IN (
        CASE 
        WHEN (SELECT CenterID 
            FROM consent_display_rel 
            WHERE ConsentGroupID=dc.ConsentGroupID 
            AND CenterID=ca.RegistrationCenterID 
            AND CenterID IS NOT NULL) 
            IS NOT NULL 
        THEN (ca.RegistrationCenterID)
        ELSE ('X')
        END
    )",
    [],
    'OneTimeKey'
);

$consentForms       = $DB->pselectCol(
    "SELECT ConsentGroupID FROM consent_group",
    []
);
$individualConsents = [];

foreach ($consentForms as $consentGroupID) {
    $consentCodes = $DB->pselectCol(
        "SELECT ConsentID FROM consent WHERE ConsentGroupID=:cg",
        ["cg" => $consentGroupID]
    );
    $individualConsents[$consentGroupID] = $consentCodes;
}

foreach ($eConsents AS $key => $consentData) {
    // Check if there is an expiry period
    if (!is_null($consentData['Reset_period_days'])) {
        // if there is an expiry period, get date sent & expiry period
        $sendDate     = $consentData['Date_sent'];
        $expiryPeriod = '-' . $consentData['Reset_period_days'] . ' days';

        // only wipe data if:
        // the form has already been sent,
        // the form has not been completed,
        // the form has not yet had it's data cleared
        // (should only be the first time after accessing expiry period),
        // the expiry period has passed
        if (!empty($sendDate)
            && $consentData['Request_status'] !== 'complete'
            && !$consentData['Data_cleared']
            && strtotime($expiryPeriod) > strtotime($sendDate)
        ) {
            $db = \Database::singleton();
            // Clear trainingProgress, set data cleared to true, reset link
            $bytes  = openssl_random_pseudo_bytes(8);
            $newKey = bin2hex($bytes);

            $db->update(
                'direct_consent',
                [
                    'trainingProgress' => null,
                    'Data_cleared'     => true,
                    'OneTimeKey'       => $newKey
                ],
                ['OneTimeKey' => $key]
            );

            $consentIDs = $individualConsents[$consentData['ConsentGroupID']];
            // Wipe responses for each consent code
            foreach ($consentIDs as $consentID) {
                $db->update(
                    'candidate_consent_rel',
                    [
                        'Status'    => null,
                        'DateGiven' => null
                    ],
                    [
                        'CandidateID' => $consentData['CandID'],
                        'ConsentID'   => $consentID
                    ]
                );
            }
        }
    }
}