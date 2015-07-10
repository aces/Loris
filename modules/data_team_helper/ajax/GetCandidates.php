<?php
header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once "NDB_Client.class.inc";

//TODO: create different querys for instrument and visit set

$db =& Database::singleton();
$searchArray = array();

if ((!isset($_REQUEST['instrument'])
     || (!empty($_REQUEST['instrument'])
         && $_REQUEST['instrument'] == 'All Instruments'))
){
    //FIXME not sure how to enter a variable in a like statement
    $query = "SELECT DISTINCT ses.candID FROM session AS ses JOIN test_battery
                AS tst ON ses.Visit_label = tst.Visit_label WHERE ses.candID LIKE :searchTerm";

    $searchArray[':searchTerm'] = '%' . $_REQUEST["query"] . '%'; 
    // $result = $db->pselect($query, array(':searchTerm' => '%'. $_REQUEST["query"] . '%' )); 
}


//Instrument is set adding that to the query. 
else {
    $query .= "AND tst.Test_Name = :NAM";
    $testname = Utility::getTestNameUsingFullName($_REQUEST['instrument']);    
    $searchArray['NAM'] = $testname;
    // $query = "SELECT DISTINCT ses.candID FROM session AS ses JOIN test_battery AS tst ON ses.Visit_label = tst.Visit_label WHERE tst.Test_Name = :NAM";
    // $testname = Utility::getTestNameUsingFullName($_REQUEST['instrument']);
    // $result = $db->pselect($query, array('NAM' => $testname));
    

}

$result = $db->pselect($query, $searchArray);

$flattened_result = array();

if ($result == null){
    $flattened_result[0] = "Not found";
}
else {
    foreach ($result as $k => $v) {
        $flattened_result[$k] = $v['candID'];
    }
}

$response = array();
$response["suggestions"] = $flattened_result;
print json_encode($response);


?>