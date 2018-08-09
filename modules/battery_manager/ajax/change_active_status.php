<?php
/**
 * Battery Manager status changer
 *
 * Used by Battery Manager module to activate or deactivate entries in Test Battery
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

// Determine whether entry should be activated or deactivated
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action === "activate") {
        echo changeStatus('Y');
    } else if ($action === "deactivate") {
        echo changeStatus('N');
    }
}


/**
 * Update entry by changing Active status
 *
 * @param string $value which sets Active to Y or N
 *
 * @throws Exception
 *
 * @return void
 */
function changeStatus($value)
{

    $DB = Database::singleton();

    $DB->update(
        "test_battery",
        array("Active" => $value),
        array(
         "ID" => $_POST["ID"],
        )
    );

    $new_entry = $DB->pselectRow(
        " SELECT * FROM test_battery WHERE ID = :batteryID AND Active = :active",
        array(
         "batteryID" => $_POST["ID"],
         "active"    => $value,
        )
    );

    if (empty($new_entry)) {
        echo "empty";
        throw new Exception("Updated entry but could not fetch it");
    }
    return json_encode($new_entry);
}
?>
