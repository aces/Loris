<?php
ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();




header("Content-type: text/plain");
$DB = Database::singleton();
$ConditionBindings = array();
if(isset($_REQUEST['InstrumentY'])) {
    $Instrument = $_REQUEST['InstrumentY'];
}
if(isset($_REQUEST['InstrumentX'])) {
    $InstrumentX = $_REQUEST['InstrumentX'];
}
if(isset($_REQUEST['FieldY']) && !empty($_REQUEST['FieldY'])) {
    $Field = "i." . $_REQUEST['FieldY'];
} else {
    $Field = "Candidate_Age";
}
if(isset($_REQUEST['FieldX']) && !empty($_REQUEST['FieldX'])) {
    $FieldX = $_REQUEST['FieldX'];
} else {
    $FieldX = 'Candidate_Age';
}
if(isset($InstrumentX)) {
    $FieldX = "i2." . $FieldX;
}

if($Field == 'Candidate_Age') {
    $Field = 'COALESCE(i.Candidate_Age, DATEDIFF(i.Date_taken,c.DoB) / 30)';
}
if($FieldX == 'Candidate_Age') {
    if(isset($InstrumentX)) {
        $FieldX = 'COALESCE(i2.Candidate_Age, DATEDIFF(i2.Date_taken,c.DoB) / 30)';
    } else {
        $FieldX = 'COALESCE(i.Candidate_Age, DATEDIFF(i.Date_taken,c.DoB) / 30)';
    }
}
$QueryCondition = "$Field IS NOT NULL AND $FieldX IS NOT NULL AND c.Active='Y' and c.Cancelled='N' and s.Active='Y' and s.Cancelled='N'";
if(isset($_REQUEST['site']) && !empty($_REQUEST['site'])) {
    $QueryCondition           .= " AND c.CenterID=:Site";
    $ConditionBindings['Site'] = $_REQUEST['site'];

}
if(isset($_REQUEST['Administration']) && !empty($_REQUEST['Administration'])) {
    $QueryCondition .= " AND f.Administration=:Administration";
    $ConditionBindings['Administration'] = $_REQUEST['Administration'];
}
if(isset($_REQUEST['Visit_label']) && !empty($_REQUEST['Visit_label'])) {
        $QueryCondition .= " AND s.Visit_label=:Visit_label";
        $ConditionBindings['Visit_label'] = $_REQUEST['Visit_label'];
}
$QueryTable = "$Instrument i join flag f ON (i.CommentID=f.CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c USING (CandID)";
if(isset($InstrumentX)) {
    $QueryTable .= "JOIN flag f2 ON (f2.SessionID=f.SessionID AND f2.Test_name=";
    $QueryTable .= "'$InstrumentX') JOIN $InstrumentX i2 ON (f2.CommentID=i2.CommentID) ";
}


$FullQuery = "SELECT c.PSCID as ID, $FieldX as X, $Field as Y, s.SubprojectID as Category, c.CandID, s.ID as SessionID, i.CommentID FROM $QueryTable WHERE $QueryCondition AND c.CenterID <> 1";
$rows      = $DB->pselect($FullQuery, $ConditionBindings);
foreach($rows as $row) {
    foreach($row as $key => $val) {
        print "\"$val\",";
    }
    print "\n";
    //print "\"$row[ID]\",\"$row[X]\",\"$row[Y]\",\"$row[Category]\"\n";
}
