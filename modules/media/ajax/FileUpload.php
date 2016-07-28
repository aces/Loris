<?php
/**
 * Media uploader.
 *
 * Handles media upload and update actions received from a front-end ajax call
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Alex I. <ailea.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "getData") {
        echo json_encode(getUploadFields());
    } else if ($action == "upload") {
        uploadFile();
    } else if ($action == "edit") {
        editFile();
    }
}

/**
 * Handles the media update/edit process
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editFile()
{
    $db   =& Database::singleton();
    $user =& User::singleton();
    if (!$user->hasPermission('media_write')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    // Process posted data
    $idMediaFile = $_POST['idMediaFile'];
    $dateTaken   = isset($_POST['date_taken']) ? $_POST['date_taken'] : null;
    $comments    = isset($_POST['comments']) ? $_POST['comments'] : null;
    $hideFile    = $_POST['hide_file'];

    $updateValues = [
                     'date_taken' => $dateTaken,
                     'comments'   => $comments,
                     'hide_file'  => $hideFile,
                    ];

    $db->update('media', $updateValues, ['id' => $idMediaFile]);
}


/**
 * Handles the media upload process
 *
 * @throws DatabaseException
 *
 * @return void
 */
function uploadFile()
{
    $db     =& Database::singleton();
    $config = NDB_Config::singleton();
    $user   =& User::singleton();
    if (!$user->hasPermission('media_write')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    // Validate media path and destination folder
    $mediaPath = $config->getSetting('paths')['mediaPath'];

    if (!isset($mediaPath)) {
        showError("Error! Media path is not set in Loris Settings!");
        exit;
    }

    if (!file_exists($mediaPath)) {
        showError("Error! The upload folder '$mediaPath' does not exist!");
        exit;
    }

    // Make sure folder is writable
    chmod($mediaPath, 0777);

    // Process posted data
    $pscid      = isset($_POST['pscid']) ? $_POST['pscid'] : null;
    $visit      = isset($_POST['visit_label']) ? $_POST['visit_label'] : null;
    $instrument = isset($_POST['instrument']) ? $_POST['instrument'] : null;
    $site       = isset($_POST['for_site']) ? $_POST['for_site'] : null;
    $dateTaken  = isset($_POST['date_taken']) ? $_POST['date_taken'] : null;
    $comments   = isset($_POST['comments']) ? $_POST['comments'] : null;

    // If required fields are not set, show an error
    if (!isset($_FILES) || !isset($pscid) || !isset($visit) || !isset($site)) {
        showError("Please fill in all required fields!");

        return;
    }

    $fileName = $_FILES["file"]["name"];
    $fileType = $_FILES["file"]["type"];

    $userID = $user->getData('UserID');

    $sessionID = $db->pselectOne(
        "SELECT s.ID as session_id FROM candidate c " .
        "LEFT JOIN session s USING(CandID) WHERE c.PSCID = :v_pscid AND " .
        "s.Visit_label = :v_visit_label AND s.CenterID = :v_center_id",
        [
         'v_pscid'       => $pscid,
         'v_visit_label' => $visit,
         'v_center_id'   => $site,
        ]
    );

    if (!isset($sessionID) || count($sessionID) < 1) {
        showError(
            "Error! A session does not exist for candidate '$pscid'' " .
            "and visit label '$visit'."
        );

        return;
    }

    // Build insert query
    $query = [
              'session_id'    => $sessionID,
              'instrument'    => $instrument,
              'date_taken'    => $dateTaken,
              'comments'      => $comments,
              'file_name'     => $fileName,
              'file_type'     => $fileType,
              'data_dir'      => $mediaPath,
              'uploaded_by'   => $userID,
              'hide_file'     => 0,
              'date_uploaded' => date("Y-m-d H:i:s"),
             ];

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $mediaPath . $fileName)) {
        $db->insert('media', $query);
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
        "SELECT Test_name FROM test_names ORDER BY Test_name",
        []
    );
    $candidates  = $db->pselect(
        "SELECT CandID, PSCID FROM candidate ORDER BY PSCID",
        []
    );

    $instrumentsList = toSelect($instruments, "Test_name", null);
    $candidatesList  = toSelect($candidates, "PSCID", null);
    $candIdList      = toSelect($candidates, "CandID", "PSCID");
    $visitList       = Utility::getVisitList();
    $siteList        = Utility::getSiteList(false);

    // Build array of session data to be used in upload media dropdowns
    $sessionData    = [];
    $sessionRecords = $db->pselect(
        "SELECT c.PSCID, s.Visit_label, s.CenterID " .
        "FROM candidate c LEFT JOIN session s USING(CandID) ORDER BY c.PSCID ASC",
        []
    );

    foreach ($sessionRecords as $record) {
        if (!in_array(
            $record["CenterID"],
            $sessionData[$record["PSCID"]]['sites'],
            true
        )
        ) {
            $sessionData[$record["PSCID"]]['sites'][$record["CenterID"]]
                = $siteList[$record["CenterID"]];
        }

        if (!in_array(
            $record["Visit_label"],
            $sessionData[$record["PSCID"]]['visits'],
            true
        )
        ) {
            $sessionData[$record["PSCID"]]['visits'][$record["Visit_label"]]
                = $record["Visit_label"];
        }
    }

    // Build media data to be displayed when editing a media file
    $mediaData = null;
    if (isset($_GET['idMediaFile'])) {
        $idMediaFile = $_GET['idMediaFile'];
        $mediaData   = $db->pselectRow(
            "SELECT " .
            "m.session_id, " .
            "(SELECT PSCID from candidate WHERE CandID=s.CandID) as pscid, " .
            "Visit_label as visit_label, " .
            "instrument, " .
            "CenterID as for_site, " .
            "date_taken, " .
            "comments, " .
            "file_name, " .
            "hide_file, " .
            "m.id FROM media m LEFT JOIN session s ON m.session_id = s.ID " .
            "WHERE m.id = $idMediaFile",
            []
        );
    }

    $result = [
               'candidates'  => $candidatesList,
               'candIDs'     => $candIdList,
               'visits'      => $visitList,
               'instruments' => $instrumentsList,
               'sites'       => $siteList,
               'mediaData'   => $mediaData,
               'sessionData' => $sessionData,
              ];

    return $result;
}

/**
 * Utility function to return errors from the server
 *
 * @param string $message error message to display
 *
 * @return void
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
 * @param array  $options array of options
 * @param string $item    key
 * @param string $item2   value
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