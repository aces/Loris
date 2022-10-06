#!/usr/bin/env php
<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";

$options = getopt(
    "f:",
    [
        "output-dir:",
        "file:",
    ]
);

$inputFile = $options['f'] ?? $options['file'] ?? '';
$outputDir = $options['output-dir'] ?? '';

if (empty($inputFile) || empty($outputDir)) {
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

$fp = fopen($inputFile, "r");
if ($fp === false) {
    fprintf(STDERR, "Could not open file $inputFile\n");
    exit(1);
}

$headers     = fgetcsv($fp);
$instruments = [];
while ($row = fgetcsv($fp)) {
    $inst = $row[1];
    if (!isset($instruments[$inst])) {
        $instruments[$inst] = [];
    }
    $linstFormat = toLINST($row[3], $row[0], $row[4], $row[5]);
    if (!empty($linstFormat)) {
        $instruments[$inst][] = $linstFormat;
    }
}
fclose($fp);

outputFiles($outputDir, $instruments);

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
        // text maps directly to LORIS
        return "text{@}$redcapfieldname{@}$label";
    case 'descriptive':
        // descriptive maps to label with no field.
        return "static{@}{@}$label";
    case 'radio':
    case 'dropdown':
        // Radio or dropdown maps to a select and the options are in the
        // same format in the dictionary.
        return "select{@}$redcapfieldname{@}$label{@}"
            . optionsToLINST($redcapChoices);
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
        // The "SQL" data type seems to just be for presentation? I hope?
        return "";
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
    $choices      = explode(' | ', $dictionary);
    $linstChoices = [];
    foreach ($choices as $choice) {
        $matches = [];
        if (preg_match("/^(\s)*(\d+)(\s)*,(.*)$/", $choice, $matches) !== 1) {
            throw new \DomainException("Could not parse radio option: $choice");

        }
        $backend        = $matches[2] . '_'
                . preg_replace("/\s+/", "_", trim($matches[4]));
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
        "Usage: $argv[0] --file=filename --output-dir=instrumentdirectory\n"
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
function outputFiles(string $outputDir, array $instruments)
{
    foreach ($instruments as $instname => $instrument) {
        $fp = fopen("$outputDir/$instname.linst", "w");
        foreach ($instrument as $field) {
            fwrite($fp, "$field\n");
        }
        fclose($fp);

    }
}
