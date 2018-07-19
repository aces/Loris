<?php
/**
 * Battery Manager updater
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
    if ($action == "activate") {
        updateEntry('Y');
    } else if ($action == "deactivate") {
        updateEntry('N');
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
function updateEntry($value)
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
        " SELECT * FROM test_battery WHERE ID = :batteryID ",
        array("batteryID" => $_POST["ID"])
    );

    if (empty($new_entry)) {
        throw new Exception("Updated entry but could not fetch it");
    }
}
?>
