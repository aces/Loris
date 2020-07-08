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

$user =& User::singleton();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

require_once __DIR__ . "/../../../vendor/autoload.php";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$factory = NDB_Factory::singleton();
$db      = $factory->database();
$SubprojectList = Utility::getSubprojectList();
$recTarget      = empty($_POST['RecruitmentTarget'])
    ? null : $_POST['RecruitmentTarget'];

if ($_POST['subprojectID'] === 'new') {
    if (!in_array($_POST['title'], $SubprojectList) && !empty($_POST['title'])) {
        $db->insert(
            "subproject",
            array(
                "title"             => $_POST['title'],
                "useEDC"            => $_POST['useEDC'],
                "WindowDifference"  => $_POST['WindowDifference'],
                "RecruitmentTarget" => $recTarget,
            )
        );
    } else {
        header("HTTP/1.1 409 Conflict");
        print '{ "error" : "Conflict" }';
        exit();
    }
} else {
    $db->update(
        "subproject",
        array(
            "title"             => $_POST['title'],
            "useEDC"            => $_POST['useEDC'],
            "WindowDifference"  => $_POST['WindowDifference'],
            "RecruitmentTarget" => $recTarget,
        ),
        array("SubprojectID" => $_POST['subprojectID'])
    );
}
header("HTTP/1.1 200 OK");
print '{ "ok" : "Success" }';
exit();


