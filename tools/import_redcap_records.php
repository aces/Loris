#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This script will fetch records from REDCap and import them into LORIS.
 */

require_once __DIR__ . "/generic_includes.php";

// Load the REDCap module.

try {
    $lorisInstance->getModule('redcap')->registerAutoloader();
} catch (\LorisNoSuchModuleException $th) {
    error_log("[error] no 'redcap' module found.");
    exit(1);
}

use LORIS\redcap\config\RedcapConfigParser;
use LORIS\redcap\client\RedcapHttpClient;
use LORIS\redcap\RedcapMapper;
use LORIS\redcap\RedcapRecordImporter;

// Get CLI arguments.

$args = parseArgs(
    getopt(
        "",
        [
            'instance-url:',
            'project-id:',
            'simulate',
            'verbose',
        ]
    )
);

// Get CLI arguments.

$redcap_instance_url = $args['instance-url'];
$redcap_project_id   = $args['project-id'];
$simulate            = $args['simulate'];
$verbose = $args['verbose'];

// Display CLI arguments.

$simulate_message = $simulate ? "enabled" : "disabled";
$verbose_message  = $verbose ? "enabled" : "disabled";

fprintf(STDOUT, "[args:instance-url] $redcap_instance_url\n");
fprintf(STDOUT, "[args:project-id] $redcap_project_id\n");
fprintf(STDOUT, "[args:simulate] $simulate_message\n");
fprintf(STDOUT, "[args:verbose] $verbose_message\n");

// Get the REDCap module configuration for the relevant REDCap project.

$redcap_config_parser = new RedcapConfigParser(
    $lorisInstance,
    $redcap_instance_url,
    $redcap_project_id,
);

$redcap_config = $redcap_config_parser->parse();

if ($redcap_config === null) {
    fprintf(
        STDERR,
        "No REDCap configuration found for REDCap instance URL"
        . "'{$redcap_instance_url}' and REDCap project ID "
        . "{$redcap_project_id}.\n"
    );

    exit(1);
}

$redcap_client = new RedcapHttpClient(
    $redcap_config->redcap_instance_url,
    $redcap_config->redcap_api_token,
);

$redcap_mapper = new RedcapMapper($lorisInstance, $redcap_client, $redcap_config);

// Fetch the REDCap unique event names that match the REDCap module project
// configuration.

$unique_event_names = array_map(
    fn ($visit_config) => $redcap_mapper
        ->getVisitConfigEvent($visit_config)
        ->unique_name,
    $redcap_config->visits,
);

$importable_instruments = $config->getSetting('redcap_importable_instrument');

// Fetch the REDCap records that match the REDCap importable instruments and unique
// event names.
$records = [];

foreach ($unique_event_names as $unique_event_name) {
    foreach ($importable_instruments as $importable_instrument) {
        fprintf(
            STDOUT,
            "Fetching records for unique event name '{$unique_event_name}' and "
            . "instrument '{$importable_instrument}'...\n",
        );

        try {
            $instrument_records = $redcap_client->getInstrumentRecords(
                $importable_instrument,
                $unique_event_name,
                null,
            );
        } catch (\LorisException $exception) {
            fprintf(
                STDERR,
                "Failed to fetch instrument records:\n{$exception->getMessage()}\n",
            );
            continue;
        }

        $records = array_merge($records, $instrument_records);
    }
}

$record_importer = new RedcapRecordImporter(
    $lorisInstance,
    $redcap_client,
    $redcap_config,
);

$records_imported_count = 0;
$records_ignored_count  = 0;
$records_failed_count   = 0;

foreach ($records as $record) {
    fprintf(
        STDOUT,
        "Importing record {$record->record_id} {$record->unique_event_name}"
        . " {$record->getFormName()}...\n",
    );

    // Do not actually import REDCap records into LORIS in simulation mode.
    if ($simulate) {
        $records_ignored_count += 1;
        continue;
    }

    try {
        if ($record_importer->import($record)) {
            fprintf(STDOUT, "Successfully imported record.\n");
            $records_imported_count += 1;
        } else {
            fprintf(STDOUT, "Skipped record import.\n");
            $records_ignored_count += 1;
        }
    } catch (\LorisException $exception) {
        fprintf(STDOUT, "Failed to import record:\n{$exception->getMessage()}\n");
        $records_failed_count += 1;
    }
}

fprintf(
    STDOUT,
    "Successful records imports: $records_imported_count\n"
    . "Skipped records imports: $records_ignored_count\n"
    . "Failed records imports: $records_failed_count\n"
);

/**
 * Check the CLI arguments passed to the script and return them in an associative
 * array.
 *
 * @param array $args The unstructured CLI arguments.
 *
 * @return array
 */
function parseArgs(array $args): array
{
    // Check the required CLI arguments.
    if (!isset($args['instance-url']) || !isset($args['project-id'])) {
        error_log("[error] Required arguments: --instance-url --project-id");
        showHelp();
        exit(1);
    }

    return [
        'instance-url' => $args['instance-url'],
        'project-id'   => $args['project-id'],
        'simulate'     => isset($args['simulate']),
        'verbose'      => isset($args['verbose']),
    ];
}

/**
 * Displays help for this script.
 *
 * @return void
 */
function showHelp() : void
{
    fprintf(
        STDERR,
        "Usage:\n"
        . "  php import_redcap_records.php \n"
        . "    [--instance-url=URL]\n"
        . "    [--project-id=ID]\n"
        . "    [--simulate]\n"
        . "    [--verbose]\n\n"
        . "Notes:\n"
        . "  --instance-url=URL   (required) The URL of the REDCap instance from"
        . " which to import records from.\n"
        . "  --project-id=ID      (required) The ID of the REDCap project from"
        . " which to import records from.\n"
        . "  --simulate           (optional) Fetch records without importing them"
        . " into LORIS. (default: false)\n"
        . "  --verbose            (optional) Display verbose information. (default:"
        . " false)\n\n"
    );
}
