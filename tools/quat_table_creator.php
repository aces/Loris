<?
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
require_once "NDB_Client.class.inc";
require_once "Config.php";
require_once "Utility.class.inc";
require_once "Log.class.inc";

// PEAR::Config

// settings

$column_threshod = Utility::getColumnThresholdCount();
//$columnThreshhold = 250;
$quatTableBasename = 'quat_table_';
$quatTableCounter = 1;

// create an NDB client
$client = new NDB_Client;
$client->makeCommandLine();
$client->initialize();

// get a Database connection
$config =& NDB_Config::singleton();
$dbConfig = $config->getSetting('database');
$db = new Database;
$result = $db->connect($dbConfig['database'], $dbConfig['quatUser'], $dbConfig['quatPassword'], $dbConfig['host'], false);
if(PEAR::isError($result)) {
	die("Could not connect to database: ".$result->getMessage());
}

////////////////create log file////////////////////////////////////////////
//it's also a good idea to direct the results of the file into another log file..since the errors can be tracked there...
$log = new Log('quat_table_creator');


// nuke the current data query tables
$query = "SELECT DISTINCT CurrentGUITable FROM parameter_type";
$dataQueryTables = array();
$db->select($query, $dataQueryTables);

if(is_array($dataQueryTables) && count($dataQueryTables)) {
	foreach($dataQueryTables AS $table) {
		if(empty($table['CurrentGUITable'])) continue;

		$query = "DROP TABLE $table[CurrentGUITable]";
		$result = $db->run($query);
		if($db->isError($result)) {
			die( "Failed to drop table $table: ".$result->getMessage()."\n" );
		}

		$db->update('parameter_type', array('CurrentGUITable'=>null), array('CurrentGUITable'=>$table['CurrentGUITable']));
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
$countParameterTypes = count($parameterTypes);


$today= getdate();
$date = sprintf("%04d-%02d-%02d", $today['year'], $today['mon'], $today['mday']);


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
	//print 'columncount is' . $columnCount . "columnthreshold is" . $column_threshod . " idx is " . $idx . " countparametertypes is "  .$countParameterTypes . "\n";
	if($columnCount >= $column_threshod or $idx+1 == $countParameterTypes) {

		// run the create table statement
		//creates the table....
		$createSQL = "CREATE TABLE $nextTableName (SessionID int not null primary key, $createSQL)";
		$updateQuatSQL = "UPDATE parameter_type SET CurrentGUITable=" . $db->quote($nextTableName) . " WHERE ParameterTypeID IN (" . join(',', $parameterTypesForQuat) . ')';

		$insertSQL = "INSERT INTO $nextTableName (SessionID) SELECT s.ID from session s JOIN candidate c USING (CandID) WHERE c.Active='Y' AND s.Active='Y' AND c.CenterID IN (2, 3, 4, 5) AND s.Current_stage <> 'Recycling Bin' AND c.PSCID <> 'scanner'";

		$quatTableCounter++;
		$nextTableName = $quatTableBasename . $quatTableCounter;
		unset($parameterTypesForQuat);

		$log->addLog($createSQL);
		$log->addLog($updateQuatSQL);
		$log->addLog($insertSQL);


		$result = $db->run($createSQL);
		if($db->isError($result)) {
			$msg = "Failed to create table $nextTableName: ".$result->getMessage()."\n" ;
			print $msg;
			$log->addLog($msg);
			die( "Failed to create table $nextTableName: ".$result->getMessage()."\n" );
		}
		
		$result = $db->run($updateQuatSQL);
		if($db->isError($result)) {
		die( "Failed to populate table $nextTableName: ".$result->getMessage()."\n" );
		}
		
		
		$result = $db->run($insertSQL);
		if($db->isError($result)) {
			$msg = "Failed to insert the sql statements for $nextTableName $result->getMessage()";
			print $msg;
			$log->addLog($msg);
			die( "Failed to insert the sql statements for $nextTableName: ".$result->getMessage()."\n" );
		}

		// reset the column counter and create table statement
		$createSQL = "";
		$columnCount = 0;
		print "Finished creating $nextTableName: " . memory_get_usage() . "\n";
		$log->addLog("Finished creating $nextTableName: " . memory_get_usage() . "\n");
	}
}



// These are no longer used below this point, so free up the memory
unset($column_threshod);
unset($quatTableBasename);
unset($quatTableCounter);
unset($createSQL);
unset($columnCount);
unset($nextTableName);
unset($parameterType);
unset($countParameterTypes);
print "Finished creating tables: " . memory_get_usage() . "\n";
$log->addLog("Finished creating tables: " . memory_get_usage() . "\n");

unset($config);
print "At make the data table: " . memory_get_usage() . "\n";
$log->addLog("At make the data table: " . memory_get_usage() . "\n");

?>
