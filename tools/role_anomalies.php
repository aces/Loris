#!/usr/bin/php
<?php declare(strict_types=1);
/**
 * This script gets anomalies (i.e. missing user-permission entries) for each 
 * role. It compares the expected permissions a user should have with a given
 * role (in 'role-permission-rel' table), and sees if it is actually the case
 * for each user (in 'user-perm-rel' table).
 * Then, if confirmed, the script insert missing permissions in 'user-perm-rel'
 * table.
 *  
 * NOTE: the user should have AT LEAST the permissions listed by each role. 
 * 
 * TODO: add floating permissions (granted outside the scope of any role) and
 * repeated permissions (applied by multiple roles) checkings. For now, we only
 * check if each user has all permissions granted by their roles.
 *
 * PHP Version 8
 *
 * @category Tools
 * @package  Loris
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\roles_manager;

require_once "generic_includes.php";

// confirm arg
$confirm = (isset($argv[1]) && $argv[1] === "confirm");

// test if module is accessible
$hasRolesManagerModule = $lorisInstance->hasModule('roles_manager');
if (!$hasRolesManagerModule) {
    error_log("Module folder 'roles_manager' does not exist or is not active.");
    exit(-1);
}

// get anomalies
$roleAnomalies = Role::evaluateRoles($lorisInstance);

// no anomalies
if (empty($roleAnomalies)) {
    echo " -> No missing permissions.\n";
    exit(0);
}

// print found anomalies
echo " -> Missing permissions:\n";
foreach ($roleAnomalies as $roleID => $anomalies) {
    echo "  - RoleID: " . $roleID . "\n";
    foreach ($anomalies as $anomaly) {
        echo "    -> userID: " . $anomaly['userID'] . ", permID: " . $anomaly['permID'] . "\n";
    } 
}

// confirm check
if ($confirm === false) {
    echo " -> [dry mode: on] Run this tool again with the argument 'confirm' to ".
    "perform the changes\n";
    exit(0);
}

// insert
echo "\n -> [dry mode: off] Inserting missing permissions...\n";
$db = $lorisInstance->getDatabaseConnection();
foreach ($roleAnomalies as $roleID => $anomalies) {
    echo "  - RoleID: " . $roleID . "\n";
    foreach ($anomalies as $anomaly) {
        echo "    -> userID: " . $anomaly['userID'] . ", permID: " . $anomaly['permID'] . "\n";
        $db->insert('user_perm_rel', $anomaly);
    }
}
echo " -> done\n";