#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * Script that generates LINST instrument files from REDCap data dictionary.
 * REDCap data dictionary can be presented as a file or a direct API call.
 * REDCap instances and projects targetd by API calls must be must be properly
 * defined `config.xml` file to be used.
 *
 * PHP version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/../../../tools/generic_includes.php";

 // load redcap module
try {
    $lorisInstance->getModule('redcap')->registerAutoloader();
} catch (\LorisNoSuchModuleException $th) {
    error_log("[error] no 'redcap' module found.");
    exit(1);
}

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

use LORIS\redcap\client\RedcapHttpClient;
use LORIS\redcap\client\models\RedcapDictionaryRecord;
use LORIS\redcap\client\models\RedcapInstrument;
use LORIS\redcap\config\RedcapConfigParser;
use LORIS\redcap\Queries;

// options
$opts = getopt(
    "o:i:f:r:p:",
    [
        "output-dir:",
        "input-type:",
        "input-file:",
        "redcap-instance:",
        "redcap-project:",
        "trim-formname",
    ]
);

// clean options
$options = checkOptions($lorisInstance, $opts);

// get REDCap importable instrument list
$config         = $lorisInstance->getConfiguration();
$imp_instrument = $config->getSetting('redcap_importable_instrument');

// this will only return the importable instruments
if ($options['inputType'] === 'api') {
    // import only selected instruments from REDCap
    fwrite(STDOUT, "\n-- Getting metadata from REDCap connection.\n");
    $dict = $options['redcapConnection']->getDataDictionary(
        $imp_instrument,
        $options['trimInstrumentName']
    );
} else {
    // file stream to REDCap Dictionary Record
    fwrite(STDOUT, "\n-- Getting metadata from input file.\n");
    $dict = getDictionaryCSVStream(
        $options['file'],
        $imp_instrument,
        $options['trimInstrumentName']
    );
}

// create LINST lines by instrument
fwrite(STDOUT, "\n-- Parsing records...\n");
$instruments = [];
$dictionary  = [];
foreach ($dict as $dict_record) {
    $linst = $dict_record->toLINST();
    if (!empty($linst)) {
        $instruments[$dict_record->form_name][] = $linst;
        $dictionary[$dict_record->form_name][]  = $dict_record;
    }
}

// output directory
$output_dir = $options['outputDir'];

// back-end name/title instrument mapping
$redcap_intruments_map = ($options['redcapConnection'])->getInstruments(true);

// write instrument
fwrite(STDOUT, "\n-- Writing LINST/META files.\n\n");
foreach ($instruments as $instrument_name => $fields) {
    writeLINSTFile(
        $options['outputDir'],
        $redcap_intruments_map[$instrument_name],
        $fields
    );
}

// update the db redcap_dictionary table per instrument
fwrite(STDOUT, "\n-- Writing entries to database 'redcap_dictionary' table.\n\n");
$queries        = new Queries($lorisInstance);
$nbEntriesCount = [
    'created'   => 0,
    'updated'   => 0,
    'untouched' => 0
];
foreach ($dictionary as $instrument_name => $dictionary_entry) {
    $nbEntries = updateREDCapDictionaryInstrumentEntries(
        $queries,
        $instrument_name,
        $dictionary_entry
    );

    // update count
    $nbEntriesCount['created']   += $nbEntries['created'];
    $nbEntriesCount['updated']   += $nbEntries['updated'];
    $nbEntriesCount['untouched'] += $nbEntries['untouched'];
}

// db log
fwrite(STDOUT, "\n -> 'redcap_dictionary' table changes:");
fwrite(STDOUT, "\n    - fields created: {$nbEntriesCount['created']}");
fwrite(STDOUT, "\n    - fields updated: {$nbEntriesCount['updated']}");
fwrite(STDOUT, "\n    - fields untouched: {$nbEntriesCount['untouched']}\n");

fwrite(STDOUT, "\n-- end\n");


// ------------ Functions

