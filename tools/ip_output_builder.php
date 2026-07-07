#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This parses all of the instruments and generates a staging file (ip_output.txt)
 * which can be used by other tools such as data_dictionary_builder.php and
 * generate_tables_sql.php to handled parsed instrument dictionary.
 *
 * PHP version 8
 *
 * @category Behavioural
 * @package  Tools
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/generic_includes.php";

use \LORIS\LorisInstance;
use \Loris\Behavioural\NDB_BVL_Instrument_LINST;

// parse args
$flags = getopt("mh", ["add-meta", "help"]);

//
if (isset($flags["h"]) || isset($flags["help"])) {
    usage();
    exit(0);
}

// should add ".meta" file content?
$addMeta = isset($flags["m"]) || isset($flags["add-meta"]);
if ($addMeta) {
    fprintf(STDOUT, "[option:add-meta] LINST \".meta\" file content will be added.\n");
}

/**
 * Clean label regex.
 */
const CLEAN_LABEL_REGEX = "/\s+/";

// loris base path
$lorisBase = $lorisInstance->getConfiguration()->getSetting("base");
if ($lorisBase === null) {
    fprintf(STDERR, "No 'base' defined for LORIS in the database. Please add it.");
    exit(1);
}
$lorisBase = rtrim($lorisBase, "/");

// define paths
$instrumenDir = "{$lorisBase}/project/instruments";
$outputFile   = "{$lorisBase}/tools/ip_output.txt";

// get the list of instruments
$instruments = getInstruments($lorisInstance, $instrumenDir);

// open ip_output.txt
$ipOutput = fopen($outputFile, "w");

// tells if an instrument file name targets a linst instrument
$isLINST = fn($instrumentFile) => str_ends_with($instrumentFile, ".linst");

// add instruments to ip_output.txt
foreach ($instruments as $instrumentName => $instrumentFileName) {
    // log delimiter
    fprintf(STDOUT, "---------------------------------------------------\n");

    // process according to the file type
    if ($isLINST($instrumentFileName)) {
        fprintf(STDOUT, "Copying LINST instrument: {$instrumentName}\n");
        $barename = substr($instrumentFileName, 0, strpos($instrumentFileName, "."));
        $res = copyLINSTInstrument(
            $ipOutput,
            $instrumentName,
            "{$instrumenDir}/{$instrumentFileName}",
            $addMeta,
            "{$instrumenDir}/{$barename}.meta"
        );
    } else {
        // parse and add PHP instrument to ip_ouput.txt
        fprintf(STDOUT, "Parsing PHP instrument: {$instrumentName}\n");
        $res = parsePHPInstrument(
            $lorisInstance,
            $ipOutput,
            $instrumentName,
            "{$instrumenDir}/{$instrumentFileName}"
        );
    }

    // result
    if ($res === true) {
        fprintf(STDOUT, "Complete!\n");
    } else {
        fprintf(STDERR, "Error!\n");
    }

    // adding the star wars bomber terminal tag for each instrument
    // at the end for the instrument to include possible ".meta" in
    // ".linst" instrument case.
    fwrite($ipOutput, "{-@-}\n");
}

// close ip_output.txt file
fclose($ipOutput);

// --------------------------------------------------
// Functions
// --------------------------------------------------

/**
 * Reads a file and returns the content.
 *
 * @param string $instrumentFilePath the instrument file path
 *
 * @return string the file full data.
 */
function getInstrumentFileData(string $instrumentFilePath): string
{
    if (!is_file($instrumentFilePath)) {
        throw new \LorisException(
            "File does not exist or is not accessible: {$instrumentFilePath}"
        );
    }

    // open file
    $fp = fopen($instrumentFilePath, "r");
    if ($fp === false) {
        throw new \LorisException("Failed to open {$instrumentFilePath}");
    }

    // Read data
    // Using the same buffer as in NDB_BVL_Instrument_LINST.
    // Based on very long line (lots of options) in some REDCap instruments.
    $data = "";
    while (!feof($fp)) {
        $line = fgets($fp, NDB_BVL_Instrument_LINST::LINE_BUFFER_SIZE);
        if ($line === false) {
            continue;
        }
        $data .= trim($line) . "\n";
    }

    // close and return
    fclose($fp);
    return $data;
}

