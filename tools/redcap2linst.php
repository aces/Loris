#!/usr/bin/env php
<?php declare(strict_types=1);

require_once __DIR__ . "/generic_includes.php";

use LORIS\redcap\models\RedcapDictionaryRecord;

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// load redcap module to use the client
$lorisInstance->getModule('redcap')->registerAutoloader();
use LORIS\redcap\RedcapHTTPClientHandler;

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
$config  = $lorisInstance->getConfiguration();
$impInst = $config->getSetting('redcap_importable_instrument');

// this will only return the importable instruments
if ($options['inputType'] === 'api') {
    // import only selected instruments from REDCap
    fwrite(STDOUT, "\n-- Getting metadata from REDCap connection.\n");
    $dict = $options['redcapConnection']->getDataDictionary(
        $impInst,
        $options['trimInstrumentName']
    );
} else {
    // file stream to REDCap Dictionary Record
    fwrite(STDOUT, "\n-- Getting metadata from input file.\n");
    $dict = getDictionaryCSVStream(
        $options['file'],
        $impInst,
        $options['trimInstrumentName']
    );
}

// create LINST lines by instrument
fwrite(STDOUT, "\n-- Parsing records...\n");
$instruments = [];
foreach ($dict as $dictRecord) {
    $linst = $dictRecord->toLINST();
    if (!empty($linst)) {
        $instruments[$dictRecord->getFormName()][] = $linst;
    }
}

// output directory
$outputDir = $options['outputDir'];

// back-end name/title instrument mapping
$redcapIntrumentsMap = ($options['redcapConnection'])->getInstruments(true);

fwrite(STDOUT, "\n-- Writing LINST/META files.\n\n");

// write instrument
foreach ($instruments as $instname => $instrument) {
    writeLINSTFile(
        $options['outputDir'],
        $instname,
        $redcapIntrumentsMap[$instname],
        $instrument
    );
}

fwrite(STDOUT, "\n-- end\n");


// ------------ Functions

/**
 * Get the dictionary from a CSV file.
 *
 * @return RedcapDictionaryRecord[] dictionary
 */
function getDictionaryCSVStream(
    string $inputFile,
    array $importableInstruments,
    bool $trimName
): array {
    if (empty($inputFile)) {
        fprintf(STDERR, "Required a REDCap dictionary file.\n");
        exit(1);
    }

    // If a local input file was specified just open it
    $fp = fopen($inputFile, "r");
    if ($fp === false) {
        fprintf(STDERR, "Could not open file $inputFile\n");
        exit(1);
    }

    // first line = headers, skip them
    fgetcsv($fp);
    // use know one instead
    $headers = RedcapDictionaryRecord::getHeaders();

    // read file
    $dictionary      = [];
    $badMap          = 0;
    $mapped          = 0;
    $lastREDCapError = '';
    while ($row = fgetcsv($fp)) {
        $inst = $row[1];
        // skip non importable instruments
        if (!in_array($inst, $importableInstruments, true)) {
            $msg = " -> instrument not importable '$inst', skipped.\n";
            // to avoid repeating same msg
            if ($lastREDCapError !== $msg) {
                $lastREDCapError = $msg;
                fwrite(STDERR, $msg);
            }
            continue;
        }

        // metadata
        $metadata = $row;

        // do not trim
        if (!$trimName) {
            $dd = new RedcapDictionaryRecord(zip($headers, $metadata));
            $mapped++;
        } else {
            // try to trim form name
            try {
                $dd = new RedcapDictionaryRecord(zip($headers, $metadata), true);
                $mapped++;
            } catch (\LorisException $le) {
                // print error but continue with non trimmed
                fprintf(STDERR, $le->getMessage());
                $dd = new RedcapDictionaryRecord(zip($headers, $metadata));
                $badMap++;
            }
        }

        // add to dictionary
        $dictionary[] = $dd;
    }
    fclose($fp);

    // bad map
    if ($trimName) {
        fwrite(STDERR, "\nCould not map $badMap fields\nMapped $mapped fields\n");
    }

    return $dictionary;
}

/**
 * Zips values from the first array has keys, and values of the second array
 * as values. Both arrays must have the same length.
 *
 * @param array $headers  the key array
 * @param array $metadata the value array.
 *
 * @return array a zipped array.
 */
function zip(array &$headers, array &$metadata): array
{
    if (count($headers) !== count($metadata)) {
        fwrite(STDERR, "Cannot zip headers with metadata.\n");
    }
    $zipped = [];
    foreach ($headers as $i => $h) {
        $zipped[$h] = $metadata[$i];
    }
    return $zipped;
}

