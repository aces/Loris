<?php
set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";
require_once "Email.class.inc";
$client =& new NDB_Client();
$client->initialize("../../project/config.xml");

$config = NDB_Config::singleton();

// create Database object
$DB =& Database::singleton();
if (Utility::isErrorX($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die();
}

$action = $_POST['action'];

$userSingleton =& User::singleton();
if (Utility::isErrorX($userSingleton)) {
    return PEAR::raiseError("User Error: ".$userSingleton->getMessage());
}

//if user has document repository permission
if ($userSingleton->hasPermission('file_upload')) {
    if ($action == 'upload') {
        $user = $_POST['user'];
        $category = $_POST['category'];
        $site = $_POST['site'];
        $instrument = $_POST['instrument'];
        $pscid = $_POST['pscid'];
        $visit = $_POST['visit'];
        $comments = $_POST['comments'];
        $version = $_POST['version'];

        $fileSize = $_FILES["file"]["size"];
        $fileName = $_FILES["file"]["name"];
        $base_path = "../document_repository/";

        if (!file_exists($base_path . $user)) {
            mkdir($base_path . $user, 0777);
        }

        $target_path = $base_path  . $user . "/" . $fileName;

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
            $success = $DB->insert('document_repository',
                            array('File_category'=>$category, 'For_site'=>$site,
                                  'comments'=>$comments, 'version'=>$version, 'File_name'=>$fileName,
                                  'File_size'=>$fileSize, 'Data_dir'=>$target_path, 'uploaded_by'=>$user,
                                  'Instrument'=>$instrument, 'PSCID'=>$pscid, 'visitLabel'=>$visit));
            $www = $config->getSetting('www');
            $msg_data['newDocument'] = $www['url'] . "/main.php?test_name=document_repository";
            $msg_data['document'] = $fileName;
            $query_Doc_Repo_Notification_Emails = "SELECT Email from users where Active='Y' and Doc_Repo_Notifications='Y'";
            $Doc_Repo_Notification_Emails = $DB->pselect($query_Doc_Repo_Notification_Emails, array());
            foreach ($Doc_Repo_Notification_Emails as $email) {
                Email::send($email['Email'], 'document_repository.tpl', $msg_data);
            }
            header("Location: ../main.php?test_name=document_repository&uploadSuccess=true");
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

        $values = array('File_category' => $category, 'Instrument' => $instrument, 'For_site' => $site,
                        'PSCID' => $pscid, 'visitLabel' => $visit, 'comments' => $comments, 'version' => $version);
        $DB->update('document_repository', $values, array('record_id'=>$id));

        $fileName = $DB->pselectOne("select File_name from document_repository where record_id=:record_id",
                                     array('record_id'=>$id));
        $www = $config->getSetting('www');
        $msg_data['updatedDocument'] = $www['url'] . "/main.php?test_name=document_repository";
        $msg_data['document'] = $fileName;
        $query_Doc_Repo_Notification_Emails = "SELECT Email from users where Active='Y' and Doc_Repo_Notifications='Y'";
        $Doc_Repo_Notification_Emails = $DB->pselect($query_Doc_Repo_Notification_Emails, array());
        foreach ($Doc_Repo_Notification_Emails as $email) {
            Email::send($email['Email'], 'document_repository.tpl', $msg_data);
        }
    }
}

?>
