<?php

/**
 * Add permissions through Ajax, how crazy.
 *
 * PHP Version 5
 *
 *  @category Loris
 *  @package  Data_Release
 *  @author   Justin Kat <justinkat@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/aces/Loris
 */

$factory  = \NDB_Factory::singleton();
$settings = $factory->settings();
$DB       = $factory->database();
if ($_POST['action'] == 'addpermission') {
    $userid          = $_POST['userid'];
    $data_release_id = $_POST['data_release_id'];

        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM data_release_permissions
             WHERE userid = :userid and
             data_release_id = :data_release_id",
            array(
             'userid'          => $userid,
             'data_release_id' => $data_release_id,
            )
        );

        $baseURL = $settings->getBaseURL();
        if ($result != '1') {
            $success = $DB->insert(
                'data_release_permissions',
                array(
                 'userid'          => $userid,
                 'data_release_id' => $data_release_id,
                )
            );

            header("Location: {$baseURL}/data_release/?addpermissionSuccess=true");
        } else {
            // return username and file with permisson.
            $file = $DB->pselectOne(
                "SELECT file_name FROM data_release WHERE id = :data_release_id",
                array('data_release_id' => $data_release_id)
            );
            //add username
            $username = $DB->pselectOne(
                "SELECT userid FROM users WHERE id = :id",
                array('id' => $userid)
            );

            header(
                "Location:{$baseURL}/data_release/".
                "?addpermissionSuccess=false&user={$username}&file={$file}"
            );
        }


} else {
    header("HTTP/1.1 400 Bad Request");
    echo "There was an error adding permissions";
}

?>
