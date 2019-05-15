<?php

/**
 * Add permissions through Ajax, how crazy.
 *
 * PHP Version 7
 *
 *  @todo use the 'addpermissionSuccess' flag for front-end enhancements
 *
 *  @category Loris
 *  @package  Data_Release
 *  @author   Justin Kat <justinkat@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/aces/Loris
 */

$user     = \User::singleton();
$factory  = \NDB_Factory::singleton();
$settings = $factory->settings();
$baseURL  = $settings->getBaseURL();
$DB       = $factory->database();

if (isset($_POST['action']) && $_POST['action'] == 'addpermission'
    && $user->hasPermission('data_release_edit_file_access')
) {
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
        $data_release_version = $_POST['data_release_version'] == 'Unversioned' ? '' : $_POST['data_release_version'];

        $IDs = $DB->pselectCol(
            "SELECT id 
                    FROM data_release 
                    WHERE version=:drv",
            array('drv' => $data_release_version)
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
} elseif (isset($_POST['action']) && $_POST['action'] == 'managepermissions'
    && $user->hasPermission('data_release_edit_file_access')
) {
    // It is important here to not truncate all current permissions and rebuild
    // them but instead to only make modifications to specifically altered
    // permissions from the front end by the user. Otherwise, if a user has
    // access to SOME files for a version, the checkbox would not be checked and
    // on update the user will loose access to ALL files for that release.

    // Get permission list before any changes from main class
    $data_release   = new LORIS\data_release\data_release(
        \Module::factory('data_release'),
        '',
        '',
        '',
        ''
    );
    $vFiles         = $data_release->getVersionedFiles($DB);
    $prePermissions = $data_release->getUserVersionPermissions($vFiles, $DB);

    $postPermissions = array();
    foreach ($_POST as $key => $value) {
        if (strpos($key, 'permissions') !== false) {
            // at this stage each checked checkbox gets submitted as
            // key: permission_USERID value: array(VERSION_NAME1, VERSION_NAME2)
            $parsed_user = str_replace("permissions_", "", $key);
            foreach ($value as $k => $v) {
                $postPermissions[$parsed_user][] = $v;
            }
        }
    }

    // Compare pre and post and only update changed values
    // prePermissions array contains all users in the database
    // postPermissions contains only users with at least one checked version
    foreach ($prePermissions as $user=>$oldVersions) {
        // query to get user ID
        $query  = "SELECT ID FROM users WHERE UserID LIKE :userid";
        $params = array('userid' => $user);
        // PHP replaces dots "." characters by underscores "_" in variables.
        // to be able to compare below, do the same thing
        $userNoDot = str_replace(".", "_", $user);
        // if user did not have any associated versions
        if (empty($oldVersions)) {
            // check if user now has versions
            if (isset($postPermissions[$userNoDot])) {
                // all versions should be added to user
                $userid = $DB->pselectOne($query, $params);
                // go through each version and each file associated and insert it
                foreach ($postPermissions[$userNoDot] as $version) {
                    foreach ($vFiles[$version] as $fileID=>$fileName) {
                        $DB->insert(
                            'data_release_permissions',
                            array(
                             'userid'          => $userid,
                             'data_release_id' => $fileID,
                            )
                        );
                    }
                }
            } else {
                // nothing changed
                continue;
            }
        } else {
            // if user had associated version versions
            // check if user still has any associated versions
            if (isset($postPermissions[$userNoDot])) {
                $userid = $DB->pselectOne($query, $params);

                // versions should be compared individually and added or removed
                $added   = array_diff($postPermissions[$userNoDot], $oldVersions);
                $removed = array_diff($oldVersions, $postPermissions[$userNoDot]);

                foreach ($added as $version) {
                    foreach ($vFiles[$version] as $fileID=>$fileName) {
                        $DB->insert(
                            'data_release_permissions',
                            array(
                             'userid'          => $userid,
                             'data_release_id' => $fileID,
                            )
                        );
                    }
                }

                foreach ($removed as $version) {
                    foreach ($vFiles[$version] as $fileID=>$fileName) {
                        $DB->delete(
                            'data_release_permissions',
                            array(
                             'userid'          => $userid,
                             'data_release_id' => $fileID,
                            )
                        );
                    }
                }
            } else {
                // all version permissions should be removed
                $userid = $DB->pselectOne($query, $params);

                // go through each version and each file associated and delete it
                foreach ($oldVersions as $version) {
                    foreach ($vFiles[$version] as $fileID=>$fileName) {
                        $DB->delete(
                            'data_release_permissions',
                            array(
                             'userid'          => $userid,
                             'data_release_id' => $fileID,
                            )
                        );
                    }
                }
            }
        }
    }

    //addpermissionSuccess=true/false
    //does not currently do anything on the front-end
    //just a placeholder displaying if the operation succeeded or not
    header("Location: {$baseURL}/data_release/?addpermissionSuccess=true");

} else {
    header("HTTP/1.1 400 Bad Request");
    echo "There was an error adding permissions";
}


