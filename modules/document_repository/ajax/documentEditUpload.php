<?php
/**
  * Document_repository module
  *
  * PHP Version 5
  *
  * @category Test
  * @package  Loris
  * @author   Loris Team <loris.info@mcin.ca>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('document_repository_view')
    && !$userSingleton->hasPermission('document_repository_delete')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(
    get_include_path().
    ":../../project/libraries:../../php/libraries:"
);
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

$editNotifier = new NDB_Notifier(
    "document_repository",
    "edit"
);

$uploadNotifier = new NDB_Notifier(
    "document_repository",
    "upload"
);

$action = $_POST['action'];

//if user has document repository permission
if ($userSingleton->hasPermission('document_repository_view')
    || $userSingleton->hasPermission('document_repository_delete')
) {
    if ($action == 'upload') {
        $puser      = $_POST['user'];
        $category   = $_POST['category'];
        $site       = $_POST['site']       !== '' ? $_POST['site'] : null;
        $instrument = $_POST['instrument'] !== '' ? $_POST['instrument'] : null;
        $pscid      = $_POST['pscid']      !== '' ? $_POST['pscid'] : null;
        $visit      = $_POST['visit']      !== '' ? $_POST['visit'] : null;
        $comments   = $_POST['comments']   !== '' ? $_POST['commnets'] : null;
        $version    = $_POST['version']    !== '' ? $_POST['version'] : null;

        $fileSize = $_FILES["file"]["size"];
        $fileName = $_FILES["file"]["name"];
        $fileType = end((explode(".", $fileName)));

        // __DIR__ is the document_repository ajax directory
        // when this script is executing. Go up a level to the
        // document_repository module directory, and use a
        // user_uploads directory as a base for user uploads
        $base_path = __DIR__ . "/../user_uploads/";
        $fileBase  = $puser . "/" . $fileName;

        if (!file_exists($base_path . $puser)) {
            mkdir($base_path . $puser, 0777);
        }


        $target_path = $base_path  . $fileBase;

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
            $success = $DB->insert(
                'document_repository',
                array(
                 'File_category' => $category,
                 'For_site'      => $site,
                 'comments'      => $comments,
                 'version'       => $version,
                 'File_name'     => $fileName,
                 'File_size'     => $fileSize,
                 'Data_dir'      => $fileBase,
                 'uploaded_by'   => $puser,
                 'Instrument'    => $instrument,
                 'PSCID'         => $pscid,
                 'visitLabel'    => $visit,
                 'File_type'     => $fileType,
                )
            );
            $msg_data['newDocument']
                = $baseURL . "/document_repository/";
            $msg_data['document']    = $fileName;

            $uploadNotifier->notify($msg_data);

            $header = "Location:".
                      " $baseURL/document_repository/?uploadSuccess=true";
            header($header);

        } else {
            echo "There was an error uploading the file";
        }
    } elseif ($action == 'edit') {
        $id         = $_POST['idEdit'];
        $category   = $_POST['categoryEdit'];
        $instrument = $_POST['instrumentEdit'];
        $site       = $_POST['siteEdit'];
        $pscid      = $_POST['pscidEdit'];
        $visit      = $_POST['visitEdit'];
        $comments   = $_POST['commentsEdit'];
        $version    = $_POST['versionEdit'];

        if (empty($category) && $category !== '0') {
            header("HTTP/1.1 400 Bad Request");
            exit;
        }

        $values = array(
                   'File_category' => $category,
                   'Instrument'    => $instrument,
                   'For_site'      => $site,
                   'PSCID'         => $pscid,
                   'visitLabel'    => $visit,
                   'comments'      => $comments,
                   'version'       => $version,
                  );
        $DB->update('document_repository', $values, array('record_id' => $id));

        $fileName = $DB->pselectOne(
            "select File_name from document_repository where record_id=:record_id",
            array('record_id' => $id)
        );
        $msg_data['updatedDocument'] = $baseURL . "/document_repository/";
        $msg_data['document']        = $fileName;

        $editNotifier->notify($msg_data);
    }
}

?>
