<?php declare(strict_types=1);

/**
 * This tool migrate the actions in permission to the relational table
 * perm_perm_action_rel.
 */

require_once __DIR__ . "/../generic_includes.php";

$DB = $lorisInstance->getDatabaseConnection();

// current permissions with actions
$current_permissions = $DB->pselect(
    "SELECT
        p.permID as permID,
        p.action as action
    FROM permissions p
    WHERE p.action is not null
    ",
    []
);

// actions map
$permissions_action = $DB->pselectColWithIndexKey(
    "SELECT ID, name FROM permissions_action",
    [],
    "ID"
);
$action_map         = array_flip($permissions_action);

// iterate over all current actions
foreach ($current_permissions as $key => $permission) {
    $permID = $permission['permID'];
    $action = $permission['action'];

    $actions     = explode('/', $action);
    $action_keys = array_map(
        fn($action) => $action_map[$action] ?? null,
        $actions
    );

    // inserting new action in rel table
    foreach ($action_keys as $action_key) {
        $DB->insertIgnore(
            "perm_perm_action_rel",
            [
                "permID"   => $permID,
                "actionID" => $action_key
            ]
        );
    }
}

// drop the original column
$dropColumnActionStatement = $DB->prepare(
    "ALTER TABLE permissions DROP COLUMN action"
);
$dropColumnActionStatement->execute();
