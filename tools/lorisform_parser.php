#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This parses all of the instruments and generates a staging file (ip_output.txt)
 * which can be used by data_dictionary_builder.php and generate_tables_sql.php
 *
 * Ex. call: find ../project/instruments/*.inc | php lorisform_parser.php
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Loris_Script
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/generic_includes.php";

$opts = getopt("", ["stdout::"]);
$stdout = isset($opts['stdout']);

$instrumentsToSkip = [];
$instruments       = getExcludedInstruments();
foreach ($instruments as $instrument) {
    if (isset($instrument)) {
        $instrumentsToSkip[] = $instrument;
    }
}

//Get the list of files from STDIN
while ($file=fgets(STDIN)) {
    $file    =trim($file);
    $files[] =$file;
    fwrite(STDERR, $file);
}

//Process the files
foreach ($files as $file) {
    echo "\n";
    $fp   =fopen($file, "r");
    $data =fread($fp, filesize($file));
    fclose($fp);
    preg_match("/class (.+) extends NDB_BVL_Instrument/", $data, $matches);
    if (empty($matches[1])) {
        fwrite(STDERR, "File '$file' does not contain an instrument.\n");
        continue;
    }
    fwrite(STDERR, "Reading file $file\n");
    $className =$matches[1];
    fwrite(STDERR, "Instrument found: $matches[1]\n");
    fwrite(STDERR, "Instantiating new object...\n");
    
    $testname = preg_replace("/NDB_BVL_Instrument_/", "", $className);
    $obj = \NDB_BVL_Instrument::factory($lorisInstance, $testname);

    //Some instruments ought not be parsed with the lorisform_parser
    if ((in_array($obj->testName, $instrumentsToSkip))) {
        fwrite(STDERR, "lorisform_parser will skip file {$file}\n");
        continue;
    }

    $subtests =$obj->getSubtestList();
    foreach ($subtests as $subtest) {
        $obj->page =$subtest['Name'];
        fwrite(STDERR, "Building instrument page '$subtest[Name]'...\n");
        $obj->_setupForm();
    }

    if (is_array($obj->getFullName())) {
        fwrite(STDERR, "Could not find row for $matches[1] in table test_names,
        please populate test_names, instrument_subtests\n");
        continue;
    }

    if (!empty($output)) {
        $output .="{-@-}";
    } else {
        $output = '';
    }

    fwrite(STDERR, "Parsing instrument object...\n");

    $output .="testname{@}".$obj->testName."\n";
    $output .="table{@}".$obj->table."\n";

    $output .="title{@}".$obj->getFullName()."\n";

    $formElements = $obj->form->toElementArray();
    $output      .=parseElements($formElements["elements"]);
    fwrite(STDERR, "Parsing complete\n---------------------------------------------------\n\n");
}
if (empty($output)) {
    fwrite(STDERR, "Nothing to output, 'ip_output.txt' not created\n");
} else {
    if($stdout) {
        fwrite(STDOUT, $output);
    } else {
        $fp =fopen("ip_output.txt", "w");
        fwrite($fp, $output);
        fclose($fp);
    }
}

/**
 * Create a linst formated string for an LorisForm element.
 *
 * @param LorisFormElement $elements   The element to parse.
 * @param String           $groupLabel The group label
 *
 * @return string LINST formated element.
 */
function parseElements($elements, $groupLabel = "")
{
    global $obj;
    $output = '';
    foreach ($elements as $element) {
        if ($element['label'] != "") {
            $label = str_replace("&nbsp;", "", $element['label']);
            $label = trim(preg_replace('/\s+/', ' ', $label));
        } else {
            $label = trim(preg_replace('/\s+/', ' ', $groupLabel));
        }

        switch ($element['type']) {
        case "select":
            $output .="select";
            if (array_key_exists('multiple', $element)) {
                $output .="multiple";
            }
            $output       .="{@}".$element['name']."{@}".$label."{@}";
            $optionsOutput ="";
            foreach ($element['options'] as $key => $option) {
                if (!empty($optionsOutput)) {
                    $optionsOutput .="{-}";
                }
                if (is_null($option) || $option==='') {
                    $optionsOutput .="NULL";
                } else {
                    $optionsOutput .="'".$key."'";
                }
                $optionsOutput .="=>'".addslashes($option)."'";
            }
            $output .=$optionsOutput."\n";
            break;

        case "text":
            $output .="text{@}".$element['name']."{@}".$label."\n";
            break;

        case "textarea":
            $output .="textarea{@}".$element['name']."{@}".$label."\n";
            break;

        case "date":
            $options = "{@}";
            if (array_key_exists('options', $element)
                && isset($el['options']['minYear'])
                && isset($el['options']['maxYear'])
            ) {
                $options = $element['options']['minYear']
                ."{@}"
                .$element['options']['maxYear'];
            }
            $output .="date{@}".$element['name']."{@}".$label."{@}".$options."\n";
            break;

        case "group":
            $output .=parseElements($element['elements'], $label);
            break;

        case "header":
            $name = '';
            if (array_key_exists('name', $element)) {
                $name = $element['name'];
            }
            $output .="header{@}".$name."{@}".$element['label']."\n";
            break;

        case "static":
            //see how static element is used...
            if (!array_key_exists('name', $element)) {
                $output .="header{@}{@}".$label."\n";
            } elseif (($element['name'] == null)
                || array_key_exists($element['name'], $obj->localDefaults)
                || $element['name'] =='lorisSubHeader'
            ) {
                //element is plain form text, or a header.
                $output .="header{@}".$element['name']."{@}".$label."\n";
            } else {
                //element reports a database score
                $output .="static{@}".$element['name']."{@}".$label."\n";
            }

            break;

        case "advcheckbox":
            $output .="checkbox{@}".$element['name']."{@}".$label."\n";
            break;

        case "html_quickform_radio":
            $mainquestion = addslashes($element->_label);
            $optionfield  = addslashes($element->_text);
            if ($element->_attributes['position'] == "first") {
                $output .= "radio{@}";
                $output .= $element->_attributes['name'] . "{@}";
                $output .= $mainquestion . "{@}";
            }
            $output .= "'" . $element->_attributes['value']
               . "'=>'" . $optionfield . "'";
            if ($element->_attributes['position'] == "last") {
                $output .="\n";
            } else {
                $output .="{-}";
            }
            break;
        case "time":
            $output .="time{@}".$element['name']."{@}".$label."\n";
            break;
        case "html":
        case "file":
        case "hidden":
            // skip because it's useless
            fwrite(STDERR, "SKIP: skipping quickform element type: ".$element['type']."\n");
            break;

        default:
            fwrite(STDERR, "WARNING:  Unknown form element type: ".$element['type']."\n");
            break;
        }
    }
    return $output;
}

/**
 * Get the excluded instruments from the config file
 *
 * @return Array   List of instruments to be skipped
 */
function getExcludedInstruments()
{

    // Get the abbreviated instruments
    $config =& NDB_Config::singleton();
    $excluded_instruments = $config->getSetting('excluded_instruments');

    $ex_instruments = [];
    foreach ($excluded_instruments as $instruments) {
        foreach (Utility::asArray($instruments) as $instrument) {
            $ex_instruments[$instrument] = $instrument;
        }
    }
    return $ex_instruments;
}

?>
