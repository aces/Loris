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

$factory     = NDB_Factory::singleton();
$db          = $factory->database();
$ProjectList = Utility::getProjectList();
$recTarget   = empty($_POST['recruitmentTarget'])
    ? null : $_POST['recruitmentTarget'];
$projectID   = null;
// if a new project is created add the new project.php
// Otherwise, update the existing project.
if ($_POST['ProjectID'] === 'new') {
    if (!in_array($_POST['Name'], $ProjectList) && !empty($_POST['Name'])) {
        $db->insert(
            "Project",
            array(
             "Name"              => $_POST['Name'],
             "recruitmentTarget" => $recTarget,
            )
        );
        $projectID = $db->getLastInsertId();
    } else {
        header("HTTP/1.1 409 Conflict");
        print '{ "error" : "Conflict" }';
        exit();
    }
} else {
    $db->update(
        "Project",
        array(
         "Name"              => $_POST['Name'],
         "recruitmentTarget" => $recTarget,
        ),
        array("ProjectID" => $_POST['ProjectID'])
    );
    $projectID = $_POST['ProjectID'];
}

// get values from the database before change to crossmatch with new submission
$preValues = $db->pselectCol(
    'SELECT SubprojectID 
    FROM project_subproject_rel WHERE ProjectID=:pid',
    array('pid' => $projectID)
);

// Compare submitted values with DB values.
// It's important not to delete and reinsert the values due to delete cascades on
// tables referencing project_subproject_rel in the database.
if (isset($_POST['SubprojectIDs'])) {
    $toAdd    = array_diff($_POST['SubprojectIDs'], $preValues);
    $toRemove = array_diff($preValues, $_POST['SubprojectIDs']);
}

foreach ($toAdd as $sid) {
    $db->insertIgnore(
        'project_subproject_rel',
        array(
         'ProjectID'    => $projectID,
         'SubprojectID' => $sid,
        )
    );
}
// the following can cause some deletions from the visit_project_subproject_rel table
foreach ($toRemove as $sid) {
    $db->delete(
        'project_subproject_rel',
        array(
         'ProjectID'    => $projectID,
         'SubprojectID' => $sid,
        )
    );
}
header("HTTP/1.1 200 OK");
print '{ "ok" : "Success" }';
exit();

