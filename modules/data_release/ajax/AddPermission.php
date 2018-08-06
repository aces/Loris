<?php

/**
 * Add permissions through Ajax, how crazy.
 *
 * @todo use the 'addpermissionSuccess' flag for front-end enhancements
 *
 * PHP Version 7
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

if ($_POST['action'] == 'addpermission' && $user->hasPermission('superuser')) {
    if (!empty($_POST['data_release_id']) && empty($_POST['data_release_version'])) {
        $userid          = $_POST['userid'];
        $data_release_id = $_POST['data_release_id'];
        $success         = $DB->insert(
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
        $data_release_version = $_POST['data_release_version'];

        $IDs = $DB->pselectCol(
            "SELECT id FROM data_release WHERE "
            . "version=:data_release_version",
            array('data_release_version' => $data_release_version)
        );

        foreach ($IDs as $ID) {
            $success = $DB->insert(
                'data_release_permissions',
                array(
                 'userid'          => $userid,
                 'data_release_id' => $ID['id'],
                )
            );
        }
    }

    header("Location: {$baseURL}/data_release/?addpermissionSuccess=true");
} elseif ($_POST['action'] == 'managepermissions'
    && $user->hasPermission('superuser')
) {
    // 1) so with checkboxes it's not straightforward to figure out
    //    which permissions were either set or unset during the save,
    //    hence the TRUNCATE at the beginning
    // 2) put it in a transaction to make sure it succeeds or not at all
    // 3) some special characters become "_" so we wildcard match the username
    try {
        $DB->_PDO->beginTransaction();
        $DB->run("TRUNCATE data_release_permissions");
        foreach ($_POST as $key => $value) {
            if (strpos($key, 'permissions') !== false) {
                $parsed_user = str_replace(
                    "_",
                    "%",
                    str_replace("permissions_", "", $key)
                );
                $userid      = $DB->pselectOne(
                    "SELECT ID FROM users WHERE UserID LIKE :userid",
                    array('userid' => $parsed_user)
                );
                foreach ($value as $k => $v) {
                    $data_release_ids = $DB->pselect(
                        "SELECT id FROM data_release WHERE version=:version",
                        array('version' => $v)
                    );
                    foreach ($data_release_ids as $data_release_id) {
                        $success = $DB->run(
                            "INSERT IGNORE INTO data_release_permissions VALUES "
                            . "($userid, {$data_release_id['id']})"
                        );
                    }
                }
            }
        }
        $DB->_PDO->commit();
        header("HTTP/1.1 303 See Other");
        header("Location: {$baseURL}/data_release/?addpermissionSuccess=true");
    } catch (Exception $e) {
        $DB->_PDO->rollback();
        error_log("ERROR: Did not update Data Release permissions.");
        header("HTTP/1.1 500 Internal Server Error");
        header("Location: {$baseURL}/data_release/?addpermissionSuccess=false");
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo "There was an error adding permissions";
}

?>
