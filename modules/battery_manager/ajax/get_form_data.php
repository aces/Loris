<?php
/**
 * Battery Manager get data
 *
 * Gets data to populate dropdowns in Add tab and Edit page
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

if (sanitize('form') !== null) {
    $form = sanitize('form');
    if ($form === "add") {
        echo getAddFormData();
    } else if ($form === "edit") {
        echo getEditFormData();
    }
}

/**
 * Get form data for Add form
 *
 * @return json object
 */
function getAddFormData()
{
    $addFormData = getFormData();
    return json_encode($addFormData);
}

/**
 * Get form data for Edit form
 * Add form element for Active status
 * Add entry data in json form
 *
 * @return json object
 */
function getEditFormData()
{
    $editFormData = getFormData();

    // Add for element for Active status
    $editFormData['active'] = getYesNoList();

    // Add entry data using entry ID
    if (sanitize('ID') !== null) {
        $entryID = sanitize('ID');
        $editFormData['batteryData'] = getEntryData($entryID);
    }

    return json_encode($editFormData);
}

/**
 * Return object of fields and their values from database
 *
 * @return array
 */
function getFormData()
{
    $formData = [
                 'instruments' => Utility::getAllInstruments(),
                 'stages'      => getStagesList(),
                 'subprojects' => Utility::getSubprojectList(null),
                 'visits'      => Utility::getVisitList(),
                 'sites'       => Utility::getSiteList(false),
                 'firstVisits' => getYesNoList(),
                ];

    return $formData;
}

/**
 * Return associate array of stages
 *
 * @return array
 */
function getStagesList()
{
    $stageList = array(
                  'Not Started'   => 'Not Started',
                  'Screening'     => 'Screening',
                  'Visit'         => 'Visit',
                  'Approval'      => 'Approval',
                  'Subject'       => 'Subject',
                  'Recycling Bin' => 'Recycling Bin',
                 );
    return $stageList;
}

/**
 * Return associate array of yes and no values
 *
 * @return array
 */
function getYesNoList()
{
    $yesNoList = array(
                  'Y' => 'Yes',
                  'N' => 'No',
                 );
    return $yesNoList;
}

/**
 * Get entry data from the test_battery
 *
 * @param string $entryID the id of the entry
 *
 * @return array
 */
function getEntryData($entryID)
{
    $db = \Database::singleton();

    $query = " SELECT
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
               instr_order FROM test_battery WHERE id = :id ";
    // Get values of entry using entry ID
    $entry = $db->pselectRow($query, array( 'id' => $entryID));

    return $entry;
}

/**
 * Sanitize GET variable
 *
 * @param string $field to sanitize
 *
 * @return string $sanitize[$field]
 */
function sanitize($field)
{
    $sanitize = array_map('htmlentities', $_GET);
    return $sanitize[$field];
}
