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
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();
        return $user->hasPermission('config');
    }


    /**
    * Loads the project page.
    *
    * @param string $name       The test name being accessed
    * @param string $page       The subtest being accessed (may be null)
    * @param string $identifier The identifier for the data to load on this page
    * @param string $commentID  The CommentID to load the data for
    * @param string $formname   The name to give this form
    *
    * @return none
    */
    function setup()
    {
        parent::setup();
        $factory     = \NDB_Factory::singleton();
        $config      = $factory->config();
        $configs     = \NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        if ($useProjects === "true") {
            $projectList = \Utility::getProjectList();
            $projects    = array();
            foreach ($projectList as $ProjectID => $Name) {
                $projects[$ProjectID] = $config->getProjectSettings($ProjectID);
                $projects[$ProjectID]['subprojects']
                    = \Utility::getSubprojectsForProject($ProjectID);
            }
            $this->tpl_data['projects'] = $projects;
        } else {
            throw new \ConfigurationException(
                "Projects are not used in this study."
            );
        }
    }
}
