<?php
/**
 * quat_diff.php uses a map of old to new variable names (to handle
 * parameter type renaming) to compare quat tables in two databases.
 * It first looks for records pertaining to timepoints that have been
 * removed or added, then looks for the common records at the cell
 * values to determine changes.  The report it generates is fairly
 * verbose, listing the number of changes as well as the changes
 * themselves, and thus is probably best redirected to a log file and
 * examined by hand.
 * 
 * @package main
 * @subpackage query_gui
 */
require_once "../php/libraries/NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();


$oldDB = $_SERVER['argv'][1];
$newDB = $_SERVER['argv'][2];

if(empty($oldDB) || empty($newDB)) {
    die("Usage: ".$_SERVER['argv'][0]." <OLDDB> <NEWDB>\n");
}

$config =& NDB_Config::singleton();
$dbConfig = $config->getSetting('database');
$db =& Database::singleton($dbConfig['database'], $dbConfig['username'], $dbConfig['password'], $dbConfig['host']);
if(PEAR::isError($db)) {
    die("Could not connect to database: ".$db->getMessage());
}

$varMap = array();

// determine simply newly added vars
$query = "select new.Name AS NewName FROM $newDB.parameter_type AS new LEFT JOIN $oldDB.parameter_type AS old USING (ParameterTypeID) WHERE new.Queryable=1 AND old.ParameterTypeID IS NULL";
$paramsDiffs = array();
$db->select($query, $paramDiffs);

foreach($paramDiffs AS $paramDiff) {
    print "NEW VAR $paramDiff[NewName]\n";
}

// determine simply deleted vars
$query = "select old.Name AS OldName FROM $oldDB.parameter_type AS old LEFT JOIN $newDB.parameter_type AS new USING (ParameterTypeID) WHERE old.Queryable=1 AND new.ParameterTypeID IS NULL";
$paramsDiffs = array();
$db->select($query, $paramDiffs);

foreach($paramDiffs AS $paramDiff) {
    print "NUKED VAR $paramDiff[OldName]\n";
}

// determine which variables changed excluding parameter_session or parameter_candidate vars
$query = "select old.Name as OldName, new.Name AS NewName, old.Queryable AS OldQueryable, new.Queryable AS NewQueryable FROM NIH_PD_PUBLIC_RELEASE.parameter_type AS new, NIH_PD_PUBLIC_RELEASE_OLD.parameter_type AS old WHERE new.SourceField=old.SourceField AND (old.Queryable=1 OR new.Queryable=1) AND new.SourceFrom <> 'parameter_session' AND new.SourceFrom <> 'parameter_candidate' and (old.Queryable <> new.Queryable OR old.Name <> new.Name)";
//$query = "select old.Name as OldName, new.Name AS NewName, old.Queryable AS OldQueryable, new.Queryable AS NewQueryable FROM $newDB.parameter_type AS new LEFT JOIN $oldDB.parameter_type AS old USING (SourceField) WHERE old.Name is not null and (old.Queryable=1 OR new.Queryable=1) AND new.SourceFrom <> 'parameter_session' AND new.SourceFrom <> 'parameter_candidate' and (old.Queryable <> new.Queryable OR old.Name <> new.Name)";
$paramsDiffs = array();
$db->select($query, $paramDiffs);

foreach($paramDiffs AS $paramDiff) {
    if($paramDiff['OldName'] != $paramDiff['NewName']) {
        // name changed
        print "NAME $paramDiff[OldName] -> $paramDiff[NewName]\n";

        // if both old and new are queryable, check for data changes
        if($paramDiff['OldQueryable']==1 && $paramDiff['NewQueryable']==1)
            $varMap[$paramDiff['OldName']] = $paramDiff['NewName'];
    }

    if($paramDiff['OldQueryable'] != $paramDiff['NewQueryable']) {
        // queryability changed
        print "QUERYABILITY ($paramDiff[OldName] | $paramDiff[NewName]) $paramDiff[OldQueryable] -> $paramDiff[NewQueryable]\n";
    }
}

// determine changes in parameter_session or parameter_candidate vars
$query = "select old.Name as OldName, new.Name AS NewName, old.Queryable AS OldQueryable, new.Queryable AS NewQueryable FROM $newDB.parameter_type AS new LEFT JOIN $oldDB.parameter_type AS old USING (ParameterTypeID) WHERE (old.Queryable=1 OR new.Queryable=1) AND (new.SourceFrom = 'parameter_session' OR new.SourceFrom = 'parameter_candidate') and (old.Queryable <> new.Queryable OR old.Name <> new.Name)";
$paramsDiffs = array();
$db->select($query, $paramDiffs);

