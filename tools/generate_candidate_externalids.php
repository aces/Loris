#!/usr/bin/env php
<?php
/**
 * Script generating an externalID for each candidate
 * where external ID is NULL.
 * Config useExternalID property must be set.
 *
 * Take an optional argument to reset all the externalID to NULL
 * before running the algorithm
 *
 * Ways to use this script:
 * -- display a help screen
 * generate_candidate_externalids.php help
 *
 * -- to fix missing external IDS on candidates
 * generate_candidate_externalids.php
 *
 * -- to reset all candidates external IDs and regenerate them
 * generate_candidate_externalids.php reset
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Laetitia Fesselier <laetitia.fesselier@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/../tools/generic_includes.php";

$reset = false;
if ((isset($argv[1]) && $argv[1] === "reset")) {
    $reset = true;
}

/**
 * HELP SCREEN
 * display and stop processing if action=help
 */
if ((isset($argv[1]) && $argv[1] == 'help')) {
    fwrite(STDERR, "Usage: \n\n");
    fwrite(STDERR, "Display a help screen:\n");
    fwrite(STDERR, "generate_candidate_externalids.php help\n\n");

    fwrite(STDERR, "To fix missing external IDS on candidates:\n");
    fwrite(STDERR, "generate_candidate_externalids.php\n\n");

    fwrite(STDERR, "To reset all candidates external IDs and regenerate them:\n");
    fwrite(STDERR, "generate_candidate_externalids.php reset\n\n");

    return;
}

echo "\n---------------------------------------------------------------\n\n".
    "  This script will generate an externalID for each candidate \n".
    "  with misssing external ID.\n".
    "\n---------------------------------------------------------------\n\n";

if ($config->getSetting('useExternalID') !== 'true') {
    echo "ERROR: useExternalID is deactivated in your config. \n"
         . "Please activate it before running this script.\n\n";
    exit(1);
}

// Get all Candidates
$cands = $DB->pselect(
    "SELECT CandID, ExternalID, RegistrationCenterID as site,
    RegistrationProjectID as project
    FROM candidate",
    []
);

$i = 0;
// Update all candidates external IDs
foreach ($cands as $cand) {
    if (!$reset && !is_null($cand['ExternalID'])) {
        continue;
    }

    $site    = \Site::singleton($cand['site']);
    $project = \Project::getProjectFromID($cand['project']);

    $externalID = (new \ExternalIDGenerator(
        $site->getSiteAlias(),
        $project->getAlias()
    ))->generate();

    echo "Candidate " . $cand['CandID'] ." external ID changed from "
         . ($cand['ExternalID'] ?? "NULL") . " to " . $externalID . "\n";

    $setArray   = ['ExternalID' => $externalID];
    $whereArray = ['CandID' => $cand['CandID']];

    $DB->update('candidate', $setArray, $whereArray);
    $i++;
}

echo "\nUpdated " . $i . " candidate external ID(s). \n\n";


