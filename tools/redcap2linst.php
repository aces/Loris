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

require_once __DIR__ . "/generic_includes.php";

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// load redcap module to use the client
$lorisInstance->getModule('redcap')->registerAutoloader();

use LORIS\redcap\client\RedcapHttpClient;
use LORIS\redcap\client\models\RedcapDictionaryRecord;
use LORIS\redcap\config\RedcapConfigParser;
use LORIS\RedcapCSVParser;

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
    $redcapCSV = new SplFileInfo($options['file']);
    $redcapParser = new RedcapCSVParser($redcapCSV, $imp_instrument, $options['trimInstrumentName']);
    $dict = $redcapParser->parseDictionaryCSV($lorisInstance);
}


// output directory
$output_dir = $options['outputDir'];

// back-end name/title instrument mapping
$redcap_intruments_map = ($options['redcapConnection'])->getInstruments(true);

fwrite(STDOUT, "\n-- Writing LINST/META files.\n\n");

RedcapCSVParser::convertDictionaryCSVToLINST($dict, $output_dir, $redcap_intruments_map);

fwrite(STDOUT, "\n-- end\n");


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
    $output_dir = $options['o'] ?? $options['output-dir'] ?? null;
    if (empty($output_dir)) {
        fprintf(STDERR, "Output directory required.\n");
        showHelp();
        exit(1);
    }
    if (!is_dir($output_dir)) {
        fprintf(STDERR, "Output directory '$output_dir' does not exist.\n");
        exit(1);
    }
    if (!is_writeable($output_dir)) {
        fprintf(STDERR, "Output directory '$output_dir' is not writeable.\n");
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
                "Input file '$input_file' does not exist or is not readable.\n"
            );
            exit(1);
        }
    }

    // redcap instance and project
    $redcap_instance = $options['r'] ?? $options['redcap-instance'] ?? null;
    $redcap_project  = $options['p'] ?? $options['redcap-project'] ?? null;

    if (empty($redcap_instance)) {
        fprintf(STDERR, "REDCap instance name required.\n");
        showHelp();
        exit(1);
    }
    if (empty($redcap_project)) {
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
        "{$config->redcap_instance_url}/api/",
        $config->redcap_api_token,
    );

    // trim instrument name
    $trim_name = isset($options['t']) || isset($options['trim-formname']) || false;

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
