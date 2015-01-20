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

require_once "Database.class.inc";

$DB = Database::singleton();

// Get the ID for the instrument that was selected
$instrumentID = $_REQUEST['instrument'];

// Get the tab titles
$tabs = $DB->pselect(
    "SELECT Title, TrainingType, OrderNumber
     FROM certification_training
     WHERE TestID=:TID
     ORDER BY OrderNumber",
    array('TID' => $instrumentID)
);

// If there is no training content for the instrument, return 0
if (empty($tabs)) {
    print 0;
    exit();
}

// Add tab html
$tabhtml = '<ul class="nav nav-tabs" id="trainingTabs">';
foreach ($tabs as $tab) {
    $tabhtml = $tabhtml
             . '<li class="disabled" id="'
             . $tab['OrderNumber']
             . '"><a role="button" data-toggle="tab" data-target="#'
             . str_replace(' ', '', $tab['Title'])
             . '">'
             . $tab['Title']
             . '</a></li>';
}
$tabhtml .= '</ul>';

// Add tab body html
$tabhtml .= '<div class="tab-content container">';
foreach ($tabs as $tab) {
    $tabhtml = $tabhtml
             . '<div class="tab-pane '
             . 'training-'
             . $tab['TrainingType']
             . '" id="'
             . str_replace(' ', '', $tab['Title'])
             . '"></div>';
}
$tabhtml .= '</div>';

print $tabhtml;
?>