/**
 * Write LINST file and its associated META file.
 *
 * @param string $outputDir the output directory
 * @param string $instname  the instrument name
 * @param string $instTitle the instrument title/label
 * @param array $instrument the instrument data
 *
 * @return void
 */
function writeLINSTFile(
    string $outputDir,
    string $instname,
    string $instTitle,
    array $instrument
): void {
    fwrite(STDERR, " -> writing '$instname'\n");
    //
    $fp = fopen("$outputDir/$instname.linst", "w");
    fwrite($fp, "{-@-}testname{@}$instname\n");
    fwrite($fp, "table{@}$instname\n");
    fwrite($fp, "title{@}$instTitle\n");

    // Standard LORIS metadata fields that the instrument builder adds
    // and LINST class automatically adds to instruments.
    fwrite($fp, "date{@}Date_taken{@}Date of Administration{@}{@}\n");
    fwrite($fp, "static{@}Candidate_Age{@}Candidate Age (Years)\n");
    fwrite($fp, "static{@}gestational_age{@}Gestational Age (Days)\n");
    fwrite($fp, "static{@}Window_Difference{@}Window Difference (+/- Days)\n");
    fwrite($fp, "select{@}Examiner{@}Examiner{@}NULL=>''\n");

    foreach ($instrument as $field) {
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
    fclose($fp);

    // META file
    $fpMeta = fopen("$outputDir/$instname.meta", "w");
    fwrite($fpMeta, "testname{@}$instname\n");
    fwrite($fpMeta, "table{@}$instname\n");
    fwrite($fpMeta, "jsondata{@}true\n");
    fwrite($fpMeta, "norules{@}true");
    fclose($fpMeta);
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
        "\nUsage: $argv[0]\n\n"
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
function checkOptions(\LORIS\LorisInstance $loris, array &$options): array
{
    // ouput dir
    $outputDir = $options['o'] ?? $options['output-dir'] ?? null;
    if (empty($outputDir)) {
        fprintf(STDERR, "Output directory required.\n");
        showHelp();
        exit(1);
    }
    if (!is_dir($outputDir)) {
        fprintf(STDERR, "Output directory '$outputDir' does not exist.\n");
        exit(1);
    }
    if (!is_writeable($outputDir)) {
        fprintf(STDERR, "Output directory '$outputDir' is not writeable.\n");
        exit(1);
    }

    // source type
    $sourceType = $options['i'] ?? $options['input-type'] ?? null;
    if (empty($sourceType)) {
        fprintf(STDERR, "Source type required.\n");
        showHelp();
        exit(1);
    }
    if (!in_array($sourceType, ['file','api'], true)) {
        fprintf(STDERR, "Source type must be one of 'file' or 'api'.\n");
        showHelp();
        exit(1);
    }

    // file, only checked and used if inputType = 'file'
    $inputFile = $options['f'] ?? $options['input-file'] ?? null;
    if ($sourceType === 'file') {
        if (empty($inputFile)) {
            fprintf(STDERR, "Input file required.\n");
            showHelp();
            exit(1);
        }
        if (!is_file($inputFile)) {
            fprintf(STDERR, "Input file '$inputFile' does not exist or is not readable.\n");
            exit(1);
        }
    }

    // redcap instance and project
    $rInstance = $options['r'] ?? $options['redcap-instance'] ?? null;
    $rProject  = $options['p'] ?? $options['redcap-project'] ?? null;
    $rc        = null;
    if (empty($rInstance)) {
        fprintf(STDERR, "REDCap instance name required.\n");
        showHelp();
        exit(1);
    }
    if (empty($rProject)) {
        fprintf(STDERR, "REDCap project ID required.\n");
        showHelp();
        exit(1);
    }
    // client handler
    $rh = RedcapHTTPClientHandler::factory($loris, false);
    if (!$rh->hasInstanceProjectByName($rInstance, $rProject)) {
        fprintf(
            STDERR,
            "REDCap instance '$rInstance' with project ID"
            . " '$rProject' does not exist in 'config.xml'.\n"
        );
        showHelp();
        exit(1);
    }
    // get client
    $rc = $rh->getClientByName($rInstance, $rProject);

    // trim instrument name
    $trimName = isset($options['t']) || isset($options['trim-formname']) || false;

    // checked and clean options
    return [
        'outputDir'          => $outputDir,
        'inputType'          => $sourceType,
        'file'               => $inputFile,
        'redcapInstance'     => $rInstance,
        'redcapProject'      => $rProject,
        'redcapConnection'   => $rc,
        'trimInstrumentName' => $trimName,
    ];
}