<?php
/**
 * This file extracts the data from a MINC or NIfTI file in a way that
 * BrainBrowser volume viewer will understand.
 *
 * PHP Version 5
 *
 * @category Imaging
 * @package  Loris/Modules/BrainBrowser
 * @author   Mia Petkova <mia.petkova@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
ini_set('default_charset', 'utf-8');
require_once "Utility.class.inc";
require_once "NDB_Config.class.inc";
require_once "MincEnv.php.inc";

if (strpos($_REQUEST['file_id'], 'l') !== false) {
    list($l, $id) = explode('l', $_REQUEST['file_id']);

    switch ($l) {
    case 1:
        $query = "SELECT minc_location FROM mri_protocol_violated_scans " .
        "WHERE ID = :LogID";
        break;
    case 2:
        $query = "SELECT MincFile FROM mri_violations_log WHERE LogID = :LogID";
        break;
    case 3:
        $query = "SELECT MincFile FROM MRICandidateErrors WHERE ID = :LogID";
        break;
    default:
        header("HTTP/1.1 400 Bad Request");
        exit();
    }

    if (!empty($query)) {
        $image_file = $DB->pselectOne($query, array('LogID' => $id));
        $file       = implode('/', array_slice(explode('/', $image_file), -2));

        if (strpos($image_file, 'assembly') !== false) {
            if (strpos($image_file, 'assembly') === 0) {
                $image_path = getFileLocation() . $image_file;
            } else {
                $image_path = $image_file;
            }
        } else {
            $image_path = getFileLocation() . "trashbin/" . $file;
        }
    }
} else {
    $query      = "select File from files where FileID = :FileID";
    $image_file = $DB->pselectOne(
        $query,
        array(
         'FileID' => $_REQUEST['file_id'],
        )
    );
    $image_path = getFileLocation() . $image_file;
}

if (!empty($image_file)) {
    if (preg_match('/nii(\.gz)?/i', $image_file)) {
        header('Content-Type: application/x-nii');
    } elseif (preg_match('/mnc/', $image_file)) {
        header('Content-Type: application/x-mnc');
    }
    header('X-FileID: ' . $_REQUEST['file_id']);
    readfile($image_path);
} else {
    header("HTTP/1.1 404 Not Found");
    exit();
}


/**
 * Returns the path under which MINC or NIfTI files are located in this Loris
 * install.
 *
 * @return string Path which contains MINC or NIfTI files
 */
function getFileLocation()
{
    $config     = & NDB_Config::singleton();
    $paths      = $config->getSetting('paths');
    $image_path = $paths['mincPath'];
    return $image_path;
}

?>
