<?php
/**
 * Script for handling a new (sub)category addition to the Document Repository
 *
 * PHP Version 5
 *
 * @category Documentation
 * @package  Main
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/Jkat/Loris-Trunk/
 */
set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";
require_once "Email.class.inc";

$client = new NDB_Client();
$client->initialize("../../project/config.xml");

$config = NDB_Config::singleton();

// create Database object
$DB =& Database::singleton();
if (Utility::isErrorX($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die();
}

if ($_POST['category_name'] !== '') {
    $category_name = $_POST['category_name'];
}
if ($_POST['parent_id'] !== '') {
    if (is_numeric($_POST['parent_id'])) {
        $parent_id = $_POST['parent_id'];
    } else {
        error_log("Invalid parent id!");
        die();
    }
}
if ($_POST['comments'] !== '') {
    $comments = $_POST['comments'];
}

$user =& User::singleton();
if (Utility::isErrorX($user)) {
    return PEAR::raiseError("User Error: ".$user->getMessage());
}

//if user has document repository permission
if ($user->hasPermission('file_upload')) {
    $DB->insert(
        "document_repository_categories",
        array("category_name" => $category_name,
              "parent_id"     => $parent_id,
              "comments"      => $comments)
    );

    $www = $config->getSetting('www');

    $msg_data['newCategory'] = $www['url'] . 
                               "/main.php?test_name=document_repository";
    $msg_data['category']    = $category_name;

    $Doc_Repo_Notification_Emails = $DB->pselect(
        "SELECT Email from users where Active='Y' and Doc_Repo_Notifications='Y'",
        array()
    );
    foreach ($Doc_Repo_Notification_Emails as $email) {
        Email::send($email['Email'], 'document_repository.tpl', $msg_data);
    }
}

?>
