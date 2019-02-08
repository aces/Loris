<?php

/**
  * Upload files, wow.
  *
  * PHP Version 5
  *
  *  @category Loris
  *  @package  Data_Release
  *  @author   Justin Kat <justinkat@gmail.com>
  *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  *  @link     https://github.com/aces/Loris
  */

$DB   = \Database::singleton();
$user = \User::singleton();

if ($_POST['action'] == 'upload'
    && $user->hasPermission("data_release_upload")
) {
    $fileName    = $_FILES["file"]["name"];
    $version     = $_POST['version'];
    $upload_date = date('Y-m-d');
    $base_path   = __DIR__ . "/../user_uploads/";

    $factory  = NDB_Factory::singleton();
    $settings = $factory->settings();

    $baseURL = $settings->getBaseURL();

    if (!file_exists(__DIR__ . "/../user_uploads/")) {
        error_log(
            "ERROR: File upload failed. Default user_uploads"
            . " directory not found."
        );
        header("HTTP/1.1 500 Internal Server Error");
    } elseif (!is_writable(__DIR__ . "/../user_uploads/")) {
        error_log(
            "File upload failed. Default user_uploads directory"
            . " does not appear to be writeable."
        );
        header("HTTP/1.1 500 Internal Server Error");
    } else {
        $target_path = $base_path . $fileName;
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
            $success = $DB->insert(
                'data_release',
                array(
                 'file_name'   => $fileName,
                 'version'     => $version,
                 'upload_date' => $upload_date,
                )
            );

            $user_ID = $DB->pselectOne(
                "SELECT ID FROM users WHERE userid=:UserID",
                array('UserID' => $user->getUsername())
            );
            $ID      = $DB->pselectOne(
                "SELECT id 
                        FROM data_release 
                        WHERE file_name=:file_name 
                            AND version=:version 
                            AND upload_date=:upload_date",
                array(
                 'file_name'   => $fileName,
                 'version'     => $version,
                 'upload_date' => $upload_date,
                )
            );
            $success = $DB->insert(
                'data_release_permissions',
                array(
                 'userid'          => $user_ID,
                 'data_release_id' => $ID,
                )
            );
        }
        header("Location: {$baseURL}/data_release/?uploadSuccess=true");
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo "There was an error uploading the file";
}

?>
