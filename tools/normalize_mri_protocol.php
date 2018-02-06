<?php

/**
 * Script which populates the normalized mri_protocol_TE and mri_protocol_TR tables with
 * TE_range & TR_range data from the mri_protocol table, respectively.
 *
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Liza Levitis  <llevitis.mcin@gmail.com>
 * @license  Loris License
 * @link     https://github.com/llevitis/Loris
 */

set_include_path(
    get_include_path().":".
    __DIR__."/../project/libraries:".
    __DIR__."/../php/libraries:"
);

require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB =& Database::singleton();

## Get the list of scan types in the mri_protocol table

$st_result = $DB->pselect("SELECT DISTINCT Scan_type FROM mri_protocol ORDER BY Scan_type", array());
$scan_types_list = array();
for ($i=0; $i < sizeof($st_result); $i++) {
    $scan_types_list[$i] = $st_result[$i]["Scan_type"];
}
echo("The following are the scan types in the mri_protocol table:\n");
foreach ($scan_types_list as $scan_type) {
    print_r("$scan_type\n");
}

function _getRange($scan_type, $protocol_type) {
    $DB =& Database::singleton();
    $params =
        array(
            'Scan_type' => $scan_type
        );
    if ($protocol_type == "TR") {
        $protocol_range = $DB->pselect("SELECT TR_range FROM mri_protocol WHERE Scan_type=:Scan_type", $params);
    }
    if ($protocol_type == "TE") {
        $protocol_range = $DB->pselect("SELECT TE_range FROM mri_protocol WHERE Scan_type=:Scan_type", $params);
    }
    return $protocol_range;
}

function _populateTables($scan_type) {
    $DB =& Database::singleton();
    # populate the mri_protocol_TE table
    $te_range = _getRange($scan_type, "TE");
    foreach ($te_range as $arr) {
        $protocolRanges = explode(",", $arr["TE_range"]);
        foreach ($protocolRanges as $range) {
            $rangeTrimmed = trim($range);
            if (strpos($rangeTrimmed, "-")) { // range X-Y
                $array = explode("-", $rangeTrimmed);
                $left = (float)trim($array[0]);
                $right = (float)trim($array[1]);
                $x = $DB->insert("mri_protocol_TE", array('Scan_type' => $scan_type, 'TE_min' => $left, 'TE_max' => $right));
            } else {
                $x = $DB->insert("mri_protocol_TE", array('Scan_type' => $scan_type, 'TE_min' => $rangeTrimmed, 'TE_max' => $rangeTrimmed));
            }
        }
    }
    $tr_range = _getRange($scan_type, "TR");
    foreach ($tr_range as $arr) {
        $protocolRanges = explode(",", $arr["TR_range"]);
        foreach ($protocolRanges as $range) {
            $rangeTrimmed = trim($range);
            if (strpos($rangeTrimmed, "-")) { // range X-Y
                $array = explode("-", $rangeTrimmed);
                $left = (float)trim($array[0]);
                $right = (float)trim($array[1]);
                $x = $DB->insert("mri_protocol_TR", array('Scan_type' => $scan_type, 'TR_min' => $left, 'TR_max' => $right));
            } else {
                $x = $DB->insert("mri_protocol_TR", array('Scan_type' => $scan_type, 'TR_min' => $rangeTrimmed, 'TR_max' => $rangeTrimmed));
            }
        }
    }
}

foreach ($scan_types_list as $scan_type) {
    _populateTables($scan_type);
}

?>