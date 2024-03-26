<?php
/**
 * Media uploader.
 *
 * Handles media upload and update actions received from a front-end ajax call
 *
 * PHP Version 7
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
        viewData();
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
    $db   = \NDB_Factory::singleton()->database();
    $user =& User::singleton();
    if (!$user->hasPermission('media_write')) {
        showMediaError("Permission Denied", 403);
        exit;
    }

    // Read JSON from STDIN
    $stdin = file_get_contents('php://input');
    $req   = json_decode($stdin, true);
    if (!is_array($req)) {
        throw new Exception("Invalid JSON");
    }
    $idMediaFile = $req['idMediaFile'] ?? '';

    if (!$idMediaFile) {
        showMediaError("Media ID $idMediaFile not found", 404);
    }

    $dateTaken = $req['dateTaken'];
    checkDateTaken($dateTaken);

    $updateValues = [
        'date_taken'  => $dateTaken,
        'comments'    => $req['comments'],
        'language_id' => $req['language'],
        'hide_file'   => $req['hideFile'] ? $req['hideFile'] : 0,
    ];

    try {
        $db->update('media', $updateValues, ['id' => $idMediaFile]);
    } catch (DatabaseException $e) {
        showMediaError("Could not update the file. Please try again!", 500);
    }

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
    $uploadNotifier = new NDB_Notifier(
        "media",
        "upload"
    );

    $db     = \NDB_Factory::singleton()->database();
    $config = NDB_Config::singleton();
    $user   =& User::singleton();
    if (!$user->hasPermission('media_write')) {
        showMediaError("Permission Denied", 403);
        exit;
    }

    // Validate media path and destination folder
    $mediaPath = $config->getSetting('mediaPath');

    if (!isset($mediaPath)) {
        showMediaError(
            "Media path not set in LORIS settings! "
            . "Please contact your LORIS administrator",
            500
        );
    }

    if (!file_exists($mediaPath)) {
        showMediaError("Error! The upload folder '$mediaPath' does not exist!", 404);
    }

    // Process posted data
    $pscid      = isset($_POST['pscid']) ? $_POST['pscid'] : null;
    $visit      = isset($_POST['visitLabel']) ? $_POST['visitLabel'] : null;
    $instrument = isset($_POST['instrument']) ? $_POST['instrument'] : null;
    $dateTaken  = isset($_POST['dateTaken']) ? $_POST['dateTaken'] : null;
    $comments   = isset($_POST['comments']) ? $_POST['comments'] : null;
    $language   = isset($_POST['language']) ? $_POST['language'] : null;

    // If required fields are not set, show an error
    if (empty($_FILES)) {
        echo showMediaError(
            "File could not be uploaded successfully.
            Please contact the administrator.",
            400
        );
    }

    if (!isset($pscid, $visit)) {
        echo showMediaError("Please fill in all required fields!", 400);
        return;
    }

    checkDateTaken($dateTaken);

    $fileName = preg_replace('/\s/', '_', $_FILES["file"]["name"]);
    // urldecode() necessary to decode double quotes encoded automatically
    // by chrome browsers to avoid XSS attacks
    $fileName  = urldecode($fileName);
    $fileType  = $_FILES["file"]["type"];
    $extension = pathinfo($fileName, PATHINFO_EXTENSION);

    if (empty($extension)) {
        $response = showMediaError(
            "Please make sure your file has a valid extension!",
            400,
        );
        print $response;
        return;
    }

    $userID = $user->getUsername();

    $sessionID = $db->pselectOne(
        "SELECT s.ID as session_id FROM candidate c " .
        "LEFT JOIN session s USING(CandID) WHERE c.PSCID = :v_pscid AND " .
        "s.Visit_label = :v_visit_label",
        [
            'v_pscid'       => $pscid,
            'v_visit_label' => $visit,
        ]
    );

    if (!isset($sessionID) || strlen($sessionID) < 1) {
        echo showMediaError(
            "Error! A session does not exist for candidate '$pscid'' " .
            "and visit label '$visit'.",
            404
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
        'last_modified' => date("Y-m-d H:i:s"),
        'language_id'   => $language,
    ];

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $mediaPath . $fileName)) {
        try {
            // Insert or override db record if file_name already exists
            $db->unsafeInsertOnDuplicateUpdate('media', $query);
            $uploadNotifier->notify(["file" => $fileName]);
            $qparam = ['ID' => $sessionID];
            $result = $db->pselect(
                'SELECT ID, CandID, CenterID, ProjectID, Visit_label
                            from session
                        where ID=:ID',
                $qparam
            )[0];
            echo json_encode(
                [
                    'full_name'      => $fileName,
                    'pscid'          => $pscid,
                    'visit_label'    => $result['ProjectID'],
                    'language'       => $language,
                    'instrument'     => $instrument,
                    'site'           => $result['CenterID'],
                    'project'        => $result['ProjectID'],
                    'uploaded_by'    => $userID,
                    'date_taken'     => $dateTaken,
                    'comments'       => $comments,
                    'last_modified'  => date("Y-m-d H:i:s"),
                    'file_type'      => $fileType,
                    'CandID'         => $result['CandID'],
                    'SessionID'      => $sessionID,
                    'fileVisibility' => 0,
                ]
            );
        } catch (DatabaseException $e) {
            echo showMediaError("Could not upload the file. Please try again!", 500);
        }
    } else {
        echo showMediaError("Could not upload the file. Please try again!", 500);
    }
}

/**
 * Handles the media view data process
 *
 * @return void
 */
