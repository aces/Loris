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

$user =& User::singleton();
if (!$user->hasPermission('document_repository_view') && !$user->hasPermission('document_repository_delete')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";
require_once "Email.class.inc";

$factory = NDB_Factory::singleton();
$baseURL = $factory->settings()->getBaseURL();
$client = new NDB_Client();
$client->initialize("../../project/config.xml");

$config = NDB_Config::singleton();

// create Database object
$DB =& Database::singleton();

if (empty($_POST['category_name']) && $_POST['category_name'] !== '0') {
    header("HTTP/1.1 400 Bad Request");
    exit;
} else {
    $category_name = $_POST['category_name'];
}
if ($_POST['parent_id'] !== '') {
    if (isset($_POST['parent_id']) || is_numeric($_POST['parent_id'])) {
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
//if user has document repository permission
if ($user->hasPermission('document_repository_view') || $user->hasPermission('document_repository_delete')) {
    $DB->insert(
        "document_repository_categories",
        array("category_name" => $category_name,
              "parent_id"     => $parent_id,
              "comments"      => $comments)
    );


    $msg_data['newCategory'] = $baseURL . "/document_repository/";
    $msg_data['category']    = $category_name;
    $msg_data['study']       = $config->getSetting('title');

    $Doc_Repo_Notification_Emails = $DB->pselect(
        "SELECT Email from users where Active='Y' and Doc_Repo_Notifications='Y' and UserID<>:uid",
        array("uid"=>$user->getUsername())
    );
    foreach ($Doc_Repo_Notification_Emails as $email) {
        Email::send($email['Email'], 'document_repository.tpl', $msg_data);
    }
}

?>
