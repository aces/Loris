<?php
/* This is used by the data_team_helper module */
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

require_once "Utility.class.inc";

//Array containing the JSON information to return.
$flattened_result = array();
//gets the given visit_label and returns the instrument

//If all visits are selected return all visits
if ($_REQUEST['visit_label'] == 'All Visits'){
    $instruments = Utility::getAllInstruments();
    array_unshift($instruments, "All Instruments");

    $counter = 0;
    foreach ($instruments as $k => $v) {
        $flattened_result[$counter] = $v;
        $counter++;
    }

    print json_encode($flattened_result);
    exit();
}

//else a specific visit is set and only return visit instruments 
else{
    $instruments = Utility::getVisitInstruments($_REQUEST['visit_label']);
//flattening the array result for proper json encoding
    if ($instruments == null){
        $flattened_result[0] = "No instruments for this visit";
        print json_encode($flattened_result);
        exit();
    }
    else{
        foreach ($instruments as $k => $v) {
            $flattened_result[$k] = $v['Test_name_display'];
        }
        array_unshift($flattened_result, "All Instruments");
        print json_encode($flattened_result);
        exit();
    }
}


