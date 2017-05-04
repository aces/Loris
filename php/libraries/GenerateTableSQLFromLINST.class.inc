<?php
/**
 * This file contains GenerateTableSQLFromLINST
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
 * Generate SQL from LINST String
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


class GenerateTableSQLFromLINST
{
    /**
     * Generate SQL from LINST String
     *
     * @param string $linstString linst string
     *
     * @return string SQL table schema
     */
    static function generate($linstString)
    {
        $items = explode("\n", trim($linstString));

        foreach ($items AS $item) {
            $bits = explode("{@}", trim($item));
            if (preg_match("/Examiner[0-9]*/", (string)(array_key_exists(1, $bits) ? $bits[1] : null))) {
                continue;
            }
            switch($bits[0]){
                //generate the CREATE TABLE syntax
            case "table":
                $output = "";
                if (isset($opts["D"])) {
                    $output = "DROP TABLE IF EXISTS `$bits[1]`;\n";
                }
                $output .= "CREATE TABLE `$bits[1]` (\n";
                $output .= "`CommentID` varchar(255) NOT NULL default '',\n
                        `UserID` varchar(255) default NULL,\n
                        `Examiner` varchar(255) default NULL,\n
                        `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n
                        `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',\n";
                break;

                //no SQL need be generated.
            case "title":
            case "header":
                continue;
                    break;

                //generate specific column definitions for specific types of HTML elements
            default:
                if ((array_key_exists(1, $bits) ? $bits[1] : "") == "") {
                    continue;
                }
                if ($bits[0]=="select") {
                    $bits[0]   =self::_enumizeOptions(
                        array_key_exists(3, $bits) ? $bits[3] : null,
                        $table = array(),
                        $bits[1]
                    );
                } else if ((array_key_exists(0, $bits) ? $bits[0] : null) =="selectmultiple") {
                    $bits[0] ="varchar(255)";
                } else if ((array_key_exists(0, $bits) ? $bits[0] : null) == "textarea") {
                    $bits[0] ="text";
                } else if ((array_key_exists(0, $bits) ? $bits[0] : null) == "text") {
                    $bits[0] ="varchar(255)";
                } else if ((array_key_exists(0, $bits) ? $bits[0] : null) == "checkbox") {
                    $bits[0] ="varchar(255)";
                } else if ((array_key_exists(0, $bits) ? $bits[0] : null) == "static") {
                    $bits[0] ="varchar(255)";
                } else if ((array_key_exists(0, $bits) ? $bits[0] : null) == "radio") {
                    $bits[0] =enumizeOptions($bits[3], $table = array(), $bits[1]);
                }
                if (array_key_exists(2, $bits)) {
                    $bits[2] =htmlspecialchars($bits[2]);
                }
                $output .="`$bits[1]` $bits[0] default NULL,\n";
            }

        }
        $output .="PRIMARY KEY  (`CommentID`)\n
          );\n";
        return $output;
    }

    /**
     * Generate SQL enum from LINST options
     *
     * @param string $options LINST options string
     * @param string $table   table
     * @param string $name    name
     *
     * @return string SQL enum string
     */
    static function _enumizeOptions($options, $table, $name)
    {
        $options =explode("{-}", $options);
        foreach ($options as $option) {
            $option =explode("=>", $option);
            if ($option[0]!='NULL') {
                $enum[] =$option[0];
            }
        }
        if (!is_array($enum)) {
            echo "$table $name $options\n";
        }
        $enum =implode(",", $enum);
        return "enum($enum)";
    }
}