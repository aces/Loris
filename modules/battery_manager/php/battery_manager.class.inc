<?php
/**
 * This file contains the NDB_Menu_Filter_battery_manager class
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\battery_manager;

/**
 * Main class for battery manager module corresponding to /battery_manager/ URL
 * Admin section of the LorisMenu.
 *
 * Displays a list of records in the test battery and control panel to search them
 * Allows user to add, activate, and deactivate entries in the test battery
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Battery_Manager extends \NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $AjaxModule         = true;
    public $skipTemplate       = true;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& \User::singleton();

        // Set global permission to control access to both tabs of module
        $this->hasWritePermission = $user->hasPermission('battery_manager_edit');

        return $user->hasPermission('battery_manager_view');
    }

    /**
     * Create a form to filter test battery by various criteria
     *
     * @return bool
     */
    function setup()
    {
        parent::setup();

        $instruments = $this->makeKeySameAsValue(\Utility::getAllInstruments());

        $stages = $this->getStageList();

        $subprojects = $this->makeKeySameAsValue(\Utility::getSubprojectList(null));

        $visits = \Utility::getVisitList();

        $sites = $this->makeKeySameAsValue(\Utility::getSiteList(false));

        $firstVisit = $this->getYesNoList();

        $active = $this->getYesNoList();

        // Filter Form Elements
        $this->addSelect('instrument', 'Instrument', $instruments);
        $this->addBasicText('minimumAge', 'Minimum age');
        $this->addBasicText('maximumAge', 'Maximum age');
        $this->addSelect('stage', 'Stage', $stages);
        $this->addSelect('subproject', 'Subproject', $subprojects);
        $this->addSelect('visitLabel', 'Visit Label', $visits);;
        $this->addSelect('site', 'Site', $sites);
        $this->addSelect('firstVisit', 'First Visit', $firstVisit);
        $this->addBasicText('instrumentOrder', 'Instrument Order');
        $this->addSelect('active', 'Active', $active);

        return true;
    }

    /**
     * Return associative array of stages
     *
     * @return array
     */
    function getStageList()
    {
        return array(
                "Not Started"   => 'Not Started',
                "Screening"     => 'Screening',
                "Visit"         => 'Visit',
                "Approval"      => "Approval",
                "Subject"       => "Subject",
                "Recycling Bin" => "Recycling Bin",
               );
    }

    /**
     * Return associative array of yes and no values
     *
     * @return array
     */
    function getYesNoList()
    {
        return array(
                'Y' => 'Yes',
                'N' => 'No',
               );
    }

    /**
     * Change the associative array so that the keys are the same as the values
     * (ensures filter will work on columns displaying full names)
     *
     * @param array $list that needs to be updated
     *
     * @return array
     */
    function makeKeySameAsValue($list)
    {
        $options = array();
        foreach ($list as $key => $value ) {
            $options[$value] = $value;
        }
        return $options;
    }

    /**
     * Build a list of test battery records to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        // the base query
        $query  = " FROM test_battery b
                   LEFT JOIN test_names t ON b.Test_name = t.Test_name
                   LEFT JOIN subproject s ON b.SubprojectID = s.SubprojectID
                   LEFT JOIN psc p ON b.CenterID = p.CenterID ";
        $query .= " WHERE 1=1 ";

        // set the class variables
        $this->columns
            = array(
               't.Full_name',
               'b.AgeMinDays',
               'b.AgeMaxDays',
               'b.Stage',
               's.title as subproject',
               'b.Visit_label',
               'p.name as site',
               'b.firstVisit as first_visit',
               'b.instr_order as instrumentOrder',
               'b.Active as active',
               'b.id as changeStatus',
               'b.id as edit',
              );

        $this->query = $query;

        $this->group_by = '';
        $this->order_by = 'Full_name';
        $this->headers  = array(
                           'Instrument',
                           'Minimum Age',
                           'Maximum Age',
                           'Stage',
                           'Subproject',
                           'Visit Label',
                           'Site',
                           'First Visit',
                           'Instrument Order',
                           'Active',
                          );

        // Add Edit field if user has permissions
        if ($this->hasWritePermission) {
            array_push($this->headers, 'Change Status');
            array_push($this->headers, 'Edit Metadata');
        }

        return true;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        return json_encode($result);
    }

    /**
     * Include additional CSS files:
     *  1. battery_manager.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/battery_manager/css/battery_manager.css",
            )
        );
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/battery_manager/js/batteryManagerIndex.js",
            )
        );
    }
}

