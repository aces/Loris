<?php
/**
 * This is an AJAX script which returns the file name for a MINC,
 * given a minc_id request parameter
 *
 * PHP Version 5
 *
 * @category BrainBrowser
 * @package  LorisModules
 * @author   Mia Petkova <mia.petkova@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
ini_set('default_charset', 'utf-8');
require_once "Utility.class.inc";


$DB = Database::singleton();

$query = "select File from files where FileID = :MincID";
$file  = $DB->pselectOne($query, array('MincID' => $_REQUEST['minc_id']));
$file  = substr($file, strrpos($file, '/') + 1);

// create a JSON object with the file information
$result->filename = $file;
$result->fileid   = $_REQUEST['minc_id'];

echo json_encode($result);
?>
