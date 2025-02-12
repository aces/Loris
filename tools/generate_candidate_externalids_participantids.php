#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * Script generating ExternalID and/or ParticipantID for each candidate
 * where ExternalID or ParticipantID is NULL.
 * Config useExternalID property must be set if generating ExternalID.
 *
 * Arguments:
 * reset: Reset ExternalID and/or ParticipantID to NULL before generating new ones.
 * ExternalID: Generate only ExternalID for candidates where it is NULL.
 * ParticipantID: Generate only ParticipantID for candidates where it is NULL.
 * help: Display help screen.
 *
 * Ways to use this script:
 * -- Display a help screen:
 * generate_candidate_externalids_participantids.php help
 *
 * -- Fix missing ExternalID and/or ParticipantID on candidates:
 * generate_candidate_externalids_participantids.php ExternalID ParticipantID
 *
 * -- Reset and regenerate ExternalID:
 * generate_candidate_externalids_participantids.php reset ExternalID
 *
 * -- Reset and regenerate ParticipantID:
 * generate_candidate_externalids_participantids.php reset ParticipantID
 *
 * -- Reset and regenerate both ExternalID and ParticipantID:
 * generate_candidate_externalids_participantids.php reset ExternalID ParticipantID
 *
 * -- Generate only ExternalID for candidates where it is NULL:
 * generate_candidate_externalids_participantids.php ExternalID
 *
 * -- Generate only ParticipantID for candidates where it is NULL:
 * generate_candidate_externalids_participantids.php ParticipantID
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
$generateExternalID    = false;
$generateParticipantID = false;

// If no arguments are provided, display help and exit
if (count($argv) === 1) {
    displayHelp();
    exit(0);
}

// Parse command-line arguments
foreach ($argv as $arg) {
    switch ($arg) {
    case 'reset':
        $reset = true;
        break;
    case 'ExternalID':
        $generateExternalID = true;
        break;
    case 'ParticipantID':
        $generateParticipantID = true;
        break;
    case 'help':
        displayHelp();
        exit(0);
    default:
        // Ignore invalid arguments
        break;
    }
}

/**
 * Display help screen and exit.
 */
function displayHelp(): void
{
    fwrite(STDERR, "Usage: \n\n");
    fwrite(STDERR, "Display a help screen:\n");
    fwrite(STDERR, "generate_candidate_externalids_participantids.php help\n\n");

    fwrite(STDERR, "To fix missing ExternalID and/or ParticipantID on candidates:\n");
    fwrite(
        STDERR,
        "generate_candidate_externalids_participantids.php ExternalID ParticipantID\n\n"
    );

    fwrite(STDERR, "To reset and regenerate ExternalID:\n");
    fwrite(
        STDERR,
        "generate_candidate_externalids_participantids.php reset ExternalID\n\n"
    );

    fwrite(STDERR, "To reset and regenerate ParticipantID:\n");
    fwrite(
        STDERR,
        "generate_candidate_externalids_participantids.php reset ParticipantID\n\n"
    );

    fwrite(STDERR, "To reset and regenerate both ExternalID and ParticipantID:\n");
    fwrite(
        STDERR,
        "generate_candidate_externalids_participantids.php reset ExternalID ParticipantID\n\n"
    );

    fwrite(STDERR, "To generate only ExternalID for candidates where it is NULL:\n");
    fwrite(
        STDERR,
        "generate_candidate_externalids_participantids.php ExternalID\n\n"
    );

    fwrite(STDERR, "To generate only ParticipantID for candidates where it is NULL:\n");
    fwrite(
        STDERR,
        "generate_candidate_externalids_participantids.php ParticipantID\n\n"
    );
}

echo "\n---------------------------------------------------------------\n\n" .
    "  This script will generate ExternalID and/or ParticipantID for each candidate\n" .
    "  with missing ExternalID or ParticipantID.\n" .
    "\n---------------------------------------------------------------\n\n";

// Check useExternalID setting only if ExternalID generation is requested
if ($generateExternalID && $config->getSetting('useExternalID') !== 'true') {
    echo "ERROR: useExternalID is deactivated in your config. \n" .
        "Please activate it before running this script.\n\n";
    exit(1);
}

// Get all Candidates
$cands = $DB->pselect(
    "SELECT CandID, ExternalID, ParticipantID, RegistrationCenterID as site,
    RegistrationProjectID as project
    FROM candidate",
    []
);

$i = 0;
// Update all candidates' ExternalID and/or ParticipantID
foreach ($cands as $cand) {
    $setArray   = [];
    $whereArray = ['CandID' => $cand['CandID']];

    $site    = \Site::singleton(
        \CenterID::singleton(intval($cand['site']))
    );
    $project = \Project::getProjectFromID(
        \ProjectID::singleton(intval($cand['project']))
    );

    // Reset ExternalID if requested
    if ($reset && $generateExternalID) {
        $setArray['ExternalID'] = null;
    }

    // Reset ParticipantID if requested
    if ($reset && $generateParticipantID) {
        $setArray['ParticipantID'] = null;
    }

    // Generate ExternalID if requested
    if ($generateExternalID && ($reset || is_null($cand['ExternalID']))) {
        $externalID = (new \ExternalIDGenerator(
            $site->getSiteAlias(),
            $project->getAlias()
        ))->generate();
        $setArray['ExternalID'] = $externalID;
        echo "Candidate " . $cand['CandID'] . " external ID changed from " .
            ($cand['ExternalID'] ?? "NULL") . " to " . $externalID . "\n";
    }

    // Generate ParticipantID if requested
    if ($generateParticipantID && ($reset || is_null($cand['ParticipantID']))) {
        $participantID = (new \ParticipantIDGenerator(
            $site->getSiteAlias(),
            $project->getAlias()
        ))->generate();
        $setArray['ParticipantID'] = $participantID;
        echo "Candidate " . $cand['CandID'] . " participant ID changed from " .
            ($cand['ParticipantID'] ?? "NULL") . " to " . $participantID . "\n";
    }

    if (!empty($setArray)) {
        $DB->update('candidate', $setArray, $whereArray);
        $i++;
    }
}

echo "\nUpdated " . $i . " candidate(s). \n\n";