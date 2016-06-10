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

$headers = array();

$query     = "select File from files where FileID = :MincID";
$minc_file = $DB->pselectOne($query, array('MincID' => $_REQUEST['minc_id']));
$minc_file = getMincLocation() . $minc_file;


$header      = $_REQUEST['minc_headers'];
$header_data = $_REQUEST['raw_data'];
if ($header_data) {
    passthru("minctoraw -double -normalize $minc_file");
}
if ($header=='true' && $minc_file !=null) {
    print initialize($minc_file);
}

/**
 * Extracts the values required for a specific dimension from a minc file
 *
 * @param string $dimension A string representing the dimension to extract
 * @param string $minc_file The filename to run mincinfo on to extract
 *                          information
 *
 * @return array with elements start, space_length, and step populated
 */
function extractDimension($dimension, $minc_file)
{
    return array(
            'start'        => exec("mincinfo -attval $dimension:start $minc_file"),
            'space_length' => exec("mincinfo -dimlength $dimension $minc_file"),
            'step'         => exec("mincinfo -attval $dimension:step $minc_file"),
            'dir_cosines'  => explode(
                " ",
                exec(
                    "mincinfo -attval $dimension:direction_cosines $minc_file"
                )
            ),
           );
}

/**
 * Creates a json array of mincinfo
 *
 * @param string $minc_file the filename that mincinfo will run on
 *
 * @return string JSON encoded string of minc dimensions
 */
function initialize($minc_file)
{
    $headers = array(
                'xspace'   => extractDimension("xspace", $minc_file),
                'yspace'   => extractDimension("yspace", $minc_file),
                'zspace'   => extractDimension("zspace", $minc_file),
                'datatype' => 'float64',
               );

    //minc2.0, if there's a time component
    $order = explode(",", exec("mincinfo -attval image:dimorder  $minc_file"));

    //minc 1.0
    if (!((count($order) == 4) || (count($order) == 3))) {
        $order = explode(" ", exec("mincinfo -dimnames $minc_file"));
    }

    //for 4D (BOLD or DTI)
    if (count($order) == 4) {
        $headers['time'] = extractDimension("time", $minc_file);
    }

    $headers['order'] = $order;

    return json_encode($headers);
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
