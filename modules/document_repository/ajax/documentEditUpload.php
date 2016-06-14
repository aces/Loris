<?php

$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('document_repository_view') && !$userSingleton->hasPermission('document_repository_delete')) {
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

$action = $_POST['action'];

//if user has document repository permission
if ($userSingleton->hasPermission('document_repository_view') || $userSingleton->hasPermission('document_repository_delete')) {
    if ($action == 'upload') {
        $puser = $_POST['user'];
        $category = $_POST['category'];
        $site = $_POST['site'];
        $instrument = $_POST['instrument'];
        $pscid = $_POST['pscid'];
        $visit = $_POST['visit'];
        $comments = $_POST['comments'];
        $version = $_POST['version'];

        $fileSize = $_FILES["file"]["size"];
        $fileName = $_FILES["file"]["name"];
        $fileType = end((explode(".", $fileName)));

        // __DIR__ is the document_repository ajax directory
        // when this script is executing. Go up a level to the
        // document_repository module directory, and use a
        // user_uploads directory as a base for user uploads
        $base_path = __DIR__ . "/../user_uploads/";
        $fileBase = $puser . "/" . $fileName;

        if (!file_exists($base_path . $puser)) {
            mkdir($base_path . $puser, 0777);
        }


        $target_path = $base_path  . $fileBase;

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
            $success = $DB->insert('document_repository',
                            array('File_category'=>$category, 'For_site'=>$site,
                                  'comments'=>$comments, 'version'=>$version, 'File_name'=>$fileName,
                                  'File_size'=>$fileSize, 'Data_dir'=>$fileBase, 'uploaded_by'=>$puser,
                                  'Instrument'=>$instrument, 'PSCID'=>$pscid, 'visitLabel'=>$visit,
                                  'File_type'=>$fileType));
            $msg_data['newDocument'] = $baseURL . "/document_repository/";
            $msg_data['document'] = $fileName;
            $msg_data['study'] = $config->getSetting('title');
            $query_Doc_Repo_Notification_Emails = "SELECT Email from users where Active='Y' and Doc_Repo_Notifications='Y' and UserID<>:uid";
            $Doc_Repo_Notification_Emails = $DB->pselect($query_Doc_Repo_Notification_Emails, array("uid"=>$userSingleton->getUsername()));
            foreach ($Doc_Repo_Notification_Emails as $email) {
                Email::send($email['Email'], 'document_repository.tpl', $msg_data);
            }
            header("Location: $baseURL/document_repository/?uploadSuccess=true");
        } else {
            echo "There was an error uploading the file";
        }
    } elseif ($action == 'edit') {
        $id = $_POST['idEdit'];
        $category = $_POST['categoryEdit'];
        $instrument = $_POST['instrumentEdit'];
        $site = $_POST['siteEdit'];
        $pscid = $_POST['pscidEdit'];
        $visit = $_POST['visitEdit'];
        $comments = $_POST['commentsEdit'];
        $version = $_POST['versionEdit'];

        if(empty($category) && $category !== '0'){
            header("HTTP/1.1 400 Bad Request");
            exit;
        }

        $values = array('File_category' => $category, 'Instrument' => $instrument, 'For_site' => $site,
                        'PSCID' => $pscid, 'visitLabel' => $visit, 'comments' => $comments, 'version' => $version);
        $DB->update('document_repository', $values, array('record_id'=>$id));

        $fileName = $DB->pselectOne("select File_name from document_repository where record_id=:record_id",
                                     array('record_id'=>$id));
        $msg_data['updatedDocument'] = $baseURL . "/document_repository/";
        $msg_data['document'] = $fileName;
        $query_Doc_Repo_Notification_Emails = "SELECT Email from users where Active='Y' and Doc_Repo_Notifications='Y' and UserID<>:uid";
        $Doc_Repo_Notification_Emails = $DB->pselect($query_Doc_Repo_Notification_Emails, array("uid"=>$userSingleton->getUsername()));
        foreach ($Doc_Repo_Notification_Emails as $email) {
            Email::send($email['Email'], 'document_repository.tpl', $msg_data);
        }
    }
}

?>
