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
$columnThreshhold = 150;
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
        $insertSQL = "INSERT INTO $nextTableName (SessionID) SELECT DISTINCT SessionID FROM flag f JOIN parameter_type pt ON (f.Test_name=pt.SourceFrom) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c ON (c.CandID=s.CandID) WHERE pt.CurrentGUITable='$nextTableName' AND c.Active='Y' AND c.Cancelled='N' AND s.Active='Y' AND s.Cancelled='N' AND c.CenterID IN (2, 3, 4, 5) AND s.Current_stage <> 'Recycling Bin' UNION select DISTINCT SessionID FROM parameter_session ps JOIN parameter_type pt ON (pt.ParameterTypeID=ps.ParameterTypeID) JOIN session s ON (ps.SessionID=s.ID) JOIN candidate c ON (c.CandID=s.CandID) WHERE pt.CurrentGUITable='$nextTableName' AND c.Active='Y' AND c.Cancelled='N' AND s.Active='Y' AND s.Cancelled='N' AND c.CenterID IN (2, 3, 4, 5) AND s.Current_stage <> 'Recycling Bin'";
        $quatTableCounter++;
        $nextTableName = $quatTableBasename . $quatTableCounter;
        $result = $db->run($createSQL);
        if($db->isError($result)) {
            die( "Failed to create table $nextTableName: ".$result->getMessage()."\n" );
        }
        $result = $db->run($insertSQL);
        if($db->isError($result)) {
            die( "Failed to populate table $nextTableName: ".$result->getMessage()."\n" );
        }

        // reset the column counter and create table statement
        $createSQL = "";
        $columnCount = 0;
        print "Finished creating $nextTableName: " . memory_get_usage() . "\n";
if($quatTableCounter > 2) break;
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

// define the list of sessions to use, according to NIHPD criteria, or not.
$query = "SELECT ID, CandID, Screening, Visit FROM session";
$isNIHPD = $config->getSetting('isNIHPD');
if ($isNIHPD == "true") {
    $query .= " WHERE Approval='Pass'";
}
$sessions = array();
$db->select($query, $sessions);

unset($config);
print "At make the data table: " . memory_get_usage() . "\n";

function GetSelectStatement($parameterType, $field=NULL) {
    // construct query string dependant on parameter source
    switch($parameterType['SourceFrom']) {
    case 'files':
        if($field == null) {
            $field = "File";
        }
        $query = "SELECT $field AS Value FROM files JOIN session as S ON (s.ID=files.SessionID) WHERE OutputType='$parameterType[SourceCondition]'";
        break;

    case 'parameter_file':
        if($field == null) {
            $field = "p.Value";
        }
        $query = "SELECT $field FROM session AS s, files AS f, parameter_file AS p WHERE s.ID=f.SessionID AND f.FileID=p.FileID AND (f.QCStatus<>'Fail' OR f.QCStatus IS NULL) AND ParameterTypeID=$parameterType[ParameterTypeID]";
        break;

    case 'files_where_parameter':
        if($field == null) {
            $field = "$parameterType[SourceField]";
        }
        // SourceCondition can refer to acquisition protocol as
        // Scan_type and limiter_type.Name=X and limiter_value.Value=Y
        $query = "SELECT $field AS Value FROM session AS s INNER JOIN files ON (s.ID=files.SessionID) INNER JOIN mri_scan_type ON (files.AcquisitionProtocolID=mri_scan_type.ID) NATURAL JOIN parameter_file AS limiter_value INNER JOIN parameter_type AS limiter_type ON (limiter_value.ParameterTypeID=limiter_type.ParameterTypeID) WHERE $parameterType[SourceCondition]";
        break;

    case 'parameter_file_where_parameter':
        if($field == null) {
            $field = "$parameterType[SourceField]";
        }
        // SourceCondition can refer to acquisition protocol as
        // Scan_type and limiter_type.Name=X and limiter_value.Value=Y
        $query = "SELECT $field FROM session AS s INNER JOIN files ON (s.ID=files.SessionID) INNER JOIN mri_scan_type ON (files.AcquisitionProtocolID=mri_scan_type.ID) INNER JOIN parameter_file AS limiter_value ON (limiter_value.FileID=files.FileID) INNER JOIN parameter_type AS limiter_type ON (limiter_value.ParameterTypeID=limiter_type.ParameterTypeID) INNER JOIN parameter_file ON (files.FileID=parameter_file.FileID) INNER JOIN parameter_type ON (parameter_file.ParameterTypeID=parameter_type.ParameterTypeID) WHERE $parameterType[SourceCondition]";
        break;

    case 'parameter_session':
        if($field == null) {
            $field = "Value";
        }
        $query = "SELECT $field FROM parameter_session JOIN session s ON (s.ID=parameter_session.SessionID) WHERE ParameterTypeID=$parameterType[ParameterTypeID]";
        break;

    case 'parameter_candidate':
        if($field == null) {
            $field = "Value";
        }
        $query = "SELECT $field FROM session s LEFT JOIN parameter_candidate USING (CandID) WHERE ParameterTypeID=$parameterType[ParameterTypeID]";
        break;

    case 'session':
    case 'candidate':
        if($field == null && $parameterType['SourceFrom']=='session') {
            $field = "s.$parameterType[SourceField] ";
        } else if($field == null && $parameterType['SourceFrom']=='candidate') {
            $field = "c.$parameterType[SourceField] ";
        }

        $query = "SELECT $field AS Value FROM session s LEFT JOIN candidate c USING (CandID) WHERE 1=1 ";
        break;

    case 'psc':
        if($field == null) {
            $field = "s.$parameterType[SourceField] Value";
        }
        $query = "SELECT $field AS Value FROM session s LEFT JOIN psc USING (CenterID) WHERE 1=1";
        break;

    case 'mri_acquisition_dates':
        if($field == null) {
            $field = "$parameterType[SourceField] Value";
        }
        $query = "SELECT $field AS Value FROM session s LEFT JOIN candidate USING (CandID) LEFT JOIN mri_acquisition_dates ON (session.ID=mri_acquisition_dates.SessionID)";
	 break;

    //for behavioural instrument data
    default:
        if($field == null) {
            if($parameterType['SourceField'] == 'Administration' ||
                $parameterType['SourceField'] == 'Validity' ||
                $parameterType['SourceField'] == 'Data_entry') {
                $field = "`flag`.`$parameterType[SourceField]`";
            } else if($parameterType['SourceField'] == 'Examiner') 
                $field = "e.`full_name`";
            else {
                $field = "`$parameterType[SourceFrom]`.`$parameterType[SourceField]`";
            }
        }
        if($parameterType['SourceField'] == 'Examiner') 
            $query = "SELECT $field AS Value FROM session s JOIN flag ON (s.ID=flag.SessionID) LEFT JOIN feedback_bvl_thread USING (CommentID) CROSS JOIN $parameterType[SourceFrom] LEFT JOIN candidate ON (s.CandID = candidate.CandID) LEFT JOIN examiners e ON (e.examinerID=$parameterType[SourceFrom].Examiner) WHERE flag.Administration IN ('All', 'Partial') AND flag.Data_entry='Complete' AND flag.CommentID=$parameterType[SourceFrom].CommentID AND (feedback_bvl_thread.Status IS NULL OR feedback_bvl_thread.Status='closed' OR feedback_bvl_thread.Status='comment')";
        else {
            $query = "SELECT $field AS Value FROM session s JOIN flag ON (s.ID=flag.SessionID) LEFT JOIN feedback_bvl_thread USING (CommentID) CROSS JOIN $parameterType[SourceFrom] LEFT JOIN candidate ON (s.CandID = candidate.CandID) WHERE flag.Administration IN ('All', 'Partial') AND flag.Data_entry='Complete' AND flag.CommentID=$parameterType[SourceFrom].CommentID AND (feedback_bvl_thread.Status IS NULL OR feedback_bvl_thread.Status='closed' OR feedback_bvl_thread.Status='comment')";
        }
        break;
    }
    return $query;
}

