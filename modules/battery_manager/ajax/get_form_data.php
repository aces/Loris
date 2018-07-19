<?php
/**
 * Battery Manager adder
 *
 * Gets data to populate dropdowns in Add tab
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */



if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action === "getFormData") {
        echo getFormData();
    }
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

    return json_encode($formData);
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
