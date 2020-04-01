<?php declare(strict_types=1);
/**
 * This script is used to correctly establish a link betwen the `issues` table
 * used by the Issue Tracker module and the new table `modules`.
 * It outputs SQL statements necessary to upgrade this table from LORIS version
 * 22 to version 23.
 * It relies on the existence of the `LorisMenu` table and the `modules` table
 * so it must be used in the following way:
 *
 * 1. A user must apply the patch file:
 *      SQL/New_patches/2019-12-05-AddModuleTable.sql
 * 2. The user runs this script
 * 3. The user executes the commands it generates
 * 4. Proceed with the release as normal.
 */
require_once __DIR__ . '/../generic_includes.php';

$sqlPatch     = realpath(
    __DIR__ . '/../../SQL/New_patches/2019-12-05-AddModuleTable.sql'
);
$cleanupPatch = realpath(
    __DIR__ . '/../../SQL/New_patches/2020-02-28-foreign_key_issues_modules.sql'
);

$confirm = false;
if (isset($argv[1]) && $argv[1] === "confirm") {
    $confirm = true;
}

// Create a mapping of IDs and Names from the LorisMenu table.
// This array is indexed by the NAME.
$result = $DB->pselect('SELECT ID,Name FROM modules', array());
if (empty($result)) {
    throw new \DatabaseException(
        'Could not load data from the `modules` table. Please make sure you '
        . "have applied the patch file $sqlPatch"
    );
}
$modulesTableMapping = [];
foreach ($result as $row) {
    // Non-alphabetical characters are removed from the module name. The LorisMenu
    // table adds forward-slashes at the end of its values making comparison more
    // difficult without this step.
    $modulesTableMapping[filterNonAlpha($row['Name'])] = $row['ID'];
}
unset($result);

// Create a mapping of IDs and Links from the LorisMenu table.
// This array is indexed by the ID.
$result           = $DB->pselect(
    'SELECT ID,Link,Parent FROM LorisMenu WHERE Parent IS NOT NULL',
    []
);
$menuTableMapping = [];
foreach ($result as $row) {
    $menuTableMapping[$row['ID']] = filterNonAlpha($row['Link']);
}
unset($result);

// Use mapping arrays to replace old `LorisMenu` ID values in issue_tracker
// `module` column with new `modules` table ID values.
$result = $DB->pselect(
    'SELECT issueID,module FROM issues WHERE module IS NOT NULL',
    []
);
$issueTrackerMapping = [];
foreach ($result as $row) {
    $issueTrackerMapping[$row['issueID']] = $row['module'];
}
unset($result);

$correctMapping   = [];
$incorrectMapping = [];
foreach ($issueTrackerMapping as $issueID => $menuTableID) {
    // Using the menuTableID, look up the corresponding module name from the
    // `LorisMenu` table.
    // Using the module name, look up the new ID in the `modules` table.
    if (!array_key_exists($menuTableID, $menuTableMapping)) {
        echo "[!] Issue ID: $issueID. Could not find key `$menuTableID` in ".
            "LorisMenu mapping array\n";
        $incorrectMapping[] =$issueID;
        continue;
    }
    if (!array_key_exists($menuTableMapping[$menuTableID], $modulesTableMapping)) {
        echo "[!] Issue ID: $issueID. Could not find key ".
            "`$menuTableMapping[$menuTableID]` in modules mapping array\n";
        $incorrectMapping[] =$issueID;
        continue;
    }
    $correctMapping[$issueID]
        = $modulesTableMapping[$menuTableMapping[$menuTableID]];
}

// Now we have an array of issue IDs mapped to the IDs in the `module` table
// matched based on the name of modules. This should fix the problem.

$patch = [];
foreach ($correctMapping as $issueID => $modulesTableID) {
    $result       = $DB->pselect(
        "SELECT i.issueID,lm.Link as module FROM LorisMenu lm 
        INNER JOIN issues i ON (i.module=lm.ID AND i.issueID=:id)",
        array('id' => $issueID)
    );
    $idBefore     = $result[0]['issueID'];
    $moduleBefore = $result[0]['module'];

    $moduleAfter = $DB->pselectOne(
        'SELECT name FROM modules WHERE ID=:id',
        array('id' => $modulesTableID)
    );
    echo sprintf(
        "Issue ID: %s. Module before (`LorisMenu`): `%s`. Module after "
        . "(`modules`): `%s`\n",
        $idBefore,
        $moduleBefore,
        $moduleAfter
    );

    $patch[$issueID] = $modulesTableID;
}

if ($confirm) {
    foreach ($patch as $issueID=>$modulesTableID) {
        $DB->update('issues', ['module'=>$modulesTableID], ['issueID'=>$issueID]);
    }
    foreach ($incorrectMapping as $issueID) {
        $DB->update('issues', ['module'=>null], ['issueID'=>$issueID]);
    }
    echo "Done. Make sure to run the clean-up patch $cleanupPatch to complete ".
        "the process\n";
} else {

    foreach ($patch as $issueID=>$modulesTableID) {
        echo "UPDATE `issues` SET module=$modulesTableID WHERE issueID=$issueID;\n";
    }
    foreach ($incorrectMapping as $issueID) {
        echo "UPDATE `issues` SET module=NULL WHERE issueID=$issueID;\n";
    }

    echo "ALTER TABLE `issues` ADD FOREIGN KEY (module) REFERENCES modules(ID);\n\n";

    echo "Run this tool again with the argument 'confirm' to ".
        "perform the changes.\n".
        "Note: The module field for issues for which a mapping between LorisMenu and 
        modules can not be found will be nullified.\n\n";
}

/**
 * Removes non-alphabetical characters from a string.
 *
 * @param string $value The string to modify
 *
 * @return string $value with non-alpha characters removed.
 */
function filterNonAlpha(string $value): string
{
    return preg_replace('/[^a-z]/i', '', $value);
}
