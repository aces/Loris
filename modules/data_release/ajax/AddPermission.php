<?php

/**
 * Add permissions through Ajax, how crazy.
 *
 * PHP Version 7
 *
 * @todo use the 'addpermissionSuccess' flag for front-end enhancements
 *
 * @category Loris
 * @package  Data_Release
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

$user     = \User::singleton();
$DB       = \Database::singleton();
$factory  = \NDB_Factory::singleton();
$settings = $factory->settings();
$baseURL  = $settings->getBaseURL();

if (!isset($_GET['action'])) {
    http_response_code(400);
    exit;
}

if (!$user->hasPermission('data_release_edit_file_access')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}


if ($_GET['action'] == 'addpermission') {

    if (!isset($_POST) || empty($_POST)) {
        $message = "No data was sent in the POST request";
        http_response_code(400);
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(['message' => $message]));
    }

    if (!empty($_POST['data_release_id']) && empty($_POST['data_release_version'])) {
        $userid          = $_POST['userid'];
        $data_release_id = $_POST['data_release_id'];
        $DB->insertIgnore(
            'data_release_permissions',
            array(
                'userid'          => $userid,
                'data_release_id' => $data_release_id,
            )
        );

    } elseif (empty($_POST['data_release_id'])
        && !empty($_POST['data_release_version'])
    ) {
        $userid = $_POST['userid'];
        $data_release_version = $_POST['data_release_version'] == 'Unversioned'
                                ? '' : $_POST['data_release_version'];
        $query  = "SELECT id FROM data_release WHERE ";
        $query .= $data_release_version == ''
                  ? "version IS NULL OR version=:drv" : "version=:drv";
        $IDs    = $DB->pselectCol(
            $query,
            array(':drv' => $data_release_version)
        );
        foreach ($IDs as $ID) {
            $DB->insertIgnore(
                'data_release_permissions',
                array(
                    'userid'          => $userid,
                    'data_release_id' => $ID,
                )
            );
        }
    }
    //addpermissionSuccess=true/false
    //does not currently do anything on the front-end
    //just a placeholder displaying if the operation succeeded or not
    header("Location: {$baseURL}/data_release/?addpermissionSuccess=true");
} elseif ($_GET['action'] == 'managepermissions') {
    // It is important here to not truncate all current permissions and rebuild
    // them but instead to only make modifications to specifically altered
    // permissions from the front end by the user. Otherwise, if a user has
    // access to SOME files for a version, the checkbox would not be checked and
    // on update the user will loose access to ALL files for that release.

    $data = json_decode($_POST['data'], true);
    if (!isset($data) || empty($data)) {
        $message = "No data was sent in the POST request";
        http_response_code(400);
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(['message' => $message]));
    }

    // Get old permission list before any changes from main class
    $dataRelease = new LORIS\data_release\data_release(
        \Module::factory('data_release'),
        '',
        '',
        '',
    );

    $versionFiles = $dataRelease->getVersionFiles($DB);
    $userVersionFiles = $dataRelease->getUserVersionFiles($DB);

    foreach($data as $userId => $user) {
        $added = array_diff(
            $user['versions'],
            $userVersionFiles[$userId]['versions']
        );
        $removed = array_diff(
            $userVersionFiles[$userId]['versions'],
            $user['versions']
        );


        foreach($added as $version) {
            foreach($versionFiles[$version] as $fileId) {
                $DB->insertOnDuplicateUpdate(
                    'data_release_permissions',
                    array(
                        'userid' => $userId,
                        'data_release_id' => $fileId,
                    )
                );
            }
        } 

        foreach($removed as $version) {
            foreach($versionFiles[$version] as $fileId) {
                $DB->delete(
                    'data_release_permissions',
                    array(
                        'userid' => $userId,
                        'data_release_id' => $fileId,
                    )
                );
            }
        } 
    }

    //addpermissionSuccess=true/false
    //does not currently do anything on the front-end
    //just a placeholder displaying if the operation succeeded or not
    header("Location: {$baseURL}/data_release/?addpermissionSuccess=true");
} elseif ($_GET['action'] == 'getPermissions') {
    getManagePermissionsData();
} else {
    header("HTTP/1.1 400 Bad Request");
    echo "There was an error adding permissions";
}

/**
 * Gets the data for the manage permission modal window.
 *
 * @return void
 */
function getManagePermissionsData(): void
{
    // Get permission list before any changes from main class
    $dataRelease = new LORIS\data_release\data_release(
        \Module::factory('data_release'),
        '',
        '',
        '',
        ''
    );

    $db = \Database::singleton();

    echo json_encode($dataRelease->getUserVersionFiles($db));
}
