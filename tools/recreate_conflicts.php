#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This script allows recreation of conflicts
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . '/generic_includes.php';

$config = NDB_Config::singleton();
$db     = $lorisInstance->getDatabaseConnection();

/**
 * HELP SCREEN
 * display and stop processing if action=help
 */
if (empty($argv[1]) || $argv[1] == 'help') {
    fwrite(STDERR, "Usage: \n\n");
    $case1 ="recreate_conflicts.php all         : To recreate".
        "conflicts for all instruments\n";
    $case2 = "recreate_conflicts.php <test_name> : To recreate".
        "conflict for a given instrument \n";

    fwrite(
        STDERR,
        $case1
    );
    fwrite(
        STDERR,
        $case2
    );
    return;
}

/**
 * Get cmd-line arguments
 */
// get $action argument
$action = $argv[1];

if ($action=='all') {
    $allInstruments = NDB_BVL_Instrument::getInstrumentNamesList($lorisInstance);
    $ddeInstruments = array_keys(
        \NDB_BVL_Instrument::getDDEInstrumentNamesList($lorisInstance)
    );
} else {
    $allInstruments = [$action => $action];
    $ddeInstruments = [$action => $action];
}
// clear the unresolved conflicts for all the instruments
foreach ($allInstruments as $instrument => $Full_name) {
    $clear_conflicts = $db->pselect(
        "SELECT CommentID, Test_name,
                                            CONCAT('DDE_', CommentID)
                                            AS DDECommentID
                                     FROM flag
                                     JOIN session s ON (s.ID=flag.SessionID)
                                     JOIN candidate c ON (c.ID=s.CandidateID)
                                     JOIN test_names tn ON (tn.ID=flag.TestID)
                                     WHERE Test_name=:testname AND CommentID
                                           NOT LIKE 'DDE%' AND s.Active='Y'
                                           AND c.Active='Y'",
        ['testname' => $instrument]
    );

    foreach ($clear_conflicts as $conflict) {
        ConflictDetector::clearConflictsForInstance($conflict['CommentID']);
    }
}

foreach ($ddeInstruments as $test) {
    $instruments = $db->pselect(
        "SELECT CommentID, Test_name, CONCAT('DDE_',
            CommentID) AS DDECommentID
        FROM flag sde
        JOIN session s ON (s.ID=sde.SessionID)
        JOIN candidate c ON (c.ID=s.CandidateID)
        JOIN test_names tn ON (tn.ID=sde.TestID)
        WHERE Test_name=:testname AND sde.CommentID
        NOT LIKE 'DDE%' AND sde.Data_entry='Complete'
        AND s.Active='Y' AND c.Active='Y'
        AND EXISTS (SELECT 'x' FROM flag dde WHERE
            dde.CommentID=CONCAT('DDE_',sde.CommentID)
        AND Data_entry='Complete')",
        ['testname' => $test]
    );

    foreach ($instruments as $instrument) {
        // If the instrument requires double data entry, check that DDE is also done
        if (in_array($instrument['Test_name'], $ddeInstruments)) {
            print "Recreating conflicts for " . $instrument['Test_name'] .
                ':'. $instrument['CommentID'] . "\n";
            $diff = ConflictDetector::detectConflictsForCommentIds(
                $lorisInstance,
                $instrument['Test_name'],
                $instrument['CommentID'],
                $instrument['DDECommentID']
            );
            ConflictDetector::recordUnresolvedConflicts($diff);
        }
    }
}

?>
