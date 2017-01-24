<?php
ini_set("max_input_vars", 4000);

$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");


$user = User::singleton();
$cdb  = CouchDB::singleton();
$qid  = $user->getUserName() . "_" . $_REQUEST['QueryName'];

if ($_REQUEST['SharedQuery'] === "true") {
    $qid = "global_" . $qid;
}

if ($_REQUEST['Override'] === "false") {
    $results = $cdb->getDoc(
        $qid
    );

    if (!empty($results)) {
        error_log($_REQUEST['SharedQuery']);
        header("HTTP/1.1 409 Conflict");
        exit;
    }
}

$baseDocument = array(
    '_id' => $qid,
    'Meta' => array('DocType' => 'SavedQuery',
        'user' => $user->getUserName()),

    'Fields' => array(),
    'Conditions' => array(),
);
if(isset($_REQUEST['QueryName'])) {
    $baseDocument['Meta']['name'] = $_REQUEST['QueryName'];
}
if($_REQUEST['SharedQuery'] === "true") {
    $baseDocument['Meta']['user'] = 'global';
    $baseDocument['Meta']['name'] = $user->getUserName() . ': ' . $_REQUEST['QueryName'];
}

$fields = $_REQUEST['Fields'];

$cond = $_REQUEST['Filters'];

$baseDocument['Conditions'] = $cond;
$baseDocument['Fields'] = $fields;

if ($_REQUEST['Override'] === "true") {
    unset($baseDocument['_id']);
    $cdb->replaceDoc($qid, $baseDocument);
    $query['id'] = $qid;
    print json_encode($query);
} else {
    print $cdb->postDoc($baseDocument);
}

?>
