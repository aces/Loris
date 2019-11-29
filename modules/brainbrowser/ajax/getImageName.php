<?php
/**
 * This is an AJAX script which returns the file name for a MINC or NIfTI file,
 * given a file_id request parameter
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

$query = "select File from files where FileID = :FileID";
$file  = $DB->pselectOne($query, array('FileID' => $_REQUEST['file_id']));
$file  = substr($file, strrpos($file, '/') + 1);

// create a JSON object with the file information
$result = array(
    'filename' => $file,
    'fileid'   => $_REQUEST['file_id'],
);

echo json_encode($result);