/**
 * Add a linst file data to the "ip_output.txt".
 *
 * @param mixed  $ipOutput           the ip_output.txt file descriptor.
 * @param string $instrumentName     the instrument name
 * @param string $instrumentFilePath the instrument ".linst" file path
 * @param bool   $addMeta            add the ".meta" content to the beginning.
 * @param string $instrumentMetaFile the instrument ".meta" file path
 *
 * @return bool true if the copying worked, else false.
 */
function copyLINSTInstrument(
    mixed $ipOutput,
    string $instrumentName,
    string $instrumentFilePath,
    bool $addMeta = false,
    string $instrumentMetaFile = null
): bool {
    // output final
    $output = "";

    // do add ".meta" content?
    if ($addMeta) {
        fprintf(
            STDOUT,
            "[option:add-meta] Reading file: {$instrumentMetaFile}\n"
        );
        try {
            $output .= getInstrumentFileData($instrumentMetaFile);
        } catch (\LorisException $le) {
            fprintf(
                STDERR,
                "[option:add-meta][skipped] {$le->getMessage()}\n"
            );
        }
    }

    // get ".linst" data
    try {
        $output .= getInstrumentFileData($instrumentFilePath);
    } catch (\LorisException $le) {
        fprintf(STDERR, "{$le->getMessage()}\n");
        return false;
    }

    // copy to ip_output file
    if (empty($output)) {
        fprintf(STDERR, "Nothing to output, 'ip_output.txt' not created\n");
    } else {
        fwrite($ipOutput, $output);
    }

    // good end
    return true;
}

/**
 * Parse a PHP instrument to the "ip_output.txt" stream.
 *
 * @param LorisInstance $loris              the loris instance
 * @param mixed         $ipOutput           the ip_output.txt file descriptor.
 * @param string        $instrumentName     the instrument name
 * @param string        $instrumentFilePath the instrument file path
 *
 * @return bool true if the parsing worked, else false.
 */
function parsePHPInstrument(
    LorisInstance $loris,
    mixed $ipOutput,
    string $instrumentName,
    string $instrumentFilePath
): bool {
    // get data
    try {
        $data = getInstrumentFileData($instrumentFilePath);
    } catch (\LorisException $le) {
        fprintf(STDERR, "{$le->getMessage()}\n");
        return false;
    }

    // check instrument state
    preg_match("/class (.+) extends NDB_BVL_Instrument/", $data, $matches);
    if (empty($matches[1])) {
        fprintf(STDERR, "File '{$instrumentFilePath}' does not contain an instrument.\n");
        return false;
    }

    // match
    fprintf(STDOUT, "Reading file {$instrumentFilePath}\n");
    $className = $matches[1];

    // include
    fprintf(STDOUT, "Requiring file...\n");
    include_once $instrumentFilePath;

    // instantiate
    fprintf(STDOUT, "Instantiating new object...\n");
    $obj = new $className(
        $loris,
        new NullModule($loris, "loris"),
        "",
        "",
        "",
        ""
    );

    // setup instrument
    fprintf(STDOUT, "Initializing instrument object...\n");
    $obj->setup(null, null);
    $subtests = $obj->getSubtestList();
    foreach ($subtests as $subtest) {
        $obj->page = $subtest['Name'];
        fprintf(STDOUT, "Building instrument page '$subtest[Name]'...\n");
        $obj->_setupForm();
    }

    if (is_array($obj->getFullName())) {
        fprintf(
            STDERR,
            "Could not find row for {$className} in table test_names,"
            . " please populate test_names, instrument_subtests\n"
        );
        return false;
    }

    // parse
    fprintf(STDOUT, "Parsing instrument object...\n");
    if (empty($output)) {
        $output = "";
    }

    $output .= "testname{@}" . $obj->testName . "\n";
    $output .= "table{@}" . $obj->table . "\n";
    $output .= "title{@}" . $obj->getFullName() . "\n";

    $formElements = $obj->form->toElementArray();

    $output .= parseElements($obj, $formElements["elements"]);

    // write in file
    if (empty($output)) {
        fprintf(STDERR, "Nothing to output, 'ip_output.txt' not created\n");
    } else {
        fwrite($ipOutput, $output);
    }

    // good end
    return true;
}

