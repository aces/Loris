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

$DB =& Database::singleton();
if ($_POST['action'] == 'upload') {
    $fileName    = $_FILES["file"]["name"];
    $version     = $_POST['version'];
    $upload_date = date('Y-m-d');
    $base_path   = __DIR__ . "/../user_uploads/";

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
    }
    header("Location: /data_release/?uploadSuccess=true");
} else {
    header("HTTP/1.1 400 Bad Request");
    echo "There was an error uploading the file";
}

?>
