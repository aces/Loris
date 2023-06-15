<?php
/**
 * Used to delete an entry on a specific thread via the bvl feedback
 * panel.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Saagar Arya <saagar.arya@mcin.ca>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris/
 */
header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require "bvl_panel_ajax.php";

$db =& NDB_Factory::singleton()->database();

// DELETE the thread entries
$db->delete('feedback_bvl_entry', ["ID" => $_POST['entryID']]);

print json_encode('success');

exit();