<?php
/**
 * VideoUpload.php
 *
 * Handles video upload and update actions received from a front-end ajax call
 *
 * @author  Alex I.
 * @version 1.0.0
 */

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "getVideoData") {
        echo json_encode(getUploadFields());
    } else if ($action == "upload") {
        uploadVideo();
    } else if ($action == "edit") {
        editVideo();
    }
}


/**
 * Handles the video update/edit process
 *
 * @throws DatabaseException
 */
function editVideo()
{
    $db =& Database::singleton();

    // Process posted data
    $idVideo = $_POST['idVideo'];
    $site = $_POST['for_site'];
    $dateTaken = $_POST['date_taken'];
    $comments = $_POST['comments'];
    $hideVideo = $_POST['hide_video'];

    $updateValues = [
        'for_site'   => $site,
        'date_taken' => $dateTaken,
        'comments'   => $comments,
        'hide_video' => $hideVideo
    ];

    $db->update('videos', $updateValues, ['id' => $idVideo]);
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
    $videosPath = $config->getSetting('paths')['videosPath'];
    if (!isset($videosPath) && !file_exists($videosPath)) {
        echo "Error! Video path is not set in Loris Settings!";

        return;
    }
    // Make sure folder is writable
    chmod($videosPath, 0777);

    // Process posted data
    $pscid = isset($_POST['pscid']) ? $_POST['pscid'] : null;
    $visit = isset($_POST['visit_label']) ? $_POST['visit_label'] : null;
    $instrument = isset($_POST['instrument']) ? $_POST['instrument'] : null;
    $site = isset($_POST['for_site']) ? $_POST['for_site'] : null;
    $dateTaken = isset($_POST['date_taken']) ? $_POST['date_taken'] : null;
    $comments = isset($_POST['comments']) ? $_POST['comments'] : null;

    // If required fields are not set, show an error
    if (!isset($_FILES) || !isset($pscid) || !isset($visit)) {
        showError("Please fill in all required fields!");

        return;
    }

    $fileSize = $_FILES["file"]["size"];
    $fileName = $_FILES["file"]["name"];
    $fileType = $_FILES["file"]["type"];

    $userID = $user->getData('UserID');

    // Build insert query
    $query = [
        'pscid'         => $pscid,
        'visit_label'   => $visit,
        'instrument'    => $instrument,
        'for_site'      => $site,
        'date_taken'    => $dateTaken,
        'comments'      => $comments,
        'file_name'     => $fileName,
        'file_type'     => $fileType,
        'file_size'     => $fileSize,
        'data_dir'      => $videosPath,
        'uploaded_by'   => $userID,
        'hide_video'    => 0,
        'date_uploaded' => date("Y-m-d H:i:s"),
    ];

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $videosPath . $fileName)) {
        $db->insert('videos', $query);
    } else {
        showError("Could not upload the file. Please try again!");
    }
}

/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseExceptionr
 */
function getUploadFields()
{

    $db =& Database::singleton();

    $instruments = $db->pselect(
        "SELECT Test_name FROM test_names ORDER BY Test_name", []
    );
    $candidates = $db->pselect(
        "SELECT CandID, PSCID FROM candidate ORDER BY PSCID", []
    );

    $instrumentsList = toSelect($instruments, "Test_name", null);
    $candidatesList = toSelect($candidates, "PSCID", null);
    $candIdList = toSelect($candidates, "CandID", "PSCID");
    $visitList = Utility::getVisitList();
    $siteList = Utility::getSiteList(false);

    $videoData = null;
    if (isset($_GET['idVideo'])) {
        $idVideo = $_GET['idVideo'];
        $videoData = $db->pselectRow(
            "SELECT * FROM videos WHERE id = $idVideo", []
        );
    }

    $result = [
        'candidates'  => $candidatesList,
        'candIDs'     => $candIdList,
        'visits'      => $visitList,
        'instruments' => $instrumentsList,
        'sites'       => $siteList,
        'videoData'   => $videoData
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
    if (isset($item2)) {
        $optionsValue = $item2;
    }

    foreach ($options as $key => $value) {
        $selectOptions[$options[$key][$optionsValue]] = $options[$key][$item];
    }

    return $selectOptions;
}