/**
 * Create a linst formated string for an LorisForm element.
 *
 * @param NDB_BVL_Instrument $instrument an instrument instancer
 * @param LorisFormElement   $elements   The element to parse.
 * @param string             $groupLabel The group label
 *
 * @return string LINST formated element.
 */
 function parseElements($instrument, $elements, $groupLabel = "")
 {
    $output = '';
    foreach ($elements as $element) {

        // clean label
        $label = cleanLabel($element["label"], $groupLabel);

        // parse element
        switch ($element["type"]) {
        case "select":
            $output .="select";
            if (array_key_exists("multiple", $element)) {
                $output .="multiple";
            }
            $output       .="{@}".$element["name"]."{@}".$label."{@}";
            $optionsOutput ="";
            foreach ($element["options"] as $key => $option) {
                if (!empty($optionsOutput)) {
                    $optionsOutput .="{-}";
                }
                if (is_null($option) || $option==="") {
                    $optionsOutput .="NULL";
                } else {
                    $optionsOutput .="'".$key."'";
                }
                $optionsOutput .="=>'".addslashes($option)."'";
            }
            $output .= $optionsOutput."\n";
            break;

        case "text":
            $output .= "text{@}".$element["name"]."{@}".$label."\n";
            break;

        case "textarea":
            $output .= "textarea{@}".$element["name"]."{@}".$label."\n";
            break;

        case "date":
            $options = "{@}";
            if (array_key_exists("options", $element)
                && isset($el["options"]["minYear"])
                && isset($el["options"]["maxYear"])
            ) {
                $options = $element["options"]["minYear"]
                ."{@}"
                .$element["options"]["maxYear"];
            }
            $output .= "date{@}".$element["name"]."{@}".$label."{@}".$options."\n";
            break;

        case "group":
            $output .= parseElements($instrument, $element["elements"], $label);
            break;

        case "header":
            $name = "";
            if (array_key_exists("name", $element)) {
                $name = $element["name"];
            }
            $output .= "header{@}".$name."{@}".$element["label"]."\n";
            break;

        case "static":
            //see how static element is used...
            if (!array_key_exists("name", $element)) {
                $output .="header{@}{@}".$label."\n";
            } elseif (($element["name"] == null)
                || array_key_exists($element["name"], $instrument->localDefaults)
                || $element["name"] =="lorisSubHeader"
            ) {
                //element is plain form text, or a header.
                $output .= "header{@}".$element["name"]."{@}".$label."\n";
            } else {
                //element reports a database score
                $output .= "static{@}".$element["name"]."{@}".$label."\n";
            }

            break;

        case "advcheckbox":
            $output .= "checkbox{@}".$element["name"]."{@}".$label."\n";
            break;

        case "html_quickform_radio":
            $mainquestion = addslashes($element->_label);
            $optionfield  = addslashes($element->_text);
            if ($element->_attributes["position"] == "first") {
                $output .= "radio{@}";
                $output .= $element->_attributes["name"] . "{@}";
                $output .= $mainquestion . "{@}";
            }
            $output .= "'" . $element->_attributes["value"]
            . "'=>'" . $optionfield . "'";
            if ($element->_attributes["position"] == "last") {
                $output .= "\n";
            } else {
                $output .= "{-}";
            }
            break;
        case "time":
            $output .= "time{@}".$element["name"]."{@}".$label."\n";
            break;
        case "html":
        case "file":
        case "hidden":
            // skip because it's useless
            fprintf(
                STDERR,
                "SKIP: skipping quickform element type: ".$element["type"]."\n"
            );
            break;

        default:
            fprintf(
                STDERR,
                "WARNING:  Unknown form element type: ".$element["type"]."\n"
            );
            break;
        }
     }
     return $output;
 }

 /**
  * Clean a raw label.
  *
  * @param null|string $rawLabel   the raw label to clean.
  * @param string      $groupLabel an optional group label to include in the cleaning.
  *
  * @return string the cleaned label
  */
