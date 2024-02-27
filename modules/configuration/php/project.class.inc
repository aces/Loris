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
        $factory     = \NDB_Factory::singleton();
        $config      = $factory->config();
        $projectList = \Utility::getProjectList();
        $cohortList  = \Utility::getCohortList();
        $projects    = [];
        foreach (array_keys($projectList) as $ProjectID) {
            $projects[$ProjectID] = $config->getProjectSettings($ProjectID);
            $projects[$ProjectID]['projectCohorts']
                = \Utility::getCohortsForProject(
                    new \ProjectID(strval($ProjectID))
                );
        }
        $this->tpl_data['projects'] = $projects;
        $this->tpl_data['cohorts']  = $cohortList;
    }

    /**
     * Add CSS dependencies
     *
     * @return array The list of CSS files this page depends on
     */
    function getCSSDependencies(): array
    {
        return [
            '/configuration/css/configuration.css',
        ];
    }
}
