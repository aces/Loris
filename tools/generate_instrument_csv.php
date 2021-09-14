<?php

/**
 * Script which  generate a csv file with all the question from
 * every instruments in the projects.
 *
 * PHP version 7
 *
 * @category instrument
 * @package  Main
 * @author   Mélanie Legauylt <melanie.legault2@mcgill.ca>
 * @license  Loris License
 */


$dir = __DIR__ . '/../project/instruments/';

$filelist   = scandir($dir);
$outputFile = fopen($dir."instrumentQuestion.csv", 'w');
fwrite($outputFile, "short name, long name, page, section, question name, description, options \n");

foreach ($filelist as $file) {
    if (substr($file, -5) == "linst") {
        $fhandle = fopen($dir.$file, 'r');
        while (($line = fgets($fhandle)) != false) {
            $option    = '';
            $lineParts = explode("{@}", trim($line));
            switch ($lineParts[0]) {
            case "table":
                $shortName = $lineParts[1];
                $page      = "top";
                $section   = "";
                continue(2);
            case "title":
                $longName = $lineParts[1];
                continue(2);
            case "page":
                $page = $lineParts[1];
                continue(2);
            case "header":
                $section = $lineParts[2];
                continue(2);
            case "date":
            case "text":
            case "textarea":
            case "static":
                $testcase    = $lineParts[1];
                $description = $lineParts[2];
                break;
            case "select":
            case "selectmultiple":
                $testcase    = $lineParts[1];
                $description = $lineParts[2];
                $choices     = array();
                $parts       = explode("{-}", $lineParts[3]);
                foreach ($parts as $part) {
                    $subpart   = explode("=>", $part);
                    $choices[] = trim($subpart[1], "'");
                }
                $option = implode(' | ', $choices);
                break;
            case "numeric":
                $testcase    = $lineParts[1];
                $description = $lineParts[2];
                $option      = "range: " . $lineParts[3] . " to " . $lineParts[4];
                break;
            default:
                $testcase    = '*** UNKNOWN ***';
                $description = $lineParts[0] . " - " . $lineParts[1];
                break;
            }
            fwrite($outputFile, 
                   "$shortName, $longName, $page, $section, $testcase, $description, $option \n");
        }
        fclose($fhandle);
    }
}

fclose($outputFile);
