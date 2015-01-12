<?php
/**
 * Certification module....
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB = Database::singleton();

// Get the ID for the instrument that was selected
$instrumentID = $_REQUEST['instrument'];

// Check the tabs and their titles
$tabs = $DB->pselect(
    "SELECT Title, OrderNumber FROM certification_training WHERE TestID=:TID ORDER BY OrderNumber",
    array('TID' => $instrumentID)
);

$tabhtml = '<ul class="nav nav-tabs">';
foreach ($tabs as $tab) {
    $tabhtml = $tabhtml . '<li class="disabled" id="' . $tab['OrderNumber'] . '"><a href="#">' . $tab['Title'] . '</a></li>';
}
$tabhtml = $tabhtml . '</ul>';

print $tabhtml;
?>