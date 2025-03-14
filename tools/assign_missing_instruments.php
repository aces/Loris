#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * Script which  compares the currently assigned battery with the expected
 * battery at a particular timepoint for all candidates.
 *
 * It has two modes:
 *     regular mode -> Prints the instruments found missing, but does not acutally
 *                     add them to the battery.
 *
 *     confirm mode -> Actually assigns the instruments found missing in the
 *                     database.
 *
 * Usage: php assign_missing_instruments.php [Visit_label] [confirm]
 *
 * Example: php assign_missing_instruments.php 18month
 * (Will use regular mode and print the missing instruments
 * for the specified timepoint)
 *
 * Example: php assign_missing_instruments.php 18month confirm
 * (Will use confirm mode and assign the missing instruments
 * for the specified timepoint)
 *
 * Note: This tool will NOT remove instruments that do exist in the
 * assigned battery but have been removed from the battery lookup table (or
 * set to Active=N).  This behaviour is intended, instruments should NEVER be
 * removed.  Ever.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/mohadesz/Loris-Trunk
 */
use LORIS\StudyEntities\Candidate\CandID;

//get a list of all the candidates
//foreach candidate we need to look at each timepoint
//compare the looked up battery to the actual assigned battery
//add missing instruments.
set_include_path(
    get_include_path().":".
    __DIR__."/../project/libraries:".
    __DIR__."/../php/libraries:"
);

require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$confirm = false;
if ((isset($argv[1]) && $argv[1] === "confirm")
    || (isset($argv[2]) && $argv[2] === "confirm")
) {
    $confirm = true;
}

$DB = \NDB_Factory::singleton()->database();
if (!empty($argv[1]) && $argv[1]!="confirm") {
    $visit_label = $argv[1];
} else {
    $visit_labels = $DB->pselect(
        "SELECT DISTINCT Visit_label FROM session
        WHERE Active='Y' AND Visit_label NOT LIKE '%phantom%' AND Visit_label
        NOT LIKE 'Vsup%' AND COALESCE(Submitted,'N')='N'  ",
        []
    );
}

/**
 * Adds the missing instruments based on the visit_label
 *
 * @param Array  $result      containing visit_label info
 * @param String $visit_label The name of the visit
 *
 * @return NULL
 */
function populateVisitLabel($result, $visit_label)
{
    global $argv, $confirm;
    // create a new battery object && new battery
    $battery = new NDB_BVL_Battery;

    // select a specific time point (sessionID) for the battery
    $sessionID = new \SessionID(strval($result['ID']));
    $battery->selectBattery($sessionID);
    $timePoint = TimePoint::singleton($sessionID);

    $candidate         = Candidate::singleton(new CandID(strval($result['CandID'])));
    $result_firstVisit = $candidate->getFirstVisit();
    $isFirstVisit      = false;//adding check for first visit
    if ($result_firstVisit == $visit_label) {
        $isFirstVisit = true;
    }

    //To assign missing instruments to all sessions, sent to DCC or not.
    $defined_battery =$battery->lookupBattery(
        $battery->age,
        $result['cohortID'],
        $timePoint->getCurrentStage(),
        $visit_label,
        $timePoint->getCenterID(),
        $isFirstVisit
    );
    $actual_battery  =$battery->getBattery();

    $diff = array_unique(array_diff($defined_battery, $actual_battery));
    if (!empty($diff)) {
        echo "\n CandID: ".$timePoint->getCandID()."  Visit Label:  ".
        $timePoint->getVisitLabel()."\nMissing Instruments:\n";
        print_r($diff);
    }
        $lorisinstance = new \LORIS\LorisInstance(
            \NDB_Factory::singleton()->database(),
            \NDB_Factory::singleton()->config(),
            [
                __DIR__ . "/../project/modules",
                __DIR__ . "/../modules/",
            ]
        );
    if ($confirm === true) {
        foreach ($diff as $test_name) {
            $battery->addInstrument($lorisinstance, $test_name);
        }
    }

    unset($battery);
    unset($timePoint);
}

if (isset($visit_label)) {
    $query ="SELECT s.ID, s.cohortID, c.CandID from session
            s LEFT JOIN candidate c ON c.ID=s.CandidateID
            WHERE s.Active='Y'
            AND c.Active='Y' AND s.visit_label=:vl";
    $where = ['vl' => $argv[1]];

    $results = $DB->pselect($query, $where);
    foreach ($results as $result) {
        populateVisitLabel($result, $visit_label);
    }
} else if (isset($visit_labels)) {
    $query   ="SELECT s.ID, s.cohortID, s.Visit_label, c.CandID from session s
            LEFT JOIN candidate c ON c.ID=s.CandidateID WHERE s.Active='Y'
            AND c.Active='Y' AND s.Visit_label NOT LIKE 'Vsup%'";
    $results = $DB->pselect($query, []);
    foreach ($results as $result) {
        populateVisitLabel($result, $result['Visit_label']);
    }
}

if ($confirm === false) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
    "perform the changes\n\n";
}
