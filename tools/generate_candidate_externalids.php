#!/usr/bin/env php
<?php
/**
 * Script generating an externalID for each candidate
 * where external ID is NULL.
 * Config useExternalID property must be set.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Laetitia Fesselier <laetitia.fesselier@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
set_include_path(
    get_include_path().":".__DIR__."/../project/libraries:"
    .":".__DIR__."/../../php/libraries:"
);
require_once __DIR__ . "/../vendor/autoload.php";

echo "\n---------------------------------------------------------------\n\n".
    "  This script will generate an externalID for each candidate \n".
    "  with misssing external ID.\n".
    "\n---------------------------------------------------------------\n\n";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__."/../project/config.xml");

$factory = \NDB_Factory::singleton();
$config  = $factory->config();
$db      = $factory->database();

if ($config->getSetting('useExternalID') !== 'true') {
    echo "ERROR: useExternalID is deactivated in your config. \n"
         . "Please activate it before running this script.\n\n";
    exit(1);
}

// Get all Candidate with a NULL externalID
$cands = $db->pselect(
    "SELECT CandID, RegistrationCenterID as site, RegistrationProjectID as project
    FROM candidate
    WHERE ExternalID IS NULL",
    []
);
echo "Found " . count($cands) . " candidate(s) with missing external ID \n\n";

// Update all candidates with an external ID
foreach ($cands as $cand) {
    $site    = \Site::singleton($cand['site']);
    $project = \Project::getProjectFromID($cand['project']);

    $externalID = (new \ExternalIDGenerator(
        $site->getSiteAlias(),
        $project->getAlias()
    ))->generate();

    echo "Candidate ". $cand['CandID'] ." external ID set to ". $externalID ."\n";

    $setArray   = ['ExternalID' => $externalID];
    $whereArray = ['CandID' => $cand['CandID']];

    $db->update('candidate', $setArray, $whereArray);
}
