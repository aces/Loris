<?php
/**
 * Script for handling (sub)category comments in the Document Repository
 *
 * PHP Version 5
 *
 * @category Documentation
 * @package  Main
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/Jkat/Loris-Trunk/
 */

$user =& User::singleton();
if (!$user->hasPermission('document_repository_view')
    && !$user->hasPermission('document_repository_delete')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../../project/config.xml");

// create Database object
$DB =& Database::singleton();

if (get_magic_quotes_gpc()) {
    // Magic quotes adds \ to description, get rid of it.
    $comments = stripslashes($_REQUEST['comments']);
} else {
    // Magic quotes is off, so we can just directly use the description
    // since insert() will use a prepared statement.
    $comments = $_REQUEST['comments'];
}

$user =& User::singleton();

//if user has document repository permission
if ($user->hasPermission('document_repository_view')
    || $user->hasPermission('document_repository_delete')
) {
    $DB->update(
        'document_repository_categories',
        array('comments' => $comments),
        array('id' => $_REQUEST['id'])
    );
}

?>
