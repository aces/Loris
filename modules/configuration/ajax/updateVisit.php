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
$client->initialize();
$controller = new \LORIS\VisitController(\NDB_Factory::singleton()->database());

$VisitList          = $controller->getAllVisits();
$visitName          = $_POST['name'] ?? '';
$visitLabel         = $_POST['label'] ?? '';
$WindowMinDays      = empty($_POST['windowMinDays'])
    ? null : $_POST['WindowMinDays'];
$WindowMaxDays      = empty($_POST['windowMaxDays'])
    ? null : $_POST['WindowMaxDays'];
$OptimumMinDays     = empty($_POST['optimumMinDays'])
    ? null : $_POST['OptimumMinDays'];
$OptimumMaxDays     = empty($_POST['optimumMaxDays'])
    ? null : $_POST['OptimumMaxDays'];
$WindowMidpointDays = empty($_POST['windowMidpointDays'])
    ? null : $_POST['WindowMidpointDays'];
$visitID            = empty($_POST['visitID']) ? null : intval($_POST['visitID']);
$projectSubprojectIDs = $_POST['projectSubprojects'] ?? [];


// Create or update a Project
if ($visitID == 'new') {
    if ($controller->visitExists($visitName)) {
        http_response_code(409);
        echo json_encode(['error' => 'Conflict']);
        exit;
    }

    $visit = $controller->createVisit(
        new \LORIS\Visit(
            null,
            $visitName,
            $visitLabel,
            $WindowMinDays,
            $WindowMaxDays,
            $OptimumMinDays,
            $OptimumMaxDays,
            $WindowMidpointDays
        )
    );
} else {
    // Update Project fields
    $oldVisit = $controller->getVisitByID($visitID);
    $oldVisit->setLabel($visitLabel);
    $oldVisit->setWindowMinDays($WindowMinDays);
    $oldVisit->setWindowMaxDays($WindowMaxDays);
    $oldVisit->setOptimumMinDays($OptimumMinDays);
    $oldVisit->setOptimumMaxDays($OptimumMaxDays);
    $oldVisit->setWindowMidpointDays($WindowMidpointDays);

    $visit = $controller->updateVisit($oldVisit);
}

// Subproject information isn't mandatory. If the array is empty, give an
// OK response.
if (!empty($projectSubprojectIDs)) {
    // Update visit_project_subproject_rel if data submitted.

    // Avoid deleting all and re-inserting in case the VisitProjectSubprojectRelID
    // is referenced in another table in the database
    $preValues = $controller
        ->loadProjectSubprojectIDs($visit)
        ->getProjectSubprojectIDs();
    $toAdd     = array_diff($projectSubprojectIDs, $preValues);
    $toRemove  = array_diff($preValues, $projectSubprojectIDs);

    foreach ($toAdd as $id) {
        $controller->addProjectSubproject($visit, intval($id));
    }
    foreach ($toRemove as $id) {
        $controller->removeProjectSubproject($visit, intval($id));
    }
}

http_response_code(200);
echo json_encode(['ok' => 'Success']);
exit;

