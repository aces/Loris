<?php
/**
 * Certification training: Creates the html for the tab navigation,
 * and the divs that will hold the tab content.
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

require_once __DIR__ . "/../../../vendor/autoload.php";

$DB = Database::singleton();

// Get the ID for the instrument that was selected
$instrumentID   = $_REQUEST['instrument'];
$instrumentName = $_REQUEST['instrumentName'];
$type           = $_REQUEST['type'];

// Get the tab titles
$tabs = $DB->pselect(
    "SELECT Title, TrainingType, OrderNumber
     FROM certification_training
     WHERE TestID=:TID
     ORDER BY OrderNumber",
    array('TID' => $instrumentID)
);

$tpl_data['instrumentName'] = $instrumentName;
$tpl_data['type']           = $type;
$tpl_data['tabs']           = $tabs;

$smarty = new Smarty_NeuroDB('training');
$smarty->assign($tpl_data);
$html = $smarty->fetch('training_tabs.tpl');

print $html;
?>