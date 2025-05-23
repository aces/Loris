#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * This script will try to import data that are in REDCap and not in LORIS.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../../../tools/generic_includes.php";

// load redcap module
try {
    $lorisInstance->getModule('redcap')->registerAutoloader();
} catch (\LorisNoSuchModuleException $th) {
    error_log("[error] no 'redcap' module found.");
    exit(1);
}

use \GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;

use LORIS\StudyEntities\Candidate\CandID;

use LORIS\redcap\config\RedcapConfigLorisId;
use LORIS\redcap\config\RedcapConfigParser;
use LORIS\redcap\client\RedcapHttpClient;


// --------------------------------------

/**
 * All REDCap connections (http client) for each REDCap instance/project.
 * @var mixed
 */
$redcapConnections = [];

// /**
//  * All REDCap unique event names (event + arm) for each REDCap instance/project.
//  * @var mixed
//  */
// $redcapEventMap = [];

// /**
//  * All REDCap instruments for each REDCap instance/project.
//  * @var mixed
//  */
// $redcapInstrumentMap = [];

/**
 * All REDCap instrument-event map for each REDCap instance/project.
 * @var mixed
 */
$redcapInstrumentEventMap = [];


// --------------------------------------
// TODO: arg parse.
$verbose        = true;
$forceUpdate    = false;         // force even complete instrument?
$redcapUsername = "bulk_import"; // the name that will be used in the redcap notification

// --------------------------------------
// arg display
$verboseMsg = $verbose ? 'enabled' : 'disabled';
fprintf(STDOUT, "[args:verbose] {$verboseMsg}\n");
$forceUpdateMsg = $forceUpdate ? 'enabled' : 'disabled';
fprintf(STDOUT, "[args:force_update_instruments] {$forceUpdateMsg}\n");


// --------------------------------------
// LORIS URL
try {
    $lorisURL = $lorisInstance->getConfiguration()->getSetting('baseURL');
} catch (\Throwable $th) {
    $lorisURL = \NDB_Factory::singleton()->settings()->getBaseURL();
}
if (empty($lorisURL)) {
    fprintf(STDERR, "[loris:config:base_url] no LORIS base URL.\n");
    exit(1);
}
fprintf(STDOUT, "[loris:url] LORIS instance used: {$lorisURL}\n");

// init LORIS client
$lorisClient = new Client(
    ['base_uri' => "$lorisURL/redcap/notifications"]
);

// Load all LORIS importable instruments (across all REDCap instances)
$redcapAllowedInstruments = $config->getSetting('redcap_importable_instrument');
if (empty($redcapAllowedInstruments)) {
    fprintf(STDERR, "[redcap:configuration] no instrument authorized.\n");
    exit(3);
}

// Get LORIS data to import
fprintf(STDOUT, "[loris:data] getting data to import...\n");
$lorisDataToImport = getLORISInstrumentToImport(
    $lorisInstance->getDatabaseConnection(),
    $redcapAllowedInstruments,
    $forceUpdate
);
if (empty($lorisDataToImport)) {
    fprintf(STDERR, "[loris:data] no data to import.\n");
    exit(0);
}

$cLorisData = count($lorisDataToImport);
$forceMsg   = $forceUpdate ? " (already 'Complete' instruments too)" : " ('In Progress' instruments)";
fprintf(STDOUT, "[loris:data] records to import from REDCap{$forceMsg}: {$cLorisData}\n");

// Load REDCap configuration
fprintf(STDOUT, "[redcap:configuration] getting REDCap configurations...\n");
try {
    $redcapConfiguration = RedcapConfigParser::getConfiguration($lorisInstance);
} catch (\LorisException $th) {
    fprintf(STDERR, "[redcap:configuration] {$th->getMessage()}.\n");
    exit(3);
}
// 
if ($redcapConfiguration === null) {
    fprintf(STDERR, "[redcap:configuration] no REDCap configuration in 'config.xml'.\n");
    exit(3);
}

// error_log(print_r(array_keys($redcapConfiguration['https://redcap.iths.org/']), true));
// error_log(print_r($redcapConfiguration['https://redcap.iths.org/'][98505], true));

# Load REDCap connections 
fprintf(STDOUT, "[redcap:connections] building REDCap connections...\n");
initREDCapConnections(
    $redcapConfiguration,
    $redcapConnections,
    false
);

// Test REDCap connections
fprintf(STDOUT, "[redcap:connections] testing REDCap connections...\n");
testREDCapConnections($redcapConnections);

// // Load REDCap unique event names
// fprintf(STDOUT, "[redcap:connections] loading REDCap events...\n");
// initREDCapEventMap(
//     $redcapConnections,
//     $redcapEventMap
// );

