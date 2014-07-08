<?php
set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../../project/config.xml");

// create Database object
$DB =& Database::singleton();
if (Utility::isErrorX($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die();
}

if (get_magic_quotes_gpc()) {
    // Magic quotes adds \ to description, get rid of it.
    $comments = stripslashes($_REQUEST['comments']);
} else {
    // Magic quotes is off, so we can just directly use the description
    // since insert() will use a prepared statement.
    $comments = $_REQUEST['comments'];
}

$user =& User::singleton();
if (Utility::isErrorX($user)) {
    return PEAR::raiseError("User Error: ".$user->getMessage());
}

//if user has document repository permission
if ($user->hasPermission('file_upload')) {
    $DB->update('document_repository_categories',
         array('comments'=>$comments),
         array('id'=>$_REQUEST['id']));
}

?>
