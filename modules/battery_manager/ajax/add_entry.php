<?php
/**
 * Battery Manager entry adder
 *
 * Checks Test Battery for duplicates and handles insertions into Test Battery
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */


// Determine which action is called
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "checkForDuplicate") {
        echo checkForDuplicate();
    } else if ($action == "add") {
        addEntry();
    } else if ($action == "edit") {
        echo editEntry();
    }
}

/**
 * Return duplicate of entry if it exists and null otherwise
 *
 * @return json object or null
 */
function checkForDuplicate()
{
    $db =& \Database::singleton();

    // Retrieve values entered by user
    $form_data = getFormData();

    // Build SQL query based on values entered by user
    $query     = " SELECT
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
                   instr_order FROM test_battery ";
    $i         = 0;
    $connector = "WHERE ";
    foreach ($form_data as $key => $value) {
        if ($i > 0) {
            $connector = "AND ";
        }
        if (isset($value) || $value !== null) {
            $query .= $connector . $key . " = :" . $key . " ";
        } else {
            $query .= $connector . $key . " IS NULL ";
            unset($form_data[$key]);
        }
        $i++;
    }

    // Select duplicate entry from Test Battery
    $entry = $db->pselectRow(
        $query,
        $form_data
    );
    // Return JSON representation of duplicate entry if it exists, null otherwise
    if ($entry) {
        return json_encode($entry);
    } else {
        return null;
    }
}

/**
 * Handle insertions into the test battery
 *
 * @throws DatabaseException
 *
 * @return void
 */
function addEntry()
{
    $db   =& \Database::singleton();
    $user =& User::singleton();
    if (!$user->hasPermission('battery_manager_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    // Retrieve values entered by user
    $form_data = getFormData();

    // Make sure new entry is active
    $form_data['Active'] = 'Y';

    // Add entry to Test Battery
    try {
        $db->insert('test_battery', $form_data);
    } catch (DatabaseException $e) {
        showError("Could not add entry to the test battery. Please try again!");
    }
}

/**
 * Handle updates in the test battery
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editEntry()
{
    $db   =& \Database::singleton();
    $user =& User::singleton();
    if (!$user->hasPermission('battery_manager_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $entryID = $_POST['id'];

    // Retrieve values entered by user
    $form_data = getFormData();

    foreach ($form_data as $key => $value) {
        if ($value === "null") {
            $form_data[$key] = null;
        }
    }
    // Update entry to Test Battery
    try {
          $db->update('test_battery', $form_data, ['ID' => $entryID]);
    } catch (DatabaseException $e) {
        showError("Could not update entry "+$entryID+" to the test battery. Please try again!");
    }
    return json_encode($form_data);
}

/**
 * Retrieve values entered by user
 *
 * @return array
 */
function getFormData()
{
    $form_data = array(
                   'Test_name'    => $_POST['instrument'] ?? null,
                   'AgeMinDays'   => $_POST['ageMinDays'] ?? null,
                   'AgeMaxDays'   => $_POST['ageMaxDays'] ?? null,
                   'Stage'        => $_POST['stage'] ?? null,
                   'SubprojectID' => $_POST['subproject'] ?? null,
                   'Visit_label'  => $_POST['visitLabel'] ?? null,
                   'CenterID'     => $_POST['forSite'] ?? null,
                   'firstVisit'   => $_POST['firstVisit'] ?? null,
                   'instr_order'  => $_POST['instrumentOrder'] ?? null,
    );
    if (isset($_POST['active'])) {
        $form_data['Active'] = $_POST['active'];
    }
    return $form_data;
}

/**
 * Utility function to return errors from the server
 *
 * @param string $message error message to display
 *
 * @return void
 */
function showError($message)
{
    if (!isset($message)) {
        $message = 'An unknown error occurred!';
    }
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
}
