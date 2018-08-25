<?php
/**
 * Battery Manager entry adder
 *
 * Checks Test Battery for duplicates
 * Handles insertions in the Test Battery
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
if (sanitize('action', 'get') !== null) {
    $action = sanitize('action', 'get');
    if ($action == "checkForDuplicate") {
        echo checkForDuplicate();
    } else if ($action == "add") {
        addEntry();
    }
}

/**
 * Return string containing JSON representation of duplicate entry if it exists
 * Return null otherwise
 *
 * @return string or null
 */
function checkForDuplicate()
{
    $db = \Database::singleton();

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
    // Iterate through values entered by user
    foreach ($form_data as $key => $value) {
        if ($i > 0) {
            $connector = "AND ";
        }
        if (isset($value) || $value !== null) {
            $query .= $connector . $key . " = :" . $key . " ";
        } else {
            $query .= $connector . $key . " IS NULL ";
            // Remove null parameters
            unset($form_data[$key]);
        }
        $i++;
    }

    // Select duplicate entry from Test Battery
    $entry = $db->pselectRow(
        $query,
        $form_data
    );

    // Return string containing JSON representation of duplicate entry if it exists
    // Return null otherwise
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
    $db   = \Database::singleton();
    $user = User::singleton();
    if (!$user->hasPermission('battery_manager_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    // Retrieve values entered by user
    $form_data = getFormData();

    // Make sure new entry is active
    $form_data['Active'] = 'Y';

    // Check for duplicates on the back-end
    if (checkForDuplicate() !== null) {
        header('HTTP/1.1 400 Bad Request');
        exit("There exists a duplicate entry in the Test Battery.");
    } else {
        // Add entry to Test Battery
        try {
            $db->insert('test_battery', $form_data);
        } catch (DatabaseException $e) {
            showError("Could not add entry to the Test Battery. Please try again!");
        }
    }
}

/**
 * Retrieve values entered by user
 *
 * @return array
 */
function getFormData()
{
    $form_data = array(
                  'Test_name'    => sanitize('instrument', 'post') ?? null,
                  'AgeMinDays'   => sanitize('ageMinDays', 'post') ?? null,
                  'AgeMaxDays'   => sanitize('ageMaxDays', 'post') ?? null,
                  'Stage'        => sanitize('stage', 'post') ?? null,
                  'SubprojectID' => sanitize('subproject', 'post') ?? null,
                  'Visit_label'  => sanitize('visitLabel', 'post') ?? null,
                  'CenterID'     => sanitize('forSite', 'post') ?? null,
                  'firstVisit'   => sanitize('firstVisit', 'post') ?? null,
                  'instr_order'  => sanitize('instrumentOrder', 'post') ?? null,
                 );

    // Convert null strings to nulls
    foreach ($form_data as $key => $value) {
        if ($value === "null") {
            $form_data[$key] = null;
        }
    }

    return $form_data;
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
    if ($request === 'get') {
        $sanitize = array_map('htmlentities', $_GET);
    } else if ($request === 'post') {
        $sanitize = array_map('htmlentities', $_POST);
    }
    return $sanitize[$field];
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
    exit($message);
}
