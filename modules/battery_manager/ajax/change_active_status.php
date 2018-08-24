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
if (sanitize('action', 'get') !== null) {
    $action = sanitize('action', 'get');
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
         "ID" => sanitize('ID', 'post'),
        )
    );

    $new_entry = $DB->pselectRow(
        " SELECT
          ID,
          Test_name,
          AgeMinDays,
          AgeMaxDays,
          Active,
          Stage,
          SubprojectID,
          Visit_label,
          CenterID,
          firstVisit,
          instr_order FROM test_battery WHERE ID = :batteryID AND Active = :active",
        array(
         "batteryID" => sanitize('ID', 'post'),
         "active"    => $value,
        )
    );

    if (empty($new_entry)) {
        echo "empty";
        throw new Exception("Updated entry but could not fetch it");
    }
    return json_encode($new_entry);
}

/**
 * Sanitize GET and POST variables
 *
 * @param string $field   to sanitize
 * @param string $request specifying whether request is get or post
 *
 * @return string $sanitize[$field]
 */
function sanitize($field, $request)
{
    if ($request === "get") {
        $sanitize = array_map('htmlentities', $_GET);
    } else if ($request === "post") {
        $sanitize = array_map('htmlentities', $_POST);
    }
    return $sanitize[$field];
}
?>