/**
 * Updates the redcap_diciotnary table in db.
 *
 * @param LORIS\redcap\Queries     $queries           queries object
 * @param string                   $instrument_name   the instrument name to update
 * @param RedcapDictionaryRecord[] $redcap_dictionary the redcap dictionary
 *
 * @return int[] an array of #created and #updated entries for this instrument
 */
function updateREDCapDictionaryInstrumentEntries(
    Queries $queries,
    string $instrument_name,
    array $redcap_dictionary
): array {
    // updating or creating new entry?
    $instrumentExists = $queries->instrumentExistsInREDCapDictionary(
        $instrument_name
    );
    $updateMsg        = $instrumentExists ? "updating" : "creating";
    fwrite(STDOUT, " -> {$updateMsg} '{$instrument_name}'\n");

    // count
    $nbEntriesCount = [
        'created'   => 0,
        'updated'   => 0,
        'untouched' => 0
    ];

    // closure for escaped html
    $cleanHTML = fn($v) => is_string($v)
        ? htmlspecialchars(
            $v,
            ENT_COMPAT | ENT_SUBSTITUTE | ENT_HTML5,
            'UTF-8',
            false
        )
        : $v;

    // go through entries for this instrument
    foreach ($redcap_dictionary as $redcap_dictionary_entry) {
        // get the db correspoding field name
        $db_dictionary_field = $queries->getDictionaryEntry(
            $redcap_dictionary_entry->form_name,
            $redcap_dictionary_entry->field_name
        );

        // new entry => insert
        if ($db_dictionary_field === null) {
            $queries->insertREDCapDictionaryEntry($redcap_dictionary_entry);
            $nbEntriesCount['created'] += 1;
            continue;
        }

        // escape HTML from this entry to compare
        // same method use in Database class -> update
        $escaped_props        = array_map(
            $cleanHTML,
            $redcap_dictionary_entry->toArray()
        );
        $redcap_escaped_entry = new RedcapDictionaryRecord(
            array_combine(
                RedcapDictionaryRecord::getHeaders(),
                array_values($escaped_props)
            )
        );

        // same entry, nothing to do
        if ($db_dictionary_field == $redcap_escaped_entry) {
            $nbEntriesCount['untouched'] += 1;
            continue;
        }

        // different entry => update
        $queries->updateREDCapDictionaryEntry($redcap_dictionary_entry);
        $nbEntriesCount['updated'] += 1;
    }

    return $nbEntriesCount;
}

/**
 * Get the dictionary from a CSV file.
 *
 * @param string $input_file             a file path
 * @param array  $importable_instruments a list of importable instruments
 * @param bool   $trim_name              should the instrument name be trimmed?
 *
 * @return RedcapDictionaryRecord[] dictionary
 */
function getDictionaryCSVStream(
    string $input_file,
    array $importable_instruments,
    bool $trim_name,
): array {
    if (empty($input_file)) {
        fprintf(STDERR, "Required a REDCap dictionary file.\n");
        exit(1);
    }

    // If a local input file was specified just open it
    $fp = fopen($input_file, "r");
    if ($fp === false) {
        fprintf(STDERR, "Could not open file $input_file\n");
        exit(1);
    }

    // first line = headers, skip them
    fgetcsv($fp);
    // use know one instead
    $headers = RedcapDictionaryRecord::getHeaders();

    // read file
    $dictionary        = [];
    $badMap            = 0;
    $mapped            = 0;
    $last_redcap_error = '';
    while ($row = fgetcsv($fp)) {
        $inst = $row[1];
        // skip non importable instruments
        if (!in_array($inst, $importable_instruments, true)) {
            $msg = " -> instrument not importable '$inst', skipped.\n";
            // to avoid repeating same msg
            if ($last_redcap_error !== $msg) {
                $last_redcap_error = $msg;
                fwrite(STDERR, $msg);
            }
            continue;
        }

        // metadata
        $metadata = $row;

        // combine headers/data
        $payload = array_combine($headers, $metadata);

        // do not trim
        if (!$trim_name) {
            $dd = new RedcapDictionaryRecord($payload);
            $mapped++;
        } else {
            // try to trim form name
            try {
                $dd = new RedcapDictionaryRecord($payload, true);
                $mapped++;
            } catch (\LorisException $le) {
                // print error but continue with non trimmed
                fprintf(STDERR, $le->getMessage());
                $dd = new RedcapDictionaryRecord($payload);
                $badMap++;
            }
        }

        // add to dictionary
        $dictionary[] = $dd;
    }
    fclose($fp);

    // bad map
    if ($trim_name) {
        fwrite(STDERR, "\nCould not map $badMap fields\nMapped $mapped fields\n");
    }

    return $dictionary;
}

