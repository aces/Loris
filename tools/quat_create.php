<?php
set_time_limit(0);
/**
 * QUAT uses the parameter_type table to determine the list of
 * parameters available for querying, nukes and reconstructs the query
 * gui tables (the wide ones containing all parameter types)
 *
 * IMPORTANT NOTE:
 *
 * You will need entry in your config.xml:
 *
 *       <quatUser>username</quatUser>
 *       <quatPassword>password</quatPassword>
 * 
 * @package main
 * @subpackage query_gui
 */

/*
mysql> describe parameter_type;
+-----------------+-----------------------------------------------+------+-----+---------+----------------+
| Field           | Type                                          | Null | Key | Default | Extra          |
+-----------------+-----------------------------------------------+------+-----+---------+----------------+
| ParameterTypeID | int(10) unsigned                              |      | PRI | NULL    | auto_increment |
| Name            | varchar(255)                                  |      | MUL |         |                |
| Type            | enum('ordinal','nominal','scalar','filePath') |      |     | ordinal |                |
| Description     | text                                          | YES  |     | NULL    |                |
| RangeMin        | double                                        | YES  |     | NULL    |                |
| RangeMax        | double                                        | YES  |     | NULL    |                |
| SourceField     | text                                          | YES  |     | NULL    |                |
| SourceFrom      | text                                          | YES  |     | NULL    |                |
| CurrentGUITable | varchar(255)                                  | YES  |     | NULL    |                |
| Queryable       | tinyint(1)                                    | YES  |     | 1       |                |
+-----------------+-----------------------------------------------+------+-----+---------+----------------+
*/

set_include_path(get_include_path().":../project/libraries:../php/libraries:");


require_once "Utility.class.inc";

// settings
$columnThreshhold = Utility::getColumnThresholdCount();
$quatTableBasename = 'quat_table_';
$quatTableCounter = 1;

// create an NDB client 
require_once "../php/libraries/NDB_Client.class.inc";
require_once "Log.class.inc";
$client = new NDB_Client;
$client->makeCommandLine();
$client->initialize();

$log = new Log("quat_create");
// get a Database connection
$config =& NDB_Config::singleton();
$dbConfig = $config->getSetting('database');
$db = new Database;
$result = $db->connect($dbConfig['database'], $dbConfig['quatUser'], $dbConfig['quatPassword'], $dbConfig['host'], false);
if(PEAR::isError($result)) {
    die("Could not connect to database: ".$result->getMessage());
}

// nuke the current data query tables
$query = "SELECT DISTINCT CurrentGUITable FROM parameter_type";
$dataQueryTables = array();
$db->select($query, $dataQueryTables);

if(is_array($dataQueryTables) && count($dataQueryTables)) {
    foreach($dataQueryTables AS $table) {
        if(empty($table['CurrentGUITable'])) continue;

        /*
        $query = "DROP TABLE $table[CurrentGUITable]";
        */
        //$result = $db->run($query);
        /*
        if($db->isError($result)) {
            die( "Failed to drop table $table: ".$result->getMessage()."\n" );
        }
        */

        //$db->update('parameter_type', array('CurrentGUITable'=>null), array('CurrentGUITable'=>$table['CurrentGUITable']));
        print "At: $query, memory: " . memory_get_usage() . "\n";
    }
    unset($table);
}
// Free no longer needed memory
unset($dataQueryTables);
unset($query);

print "About to create tables: " . memory_get_usage() . "\n";
// get a list of all parameter types
$query = "SELECT ParameterTypeID, Name, Type, SourceField, SourceFrom, SourceCondition, CurrentGUITable FROM parameter_type WHERE Queryable=1";
$parameterTypes = array();
$db->select($query, $parameterTypes);

// loop over the parameter types to build the data query tables
$createSQL = "";
$columnCount = 0;
$nextTableName = $quatTableBasename . $quatTableCounter;
$nextTableName_running = $nextTableName . "_running";
$countParameterTypes = count($parameterTypes);


$createSQL = "CREATE TABLE parameter_type_running AS SELECT * FROM parameter_type WHERE Queryable=1";
$log->addLog($createSQL);
$db->run($createSQL);
if($db->isError($result)) {
    die("Failed to create temporary parameter_type table");
}
$updateSQL = "UPDATE parameter_type_running SET CurrentGUITable=null";
$db->run($createSQL);
if($db->isError($result)) {
    die("Failed to update parameter_type_running table");
}

$createSQL = '';
for($idx=0; $idx<$countParameterTypes; $idx++) {
    $parameterType =& $parameterTypes[$idx];

    // add column to the create table statement
    $createSQL .= !empty($createSQL) ? ', ' : '';
    $createSQL .= "`$parameterType[Name]` $parameterType[Type]";
    $parameterTypes[$idx]['CurrentGUITable'] = $nextTableName;
    $parameterTypesForQuat[] = $parameterType['ParameterTypeID'];
    //$db->update('parameter_type', array('CurrentGUITable'=>$nextTableName), array('ParameterTypeID'=>$parameterType['ParameterTypeID']));
    $columnCount++;

    // if the number of columns is now greater than the threshhold
    if($columnCount >= $columnThreshhold or $idx+1 == $countParameterTypes) {

        // run the create table statement
        $createSQL = "CREATE TABLE $nextTableName_running (SessionID int not null primary key, $createSQL)";
        $updateQuatSQL = "UPDATE parameter_type_running SET CurrentGUITable=" . $db->quote($nextTableName) . " WHERE ParameterTypeID IN (" . join(',', $parameterTypesForQuat) . ')';
        // be more aggressive -- insert every candidate who isn't cancelled
        $insertSQL = "INSERT INTO $nextTableName_running (SessionID) SELECT s.ID from session s JOIN candidate c USING (CandID) WHERE c.Active='Y' AND s.Active='Y' AND c.CenterID IN (2, 3, 4, 5) AND s.Current_stage <> 'Recycling Bin' AND c.PSCID <> 'scanner'";
        $quatTableCounter++;
        $nextTableName = $quatTableBasename . $quatTableCounter;
        $nextTableName_running = $nextTableName . "_running";
        unset($parameterTypesForQuat);
        $log->addLog($createSQL);
        $log->addLog($updateQuatSQL);
        $log->addLog($insertSQL);
        $result = $db->run($createSQL);
        if($db->isError($result)) {
            die( "Failed to create table $nextTableName: ".$result->getMessage()."\n" );
        }
        $result = $db->run($updateQuatSQL);
        if($db->isError($result)) {
            die( "Failed to populate table $nextTableName: ".$result->getMessage()."\n" );
        }
        $result = $db->run($insertSQL);
        if($db->isError($result)) {
            die( "Failed to populate table $nextTableName: ".$result->getMessage()."\n" );
        }

        // reset the column counter and create table statement
        $createSQL = "";
        $columnCount = 0;
        print "Finished creating $nextTableName_running: " . memory_get_usage() . "\n";
    }
}

// These are no longer used below this point, so free up the memory
unset($columnThreshhold);
unset($quatTableBasename);
unset($quatTableCounter);
unset($createSQL);
unset($columnCount);
unset($nextTableName);
unset($parameterType);
unset($countParameterTypes);
print "Finished creating tables: " . memory_get_usage() . "\n";

?>
