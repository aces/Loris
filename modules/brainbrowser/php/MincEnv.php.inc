<?php
/**
 * Get the MINC tools path for bin, lib, and pipeline
 *
 * If the minc_headers request parameter is set, it will return a JSON object
 * representing the headers necessary to render the file. If raw_data is set,
 * it will return a byte array of the raw data for brainbrowser to display.
 *
 * PHP Version 5
 *
 * @category Imaging
 * @package  Loris/Modules/BrainBrowser
 * @author   Loris Team <loris@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Get the MINC tools path for bin, lib, and pipeline
 *
 * @category Imaging
 * @package  Loris/Modules/BrainBrowser
 * @author   Loris Team <loris@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once "NDB_Config.class.inc";

$config    =& NDB_Config::singleton();
$minc_path = $config->getSetting("MINCToolsPath");

putenv("PATH=" . $minc_path . "bin:" . $minc_path . "pipeline:" . getenv("PATH"));
putenv("LD_LIBRARY_PATH=" . getenv("LD_LIBRARY_PATH") . ":" . $minc_path . "lib");


