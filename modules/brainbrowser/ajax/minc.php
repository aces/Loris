<?php
/**
 * This file extracts the data from a minc file in a way that BrainBrowser
 * volume viewer will understand.
 *
 * If the minc_headers request parameter is set, it will return a JSON object
 * representing the headers necessary to render the file. If raw_data is set,
 * it will return a byte array of the raw data for brainbrowser to display.
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

if (strpos($_REQUEST['minc_id'], 'l') !== false) {
    list($l, $id) = explode('l', $_REQUEST['minc_id']);

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
        http_response_code(400);
        exit();
    }

    if (!empty($query)) {
        $minc_file = $DB->pselectOne($query, array('LogID' => $id));
        $file      = implode('/', array_slice(explode('/', $minc_file), -2));

        if (strpos($minc_file, 'assembly') !== false) {
            if (strpos($minc_file, 'assembly') === 0) {
                $minc_path = getMincLocation() . $minc_file;
            } else {
                $minc_path = $minc_file;
            }
        } else {
            $minc_path = getMincLocation() . "trashbin/" . $file;
        }
    }
} else {
    $query     = "select File from files where FileID = :MincID";
    $minc_file = $DB->pselectOne(
        $query,
        array(
         'MincID' => $_REQUEST['minc_id'],
        )
    );
    $minc_path = getMincLocation() . $minc_file;
}

if (!is_readable($minc_path)) {
    if (!file_exists($minc_path)) {
        http_response_code(500);
        error_log("ERROR: $minc_path exists in the DB but not in the file system");
        exit();
    } else {
        error_log(
            "$minc_path was requested but is not readable. " .
            'Possible permission error'
        );
        http_response_code(403);
        exit();
    }
} else {
    readfile($minc_path);
}


/**
 * Returns the path under which minc files are located in this Loris
 * install.
 *
 * @return string Path which contains MINC files
 */
function getMincLocation()
{
    $config    =& NDB_Config::singleton();
    $paths     = $config->getSetting('paths');
    $minc_path = $paths['mincPath'] ?? '';
    if (empty($minc_path)) {
        http_response_code(500);
        exit();
    }
    return $minc_path;
}

?>
