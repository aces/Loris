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


// settings
$columnThreshhold = 500;
$quatTableBasename = 'quat_table_';
$quatTableCounter = 1;

// create an NDB client 
require_once "../php/libraries/NDB_Client.class.inc";
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
    }
}

// get a list of all parameter types
$query = "SELECT ParameterTypeID, Name, Type, SourceField, SourceFrom, SourceCondition, CurrentGUITable FROM parameter_type WHERE Queryable=1";
$parameterTypes = array();
$db->select($query, $parameterTypes);

// loop over the parameter types to build the data query tables
$createSQL = "";
$columnCount = 0;
$nextTableName = $quatTableBasename . $quatTableCounter;
$countParameterTypes = count($parameterTypes);
for($idx=0; $idx<$countParameterTypes; $idx++) {
    $parameterType =& $parameterTypes[$idx];

    // add column to the create table statement
    $createSQL .= !empty($createSQL) ? ', ' : '';
    $createSQL .= "`$parameterType[Name]` $parameterType[Type]";
    $parameterTypes[$idx]['CurrentGUITable'] = $nextTableName;
    $db->update('parameter_type', array('CurrentGUITable'=>$nextTableName), array('ParameterTypeID'=>$parameterType['ParameterTypeID']));
    $columnCount++;

    // if the number of columns is now greater than the threshhold
    if($columnCount >= $columnThreshhold or $idx+1 == $countParameterTypes) {

        // run the create table statement
        $createSQL = "CREATE TABLE $nextTableName (SessionID int not null primary key, $createSQL)";
        $quatTableCounter++;
        $nextTableName = $quatTableBasename . $quatTableCounter;
        $result = $db->run($createSQL);
        if($db->isError($result)) {
            die( "Failed to create table $nextTableName: ".$result->getMessage()."\n" );
        }

        // reset the column counter and create table statement
        $createSQL = "";
        $columnCount = 0;
    }
}
unset($parameterType);

// define the list of sessions to use, according to NIHPD criteria, or not.
$query = "SELECT ID, CandID, Screening, Visit FROM session";
$isNIHPD = $config->getSetting('isNIHPD');
if ($isNIHPD == "true") {
    $query .= " WHERE Approval='Pass'";
}
$sessions = array();
$db->select($query, $sessions);

// make the data table
$queryableSessions = array();
foreach($sessions AS $session) {
    foreach($parameterTypes AS $parameterType) {
        $dataTable[$parameterType['CurrentGUITable']][$session['ID']] = array('SessionID'=>$session['ID']);
    }
    $queryableSessions[$session['ID']] = true;
}

