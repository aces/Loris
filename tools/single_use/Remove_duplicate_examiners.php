<?php
/**
 * This script is written to clean up duplicate userIDs in the examiners table
 * This is a result of name changes in user accounts, where a new examiner
 * is created for the same user
 * Since examinerIDs are used elsewhere in the codebase
 * (certification), This should be fixed.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__."/../generic_includes.php";
echo "#####################################################################
This script will update / delete duplicate examinerIDs caused by
user Name changes. Effected tables will be: certification, examiners,
examiner_psc_rel
#####################################################################\n\n";

// get examinerIDs linked to userIDs
$examiners = $DB->pselectColWithIndexKey(
    "SELECT examinerID, userID FROM examiners WHERE userID IS NOT NULL",
    [],
    'examinerID'
);

// Get array of duplicate userIDs
$array_count   = array_count_values($examiners);
$duplicateUIDS = array_keys(
    array_filter(
        $array_count,
        function ($k) {
            return $k > 1;
        }
    )
);
$duplicates    = array_filter(
    $examiners,
    function ($k) use (&$duplicateUIDS) {
        return in_array($k, $duplicateUIDS);
    }
);

if (count($duplicates) === 0) {
    print_r("No duplicates found.\n");
} else {
    // Remove / update rows that are duplicate userIDs
    // and do not have the correct full_name

    // The examinerIDs to be kept are the ones that have the
    // same name as the current name in the users table
    $correctExaminerIDs = $DB->pselectColWithIndexKey(
        "SELECT e.userID, e.examinerID
		FROM examiners e
		JOIN users u ON u.ID=e.userID
		WHERE e.userID IS NOT NULL
		AND e.full_name=u.Real_name",
        [],
        'userID'
    );

    foreach ($duplicates as $examinerID => $userID) {
        if (!in_array($examinerID, $correctExaminerIDs)) {
            print_r(
                "Updating examinerID for user $userID ".
                "in certification\n"
            );
            $DB->update(
                'certification',
                [
                    'examinerID' => $correctExaminerIDs[$userID]
                ],
                ['examinerID' => $examinerID]
            );

            print_r(
                "Removing row for user $userID ".
                "with examinerID $examinerID in examiners and examiners_psc_rel\n\n"
            );
            $DB->delete(
                'examiners',
                ['examinerID' => $examinerID]
            );
            $DB->delete(
                'examiners_psc_rel',
                ['examinerID' => $examinerID]
            );
        }
    }
}
