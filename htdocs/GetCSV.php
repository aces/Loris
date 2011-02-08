<?php
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
if(isset($_REQUEST['Instrument'])) {
    $Instrument = $_REQUEST['Instrument'];
}
if(isset($_REQUEST['Field']) && !empty($_REQUEST['Field'])) {
    $Field = $_REQUEST['Field'];
} else {
    $Field = "Candidate_Age";
}
$QueryCondition = "i.$Field IS NOT NULL AND c.Active='Y' and c.Cancelled='N' and s.Active='Y' and s.Cancelled='N'";
if(isset($_REQUEST['site']) && !empty($_REQUEST['site'])) {
    $QueryCondition .= " AND c.CenterID=:Site";
    $ConditionBindings['Site'] = $_REQUEST['site'];

}
if(isset($_REQUEST['Administration'])) {
    $QueryCondition .= " AND f.Administration=:Administration";
    $ConditionBindings['Administration'] = $_REQUEST['Administration'];
}
if(isset($_REQUEST['Visit_label']) && !empty($_REQUEST['Visit_label'])) {
        $QueryCondition .= " AND s.Visit_label=:Visit_label";
        $ConditionBindings['Visit_label'] = $_REQUEST['Visit_label'];
}
$QueryTable = "$Instrument i join flag f USING (CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c USING (CandID)";

$rows = $DB->pselect("SELECT c.PSCID as ID, COALESCE(i.Candidate_Age, DATEDIFF(i.Date_taken,c.DoB) / 30) as X, i.$Field as Y, COALESCE(i.Window_Difference, 0) as Category FROM $QueryTable WHERE $QueryCondition", $ConditionBindings);
foreach($rows as $row) {
    print "\"$row[ID]\",\"$row[X]\",\"$row[Y]\",\"$row[Category]\"\n";
}
