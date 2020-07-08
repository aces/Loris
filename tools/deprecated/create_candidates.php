<?php
/**
 * This script inserts 5000 candidates. The CandIDs are consecutive instead
 * of random, the PSCID is dccXXXX where XXXX is an incrementing integer, and
 * the rest of the data is hardcoded.
 *
 * This is intended to stress test the candidate_list module with large numbers
 * of candidates and is not intended to produce realistic data.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
set_include_path(
    get_include_path().":".
    __DIR__."/../project/tools:".
    __DIR__."/../php/tools:"
);
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";


/*
 * Return true if either "candid" if candid exists,
 * "pscid" if pscid exists, or the empty string if
 * neither exists.
 */
function checkExists($candid, $pscid) : string {
    global $DB;
    $val = $DB->pselectOne("SELECT CandID FROM candidate WHERE CandID=:cndid",
        array('cndid' => $candid)
    );
    if (!empty($val)) {
        return "candid";
    }
    $val = $DB->pselectOne("SELECT PSCID FROM candidate WHERE PSCID=:pscid",
        array('pscid' => $pscid)
    );
    if (!empty($val)) {
        return "pscid";
    }
    return "";
}


$count = 0;
$lastcandid = 100000;
$lastpscid = 0;

while($count < 5000) {
    $pscid = sprintf("dcc%04.d", $lastpscid);
    switch(checkExists($lastcandid, $pscid)) {
    case "candid":
        $lastcandid++;
        break;
    case "pscid":
        $lastpscid++;
        break;
    default:
        print "Creating $lastcandid/$pscid\n";

        $DB->insert("candidate",
            [ 'CandID' => $lastcandid,
            'PSCID' => $pscid,
            'DoB' => '2004-02-02',
            'Sex' => 'Male',
            'RegistrationCenterID' => 1,
            'RegistrationProjectID' => 1,
            'Active' => 'Y',
            'Date_active' => '2008-01-31',
            'Entity_type' => 'Human']
        );
        $lastpscid++;
        $lastcandid++;
        $count++;
        break;
    }
}