// // Load REDCap instruments, only consider importable instruments
// fprintf(STDOUT, "[redcap:connections] loading REDCap instruments...\n");
// initREDCapInstrumentMap(
//     $redcapConnections,
//     $redcapAllowedInstruments,
//     $redcapInstrumentMap
// );

// Load REDCap instrument-event, only consider importable instruments
fprintf(STDOUT, "[redcap:connections] loading REDCap instrument-event mapping...\n");
initREDCapInstrumentEventMap(
    $redcapConnections,
    $redcapAllowedInstruments,
    $redcapInstrumentEventMap
);

// error_log(print_r($redcapInstrumentEventMap['https://redcap.iths.org/'][98505], true));


// iterating over all records
fprintf(STDERR, "[loris:redcap_endpoint] triggering notifications and import...\n");
foreach($lorisDataToImport as $index => $instrumentToQuery) {
    // LORIS param
    $pscid          = $instrumentToQuery['pscid'];
    $candid         = $instrumentToQuery['candid'];
    $visitLabel     = $instrumentToQuery['visitLabel'];
    $instrumentName = $instrumentToQuery['instrument'];
    $commentID      = $instrumentToQuery['commentID'];

    // candidate
    $candidate = \Candidate::singleton(new CandID($candid));

    // log
    fprintf(STDOUT, "[{$index}][pscid:{$pscid}|candid:{$candid}][visit:{$visitLabel}][instrument:{$instrumentName}] \n");

    // select REDCap instances and projects that have this instrument
    // [redcap instance URL => [redcap project ID => RedcapInstrumentEventMap object]]
    // ideally, there should only be one instance and one project selected
    // target event-instrument mapping from REDCap based on instrument name
    $redcapTargetedEventInstrument = getTargetedEventInstrument(
        $redcapInstrumentEventMap,
        $instrumentName
    );
    
    // count number of selected event-instrument mappings across instances
    $nbProjects = array_reduce(
        $redcapTargetedEventInstrument,
        fn($c, $i) => $c + count($i),
        0
    );
    if ($nbProjects === 0) {
        fprintf(STDERR, "  - no REDCap instances/projects for that instrument.\n");
        continue;
    }
    if ($nbProjects > 1) {
        // TODO: what if an instrument name is in different instances/projects?
        // TODO: logic needs to be implemented more largely in the rest of the codebase.
        fprintf(STDERR, "  - multiple REDCap instances/projects with that instrument.\n");
        continue;
    }

    // explicit values
    $redcapInstanceURL     = array_keys($redcapTargetedEventInstrument)[0];
    $redcapProjectID       = array_keys($redcapTargetedEventInstrument[$redcapInstanceURL])[0];
    $redcapEventInstrument = $redcapTargetedEventInstrument[$redcapInstanceURL][$redcapProjectID];
    
    fprintf(STDOUT, " - instrument found in '{$redcapInstanceURL}', pid:{$redcapProjectID}\n");
    
    // get this instance/project configuration
    // TODO: which candidate ID? PSCID/CANDID?
    // TODO: which participant ID? RecordID/surveyID?
    // TODO: which visit? visit mapping in config.
    $redcapConfig = $redcapConfiguration[$redcapInstanceURL][$redcapProjectID];

    // candidate ID to use
    // TODO: maybe some change here depending on the REDCap way of naming
    $redcapRecordID = match ($redcapConfig->candidate_id) {
        RedcapConfigLorisId::PscId  => $candidate->getPSCID(),
        RedcapConfigLorisId::CandId => $candidate->getCandID(),
    };

    // send POST request to LORIS mimicing REDCap notification
    $response = sendNotification(
        $lorisClient,
        "{$redcapInstanceURL}/api/",
        $redcapProjectID,
        $instrumentName,
        $redcapRecordID,
        $redcapEventInstrument->unique_event_name,
        $redcapUsername
    );
    
    //
    $responseStatusMsg = $response->getStatusCode() != 200 ? "failed" : "ok";
    fprintf(STDERR, "  - {$responseStatusMsg}\n");
}

// --------------------------------------

/**
 * Initialize REDCap connections based on the given configuration.
 *
 * @param array $redcapConfig     
 * @param array $redcapConnections
 * @param bool  $verbose
 *
 * @return void
 */
function initREDCapConnections(
    array $redcapConfig,
    array &$redcapConnections,
    bool $verbose = false
): void {
    foreach ($redcapConfig as $redcapURL => $redcapInstance) {
        foreach ($redcapInstance as $redcapProjectID => $redcapConfig) {
            $cleanURL = rtrim($redcapURL, '/');
            $redcapConnections[$redcapURL] = [
                ...$redcapConnections[$redcapURL] ?? [],
                $redcapProjectID => new RedcapHttpClient(
                    "{$cleanURL}/api/",
                    $redcapConfig->redcap_api_token,
                    $verbose
                )
            ];
        }
    }
}