foreach($paramDiffs AS $paramDiff) {
    if($paramDiff['OldName'] != $paramDiff['NewName']) {
        // name changed
        print "NAME $paramDiff[OldName] -> $paramDiff[NewName]\n";

        // if both old and new are queryable, check for data changes
        if($paramDiff['OldQueryable']==1 && $paramDiff['NewQueryable']==1)
            $varMap[$paramDiff['OldName']] = $paramDiff['NewName'];
    }

    if($paramDiff['OldQueryable'] != $paramDiff['NewQueryable']) {
        // queryability changed
        print "QUERYABILITY ($paramDiff[OldName] | $paramDiff[NewName]) $paramDiff[OldQueryable] -> $paramDiff[NewQueryable]\n";
    }
}


// now add the vars that didn't change to the varmap so their data gets checked
$query = "select old.Name as OldName, new.Name AS NewName FROM NIH_PD_PUBLIC_RELEASE.parameter_type AS new, NIH_PD_PUBLIC_RELEASE_OLD.parameter_type AS old WHERE new.SourceField=old.SourceField AND new.Queryable=1 AND new.SourceFrom <> 'parameter_session' AND new.SourceFrom <> 'parameter_candidate' and old.Name = new.Name and old.Queryable=new.Queryable";
$paramsDiffs = array();
$db->select($query, $paramDiffs);

foreach($paramDiffs AS $paramDiff) {
    $varMap[$paramDiff['OldName']] = $paramDiff['NewName'];
}


/**********************************************************
 ************ NOW START CHECKING DATA ITSELF **************
 *********************************************************/


// determine which rows are different
$query = "SELECT CurrentGUITable FROM $oldDB.parameter_type WHERE CurrentGUITable IS NOT NULL LIMIT 1";
$oldGuiTable = $db->selectOne($query);

$query = "SELECT CurrentGUITable FROM $newDB.parameter_type WHERE CurrentGUITable IS NOT NULL LIMIT 1";
$newGuiTable = $db->selectOne($query);

// find dropped rows
$diff = array();
$query = "SELECT old.SessionID FROM $oldDB.$oldGuiTable AS old LEFT OUTER JOIN $newDB.$newGuiTable AS new USING (SessionID) WHERE new.SessionID IS NULL";
$db->select($query, $diff);
if(!empty($diff)) {
    print "Old table contained " . count($diff) . " records not in the new table, with SessionIDs ";
    foreach($diff AS $row) {
        print $row['SessionID'].' ';
    }
    print "\n";
}
    
// find added rows
$diff = array();
$query = "SELECT new.SessionID FROM $newDB.$newGuiTable AS new LEFT OUTER JOIN $oldDB.$oldGuiTable AS old USING (SessionID) WHERE old.SessionID IS NULL";
$db->select($query, $diff);
if(!empty($diff)) {
    print "New table contains " . count($diff) . " records not in the old table, with SessionIDs ";
    foreach($diff AS $row) {
        print $row['SessionID'].' ';
    }
    print "\n";
}
    
// loop over the var name map, checking column by column
foreach($varMap AS $oldVar => $newVar) {

    // figure out what table the old variable is in
    $query = "SELECT CurrentGUITable FROM $oldDB.parameter_type WHERE Name='$oldVar'";
    $oldTable = $db->selectOne($query);
    if(empty($oldTable)) {
        print "Old var $oldVar is not queriable\n";
        continue;
    }

    // figure out what table the new variable is in
    $query = "SELECT CurrentGUITable FROM $newDB.parameter_type WHERE Name='$newVar'";
    $newTable = $db->selectOne($query);
    if(empty($newTable)) {
        print "New var $newVar is not queriable\n";
        continue;
    }

    // get the list of different cells
    $query = "SELECT new.SessionID, old.`$oldVar` AS oldCell, new.`$newVar` as newCell FROM $oldDB.$oldTable AS old, $newDB.$newTable AS new WHERE old.SessionID=new.SessionID and old.`$oldVar`<>new.`$newVar`";
    $diff = array();
    $db->select($query, $diff);

    if(!empty($diff)) {
        print "$oldVar -> $newVar : ".count($diff). " cells changed.\n";
        foreach($diff AS $row) {
            print "$row[SessionID]: $row[oldCell] -> $row[newCell]\n";
        }
    }
}

?>
