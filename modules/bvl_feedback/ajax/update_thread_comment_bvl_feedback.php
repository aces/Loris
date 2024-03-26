<?php
/**
 * Used to create a new entry on a specific thread via the bvl feedback
 * panel.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require "bvl_panel_ajax.php";

if (isset($_POST['entryID']) && isset($_POST['newComment'])) {
    $db =& NDB_Factory::singleton()->database();

    $db->update(
        'feedback_bvl_entry',
        [
            'Comment'  => $_POST['newComment'],
            'TestDate' => $_POST['date']
        ],
        ['ID' => $_POST['entryID']]
    );

    print json_encode('success');
} else {
    print json_encode('error');
    exit();
}

exit();