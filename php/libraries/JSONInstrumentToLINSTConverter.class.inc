<?php
/**
 * This file contains the JSONInstrumentToLINSTConverter class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
/**
 * Convert JSON Instruments to LINST instruments
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class JSONInstrumentToLINSTConverter
{
    /**
     * blah blah blah
     *
     * @return object blah blah blah
     */
    static function convert($json, $lang, $year = null)
    {
        $obj = json_decode($json, true);
        if (!$year) {
            $year = (new \DateTime)->format("Y");
        }

        $linstLines = array_merge(
            self::generateStandardLines($obj["Meta"]["ShortName"], $obj["Meta"]["LongName"], $year),
            self::convertElements($obj["Elements"], $lang)
        );

        return implode("\n", $linstLines);
    }

    static function generateStandardLines($table, $title, $year) {
        $lines = array();
        $lines[] = "table{@}{$table}";
        $lines[] = "title{@}{$title}";
        $lines[] = "date{@}Date_taken{@}Date of Administration{@}2006{@}{$year}";
        $lines[] = "static{@}Candidate_Age{@}Candidate Age (Months)";
        $lines[] = "static{@}Window_Difference{@}Window Difference (+/- Days)";
        $lines[] = "select{@}Examiner{@}Examiner{@}NULL=>''";
        return $lines;
    }

    static function convertElements($elements, $lang) {
        return array_map(function($element) use ($lang) {
            switch ($element["Type"]) {
                case "label":
                    return self::convertLabelElement($element, $lang);
                    break;
                case "select":
                    return self::convertSelectElement($element, $lang);
                    break;
            }
        }, $elements);
    }

    static function convertLabelElement($element, $lang) {
        if (!array_key_exists($lang, $element['Description'])) return "";
        return "static{@}{@}{$element['Description'][$lang]}";
    }

    static function convertSelectElement($element, $lang) {
        $options = self::convertSelectElementOptions($element['Options']['Values'][$lang]);
        $selectType = $element['Options']['AllowMultiple'] === true ? 'multiselect' : 'select';
        return "{$selectType}{@}{$element['Name']}{@}{$element['Description'][$lang]}{@}{$options}";
    }

    static function convertSelectElementOptions($options) {
        $result = array("NULL=>''");
        foreach($options as $index => $value) {
            $result[] = "'{$index}'=>'$value'";
        }

        //$result[] = "'not_answered'=>'Not Answered'";

        return implode("{-}", $result);
    }
}