function viewData()
{
    $user =& User::singleton();
    if (!$user->hasPermission('media_read')) {
        echo showMediaError("Permission denied", 403);
        return;
    }
    echo json_encode(getUploadFields());
}

/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseException
 */
function getUploadFields()
{

    $db     = \NDB_Factory::singleton()->database();
    $user   = \User::singleton();
    $config = \NDB_Config::singleton();

    $lorisinstance = new \LORIS\LorisInstance(
        $db,
        $config,
        [
            __DIR__ . "/../../../project/modules",
            __DIR__ . "/../../",
        ],
    );

    // Select only candidates that have had visit at user's sites
    $qparam       = [];
    $sessionQuery = "SELECT
                      c.PSCID, s.Visit_label, s.CenterID, f.Test_name, tn.Full_name
                     FROM candidate c
                      LEFT JOIN session s USING (CandID)
                      LEFT JOIN flag f ON (s.ID=f.SessionID)
                      LEFT JOIN test_names tn ON (f.Test_name=tn.Test_name)";

    if (!$user->hasPermission('access_all_profiles')) {
        $sessionQuery .= " WHERE FIND_IN_SET(s.CenterID, :cid) ORDER BY c.PSCID ASC";
        $qparam['cid'] = implode(",", $user->getCenterIDs());
    } else {
        $sessionQuery .= " ORDER BY c.PSCID ASC";
    }
    $sessionRecords = $db->pselect(
        $sessionQuery,
        $qparam
    );

    $instrumentsList = toSelect($sessionRecords, "Test_name", null);
    $candidatesList  = toSelect($sessionRecords, "PSCID", null);
    $visitList       = Utility::getVisitList();
    $languageList    = Utility::getLanguageList();
    $startYear       = $config->getSetting('startYear');
    $endYear         = $config->getSetting('endYear');

    $allInstruments = \NDB_BVL_Instrument::getInstrumentNamesList($lorisinstance);

    // Build array of session data to be used in upload media dropdowns
    $sessionData = [];
    foreach ($sessionRecords as $record) {
        // Populate visits
        if (!isset($sessionData[$record["PSCID"]]['visits'])) {
            $sessionData[$record["PSCID"]]['visits'] = [];
        }
        if ($record["Visit_label"] !== null && !in_array(
            $record["Visit_label"],
            $sessionData[$record["PSCID"]]['visits'],
            true
        )
        ) {
            $sessionData[$record["PSCID"]]['visits'][$record["Visit_label"]]
                = $record["Visit_label"];
        }

        // Populate instruments
        $visit = $record["Visit_label"];
        $pscid = $record["PSCID"];

        if (!isset($sessionData[$pscid]['instruments'][$visit])) {
            $sessionData[$pscid]['instruments'][$visit] = [];
        }
        if (!isset($sessionData[$pscid]['instruments']['all'])) {
            $sessionData[$pscid]['instruments']['all'] = [];
        }

        if ($record["Test_name"] !== null
            && !in_array(
                $record["Test_name"],
                $sessionData[$pscid]['instruments'][$visit] ?? [],
                true
            )
        ) {
            $testname       = $record["Test_name"];
            $instrumentName = $allInstruments[$testname] ?: $testname;

            $sessionData[$pscid]['instruments'][$visit][$testname]
                = $instrumentName;
            if (!in_array(
                $record["Test_name"],
                $sessionData[$pscid]['instruments']['all'],
                true
            )
            ) {
                $sessionData[$pscid]['instruments']['all'][$record["Test_name"]]
                    = $instrumentName;
            }
        }
    }

    // Build media data to be displayed when editing a media file
    $mediaData = null;
    if (isset($_GET['idMediaFile'])) {
        $idMediaFile = $_GET['idMediaFile'];
        $mediaData   = $db->pselectRow(
            "SELECT " .
            "m.session_id as sessionID, " .
            "c.PSCID as pscid, " .
            "Visit_label as visitLabel, " .
            "instrument, " .
            "CenterID as forSite, " .
            "date_taken as dateTaken, " .
            "comments, " .
            "file_name as fileName, " .
            "hide_file as hideFile, " .
            "language_id as language," .
            "m.id FROM media m LEFT JOIN session s ON m.session_id = s.ID 
                LEFT JOIN candidate c ON (c.CandID=s.CandID) " .
            "WHERE m.id = :mediaId",
            ['mediaId' => $idMediaFile]
        );
    }

    $result = [
        'candidates'  => $candidatesList,
        'visits'      => $visitList,
        'instruments' => $instrumentsList,
        'mediaData'   => $mediaData,
        'mediaFiles'  => array_values(getFilesList()),
        'sessionData' => $sessionData,
        'language'    => $languageList,
        'startYear'   => $startYear,
        'endYear'     => $endYear,
    ];

    return $result;
}

