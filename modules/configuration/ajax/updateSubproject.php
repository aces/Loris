<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the Config table.
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../vendor/autoload.php";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$factory = NDB_Factory::singleton();
$db      = $factory->database();

if ($_POST['subprojectID'] === 'new' && !empty($_POST['title'])) {
    $db->insert(
        "subproject",
        array(
         "title"            => $_POST['title'],
         "useEDC"           => $_POST['useEDC'],
         "WindowDifference" => $_POST['WindowDifference'],
        )
    );
} else {
    $db->update(
        "subproject",
        array(
         "title"            => $_POST['title'],
         "useEDC"           => $_POST['useEDC'],
         "WindowDifference" => $_POST['WindowDifference'],
        ),
        array("SubprojectID" => $_POST['subprojectID'])
    );
}
header("HTTP/1.1 200 OK");
print '{ "ok" : "Success" }';
exit();

?>
