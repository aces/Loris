<?php
/**
 * The configuration module is used to manage the configuration of Loris.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/

/**
 * Admin_Config Class
 *
 * This class is to configure the system settings
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/
class NDB_Form_Configuration extends NDB_Form
{
    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        return $user->hasPermission('config');
    }

    /**
     * Constructor
     *
     * @return null
     */
    function configuration()
    {
        $config =& NDB_Config::singleton();

        $instruments = Utility::getAllInstruments();
        $instruments = array_merge(array('' => ''), $instruments);

        $this->tpl_data['useProjects']     = $config->getSetting("useProjects");
        $this->tpl_data['parentMenuItems'] = $this->_getParentConfigLabels();
        $this->tpl_data['config']          = $this->_getConfigSettingTree();
        $this->tpl_data['instruments']     = $instruments;
        $this->tpl_data['sandbox']         = $config->getSetting("sandbox");

    }

    /**
     * Gets an array of the top level configuration items
     * This is used to create the configuration setting category menu
     *
     * @return array of parent config items
     */
    function _getParentConfigLabels()
    {
        $this->DB = Database::singleton();

        $parentConfigItems = $this->DB->pselect(
            "SELECT Label, Name 
             FROM ConfigSettings 
             WHERE Parent IS NULL AND Visible=1 ORDER BY OrderNumber",
            array()
        );

        return $parentConfigItems;
    }

    /**
     * Returns an array of configuration settings in a tree format.
     * The array contains all of the settings that are in config table
     * in the database. However, if the value if overridden in the config.xml,
     * the value for that setting is replaced with the value from the config.xml
     *
     * @return array of config settings
     */
    function _getConfigSettingTree()
    {
        $config =& NDB_Config::singleton();

        // Get the names and meta-information for the config settings in the database
        $configs = $this->DB->pselect(
            "SELECT * FROM ConfigSettings WHERE Visible=1 ORDER BY OrderNumber",
            array()
        );

        // Check whether any setting is overwritten in the config.xml
        // Add this info to the array so form entries can be disabled in front end
        // Update the value for the setting to the value from the config.xml
        foreach ($configs as &$setting) {
            try {
                $setting['Disabled'] = 'Yes';
                if ($setting['Parent'] != null) {
                    $valueFromXML = $config->getSettingFromXML($setting['Name']);
                    if (!is_array($valueFromXML)) {
                        $setting['Value'][0] = $valueFromXML;
                    } else {
                        $setting['Value'] = $valueFromXML;
                    }
                }
            } catch (ConfigurationException $e) {
                $setting['Disabled'] = 'No';
            }
        }

        // Now check for config settings from the database for the fields not
        // overridden in the config.xml
        foreach ($configs as &$setting) {
            if ($setting['Disabled'] == 'No') {
                $value = $this->DB->pselect(
                    "SELECT ID, Value FROM Config WHERE ConfigID=:ID",
                    array('ID' => $setting{'ID'})
                );
                if ($value) {
                    foreach ($value as $subvalue) {
                        $setting['Value'][$subvalue['ID']] = $subvalue['Value'];
                    }
                }
            }
        }

        // build a tree from configs array
        foreach ($configs as &$node) {
            $node['Children']  = array();
            $tree[$node['ID']] = &$node;

        }
        foreach ($configs as &$node) {
            $tree[$node['Parent']]['Children'][] = &$node;
        }

        return $configs;
    }

    /**
     * Loads the subproject management submodule
     *
     * @return none
     */
    function subproject()
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $subprojectList = Utility::getSubprojectList();
        $subprojects    = array();
        foreach ($subprojectList as $subprojectID => $title) {
            $subprojects[$subprojectID]
                = $config->getSubprojectSettings($subprojectID);
        }
        $this->tpl_data['subprojects'] = $subprojects;

        $this->tpl_data['useEDCOptions']
            = array(
               '1' => 'Yes',
               '0' => 'No',
              );

        $this->tpl_data['WindowDifferenceOptions']
            = array(
               'battery' => 'Closest Test Battery',
               'optimal' => 'Optimal Visit Window for Visit Label',
              );
    }

    /**
    * Loads the project management module
    *
    * @return none
    */
    function project()
    {
        $factory     = NDB_Factory::singleton();
        $config      = $factory->config();
        $configs     = NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        if ($useProjects === "true") {
            $projectList = Utility::getProjectList();
            $projects    = array();
            foreach ($projectList as $ProjectID => $Name) {
                $projects[$ProjectID] = $config->getProjectSettings($ProjectID);
                $projects[$ProjectID]['subprojects']
                    = Utility::getSubprojectsForProject($ProjectID);
            }
            $this->tpl_data['projects'] = $projects;
        } else {
            throw new ConfigurationException("Projects are not used in this study.");
        }
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/configuration/js/configuration_helper.js",
            )
        );
    }

     /**
        * Include additional CSS files:
        *  1. configuration
        *
        * @return array of CSS to be inserted
        */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/configuration/css/configuration.css"]
        );
    }

}

?>