/**
 * Utility function to return errors from the server
 *
 * @param string $message error message to display
 * @param int    $code    The HTTP response code to
 *                        use with the message
 *
 * @return string
 */
function showMediaError($message, $code) : string
{
    if (!isset($message)) {
        $message = 'An unknown error occurred!';
    }
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    return json_encode(['message' => $message]);
}

/**
 * Utility function to convert data from database to a
 * (select) dropdown friendly format
 *
 * @param array   $options array of options
 * @param string  $item    key
 * @param ?string $item2   value
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

    foreach (array_keys($options) as $key) {
        $selectOptions[$options[$key][$optionsValue]] = $options[$key][$item];
    }

    return $selectOptions;
}

/**
 * Returns an array of (id, file_name) pairs from media table
 *
 * @return array
 * @throws DatabaseException
 */
function getFilesList()
{
    $db       = \NDB_Factory::singleton()->database();
    $fileList = $db->pselect("SELECT id, file_name FROM media", []);

    $mediaFiles = [];
    foreach ($fileList as $row) {
        $mediaFiles[$row['id']] = $row['file_name'];
    }

    return $mediaFiles;
}

/**
 * Checks that a date is not in the future.
 *
 * @param string $dateTaken The date (in YYYY-MM-DD
 *                          format) to check)
 *
 * @return void (but may terminate as a side-effect)
 */
function checkDateTaken($dateTaken)
{
    if (!empty($dateTaken)) {
        $date = date_create_from_format("Y-m-d", $dateTaken);
        if ($date === false) {
            echo showMediaError("Invalid date: $dateTaken", 400);
            return;
        }

        $now  = new DateTime();
        $diff = intval(date_diff($date, $now)->format("%R%a"));
        if ($diff < 0) {
            echo showMediaError(
                "Date of administration cannot be in the future",
                400,
            );
        }
    }
}