// loop over the parameter types to populate the data query tables
foreach($parameterTypes AS $parameterType) {
    $query = "";

    // construct query string dependant on parameter source
    switch($parameterType['SourceFrom']) {
    case 'files':
        $query = "SELECT SessionID, FileID AS Value FROM files WHERE OutputType='$parameterType[SourceField]'";
        break;

    case 'parameter_file':
        $query = "SELECT f.SessionID, p.Value FROM session AS s, files AS f, parameter_file AS p WHERE s.ID=f.SessionID AND f.FileID=p.FileID AND (f.QCStatus<>'Fail' OR f.QCStatus IS NULL) AND ParameterTypeID=$parameterType[ParameterTypeID]";
        break;

    case 'files_where_parameter':
        // SourceCondition can refer to acquisition protocol as
        // Scan_type and limiter_type.Name=X and limiter_value.Value=Y
        $query = "SELECT files.SessionID, $parameterType[SourceField] AS Value FROM session AS s INNER JOIN files ON (s.ID=files.SessionID) INNER JOIN mri_scan_type ON (files.AcquisitionProtocolID=mri_scan_type.ID) NATURAL JOIN parameter_file AS limiter_value INNER JOIN parameter_type AS limiter_type ON (limiter_value.ParameterTypeID=limiter_type.ParameterTypeID) WHERE $parameterType[SourceCondition]";
        break;

    case 'parameter_file_where_parameter':
        // SourceCondition can refer to acquisition protocol as
        // Scan_type and limiter_type.Name=X and limiter_value.Value=Y
        $query = "SELECT files.SessionID, $parameterType[SourceField] FROM session AS s INNER JOIN files ON (s.ID=files.SessionID) INNER JOIN mri_scan_type ON (files.AcquisitionProtocolID=mri_scan_type.ID) INNER JOIN parameter_file AS limiter_value ON (limiter_value.FileID=files.FileID) INNER JOIN parameter_type AS limiter_type ON (limiter_value.ParameterTypeID=limiter_type.ParameterTypeID) INNER JOIN parameter_file ON (files.FileID=parameter_file.FileID) INNER JOIN parameter_type ON (parameter_file.ParameterTypeID=parameter_type.ParameterTypeID) WHERE $parameterType[SourceCondition]";
        break;

    case 'parameter_session':
        $query = "SELECT SessionID, Value FROM parameter_session WHERE ParameterTypeID=$parameterType[ParameterTypeID]";
        break;

    case 'parameter_candidate':
        $query = "SELECT session.ID AS SessionID, Value FROM session LEFT JOIN parameter_candidate USING (CandID) WHERE ParameterTypeID=$parameterType[ParameterTypeID]";
        break;

    case 'session':
    case 'candidate':
        $query = "SELECT session.ID AS SessionID, $parameterType[SourceField] AS Value FROM session LEFT JOIN candidate USING (CandID)";
        break;

    case 'psc':
        $query = "SELECT session.ID AS SessionID, $parameterType[SourceField] AS Value FROM session LEFT JOIN psc USING (CenterID)";
        break;

    case 'mri_acquisition_dates':
        $query = "SELECT session.ID AS SessionID, $parameterType[SourceField] AS Value FROM session LEFT JOIN candidate USING (CandID) LEFT JOIN mri_acquisition_dates ON (session.ID=mri_acquisition_dates.SessionID)";
	 break;

    //for behavioural instrument data
    default:
        $query = "SELECT session.ID AS SessionID, $parameterType[SourceField] AS Value FROM session, flag LEFT JOIN feedback_bvl_thread USING (CommentID), $parameterType[SourceFrom] LEFT JOIN candidate ON (session.CandID = candidate.CandID) WHERE session.ID=flag.SessionID AND flag.Administration<>'None' AND flag.CommentID=$parameterType[SourceFrom].CommentID AND (feedback_bvl_thread.Status IS NULL OR feedback_bvl_thread.Status='closed' OR feedback_bvl_thread.Status='comment')";
        break;
    }

    // get column of data
    $dataColumn = array();
    $db->select($query, $dataColumn);
    //print count($dataColumn)."\t".$query."\n";
    if($db->isError($dataColumn)) {
        print "Failed to retrieve $parameterType[Name]: ".$dataColumn->getMessage()."\n";
        print "$query\n";
        continue;
    }

    // store the column
    foreach($dataColumn AS $row) {
        if($queryableSessions[$row['SessionID']]) {
            $dataTable[$parameterType['CurrentGUITable']][$row['SessionID']][$parameterType['Name']] = $row['Value'];
        }
    }
}

foreach($dataTable AS $quatTableName=>$quatTable) {
    foreach($quatTable AS $SessionID=>$record) {

        if(count($record) > 0) {
            // make sure we have a row for this session - if not, create one...
            if($db->selectOne("SELECT COUNT(*) FROM $quatTableName WHERE SessionID=$record[SessionID]") == 0)
                $db->insert($quatTableName, $record);
            else
                $db->update($quatTableName, $record, array('SessionID'=>$record['SessionID']));
        } else {
            print  "No values set for SessionID $record[SessionID]\n";
        }
    }
}
?>
