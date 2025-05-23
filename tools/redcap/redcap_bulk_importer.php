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

require_once __DIR__ . "/../../tools/generic_includes.php";

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
 *
 * @var mixed
 */
$redcapConnections = [];

// /**
//  * All REDCap unique event names (event + arm) for each REDCap instance/project.
//  *
//  * @var mixed
//  */
// $redcapEventMap = [];

// /**
//  * All REDCap instruments for each REDCap instance/project.
//  *
//  * @var mixed
//  */
// $redcapInstrumentMap = [];

/**
 * All REDCap instrument-event map for each REDCap instance/project.
 *
 * @var mixed
 */
$redcapInstrumentEventMap = [];


// --------------------------------------
// ARGS PARSE
$options = getopt(
    "",
    [
        "loris-url:",
        "redcap-username:",
        "force-update",
        "verbose",
    ]
);
$opts = checkOptions($options);

// args mapping
$lorisURL       = $opts['lorisURL'];
$redcapUsername = $opts['redcapUsername'];
$forceUpdate    = $opts['forceUpdate'];
$verbose        = $opts['verbose'];

// arg display
fprintf(STDOUT, "[args:loris_url] {$lorisURL}\n");
$verboseMsg = $verbose ? 'enabled' : 'disabled';
fprintf(STDOUT, "[args:verbose] {$verboseMsg}\n");
$forceUpdateMsg = $forceUpdate ? 'enabled' : 'disabled';
fprintf(STDOUT, "[args:force_update] {$forceUpdateMsg}\n");
fprintf(STDOUT, "[args:redcap_username] {$redcapUsername}\n");

// --------------------------------------
// init LORIS client
$lorisClient = new Client(
    ['base_uri' => "{$lorisURL}/redcap/notifications"]
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
$forceMsg   = $forceUpdate
    ? "(already 'Complete' instruments too)"
    : "('In Progress' instruments)";
fprintf(
    STDOUT,
    "[loris:data] records to import from REDCap {$forceMsg}: {$cLorisData}\n"
);

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
    fprintf(
        STDERR,
        "[redcap:configuration] no REDCap configuration in 'config.xml'.\n"
    );
    exit(3);
}

// Load REDCap connections
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

error_log(
    print_r(
        $redcapInstrumentEventMap['https://redcap.iths.org/'][98505],
        true
    )
);


// iterating over all records
fprintf(STDERR, "[loris:redcap_endpoint] triggering notifications and import...\n");
foreach ($lorisDataToImport as $index => $instrumentToQuery) {
    // LORIS param
    $pscid          = $instrumentToQuery['pscid'];
    $candid         = $instrumentToQuery['candid'];
    $visitLabel     = $instrumentToQuery['visitLabel'];
    $instrumentName = $instrumentToQuery['instrument'];
    $commentID      = $instrumentToQuery['commentID'];

    // candidate
    $candidate = \Candidate::singleton(new CandID("{$candid}"));

    // log
    $log  = "[{$index}]";
    $log .= "[pscid:{$pscid}|candid:{$candid}]";
    $log .= "[visit:{$visitLabel}]";
    $log .= "[instrument:{$instrumentName}]";
    fprintf(STDOUT, "{$log} \n");

    // select REDCap instances and projects that have this instrument
    // [redcap instance URL =>
    //   [redcap project ID => RedcapInstrumentEventMap object]
    // ]
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
        // TODO: logic needs to be implemented more largely in the rest of the
        // TODO: codebase.
        fprintf(
            STDERR,
            "  - multiple REDCap instances/projects with that instrument.\n"
        );
        continue;
    }

    // explicit values
    $redcapInstanceURL     = array_keys($redcapTargetedEventInstrument)[0];
    $instanceData          = $redcapTargetedEventInstrument[$redcapInstanceURL];
    $redcapProjectID       = array_keys($instanceData)[0];
    $redcapEventInstrument = $instanceData[$redcapProjectID];

    fprintf(
        STDOUT,
        " - instrument found in '{$redcapInstanceURL}', pid:{$redcapProjectID}\n"
    );

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
 * @param array $redcapConfig      REDCap configuration structure
 * @param array $redcapConnections REDCap connection structure to fill
 * @param bool  $verbose           Verbose mode
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
 * @param array $redcapConnections REDCap connection structure
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
 * @param array $redcapConnections        REDCap connections structure
 * @param array $redcapAllowedInstruments Allowed instruments
 * @param array $redcapInstrumentEventMap REDCAp event-instrument mapping
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
 * @param Database $db                       database object
 * @param array    $allowedRedcapInstruments authorized redcap instruments
 * @param bool     $forceUpdate              do force update?
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
    // data to send
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
 * @param array  $redcapInstrumentEventMap the event-instrument mapping
 * @param string $instrumentName           the searched instrument name
 *
 * @return array[]
 */
function getTargetedEventInstrument(
    array $redcapInstrumentEventMap,
    string $instrumentName
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

// --------------------------------------
// Utility

/**
 * Check arguments passed to this script.
 *
 * @param array $options the arguments
 *
 * @return array clean and valid version.
 */
function checkOptions(array $options) {
    // loris URL, mandatory
    if (!isset($options['loris-url'])) {
        error_log("[error] Required parameter: 'loris-path'.");
        showHelp();
        exit(1);
    }
    $lorisURL = rtrim($options['loris-url'], '/');

    // redcap-username
    $redcapUsername = $options['redcap-username'] ?? 'bulk_import';

    // force-update
    $forceUpdate = isset($options['force-update']);

    // verbose
    $verbose = isset($options['verbose']);

    // clean
    return [
        'lorisURL'       => $lorisURL,
        'redcapUsername' => $redcapUsername,
        'forceUpdate'    => $forceUpdate,
        'verbose'        => $verbose,
    ];
}

/**
 * Displays help for this script.
 *
 * @return void
 */
function showHelp() : void {
    fprintf(
        STDERR,
        "Usage:\n"
        . "  php redcap_bulk_importer.php \n"
        . "    {--loris-url=LORISURL}\n"
        . "    [--redcap-username=USER]\n"
        . "    [--force-update]\n"
        . "    [--verbose]\n\n"
        . "Notes:\n"
        . "  - required, '--loris-url=LORISURL'   the loris URL\n"
        . "  - optional, '--redcap-username=USER' the text that will be in all redcap notification as the REDCap username. (default: 'bulk_import')\n"
        . "  - optional, '--force-update'         needs to force update on complete instrument? (default: false)\n"
        . "  - optional, '--verbose'              verbose mode? (default: false)\n\n"
    );
}