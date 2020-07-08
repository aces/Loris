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

namespace LORIS\configuration;

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
class Project extends \NDB_Form
{
    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('config');
    }


    /**
     * Loads the project page.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $factory        = \NDB_Factory::singleton();
        $config         = $factory->config();
        $projectList    = \Utility::getProjectList();
        $subprojectList = \Utility::getSubprojectList();
        $projects       = array();
        foreach ($projectList as $ProjectID => $Name) {
            $projects[$ProjectID] = $config->getProjectSettings($ProjectID);
            $projects[$ProjectID]['projectSubprojects']
                = \Utility::getSubprojectsForProject($ProjectID);
        }
        $this->tpl_data['projects']    = $projects;
        $this->tpl_data['subprojects'] = $subprojectList;
    }

    /**
     * Include additional CSS files:
     *  1. configuration
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/configuration/css/configuration.css"]
        );
    }
}