/**
 * Test all REDCap connections based on a given connection structure.
 *
 * @param array $redcapConnections
 *
 * @return void
 */
function testREDCapConnections(
    array $redcapConnections
): void {
    foreach ($redcapConnections as $redcapURL => $redcapInstance) {
        foreach ($redcapInstance as $redcapProjectID => $redcapClient) {
            $redcapClient->checkConnection();
        }
    }
}

// /**
//  * Initialize REDCap events based on the given connection.
//  *
//  * @param array $redcapConnections
//  * @param array $redcapEventMap
//  *
//  * @return void
//  */
// function initREDCapEventMap(
//     array $redcapConnections,
//     array &$redcapEventMap
// ): void {
//     foreach ($redcapConnections as $redcapURL => $redcapInstance) {
//         foreach ($redcapInstance as $redcapProjectID => $redcapClient) {
//             $redcapEventMap[$redcapURL] = [
//                 ...$redcapEventMap[$redcapURL] ?? [],
//                 $redcapProjectID => $redcapClient->getEvents()
//             ];
//         }
//     }
// }

// /**
//  * Initialize REDCap instruments based on the given connection.
//  *
//  * @param array $redcapConnections
//  * @param array $redcapAllowedInstruments
//  * @param array $redcapInstrumentMap
//  *
//  * @return void
//  */
// function initREDCapInstrumentMap(
//     array $redcapConnections,
//     array $redcapAllowedInstruments,
//     array &$redcapInstrumentMap
// ): void {
//     foreach ($redcapConnections as $redcapURL => $redcapInstance) {
//         foreach ($redcapInstance as $redcapProjectID => $redcapClient) {
//             // all instruments from a client
//             $instruments = $redcapClient->getInstruments();

//             // filter allowed instruments
//             $allowedInstruments = array_filter(
//                 $instruments,
//                 fn($i) => in_array(
//                     $i->name,
//                     $redcapAllowedInstruments,
//                     true
//                 )
//             );

//             //
//             if (!empty($allowedInstruments)) {
//                 $redcapInstrumentMap[$redcapURL] = [
//                     ...$redcapInstrumentMap[$redcapURL] ?? [],
//                     $redcapProjectID => $allowedInstruments
//                 ];
//             }
//         }
//     }
// }

/**
 * Initialize REDCap instrument-event based on the given connection.
 *
 * @param array $redcapConnections
 * @param array $redcapAllowedInstruments
 * @param array $redcapInstrumentMap
 *
 * @return void
 */
function initREDCapInstrumentEventMap(
    array $redcapConnections,
    array $redcapAllowedInstruments,
    array &$redcapInstrumentEventMap
): void {
    foreach ($redcapConnections as $redcapURL => $redcapInstance) {
        foreach ($redcapInstance as $redcapProjectID => $redcapClient) {
            // instrument-event map from a client
            $instrumentEventMap = $redcapClient->getInstrumentEventMapping();

            // filter allowed instruments
            $allowedInstruments = array_filter(
                $instrumentEventMap,
                fn($i) => in_array(
                    $i->form_name,
                    $redcapAllowedInstruments,
                    true
                )
            );

            //
            if (!empty($allowedInstruments)) {
                $redcapInstrumentEventMap[$redcapURL] = [
                    ...$redcapInstrumentEventMap[$redcapURL] ?? [],
                    $redcapProjectID => $allowedInstruments
                ];
            }
        }
    }
}

/**
 * Get the list of all instrument records to import from REDCap.
 *
 * @param Database $db
 * @param array    $allowedRedcapInstruments
 * @param bool     $forceUpdate
 *
 * @return array
 */
function getLORISInstrumentToImport(
    \Database $db,
    array $allowedRedcapInstruments,
    bool $forceUpdate = false
): array {
    // importable redcap instruments
    $selectedInstruments = "('"
        . implode("','", $allowedRedcapInstruments)
        . "')";

    // if forced, then we do not filter out administration/data entry already
    // set up, they will be overridden
    $forceUpdateCondition = "";
    if (!$forceUpdate) {
        $forceUpdateCondition = "
            AND (f.Data_entry = 'In Progress' OR f.Data_entry IS NULL)
            AND f.Administration IS NULL
        ";
    }

    //
    return $db->pselect(
        "SELECT c.PSCID as pscid,
            c.CandID as candid,
            s.Visit_label as visitLabel,
            f.test_name as instrument,
            f.CommentID as commentID,
            f.Data_entry as dataEntry,
            f.Administration as administration
        FROM flag f
            JOIN session s ON (s.ID = f.sessionID)
            JOIN candidate c ON (c.candid = s.candid)
        WHERE s.Active = 'Y'
            AND c.Active = 'Y'
            AND f.CommentID NOT LIKE 'DDE%'
            {$forceUpdateCondition}
            AND f.test_name IN {$selectedInstruments}
        ",
        []
    );
}