/**
 * Write LINST file and its associated META file.
 *
 * @param string           $output_dir the output directory
 * @param RedcapInstrument $instrument the instrument object
 * @param array            $fields     the instrument data
 *
 * @return void
 */
function writeLINSTFile(
    string $output_dir,
    RedcapInstrument $instrument,
    array $fields
): void {
    fwrite(STDOUT, " -> writing '{$instrument->name}'\n");
    //
    $fp = fopen("{$output_dir}/{$instrument->name}.linst", "w");

    if ($fp === false) {
        throw new \LorisException(
            "Cannot open path: {$output_dir}/{$instrument->name}.linst"
        );
    }

    fwrite($fp, "{-@-}testname{@}{$instrument->name}\n");
    fwrite($fp, "table{@}{$instrument->name}\n");
    fwrite($fp, "title{@}{$instrument->label}\n");

    // Standard LORIS metadata fields that the instrument builder adds
    // and LINST class automatically adds to instruments.
    fwrite($fp, "date{@}Date_taken{@}Date of Administration{@}{@}\n");
    fwrite($fp, "static{@}Candidate_Age{@}Candidate Age (Years)\n");
    fwrite($fp, "static{@}gestational_age{@}Gestational Age (Days)\n");
    fwrite($fp, "static{@}Window_Difference{@}Window Difference (+/- Days)\n");
    fwrite($fp, "select{@}Examiner{@}Examiner{@}NULL=>''\n");

    foreach ($fields as $field) {
        // avoid 'timestamp_start', changed in 'static' instead of 'text'
        if (str_contains($field, "{@}timestamp_start{@}")) {
            // transform timestamp start to static
            fwrite($fp, "static{@}timestamp_start{@}Start time (server)\n");

            // add 'timestamp_stop' and 'Duration' fields after 'timestamp_start'
            fwrite($fp, "static{@}timestamp_stop{@}Stop time (server)\n");
            fwrite($fp, "static{@}Duration{@}Duration (server) (in seconds)\n");

        } else {
            // write field line
            fwrite($fp, "$field\n");
        }
    }

    fwrite($fp, "{-@-}\n");
    fclose($fp);

    // META file
    $fp_meta = fopen("{$output_dir}/{$instrument->name}.meta", "w");

    if ($fp_meta === false) {
        throw new \LorisException(
            "Cannot open path: {$output_dir}/{$instrument->name}.meta"
        );
    }

    fwrite($fp_meta, "testname{@}{$instrument->name}\n");
    fwrite($fp_meta, "table{@}{$instrument->name}\n");
    fwrite($fp_meta, "jsondata{@}true\n");
    fwrite($fp_meta, "norules{@}true");
    fclose($fp_meta);
}

/**
 * Prints usage instruction to stderr
 *
 * @return void
 */
function showHelp()
{
    global $argv;
    fprintf(
        STDERR,
        "\nUsage: {$argv[0]}\n\n"
        . "Creates LINST files based on an input file"
        . " or directly from a REDCap connection.\n"
        . "A valid REDCap connection is required to get the instruments back-end"
        . " name/title mapping.\n\n"
        . " -o/--output-dir=INSTRUMENT_DIR        output directory for generated"
        . " files\n"
        . " -i/--input-type=('file' OR 'api')     explicit dictionary input type"
        . ", can be 'api' or 'file':\n"
        . "      - 'api'  = direct REDCap API call to get the dictionary\n"
        . "      - 'file' = uses a REDCap dictionary file and parses it\n"
        . " -r/--redcap-instance=INSTANCE_NAME    REDCap instance name to use\n"
        . " -p/--redcap-project=PROJECT_ID        REDCap instance project ID to"
        . " use\n"
        . " [-f/--input-file=FILEPATH]            only required with -i=file, the"
        . " dictionary file\n"
        . " [-t/--trim-formname]                  optional, trim instrument name"
        . " from field name\n"
        . "\n"
    );
}

