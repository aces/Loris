<?php
/**
 * Created by PhpStorm.
 * User: Alister
 * Date: 2016-06-16
 * Time: 3:08 PM
 */


if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "getVideoData") {
        echo json_encode(getUploadFields());
    } else if ($action == "upload") {
        uploadVideo();
    }
}

/**
 * Handles the video upload process
 *
 * @throws DatabaseException
 */
function uploadVideo()
{
    $user =& User::singleton();
    $db =& Database::singleton();
    $config = NDB_Config::singleton();

    // Get videos path
    $videosPath  = $config->getSetting('paths')['videosPath'];
    if (!isset($videosPath) && !file_exists($videosPath)) {
        echo "Error! Video path is not set in Loris Settings!";
        return;
    }
    // Make sure folder is writable
    chmod($videosPath, 0777);

    // Process posted data
    $pscid = $_POST['PSCID'];
    $visit = $_POST['visitLabel'];
    $site = $_POST['For_site'];
    $instrument = $_POST['Instrument'];
    $dateTaken = $_POST['dateTaken'];
    $comments = $_POST['comments'];

    $fileSize = $_FILES["file"]["size"];
    $fileName = $_FILES["file"]["name"];
    $fileType = $_FILES["file"]["type"];

    $userID = $user->getData('UserID');

    // Build insert query
    $query = [
        'PSCID'         => $pscid,
        'Instrument'    => $instrument,
        'visitLabel'    => $visit,
        'Date_taken'    => $dateTaken,
        'Date_uploaded' => date("Y-m-d H:i:s"),
        'File_type'     => $fileType,
        'Data_dir'      => $videosPath,
        'File_name'     => $fileName,
        'File_size'     => $fileSize,
        'uploaded_by'   => $userID,
        'For_site'      => $site,
        'comments'      => $comments,
        'hide_video'    => 0
    ];

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $videosPath . $fileName)) {
        $db->insert('videos', $query);
    } else {
        showError("Could not upload the file. Please try again!");
    }
}

/**
 * Returns a list of fields from database
 * @return array
 * @throws DatabaseExceptionr
 */
function getUploadFields()
{
    $db =& Database::singleton();

//    $dateOptions = [
//        'language'         => 'en',
//        'format'           => 'YMd',
//        'minYear'          => $config->getSetting('startYear'),
//        'maxYear'          => $config->getSetting('endYear'),
//        'addEmptyOption'   => true,
//        'emptyOptionValue' => null
//    ];

    $instruments = $db->pselect(
        "SELECT Test_name FROM test_names ORDER BY Test_name", []
    );
    $candidates = $db->pselect(
        "SELECT CandID, PSCID FROM candidate ORDER BY PSCID", []
    );

    $instrumentsList = toSelect($instruments, "Test_name");
    $candidatesList  = toSelect($candidates, "PSCID");
    $candIdList      = toSelect($candidates, "CandID", "PSCID");
    $visitList = Utility::getVisitList();
    $siteList = Utility::getSiteList(false);

    $result = [
        'candidates' => $candidatesList,
        'candIDs' => $candIdList,
        'visits' => $visitList,
        'instruments' => $instrumentsList,
        'sites' => $siteList
    ];

    return $result;
}

/**
 * Utility function to return errors from the server
 *
 * @param $message
 */
function showError($message)
{
    if (!isset($message)) {
        $message = 'An unknown error occured!';
    }
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(['message' => $message]));
}

/**
 * Utility function to convert data from database to a
 * (select) dropdown friendly format
 *
 * @param $options
 * @param $item
 * @param $item2
 *
 * @return array
 */
function toSelect($options, $item, $item2)
{
    $selectOptions = [];

    $optionsValue = $item;
    if (isset($item2)) { $optionsValue = $item2; }

    foreach ($options as $key => $value) {
        $selectOptions[$options[$key][$optionsValue]] = $options[$key][$item];
    }

    return $selectOptions;
}