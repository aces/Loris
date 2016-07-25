<?php

$user =& User::singleton();
if (!$user->hasPermission('document_repository_delete')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";
require_once "Email.class.inc";
$client = new NDB_Client();
$client->initialize("../../project/config.xml");
$factory = NDB_Factory::singleton();
$baseURL = $factory->settings()->getBaseURL();

$config = NDB_Config::singleton();

// create Database object
$DB =& Database::singleton();

$rid = $_POST['id'];

$fileName = $DB->pselectOne("Select File_name from document_repository where record_id =:identifier",
                            array(':identifier' => $rid));
$userName = $DB->pselectOne("Select uploaded_by from document_repository where record_id =:identifier",
                            array(':identifier'=> $rid));
$dataDir  = $DB->pselectOne("Select Data_dir from document_repository where record_id =:identifier",
                            array(':identifier'=> $rid));

$user =& User::singleton();

//if user has document repository delete permission
if ($user->hasPermission('document_repository_delete')) {
    $DB->delete("document_repository", array("record_id" => $rid));
    $msg_data['deleteDocument'] = $baseURL. "/document_repository/";
    $msg_data['document'] = $fileName;
    $msg_data['study'] = $config->getSetting('title');
    $query_Doc_Repo_Notification_Emails = "SELECT Email from users where Active='Y' and Doc_Repo_Notifications='Y' and UserID<>:uid";
    $Doc_Repo_Notification_Emails = $DB->pselect($query_Doc_Repo_Notification_Emails, array("uid"=>$user->getUsername()));
    foreach ($Doc_Repo_Notification_Emails as $email) {
        Email::send($email['Email'], 'document_repository.tpl', $msg_data);
    }
}

$path = __DIR__ . "/../user_uploads/$dataDir";

if (file_exists($path))
    unlink($path);

?>
