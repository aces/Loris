<?php
/**
 * Certification training: Checks if the answers given for training quiz are correct.
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

$config = NDB_Config::singleton();

$fullName = $_POST['addName'];
$siteID   = $_POST['addSite'];

// Check that a name and site was submitted
if (empty($fullName) || empty($siteID)) {
    print 1;
    exit();
}
// Check if there is already an examiner like that
if (examinerExists($fullName, $siteID)) {
    print 2;
    exit();
}
print 3;
exit();

/**
 * Checks if an examiner exists with a given name and site
 *
 * @param string $fullName The full name of the examiner
 * @param int    $siteID   The site ID
 *
 * @return boolean
 */
function examinerExists($fullName, $siteID)
{
    $DB         = Database::singleton();
    $examinerID = $DB->pselectOne(
        "SELECT examinerID
         FROM examiners
         WHERE full_name=:fullName AND centerID=:siteID",
        array(
         'fullName' => $fullName,
         'siteID'   => $siteID,
        )
    );

    if (empty($examinerID)) {
        return false;
    } else {
        return true;
    }
}
?>