// Update data
foreach($parameterTypes AS $parameterType) {
    if($parameterType['CurrentGUITable'] != null) {
    print "Updating $parameterType[Name], memory: " . memory_get_usage() . " bytes\n";
    if(strpos($parameterType['Name'], "vineland") !== FALSE ||
        strpos($parameterType['Name'], "EARLI") !== FALSE ||
        strpos($parameterType['Name'], "adi") !== FALSE ||
        strpos($parameterType['Name'], "csbs") !== FALSE ||
        strpos($parameterType['Name'], "fyi") !== FALSE ||
        strpos($parameterType['Name'], "head_measurements_subject") !== FALSE ||
        strpos($parameterType['Name'], "i3") !== FALSE ||
        strpos($parameterType['Name'], "ibq_r") !== FALSE ||
        strpos($parameterType['Name'], "m_chat_proband") !== FALSE ||
        strpos($parameterType['Name'], "med_psych_hist") !== FALSE ||
        strpos($parameterType['Name'], "aosi") !== FALSE
        ) {
        continue;
    }
    switch($parameterType['SourceFrom']) {
        case 'session':
        case 'candidate':
        case 'psc':
        case 'parameter_candidate';
        case 'parameter_session':
            print "UPDATE $parameterType[CurrentGUITable] SET $parameterType[Name]=(" . GetSelectStatement($parameterType) . " AND $parameterType[CurrentGUITable].SessionID=s.ID)  WHERE $parameterType[CurrentGUITable].SessionID=(" . GetSelectStatement($parameterType, "DISTINCT s.ID"). " AND s.ID=$parameterType[CurrentGUITable].SessionID)";
            $db->run("UPDATE $parameterType[CurrentGUITable] SET $parameterType[Name]=(" . GetSelectStatement($parameterType) . " AND $parameterType[CurrentGUITable].SessionID=s.ID)  WHERE $parameterType[CurrentGUITable].SessionID=(" . GetSelectStatement($parameterType, "DISTINCT s.ID"). " AND s.ID=$parameterType[CurrentGUITable].SessionID)");
            //exit(-1);
            break;
        default:
            print "UPDATE $parameterType[CurrentGUITable] SET $parameterType[Name]=(" . GetSelectStatement($parameterType) . " AND $parameterType[CurrentGUITable].SessionID=s.ID AND flag.CommentID NOT LIKE 'DDE%') WHERE $parameterType[CurrentGUITable].SessionID=(" . GetSelectStatement($parameterType, "DISTINCT s.ID"). " AND flag.CommentID NOT LIKE 'DDE%' AND s.ID=$parameterType[CurrentGUITable].SessionID)";
            $db->run("UPDATE $parameterType[CurrentGUITable] SET $parameterType[Name]=(" . GetSelectStatement($parameterType) . " AND $parameterType[CurrentGUITable].SessionID=s.ID AND flag.CommentID NOT LIKE 'DDE%') WHERE $parameterType[CurrentGUITable].SessionID=(" . GetSelectStatement($parameterType, "DISTINCT s.ID"). " AND flag.CommentID NOT LIKE 'DDE%' AND s.ID=$parameterType[CurrentGUITable].SessionID)");
            break;
    }
    //$db->run("UPDATE $parameterType[CurrentGUITable] SET $parameterType[Name]=(" . GetSelectStatement($parameterType) . " WHERE $parameterType[CurrentGUITable].SessionID=s.ID)");
    }
}
?>
