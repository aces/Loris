<?php
/**
 * Controls access to a module's SQL tables, exporting a CSV file of the table
 * to user. This script should ensure that only files relative to module's path
 * specified are accessible.
 * By calling new NDB_Client(), it also makes sure that the user is logged in to
 * Loris.
 *
 * It also does validation to make sure required config settings are specified.
 *
 * Used by "new" style modules.
 *
 * PHP Version 5
 *
 *  @category Loris
 *  @package  Loris
 *  @author   Jordan Stirling <jordan.stirling@mail.mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 */

require_once __DIR__ . "/../vendor/autoload.php";
// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../project/config.xml");

// Checks that config settings are set
$config =& NDB_Config::singleton();
$paths  = $config->getSetting('paths');

// Basic config validation
$basePath = $paths['base'];
if (empty($basePath)) {
    error_log("ERROR: Config settings are missing");
    header("HTTP/1.1 500 Internal Server Error");
    exit(1);
}


// Now get the file and do file validation
$TestName = isset($_REQUEST['test_name']) ? $_REQUEST['test_name'] : 'dashboard';
$subtest  = isset($_REQUEST['subtest']) ? $_REQUEST['subtest'] : '';

if (empty($TestName)) {
    error_log("Missing required parameters for request");
    header("HTTP/1.1 400 Bad Request");
    exit(2);
}

$list     = load($TestName, $subtest);
$csv_data = arrayToCSV($list);
print_r($csv_data);

/**
* Loads the correct class for which the data is wanted
*
* @param string $test_name The object type to load.  The test_name of the
*                          menu, form or instrument
* @param string $subtest   The subtest.  The page of the form or instrument.
*
* @return array the queryied data
*/
function load($test_name, $subtest)
{
    if (empty($test_name)) {
        return;
    }
    // Load config file and ensure paths are correct
    set_include_path(
        get_include_path() . ":" .
        __DIR__ . "/../project/libraries:" .
        __DIR__ . "/../php/libraries:" .
        __DIR__ . "/../modules/$test_name:" .
        __DIR__ . "/../modules/$test_name/php:"
    );

    $caller =& NDB_Caller::singleton();

    $menu_filter_testname = "NDB_Menu_Filter_$test_name.class.inc";
    $menu_form_testname   = "NDB_Menu_Filter_Form_$test_name.class.inc";
    $menu_testname        = "NDB_Menu_$test_name.class.inc";

    $menu_filter_form_subtest = "NDB_Menu_Filter_Form_$submenu.class.inc";

    if ($caller->existsAndRequire($menu_testname)) {
        error_log(
            "ERROR: This download of this table's data is not yet implemented."
        );
        header("HTTP/1.1 501 Not Implemented");
        exit(5);
    } elseif ($caller->existsAndRequire($menu_filter_testname)
        || $caller->existsAndRequire($menu_form_testname)
        || $caller->existsAndRequire($menu_filter_form_subtest)
    ) {
        $mode = isset($_REQUEST['mode']) ? $_REQUEST['mode'] : '';
        if ($submenu !== null) {
            $list = loadMenu($submenu, $mode);
        } else {
            $list = loadMenu($test_name, $mode);
        }
        return $list;
    } else {
        error_log("ERROR: The menu class ($test_name) is not defined.");
        header("HTTP/1.1 404 Not Found");
        exit(5);
    }
}

/**
* Gets desired data to export
*
* @param string $menu The Menu being loaded
* @param string $mode The Menu mode
*
* @return array the queryied data
*/
function loadMenu($menu, $mode)
{
    $menu =& NDB_Menu::factory($menu, $mode);
    $menu->setup();
    $success         = $menu->_setFilterForm();
    $list['data']    = $menu->_getFullList();
    $list['headers'] = $menu->headers;

    error_log(print_r($menu->headers, true));

    return $list;
}

/**
* Coverts array into CSV string
*
* @param array $array the array to be converted
*
* @return string CSV string of data
*/
function arrayToCSV($array)
{
    $csv = '';
    foreach ($array['headers'] as $header) {
        $csv .= ucwords(str_replace('_', ' ', $header)) . ";";
    }
    $csv = substr_replace($csv, "\n", -1);
    foreach ($array['data'] as $item) {
        foreach ($item as $colm) {
            $csv .= $colm . ";";
        }
        $csv = substr_replace($csv, "\n", -1);
    }
    return $csv;
}

?>
