<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the Project table.
 *
 * PHP version 7
 *
 * @category Main
 * @package  Loris
 * @author   Bruno Da Rosa Miranda <bruno.darosamiranda@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

$user = \User::singleton();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$factory = NDB_Factory::singleton();
$db      = $factory->database();

$ProjectList = Utility::getProjectList();
$projectName = $_POST['Name'] ?? '';
// FIXME This field should be added to the front-end.
$projectAlias  = '';
$recTarget     = empty($_POST['recruitmentTarget'])
    ? null : $_POST['recruitmentTarget'];
$projectID     = $_POST['ProjectID'] ?? null;
$subprojectIDs = $_POST['SubprojectIDs'] ?? array();

$project = null;

// Create or update a Project
if ($_POST['ProjectID'] === 'new') {
    // Give Conflict response if this project already exists.
    if (in_array($_POST['Name'], $ProjectList, true)) {
        http_response_code(409);
        echo json_encode(array('error' => 'Conflict'));
        exit;
    }

    $project = \Project::createNew($projectName, $projectAlias, $recTarget);
} else {
    // Update Project fields
    $project = \Project::getProjectFromID($projectID);
    $project->updateName($projectName);
    $project->updateRecruitmentTarget($recTarget);

}

// Compare submitted values with DB values.
// It's important not to delete and reinsert the values due to delete cascades on
// tables referencing project_subproject_rel in the database.
if (empty($subprojectIDs)) {
    http_response_code(200);
    exit;
}

// Update subprojectIDs if data submitted.
$preValues = array_column($project->getSubprojects(), 'subprojectId');
$toAdd     = array_diff($subprojectIDs, $preValues);
$toRemove  = array_diff($preValues, $subprojectIDs);

$project->insertSubprojectIDs($toAdd);
$project->deleteSubprojectIDs($toRemove);

header("HTTP/1.1 200 OK");
echo json_encode(array('ok' => 'Success'));
exit;

