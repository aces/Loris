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

$ProjectList  = Utility::getProjectList();
$projectName  = $_POST['Name'] ?? '';
$projectAlias = $_POST['Alias'] ?? '';
$recTarget    = empty($_POST['recruitmentTarget'])
    ? null : $_POST['recruitmentTarget'];
$projectID    = $_POST['ProjectID'] ?? null;
$cohortIDs    = $_POST['CohortIDs'] ?? [];

$project = null;

// Create or update a Project
if ($projectID == 'new') {
    // Give Conflict response if this project already exists.
    if (in_array($_POST['Name'], $ProjectList, true)) {
        http_response_code(409);
        echo json_encode(['error' => 'Conflict']);
        exit;
    }

    if (empty($_POST['Name'])
        || empty($_POST['Alias'])
        || strlen($_POST['Alias']) > 4
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Bad Request']);
        exit;
    }

    $project = \Project::createNew($projectName, $projectAlias, $recTarget);
    $db->insert(
        'user_project_rel',
        ["UserID"=>$user->getId(),"ProjectID"=>$project->getId()]
    );
} else {
    if (empty($_POST['Name'])
        || empty($_POST['Alias'])
        || strlen($_POST['Alias']) > 4
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Bad Request']);
        exit;
    }

    // Update Project fields
    $project = \Project::getProjectFromID(\ProjectID::singleton(intval($projectID)));
    $project->updateName($projectName);
    $project->updateAlias($projectAlias);
    $project->updateRecruitmentTarget($recTarget);
}

// Cohort information isn't mandatory. If the array is empty, give an
// OK response.
if (!empty($cohortIDs)) {
    // Update cohortIDs if data submitted.
    // It's important not to delete and reinsert the values due to delete
    // cascades on tables referencing project_cohort_rel in the database.
    $preValues = array_column($project->getCohorts(), 'cohortId');
    $toAdd     = array_diff($cohortIDs, $preValues);
    $toRemove  = array_diff($preValues, $cohortIDs);

    $toAdd = array_map(
        function ($row) {
            return intval($row);
        },
        $toAdd
    );

    $project->insertCohortIDs($toAdd);
    $project->deleteCohortIDs($toRemove);
}

http_response_code(200);
echo json_encode(['ok' => 'Success']);
exit;

