#!/usr/bin/env php
<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";

$options = getopt(
    "f:r:",
    [
        "output-dir:",
        "file:",
        "redcap-api:",
        "redcap-token:",
        "trim-formname",
    ]
);

$inputFile    = $options['f'] ?? $options['file'] ?? '';
$redcapAPIURL = $options['r'] ?? $options['redcap-api'] ?? '';
$redcapToken  = $options['redcap-token'] ?? '';
$outputDir    = $options['output-dir'] ?? '';
$trimName     = isset($options['trim-formname']);

if (empty($inputFile) && empty($redcapAPIURL)) {
    fprintf(STDERR, "Either --file or --redcap-api must be provided.\n\n");
    showHelp();
    exit(1);
}
if (!empty($redcapAPIURL) && empty($options['redcap-token'])) {
    fprintf(STDERR, "Either --redcap-api specified but missing redcap-token.\n\n");
    showHelp();
    exit(1);
}
if (empty($outputDir)) {
    showHelp();
    exit(1);
}
if (!is_dir($outputDir)) {
    fprintf(STDERR, "Output directory $outputDir doesn't exist.\n");
    exit(1);
}
if (!is_writeable($outputDir)) {
    fprintf(STDERR, "Output directory $outputDir is not writeable.\n");
    exit(1);
}

$fp = getDictionaryCSVStream($redcapAPIURL, $redcapToken, $inputFile);

$headers     = fgetcsv($fp);
$instruments = [];
$badMap = 0;
$mapped = 0;
while ($row = fgetcsv($fp)) {
    $inst = $row[1];
    if (!isset($instruments[$inst])) {
        $instruments[$inst] = [];
    }
    $fieldname = $row[0];
    if ($trimName) {
        $formname = $row[1];
        if (strpos($fieldname, $formname) !== 0) {
            $badMap++;
            fwrite(STDERR, "Field $fieldname does not have form name $formname as a prefix\n");
        } else {
            // debug
            //$oldname = $fieldname;
            $mapped++;
            $fieldname = preg_replace("/^" . preg_quote($formname) . "(_*)/", "", $fieldname);
            // fwrite(STDERR, "Field $oldname became $fieldname\n");
        }
    }

    $linstFormat = toLINST($row[3], $fieldname, $row[4], $row[5]);
    if (!empty($linstFormat)) {
        $instruments[$inst][] = $linstFormat;
    }
}
fclose($fp);
if ($trimName) {
    fwrite(STDERR, "Could not map $badMap fields\nMapped $mapped fields\n");
}

outputFiles($outputDir, $instruments, getTestNameMapping($redcapAPIURL, $redcapToken));

/**
 * Take a single line from the redcap dictionary and returns the
 * closest LINST equivalent.
 *
 * @param string $redcaptype      The type from REDCap
 * @param string $redcapfieldname The fieldname from REDCap
 * @param string $redcaplabel     The label from REDCap
 * @param string $redcapChoices   The choices columnfrom REDCap
 *
 * @return string
 */
function toLINST(
    string $redcaptype,
    string $redcapfieldname,
    string $redcaplabel,
    string $redcapChoices,
) : string {
    $label = str_replace("\n", "<br /><br />", $redcaplabel);
    switch ($redcaptype) {
    case 'text':
        /* switch ($redcapOptions) {
            case '
            date_dmy 31-12-2008
            date_mdy 12-31-2008
            date_ymd 2008-12-31

            datetime_dmy 16-02-2011 17:45
            datetime_mdy 02-16-2011 17:45
            datetime_ymd 2011-02-16 17:45
            datetime_seconds_dmy 16-02-2011 17:45:23
            datetime_seconds_mdy 02-16-2011 17:45:23
            datetime_seconds_ymd

email john.doe@vanderbilt.edu
integer 1, 4, -10 whole number with no decimal
alpha_only name letters only, no numbers, spaces or special characters
number 1.3, 22, -6.28, 3.14e-2 a general number or scientific notation (no spaces)
number_1dp_comma_decimal number to 1 decimal place - comma as decimal
number_1dp number to 1 decimal place
number_2dp_comma_decimal number to 2 decimal place - comma as decimal
number_2dp number to 2 decimal place
number_3dp_comma_decimal number to 3 decimal place - comma as decimal
number_3dp number to 3 decimal place
number_4dp_comma_decimal number to 4 decimal place - comma as decimal
number_4dp number to 4 decimal place
number_comma_decimal number comma as decimal
phone_australia
phone 615-322-2222
Area codes start with a number from 2-9, followed by 0-8 and
then any third digit.
The second group of three digits, known as the central office or
schange code, starts with a number from 2-9, followed by any
two digits.
The final four digits, known as the station code, have no
restrictions.
postalcode_australia 2150 4-digit number
postalcode_canada K1A 0B1 Format: A0A 0A0 where A is a letter and 0 is a digit
ssn 123-12-1234 Format: xxx-xx-xxxx
time 19:30 military time
time_mm_ss 31:22 time in minutes and seconds
vmrn 0123456789 10 digits
Zipcode

        }
        */
        // text maps directly to LORIS
        return "text{@}$redcapfieldname{@}$label";
    case 'descriptive':
        // descriptive maps to label with no field.
        return "static{@}{@}$label";
    case 'radio':
    case 'dropdown':
        // Radio or dropdown maps to a select and the options are in the
        // same format in the dictionary.
        $selectoptions = optionsToLINST($redcapChoices);
        if (!empty($selectoptions)) {
            $selectoptions = "NULL=>''{-}" . $selectoptions;
        }
        return "select{@}$redcapfieldname{@}$label{@}$selectoptions";
    case 'checkbox':
        // checkboxes are the same format as radios but allow multiple options,
        // so map to a selectmultiple instead of a select
        return "selectmultiple{@}$redcapfieldname{@}$label{@}"
            . optionsToLINST($redcapChoices);
    case 'yesno':
        // Map yes/no fields to dropdowns with yes and no options.
        return "select{@}$redcapfieldname{@}$label{@}"
            . "NULL=>''{-}'yes'=>'Yes'{-}'no'=>'No'";
    case 'calc':
        // Calc maps to a score field. We create the DB field but don't do the score.
        return "static{@}$redcapfieldname{@}$label";
    case 'sql':
        // The "SQL" data type is used for a dynamic display of enum options. Since
        // we don't have access to the redcap database that the sql is selecting from,
        // we treat it the same way as a score/calc field so that data can be imported.
        return "static{@}$redcapfieldname{@}$label";
    case'slider':
        return "numeric{@}$redcapfieldname{@}$label{@}0{@}100";
    case 'file':
        // File upload - NOT SUPPORTED BY LINST
        return "";
    case 'notes':
        // REDCap calls textareas notes
        return "textarea{@}$redcapfieldname{@}$label";
    default:
        throw new \LorisException("Unhandled REDCap type $redcaptype");
    }
}

