<?php
ini_set("max_input_vars", 4000);

require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");


$user = User::singleton();

$baseDocument = array(
    'Meta' => array('DocType' => 'SavedQuery',
        'user' => $user->getUserName()),

    'Fields' => array(),
    'Conditions' => array(),
);
if(isset($_REQUEST['QueryName'])) {
    $baseDocument['Meta']['name'] = $_REQUEST['QueryName'];
}
if($_REQUEST['SharedQuery'] === "true") {
    error_log("IN HERE");
    $baseDocument['Meta']['user'] = 'global';
    $baseDocument['Meta']['name'] = $user->getUserName() . ': ' . $_REQUEST['QueryName'];
}

$fields = $_REQUEST['Fields'];

$cond = $_REQUEST['Filters'];

$baseDocument['Conditions'] = $cond;
$baseDocument['Fields'] = $fields;

error_log(print_r($baseDocument, true));

$cdb = CouchDB::singleton();
print $cdb->postDoc($baseDocument);
?>
