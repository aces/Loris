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
class Visit extends \NDB_Form
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
        $projectList        = \Utility::getProjectList();
        $subprojectList     = \Utility::getSubprojectList();
        $projectSubprojects = \Utility::getProjectSubprojectAssociations();
        $visitController    = new \LORIS\VisitController(
            \NDB_Factory::singleton()->database()
        );
        $visits = $visitController->getAllVisits();
        $list   = [];
        foreach ($projectSubprojects as $psrid=>$row) {
            $projectName  = $projectList[$row['ProjectID']];
            $SubproTitle  = $subprojectList[$row['SubprojectID']];
            $list[$psrid] = "Project: $projectName - Subproject: $SubproTitle";
        }
        $this->tpl_data['projects_subprojects'] = $list;
        $this->tpl_data['visits'] = $visits;
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
