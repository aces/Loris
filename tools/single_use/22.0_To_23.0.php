<?php declare(strict_types=1);
/**
 * This script is meant to be run before the normal release patch.
 */
require_once __DIR__ . '/../generic_includes.php';

// Make sure this is a confirm argument




// Install new `modules` table.
$sqlPatch = __DIR__ . '/../../SQL/New_patches/2019-12-05-AddModuleTable.sql';

if (!is_readable($sqlPatch)) {
    throw new \Exception("Cannot access the SQL patch file (`$sqlPatch`)");
}

// Create a mapping of IDs and Names from the LorisMenu table.
// This array is indexed by the NAME.
$result = $DB->pselect('SELECT ID,Name FROM modules', array());
$modulesTableMapping = [];
foreach ($result as $row) {
    $modulesTableMapping[filterNonAlpha($row['Name'])] = $row['ID'];
}
unset($result);

// Create a mapping of IDs and Links from the LorisMenu table.
// This array is indexed by the ID.
$result = $DB->pselect('SELECT ID,Link,Parent FROM LorisMenu', array());
$menuTableMapping = [];
foreach ($result as $row) {

    // Rows without entries for Parent represent menu categories, not actual
    // modules. We don't need these.
    if (is_null($row['Parent'])) {
        continue;
    }
    $menuTableMapping[$row['ID']] = filterNonAlpha($row['Link']);
}
unset($result);


// Use mapping arrays to replace old `LorisMenu` ID values in issue_tracker
// `module` column with new `modules` table ID values.
$result = $DB->pselect('SELECT issueID,module FROM issues', array());
$issueTrackerMapping = [];
foreach ($result as $row) {
    // Skip rows in this table that do not have a module associated with them.
    if (is_null($row['module'])) {
        continue;
    }
    $issueTrackerMapping[$row['issueID']] = $row['module'];
}
unset($result);

$correctMapping = [];
foreach ($issueTrackerMapping as $issueID => $menuTableID) {
    // Using the menuTableID, look up the corresponding module name from the
    // `LorisMenu` table.
    // Using the module name, look up the new ID in the `modules` table.
    if (!array_key_exists($menuTableID, $menuTableMapping)) {
        echo "[!] Could not find key `$menuTableID` in LorisMenu mapping array\n";
        continue;
    }
    if (!array_key_exists($menuTableMapping[$menuTableID], $modulesTableMapping)) {
        echo "[!] Could not find key `{$menuTablesMapping[$menuTableID]}` in " .
            " modules mapping array\n";
        continue;
    }
    $correctMapping[$issueID] = $modulesTableMapping[
        $menuTableMapping[$menuTableID]
    ];
}

// Now we have an array of issue IDs mapped to the IDs in the `module` table
// matched based on the name of modules. This should fix the problem.

$patch = [];
foreach ($correctMapping as $issueID => $modulesTableID) {
    $result = $DB->pselect(
        "SELECT i.issueID,lm.Link as module FROM LorisMenu lm 
        INNER JOIN issues i ON (i.module=lm.ID AND i.issueID=:id)",
        array('id' => $issueID)
    );
    $idBefore = $result[0]['issueID'];
    $moduleBefore = $result[0]['module'];

    $moduleAfter = $DB->pselectOne(
        'SELECT name FROM modules WHERE ID=:id',
        array('id' => $modulesTableID)
    );
    echo sprintf(
        "Issue ID: %s. Module before (`LorisMenu`): `%s`. Module after (`modules`): `%s`\n",
        $idBefore,
        $moduleBefore,
        $moduleAfter
    );

    $patch[] = "UPDATE `issues` SET module=$modulesTableID WHERE issueID=$issueID;";
}

$patch[] = "ALTER TABLE `issues` ADD FOREIGN KEY (moduleID) REFERENCES (modules(ID));";

echo join("\n", $patch);


// Check for `modules` table

// Search on LorisMenu `Link` and JOIN with `modules` `Name`

// Tell user to run cleanup script


/**
 * Removes non-alphabetical characters from a string.
 *
 */
function filterNonAlpha(string $value): string {
    return preg_replace( '/[^a-z]/i', '', $value);
}
