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

// Setup Database object.
$config    =& \NDB_Config::singleton();
$db_config = $config->getSetting('database');
$db        = \Database::singleton(
    $db_config['database'],
    $db_config['quatUser'],
    $db_config['quatPassword'],
    $db_config['host']
);

if ($db->isConnected()) {
    echo "successfully connected";
} else {
    echo "not connected";
}

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
        $comments   = $_POST['comments']   !== '' ? $_POST['comments'] : null;

        $fileSize = $_FILES["file"]["size"];
        $fileName = $_FILES["file"]["name"];
        $fileType = end(explode(".", $fileName));

        $sql_statement = $db->prepare(
            "SELECT File_name, version FROM document_repository "
            ."WHERE File_name=? AND uploaded_by=?"
        );
        $sql_statement->bindParam(1, $fileName, PDO::PARAM_STR);
        $sql_statement->bindParam(2, $puser, PDO::PARAM_STR);
        $sql_statement->execute();
        $sql_result = $sql_statement->fetchAll(PDO::FETCH_ASSOC);

        $version = versionInspectionGenerator($_POST['version'] ?? '', $sql_result);

        $version_underscore = str_replace(".", "_", $version);

        // __DIR__ is the document_repository ajax directory
        // when this script is executing. Go up a level to the
        // document_repository module directory, and use a
        // user_uploads directory as a base for user uploads
        $base_path = __DIR__ . "/../user_uploads/";
        $fileBase  = $puser . "/" . $version_underscore . "/" . $fileName;

        if (!file_exists($base_path . $puser)) {
            mkdir($base_path . $puser, 0777);
        }

        if (!file_exists($base_path . $puser . "/" . $version_underscore)) {
            mkdir($base_path . $puser . "/" . $version_underscore, 0777);
        }

        $target_path = $base_path . $fileBase;

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
            $success = $db->insert(
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
                 'version'       => $version,
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
        $db->update('document_repository', $values, array('record_id' => $id));

        $fileName = $db->pselectOne(
            "select File_name from document_repository where record_id=:record_id",
            array('record_id' => $id)
        );
        $msg_data['updatedDocument'] = $baseURL . "/document_repository/";
        $msg_data['document']        = $fileName;

        $editNotifier->notify($msg_data);
    }
}

/**
 * Handles the version inspection process.
 * Generates correct proceeding version in some cases.
 *
 * @param string $version the version to use for uploading file.
 * @param array  $items   the array of existing files (name & version).
 *
 * @return string $version.
 */
function versionInspectionGenerator($version, $items)
{

    if (!preg_match('/^(\d+\.)(\d+\.)(\*|\d+)$/', $version)) {
        $version = '0.0.1';
    }

    $versions = array();
    foreach ($items as $item) {
        if (preg_match('/^(\d+\.)(\d+\.)(\*|\d+)$/', $item['version'])) {
            $versions[] = $item['version'];
        }
    }
    usort($versions, 'version_compare');

    if (in_array($version, $versions)) {
        // Version in array.
        $version = versionUpdate($versions[count($versions)-1], true);
    } else {
        // Version not in array.
        if (empty($versions)) {
            // No versions exist.
        } else {
            // Versions exist.
            if (version_compare($version, $versions[count($versions)-1], '>')) {
                // Version number is greater than greatest version existing.
            } else {
                // Version number is smaller than greatest version existing.
                $version = versionUpdate($versions[count($versions)-1], true);
            }
        }
    }

    return $version;
}

/**
 * Increment or Decrement the version "string" supplied.
 *
 * The $increment "bool" if true will increment the version.
 * and if false will decrement the version.
 *
 * @param string $version   the version to use for uploading file.
 * @param bool   $increment the bool to decide on increment or decrement.
 *
 * @return string $version
 */
function versionUpdate($version, $increment)
{
    $new_version = explode('.', $version);
    if ($increment) {
        $new_version[count($new_version)-1]++;
    } else {
        $new_version[count($new_version)-1]--;
    }
    return implode('.', $new_version);
}

?>
