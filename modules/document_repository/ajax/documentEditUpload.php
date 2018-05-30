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
    header('HTTP/1.1 403 Forbidden');
    exit;
}

set_include_path(
    get_include_path().
    ':../../project/libraries:../../php/libraries:'
);
require_once 'NDB_Client.class.inc';
require_once 'NDB_Config.class.inc';
require_once 'Email.class.inc';

$client = new NDB_Client();
$client->initialize('../../project/config.xml');

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

$editNotifier = new NDB_Notifier(
    'document_repository',
    'edit'
);

$uploadNotifier = new NDB_Notifier(
    'document_repository',
    'upload'
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
        $version    = $_POST['version']    !== '' ? $_POST['version'] : null;
        $uuid       = uuid4();

        $fileSize = $_FILES['file']['size'];
        $fileName = $_FILES['file']['name'];
        $fileType = '';
        // Handle retrieving the file type.
        if (preg_match('/\./', $fileName)) {
            $pos = strrpos($fileName, '.', -1);
            if ($pos+1 != strlen($fileName)) {
                $fileType = substr(
                    $fileName,
                    strrpos($fileName, '.', -1)+1
                );
            }
        }
        $sql_statement = $db->prepare(
            'SELECT File_name, version FROM document_repository '
            .'WHERE File_name=? AND uploaded_by=?'
        );
        $sql_statement->bindParam(1, $fileName, PDO::PARAM_STR);
        $sql_statement->bindParam(2, $puser, PDO::PARAM_STR);
        $sql_statement->execute();
        $sql_result = $sql_statement->fetchAll(PDO::FETCH_ASSOC);

        // __DIR__ is the document_repository ajax directory
        // when this script is executing. Go up a level to the
        // document_repository module directory, and use a
        // user_uploads directory as a base for user uploads
        $base_path = __DIR__ . '/../user_uploads/';
        $fileBase  = $puser . '/docs_repo/'
            . $fileName
            . '/' . $uuid
            . '/' . $fileName;

        // Create user directory /base_path/user
        if (!file_exists($base_path . $puser)) {
            mkdir($base_path . $puser, 0777);
        }
        // Create user directory /base_path/user/docs_repo
        if (!file_exists($base_path . $puser . '/docs_repo')) {
            mkdir($base_path . $puser . '/docs_repo', 0777);
        }
        // Create filename directory /base_path/user/docs_repo/fileName
        if (!file_exists($base_path . $puser . '/docs_repo/' . $fileName)) {
            mkdir($base_path . $puser . '/docs_repo/' . $fileName, 0777);
        }
        // Create uuid directory /base_path/user/docs_repo/fileName/uuid
        if (!file_exists($base_path . $puser . '/docs_repo/' . $fileName . '/' . $uuid)) {
            mkdir($base_path . $puser . '/docs_repo/' . $fileName . '/' . $uuid, 0777);
        }

        $target_path = $base_path . $fileBase;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
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
                 'uuid'          => $uuid,
                )
            );
            $msg_data['newDocument'] = $baseURL . '/document_repository/';
            $msg_data['document']    = $fileName;

            $uploadNotifier->notify($msg_data);

            $header = 'Location: '.$baseURL
                .'/document_repository/?uploadSuccess=true';
            header($header);
        } else {
            echo 'There was an error uploading the file';
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
            header('HTTP/1.1 400 Bad Request');
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
            'SELECT File_name FROM document_repository WHERE record_id=:record_id',
            array('record_id' => $id)
        );
        $msg_data['updatedDocument'] = $baseURL . '/document_repository/';
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

/**
 * Create a UUID v4 string.
 *
 * Source from comments:
 * http://php.net/manual/en/function.com-create-guid.php
 * Maybe move to Utilities class.
 *
 * @return string $version
 */
function uuid4()
{
    if (function_exists('com_create_guid') === true) {
        // Windows Server
        return trim(com_create_guid(), '{}');
    }
    // Linux Server
    $data    = openssl_random_pseudo_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

?>