function cleanLabel(
    ?string $rawLabel = null,
    string $groupLabel = ""
): string {
    // return group label instead
    if ($rawLabel === null || empty(trim($rawLabel))) {
        return trim(preg_replace(CLEAN_LABEL_REGEX, " ", $groupLabel));
    }

    // clean the raw label
    $label = str_replace("&nbsp;", "", $rawLabel);
    return trim(preg_replace(CLEAN_LABEL_REGEX, " ", $label));
}

/**
 * Get the list of parsable PHP instruments.
 *
 * @param LorisInstance $loris        the loris instance
 * @param string        $instrumenDir the instrument directory path
 *
 * @return array the list of selected instrument [name => filename]
 */
function getInstruments(LorisInstance $loris, string $instrumenDir): array
{
    // instruments to skip
    $excludedInstruments = getExcludedInstruments($loris);

    // building list
    fprintf(STDOUT, "Building instrument list...\n");
    $instruments = [];
    foreach (new DirectoryIterator($instrumenDir) as $fileInfo) {
        // skip self/parent directory
        if ($fileInfo->isDot()) {
            continue;
        }

        // skip if is directory
        if ($fileInfo->isDir()) {
            continue;
        }

        // skip if is linst or php only
        if (!str_ends_with($fileInfo->getBasename(), ".class.inc")
            && !str_ends_with($fileInfo->getBasename(), ".php")
            && !str_ends_with($fileInfo->getBasename(), ".linst")
        ) {
            continue;
        }

        // clean instrument name
        // - remove extension
        // - remove "NDB_BVL_Instrument_" prefix if any
        $instrumentName = str_replace(
            "NDB_BVL_Instrument_",
            "",
            substr(
                $fileInfo->getBasename(),
                0,
                strpos($fileInfo->getBasename(), ".")
            )
        );

        // skip excluded instruments
        if (in_array($instrumentName, $excludedInstruments)) {
            fprintf(STDOUT, " -> excluded instrument: {$instrumentName}");
            continue;
        }

        // register instrument
        $instruments[$instrumentName] = $fileInfo->getFilename();
    }

    // order instruments by key
    ksort($instruments, SORT_STRING);

    // log
    $numberOfInstruments = count($instruments);
    fprintf(STDOUT, "Total instruments found: {$numberOfInstruments}\n");

    // return the list of sorted instruments
    return $instruments;
}

/**
 * Get the excluded instruments from the config file
 *
 * @return array List of instruments to be skipped
 */
function getExcludedInstruments(LorisInstance $loris): array
{
    // Get the abbreviated instruments
    $config = $loris->getConfiguration();
    $rawExcludedInstruments = $config->getSetting('excluded_instruments');

    //
    $excludedInstruments = [];
    foreach ($rawExcludedInstruments as $instruments) {
        foreach (Utility::asArray($instruments) as $instrument) {
            $excludedInstruments[] = $instrument;
        }
    }
    return $excludedInstruments;
}

/**
 * Prints help text for this tool.
 *
 * @return void
 */
function usage(): void
{
    $msg  = "";
    $msg .= "Usage: ip_output_builder.php [-m|--add-meta] [-h|--help]\n\n";
    $msg .= "Options:\n";
    $msg .= "    -m/--add-meta in case of LINST instrument, add \".meta\" file content\n";
    $msg .= "    -h/--help     Show this screen\n";

    // display message
    fprintf(STDOUT, $msg);
}
