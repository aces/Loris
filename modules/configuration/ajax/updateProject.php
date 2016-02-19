<?php
/**
* This file is used by the Configuration module to update
* or insert values into the Project table.
*
* PHP version 5
*
* @category Main
* @package  Loris
* @author   Bruno Da Rosa Miranda <bruno.darosamiranda@mail.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://github.com/aces/Loris
*/

$user =& User::singleton();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();
$factory = NDB_Factory::singleton();
$db      = $factory->database();
// if a new project is created add the new project.
// Otherwise, update the existing project.
if ($_POST['ProjectID'] === 'new' && !empty($_POST['Name'])) {
    $db->insert(
        "Project",
        array(
         "Name"              => $_POST['Name'],
         "recruitmentTarget" => $_POST['recruitmentTarget'],
        )
    );
} else {
    $db->update(
        "Project",
        array(
         "Name"              => $_POST['Name'],
         "recruitmentTarget" => $_POST['recruitmentTarget'],
        ),
        array("ProjectID" => $_POST['ProjectID'])
    );
}
header("HTTP/1.1 200 OK");
print '{ "ok" : "Success" }';
exit();
?>
