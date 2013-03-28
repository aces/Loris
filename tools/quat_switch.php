<?
set_time_limit(0);
set_include_path(get_include_path().":../project/libraries:../php/libraries:");


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

$query = "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=:tschema AND TABLE_NAME LIKE '%_running' AND TABLE_NAME <> 'parameter_type_running'";
$tables = $db->pselect($query, array("tschema" => $dbConfig['database']));
foreach ($tables as $row) {
    $tname = $row['TABLE_NAME'];
    $orig_tname = substr($tname, 0, -8);
    $query = "DROP TABLE IF EXISTS $orig_tname";
    $db->run($query);
    $query = "RENAME TABLE $tname TO $orig_tname";
    $db->run($query);
}
$query = "UPDATE parameter_type SET CurrentGUITable = null";
$db->run($query);
$query = "create index pt_name2 on parameter_type_running(Name)";
$db->run($query);
$query = "UPDATE parameter_type pt1 SET CurrentGUITable=(SELECT CurrentGUITable from parameter_type_running pt2 WHERE pt1.Name=pt2.Name)";
$db->run($query);
$query = "drop table parameter_type_running";
$db->run($query);
?>
