<?php
/**
 * Certification training: Check is the user's certification status for the
 * instrument they select for training.
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

// Get the status of their certification for the select instrument
$certificationStatus = $DB->pselectOne(
    "SELECT pass FROM certification WHERE certID=:CID AND testID=:TID",
    array('CID' => 3, 'TID' => $instrumentID)
);

// Check if the examiner is certified for the selected instrument
if ($certificationStatus == 'certified') {
    print 0;
} else if ($certificationStatus == 'in_training') {
    print 1;
} else {
    print 2;
}
?>