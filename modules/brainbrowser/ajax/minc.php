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


$query     = "select File from files where FileID = :MincID";
$minc_file = $DB->pselectOne($query, array('MincID' => $_REQUEST['minc_id']));
$minc_path = getMincLocation() . $minc_file;

if (!empty($minc_file)) {
    readfile($minc_path);
} else {
    header("HTTP/1.1 404 Not Found");
    exit();
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
    $minc_path = $paths['mincPath'];
    return $minc_path;
}

?>
