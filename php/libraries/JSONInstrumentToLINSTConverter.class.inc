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
     * Converts JSON instrument to LINST instrument
     *
     * @param string $json instrument in JSON format
     * @param string $lang language code
     * @param string $year year
     *
     * @return string LINST String
     */
    static function convert($json, $lang, $year = null)
    {
        $obj = json_decode($json, true);
        if (!$year) {
            $year = (new \DateTime)->format("Y");
        }

        $linstLines = array_merge(
            self::generateStandardLines($obj["Meta"]["ShortName"], $obj["Meta"]["LongName"][$lang], $year, $lang),
            self::convertElements($obj["Elements"], $lang)
        );

        return implode("\n", $linstLines);
    }

    /**
     * Generates standard LINST lines
     *
     * @param string $table table name
     * @param string $title title
     * @param string $year  year
     *
     * @return array Array of standard LINST lines
     */
    static function generateStandardLines($table, $title, $year, $lang = 'en-ca')
    {
        $dateLabel = $lang === 'fr-ca' ? "Date d'administration" : "Date of Administration";

        $lines   = array();
        $lines[] = "table{@}{$table}";
        $lines[] = "title{@}{$title}";
        $lines[] = "date{@}Date_taken{@}{$dateLabel}{@}2006{@}{$year}";
        $lines[] = "static{@}Candidate_Age{@}Candidate Age (Months)";
        $lines[] = "static{@}Window_Difference{@}Window Difference (+/- Days)";
        $lines[] = "select{@}Examiner{@}Examiner{@}NULL=>''";
        return $lines;
    }

    /**
     * Convert JSON instrument elements into LINST lines
     *
     * @param array  $elements JSON elements
     * @param string $lang     language key
     *
     * @return array Array of LINST lines
     */
    static function convertElements($elements, $lang)
    {
        return array_map(
            function ($element) use ($lang) {
                switch ($element["Type"]) {
                case "label":
                    return self::convertLabelElement($element, $lang);
                    break;
                case "select":
                    return self::convertSelectElement($element, $lang);
                    break;
                }
            },
            $elements
        );
    }

    /**
     * Convert JSON label element to LINST line
     *
     * @param array  $element Label element
     * @param string $lang    language key
     *
     * @return string LINST line
     */
    static function convertLabelElement($element, $lang)
    {
        if (!array_key_exists($lang, $element['Description'])) return "";
        return "static{@}{@}{$element['Description'][$lang]}";
    }

    /**
     * Convert JSON select element to LINST line
     *
     * @param array  $element Select element
     * @param string $lang    language key
     *
     * @return string LINST line
     */
    static function convertSelectElement($element, $lang)
    {
        $options    = self::convertSelectElementOptions($element['Options']['Values'][$lang]);
        $selectType = $element['Options']['AllowMultiple'] === true ? 'multiselect' : 'select';
        return "{$selectType}{@}{$element['Name']}{@}{$element['Description'][$lang]}{@}{$options}";
    }

    /**
     * Convert JSON select options to LINST option format
     *
     * @param array $options JSON Select element options
     *
     * @return string LINST format options
     */
    static function convertSelectElementOptions($options)
    {
        $result = array("NULL=>''");
        foreach ($options as $index => $value) {
            $result[] = "'{$index}'=>'$value'";
        }

        //$result[] = "'not_answered'=>'Not Answered'";

        return implode("{-}", $result);
    }
}