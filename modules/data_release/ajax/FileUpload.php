<?php

/**
 * Upload files, wow.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Data_Release
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

$factory = \NDB_Factory::singleton();
$DB      = $factory->database();
$user    = $factory->user();
$config  = $factory->config();

if (!$user->hasPermission('data_release_upload')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

if (!file_exists(__DIR__ . "/../user_uploads/")) {
    error_log(
        "ERROR: File upload failed. Default user_uploads"
        . " directory not found."
    );
    header("HTTP/1.1 500 Internal Server Error");
    exit;
} elseif (!is_writable(__DIR__ . "/../user_uploads/")) {
    error_log(
        "File upload failed. Default user_uploads directory"
        . " does not appear to be writeable."
    );
    header("HTTP/1.1 500 Internal Server Error");
    exit;
}

if ($_GET['action'] == 'upload') {
    $fileName    = $_FILES["file"]["name"];
    $version     = !empty($_POST['version']) ? $_POST['version'] : null;
    $upload_date = date('Y-m-d');

    $settings = $factory->settings();

    $baseURL = $settings->getBaseURL();
    $path    = \Utility::appendForwardSlash($config->getSetting('dataReleasePath'));

    if (!file_exists($path)) {
        error_log(
            "ERROR: File upload failed. Upload"
            . " directory not found."
        );
        header("HTTP/1.1 500 Internal Server Error");
    } elseif (!is_writable($path)) {
        error_log(
            "File upload failed. Upload directory"
            . " does not appear to be writeable."
        );
        header("HTTP/1.1 500 Internal Server Error");
    } else {
        $target_path = $path . $fileName;
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
            $DB->insert(
                'data_release',
                array(
                    'file_name' => $fileName,
                    'version' => $version,
                    'upload_date' => $upload_date,
                )
            );

            // insert the file into the data_release table
            $DB->insert(
                'data_release',
                array(
                    'file_name' => $fileName,
                    'version' => $version,
                    'upload_date' => $upload_date,
                )
            );
            // get the ID of the user who uploaded the file
            $user_ID = $DB->pselectOne(
                "SELECT ID FROM users WHERE userid=:UserID",
                array('UserID' => $user->getUsername())
            );
            // get the ID of the file inserted in the data_release table
            $version_where = $version ? "version=:version" : "version IS :version";
            $ID = $DB->pselectOne(
                "SELECT 
               id 
             FROM 
               data_release 
             WHERE 
               file_name=:file_name 
               AND $version_where
               AND upload_date=:upload_date",
                array(
                    'file_name'   => $fileName,
                    'version'     => $version,
                    'upload_date' => $upload_date,
                )
            );
            // add permission to the user for the uploaded data_release file
            $DB->insert(
                'data_release_permissions',
                array(
                    'userid'          => $user_ID,
                    'data_release_id' => $ID,
                )
            );
        }
        header("Location: {$baseURL}/data_release/?uploadSuccess=true");
        header("HTTP/1.1 201 Created");
    }

} elseif ($_GET['action'] == 'getData') {
    $filesList = $DB->pselect(
        "SELECT id, file_name FROM data_release",
        array()
    );

    $dataReleaseFiles = array();
    foreach ($filesList as $row) {
        $dataReleaseFiles[$row['id']] = $row['file_name'];
    }

    $results = [
        'files' => array_values($dataReleaseFiles),
    ];

    echo json_encode($results);

} else {
    header("HTTP/1.1 400 Bad Request");
    echo "There was an error uploading the file";
}