/**
 * Send a REDCap notification to LORIS.
 * 
 * @param GuzzleHttp\Client $lorisClient           LORIS client
 * @param string            $redcapAPIURL          the REDCap API URL to use
 * @param int               $redcapProjectID       the REDCap project ID
 * @param string            $redcapInstrumentName  the REDCap instrument name
 * @param string            $redcapRecordID        the REDCap Record ID
 * @param string            $redcapUniqueEventName the REDCap unique event name
 * @param string            $redcapUsername        the REDCap user
 *
 * @return ResponseInterface
 */
function sendNotification(
    Client $lorisClient,
    string $redcapAPIURL,
    int $redcapProjectID,
    string $redcapInstrumentName,
    string $redcapRecordID,
    string $redcapUniqueEventName,
    string $redcapUsername
): ResponseInterface {
    // From REDCap doc - Data Entry Trigger composition.
    // - project_id - The unique ID number of the REDCap project (i.e. the 'pid' value found in the URL when accessing the project in REDCap).
    // - username - The username of the REDCap user that is triggering the Data Entry Trigger. Note: If it is triggered by a survey page (as opposed to a data entry form), then the username that will be reported will be '[survey respondent]'.
    // - instrument - The unique name of the current data collection instrument (all your project's unique instrument names can be found in column B in the data dictionary).
    // - record - The name of the record being created or modified, which is the record's value for the project's first field.
    // - redcap_event_name - The unique event name of the event for which the record was modified (for longitudinal projects only).
    // - redcap_data_access_group - The unique group name of the Data Access Group to which the record belongs (if the record belongs to a group).
    // - [instrument]_complete - The status of the record for this particular data collection instrument, in which the value will be 0, 1, or 2. For data entry forms, 0=Incomplete, 1=Unverified, 2=Complete. For surveys, 0=partial survey response and 2=completed survey response. This parameter's name will be the variable name of this particular instrument's status field, which is the name of the instrument + '_complete'.
    // - redcap_repeat_instance - The repeat instance number of the current instance of a repeating event OR repeating instrument. Note: This parameter is only sent in the request if the project contains repeating events/instruments *and* is currently saving a repeating event/instrument.
    // - redcap_repeat_instrument - The unique instrument name of the current repeating instrument being saved. Note: This parameter is only sent in the request if the project contains repeating instruments *and* is currently saving a repeating instrument. Also, this parameter will not be sent for repeating events (as opposed to repeating instruments).
    // - redcap_url - The base web address to REDCap (URL of REDCap's home page). e.g., https://redcap.iths.org/
    // - project_url - The base web address to the current REDCap project (URL of its Project Home page). e.g., https://redcap.iths.org/redcap_v15.1.2/index.php?pid=XXXX

    $data = [
        "redcap_url"                       => $redcapAPIURL,
        "project_id"                       => $redcapProjectID,
        "project_url"                      => "",
        "instrument"                       => $redcapInstrumentName,
        "record"                           => $redcapRecordID,
        "redcap_event_name"                => $redcapUniqueEventName,
        "username"                         => $redcapUsername,
        "{$redcapInstrumentName}_complete" => "2",
    ];

    // send
    return $lorisClient->request(
        'POST',
        '',
        [
            'form_params' => $data,
            'debug'       => false
        ]
    );
}

/**
 * Get a targeted event-instrument mapping.
 * This returns a structure 
 * [redcap instance URL => [redcap project ID => RedcapInstrumentEventMap object]]
 * when the given instrument is found in any redcap event-instrument mapping.
 * 
 * @param mixed $redcapInstrumentEventMap
 * @param mixed $instrumentName
 * 
 * @return array[]
 */
function getTargetedEventInstrument(
    $redcapInstrumentEventMap,
    $instrumentName
): array {
    $selectedRedcapProject = [];
    foreach ($redcapInstrumentEventMap as $redcapURL => $redcapInstance) {
        foreach ($redcapInstance as $redcapProjectID => $redcapInstruments) {
            // search instrument
            $foundInstrumentEventMap = array_filter(
                $redcapInstruments,
                fn($i) => $i->form_name === $instrumentName
            );

            // get the precise mapping "RedcapInstrumentEventMap" object
            if (!empty($foundInstrumentEventMap)) {
                $selectedRedcapProject[$redcapURL] = [
                    ...$selectedRedcapProject[$redcapURL] ?? [],
                    $redcapProjectID => array_values($foundInstrumentEventMap)[0]
                ];
            }
        }
    }
    return $selectedRedcapProject;
};