/**
 * Check options and return a clean version
 *
 * @param LORIS\LorisInstance $loris   a loris instance
 * @param array               $options options
 *
 * @return array
 */

/**
 * Check options and return a clean version.
 *
 * @param LORIS\LorisInstance $loris   a loris instance
 * @param array<mixed>        $options options
 *
 * @return array{
 *   file: string|null,
 *   inputType: 'api'|'file',
 *   outputDir: string,
 *   redcapConnection: RedcapHttpClient,
 *   redcapInstance: string,
 *   redcapProject: string,
 *   trimInstrumentName: bool
 * }
 */
function checkOptions(\LORIS\LorisInstance $loris, array &$options): array
{
    // ouput dir
    $output_dir = $options['o'] ?? $options['output-dir'] ?? null;
    if ($output_dir === null || empty($output_dir)) {
        fprintf(STDERR, "Output directory required.\n");
        showHelp();
        exit(1);
    }
    if (!is_string($output_dir)) {
        fprintf(STDERR, "Output directory '{$output_dir}' must be a path.\n");
        exit(1);
    }
    if (!is_dir($output_dir)) {
        fprintf(STDERR, "Output directory '{$output_dir}' does not exist.\n");
        exit(1);
    }
    if (!is_writeable($output_dir)) {
        fprintf(STDERR, "Output directory '{$output_dir}' is not writeable.\n");
        exit(1);
    }

    // source type
    $source_type = $options['i'] ?? $options['input-type'] ?? null;
    if (empty($source_type)) {
        fprintf(STDERR, "Source type required.\n");
        showHelp();
        exit(1);
    }
    if (!in_array($source_type, ['file','api'], true)) {
        fprintf(STDERR, "Source type must be one of 'file' or 'api'.\n");
        showHelp();
        exit(1);
    }

    // file, only checked and used if inputType = 'file'
    $input_file = $options['f'] ?? $options['input-file'] ?? null;
    if ($source_type === 'file') {
        if (empty($input_file)) {
            fprintf(STDERR, "Input file required.\n");
            showHelp();
            exit(1);
        }
        if (!is_file($input_file)) {
            fprintf(
                STDERR,
                "Input file '{$input_file}' does not exist or is not readable.\n"
            );
            exit(1);
        }
    }

    // redcap instance and project
    $redcap_instance = $options['r'] ?? $options['redcap-instance'] ?? null;
    $redcap_project  = $options['p'] ?? $options['redcap-project'] ?? null;

    if ($redcap_instance === null || empty($redcap_instance)) {
        fprintf(STDERR, "REDCap instance name required.\n");
        showHelp();
        exit(1);
    }
    if ($redcap_project === null || empty($redcap_project)) {
        fprintf(STDERR, "REDCap project ID required.\n");
        showHelp();
        exit(1);
    }

    $config_parser = new RedcapConfigParser(
        $loris,
        $redcap_instance,
        $redcap_project,
    );

    $config = $config_parser->parse();

    $redcap_client = new RedcapHttpClient(
        $config->redcap_instance_url,
        $config->redcap_api_token,
    );

    // trim instrument name
    $trim_name = isset($options['trim-formname']) || false;

    // checked and clean options
    return [
        'outputDir'          => $output_dir,
        'inputType'          => $source_type,
        'file'               => $input_file,
        'redcapInstance'     => $redcap_instance,
        'redcapProject'      => $redcap_project,
        'redcapConnection'   => $redcap_client,
        'trimInstrumentName' => $trim_name,
    ];
}