/**
 * Take the options column from a dictionary line and convert it to the
 * linst format for select/multiselect
 *
 * @param string $dictionary The dictionary from REDCap
 *
 * @return string
 */
function optionsToLINST(string $dictionary) : string
{
    $dictionary = str_replace(' | | ', ' | ', $dictionary);
    if (str_starts_with($dictionary, '| ')) {
        $dictionary = substr($dictionary, 2);
    }

    $choices      = explode('|', $dictionary);
    $linstChoices = [];
    foreach ($choices as $choice) {
        $matches = [];
        if (preg_match("/^(\s)*(\d+)(\s)*,(.*)$/", $choice, $matches) !== 1) {
            throw new \DomainException("Could not parse radio option: '$choice'");

        }
        // $backend        = $matches[2] . '_'
        //        . preg_replace("/\s+/", "_", trim($matches[4]));
        $backend = $matches[2];
        $linstFormat    = "'$backend'=>'" . trim(strtolower($matches[4])) . '\'';
        $linstChoices[] = $linstFormat;

    }
    return join('{-}', $linstChoices);
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
        "Usage: $argv[0] [--file=filename | --redcap-api=endpoint --redcap-token=token] --output-dir=instrumentdirectory [--trim-formname]\n"
    );
}

/**
 * Write the files to the filesystem after having parsed them.
 *
 * @param string     $outputDir   The directory to write the files
 * @param string[][] $instruments An array of fields for each instrument
 *
 * @return void
 */
function outputFiles(string $outputDir, array $instruments, array $testnameMap)
{
    foreach ($instruments as $instname => $instrument) {
        $fp = fopen("$outputDir/$instname.linst", "w");
        fwrite($fp, "table{@}$instname\n");
        if (isset($testnameMap[$instname])) {
            fwrite($fp, "title{@}" . $testnameMap[$instname] . "\n");
        } else {
            fwrite(STDERR, "Could not get title for $instname for LINST file\n");
        }

        // Standard LORIS metadata fields that the instrument builder adds
        // and LINST class automatically adds to instruments.
        fwrite($fp, "date{@}Date_taken{@}Date of Administration{@}{@}\n");
        fwrite($fp, "static{@}Candidate_Age{@}Candidate Age (Years)\n");
        fwrite($fp, "static{@}Window_Difference{@}Window Difference (+/- Days)\n");
        fwrite($fp, "select{@}Examiner{@}Examiner{@}NULL=>''\n");
        foreach ($instrument as $field) {
            fwrite($fp, "$field\n");
        }
        fclose($fp);

    }
}

/**
 * Gets a file pointer pointing to the CSV stream.
 */
function getDictionaryCSVStream($redcapAPIURL, $redcapAPIToken, $inputFile) {
    // If a local input file was specified just open it
    if (!empty($inputFile)) {
        $fp = fopen($inputFile, "r");
        if ($fp === false) {
            fprintf(STDERR, "Could not open file $inputFile\n");
            exit(1);
        }
        return $fp;
    }
    $output = REDCapAPIRequest($redcapAPIURL, $redcapAPIToken, 'metadata', 'csv');
    // fgetcsv expects a filepointer, so convert the string to a data stream.
    $fp = fopen("data://text/plain;base64," . base64_encode($output), "r");
    if ($fp === false) {
        fprintf(STDERR, "Could not open stream\n");
        exit(1);
    }
    return $fp;
}

function getTestNameMapping($redcapAPIURL, $redcapAPIToken) {
    if (empty($redcapAPIURL) && empty($redcapAPIToken)) {
        return [];
    }
    $result = REDCapAPIRequest($redcapAPIURL, $redcapAPIToken, 'instrument', 'json');
    $converted = [];
    foreach (json_decode($result) as $row) {
        $converted[$row->instrument_name] = $row->instrument_label;
    }
    return $converted;
}

function REDCapAPIRequest($redcapAPIURL, $redcapAPIToken, $content, $format) {
    $data = array(
            'token' => $redcapAPIToken,
            'content' => $content,
            'format' => $format,
            'returnFormat' => 'json',
     );
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $redcapAPIURL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_VERBOSE, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}
