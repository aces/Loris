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
        viewData();
    } else if ($action == "upload") {
        uploadFile();
    } else if ($action == "edit") {
        editFile();
    } else if ($action == "getCategory") {
        viewCategory();
    } else if ($action == "uploadCategory") {
        uploadCategory();
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

    // Read JSON from STDIN
    $stdin       = file_get_contents('php://input');
    $req         = json_decode($stdin, true);
    $idDocFile = $req['idDocFile'];

    if (!$idDocFile) {
        showError("Error! Invalid doc file ID!");
    }

    $updateValues = [
                     'File_category' => $req['category'],
                     'For_site'      => $req['forSite'],
                     'Instrument'    => $req['instrument'],
                     'comments'      => $req['comments'],
                     'version'       => $req['version'],
                     'visitLabel'    => $req['visitLabel'],
                     'pscid'         => $req['pscid'],
                    ];

    try {
        $db->update('document_repository', $updateValues, ['record_id' => $idDocFile]);
    } catch (DatabaseException $e) {
        showError("Could not update the file. Please try again!");
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
$editNotifier = new NDB_Notifier(
    "document_repository",
    "edit"
);
$uploadNotifier = new NDB_Notifier(
    "document_repository",
    "upload"
);
$userSingleton =& \User::singleton();
if (!$userSingleton->hasPermission('document_repository_view')
    && !$userSingleton->hasPermission('document_repository_delete')
) {
    http_response_code(403);
    exit;
}

$factory = \NDB_Factory::singleton();
$baseURL = $factory->settings()->getBaseURL();
$config = $factory->config();
$base   = $config->getSetting('base');
$name   = $userSingleton->getUsername();
$DB = $factory->database();



//if user has document repository permission
//if ($userSingleton->hasPermission('document_repository_view')
//    || $userSingleton->hasPermission('document_repository_delete')
//) {
        $category   = $_POST['category']; // required
        $site       = $_POST['forSite']       !== '' ? $_POST['forSite'] : null;
        $instrument = $_POST['instrument'] !== '' ? $_POST['instrument'] : null;
        $pscid      = $_POST['pscid']      !== '' ? $_POST['pscid'] : null;
        $visit      = $_POST['visitLabel']      !== '' ? $_POST['visitLabel'] : null;
        $comments   = $_POST['comments']   !== '' ? $_POST['comments'] : null;
        $version    = $_POST['version']    !== '' ? $_POST['version'] : null;
        $fileSize = $_FILES["file"]["size"];
        $fileName = $_FILES["file"]["name"];
        $fileType = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        $uploadPath = "$base/modules/document_repository/user_uploads/$name/";
        $fullPath   = $uploadPath . $fileName;
        // $category is a string representation of an ID, and so should be at
        // least equal to zero.
        if (intval($category) < 0) {
            throw new LorisException(
                "'Category' parameter must be a positive integer."
            );
        }
        // Check to see if $fullPath is writable. If not, throw an error. If it
        // doesn't exist, create an uploads folder for the logged-in user.
        if (!is_writable($fullPath)) {
            if (file_exists($fullPath)) {
                throw new LorisException(
                    "User uploads path in Document Repository is not writable."
                );
            }
            mkdir($fullPath, 0770);
        }
        // Copy the uploaded file to the user's upload folder if possible.
        // Insert a record of the file into the document_repository table
        if (!move_uploaded_file(
            $_FILES['file']['tmp_name'],
            $fullPath . $fileName
        )) {
            throw new LorisException(
                'ERROR: Could not upload file. Contact your administrator.'
            );
        } else {
            $success = $DB->insert(
                'document_repository',
                array(
                 'File_category' => $category,
                 'For_site'      => $site,
                 'comments'      => $comments,
                 'version'       => $version,
                 'File_name'     => $fileName,
                 'File_size'     => $fileSize,
                 'Data_dir'      => "$name/$fileName", // e.g. 'admin/file.png'
                 'uploaded_by'   => $name,
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
            http_response_code(303);
            header('Location:' . $baseURL . '/document_repository/');
        }
}

function uploadCategory()
{
    $DB =& Database::singleton();
        $category_name   = $_POST['category_name']; // required
        $parent_id  = $_POST['parent_id']  !== '' ? $_POST['parent_id'] : null;
        $comment    = $_POST['comments']    !== '' ? $_POST['comments'] : null;
    $DB->insert(
        "document_repository_categories",
        array(
         "category_name" => $category_name,
         "parent_id"     => $parent_id,
         "comments"      => $comments,
        )
    );
}
function viewCategory()
{
    $user =& User::singleton();
    if (!$user->hasPermission('document_repository_view')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }
    echo json_encode(getCategoryFields());   
}
/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseException
 */
function getCategoryFields()
{
    $db =& Database::singleton();
$query = $db->pselect(
    "SELECT * FROM document_repository_categories",
    array()
);
//categories
$categoriesList = array();

foreach ($query as $value) {
       $arr = parseCategory($value);
       $categoriesList[$arr['id']]=$arr['name'];
}

    $result = [
               'categories'  => $categoriesList,
              ];

    return $result;
}

function viewData()
{
    $user =& User::singleton();
    if (!$user->hasPermission('document_repository_view')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
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

    $db =& Database::singleton();
$query = $db->pselect(
    "SELECT * FROM document_repository_categories",
    array()
);
//categories
$categoriesList = array();

foreach ($query as $value) {
       $arr = parseCategory($value);
       $categoriesList[$arr['id']]=$arr['name'];
}
//site
$siteList        = Utility::getSiteList(false);
//instrument

    $instruments = $db->pselect(
        "SELECT Test_name FROM test_names ORDER BY Test_name",
        []
    );
 $instrumentsList = toSelect($instruments, "Test_name", null);
//docFile
    $docData = null;
    if (isset($_GET['idDocFile'])) {
        $idDocFile = $_GET['idDocFile'];
        $docData   = $db->pselectRow(
            "SELECT " .
            "record_id as id, " .
            "PSCID as pscid, " .
            "File_category as category," .
            "visitLabel, " .
            "Instrument as instrument, " .
            "For_site as forSite, " .
            "comments, " .
            "File_Name as fileName, " .
            "version " .
            "FROM document_repository " .
            " WHERE record_id = $idDocFile",
            []
        );
    }





    $result = [
               'categories'  => $categoriesList,
               'sites'       => $siteList,
               'instruments' => $instrumentsList,
               'docData'   => $docData,
              ];

    return $result;
}
function parseCategory($value)
    {
        $id = $value['id'];
        $depth = 0;
        $DB    = \Database::singleton();
            $categoryName = $value['category_name'];
        do {
            if ($value['parent_id'] != 0) {
                $depth       += 1;
                $parent_id    = $value['parent_id'];
                $query        = "SELECT * FROM document_repository_categories".
                                " where id=$parent_id";
                $value        = $DB->pselectRow($query, array());
                $categoryName = $value['category_name'] . ">" . $categoryName;
            }
        } while ($value['parent_id'] != 0);
//try to return array{{name:"ddd",id:'1'}{}}
//        return $categoryName;
//          return $id;
         return array("name"=>$categoryName,"id"=>$id);
    }

/**
 * Utility function to return errors from the server
 *
 * @param string $message error message to display
 *
 * @return void
 */
function showMediaError($message)
{
    if (!isset($message)) {
        $message = 'An unknown error occurred!';
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

/**
 * Returns an array of (id, file_name) pairs from media table
 *
 * @return array
 * @throws DatabaseException
 */
function getFilesList()
{
    $db       =& Database::singleton();
    $fileList = $db->pselect("SELECT id, file_name FROM media", []);

    $mediaFiles = [];
    foreach ($fileList as $row) {
        $mediaFiles[$row['id']] = $row['file_name'];
    }

    return $mediaFiles;
}

