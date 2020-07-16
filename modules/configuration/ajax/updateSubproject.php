<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the subproject table.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

$factory = NDB_Factory::singleton();
$user    = $factory->user();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

require_once __DIR__ . "/../../../vendor/autoload.php";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$db = $factory->database();
$SubprojectList = Utility::getSubprojectList();
$recTarget      = $_POST['RecruitmentTarget'];


// Basic validation
if (!Utility::valueIsPositiveInteger($recTarget)) {
    printAndExit(
        400,
        ['error' => 'Recruitment Target must be an integer greater than zero']
    );
}

if ($_POST['subprojectID'] === 'new') {
    if (!in_array($_POST['title'], $SubprojectList) && !empty($_POST['title'])) {
        $db->insert(
            "subproject",
            [
                "title"             => $_POST['title'],
                "useEDC"            => $_POST['useEDC'],
                "WindowDifference"  => $_POST['WindowDifference'],
                "RecruitmentTarget" => $recTarget,
            ]
        );
    } else {
        printAndExit(409, ['error' => 'Conflict']);
    }
} else {
    $db->update(
        "subproject",
        [
            "title"             => $_POST['title'],
            "useEDC"            => $_POST['useEDC'],
            "WindowDifference"  => $_POST['WindowDifference'],
            "RecruitmentTarget" => $recTarget,
        ],
        ["SubprojectID" => $_POST['subprojectID']]
    );
}
// FIXME: This should probably be a 201 Created instead.
printAndExit(200, ["ok" => "Subproject updated successfully"]);

/**
 * Prints a parameter converted to JSON-encoded string.
 *
 * @param int                  $code The HTTP Response Code.
 * @param array<string,string> $msg  A key-value pair representing the JSON to
 *                                   be returned from this file.
 *
 * @return void
 */
function printAndExit(int $code, array $msg): void
{
    http_response_code($code);
    print json_encode($msg);
    exit;
}
