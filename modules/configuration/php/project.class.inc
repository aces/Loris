<?php declare(strict_types=1);

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
     * Render the project manager with React instead of Smarty.
     *
     * @var bool
     */
    public $skipTemplate = true;

    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
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
            $projectCohorts       = \Utility::getCohortsForProject(
                \ProjectID::singleton($ProjectID)
            );
            $projects[$ProjectID]['cohortIDs'] = array_map(
                'strval',
                array_keys($projectCohorts)
            );
        }
        $this->tpl_data['projects'] = $projects;
        $this->tpl_data['cohorts']  = $cohortList;
    }

    /**
     * Return the project manager data for the React page.
     *
     * @return array<string, mixed>
     */
    #[\Override]
    function toArray(): array
    {
        return [
            'projects' => $this->tpl_data['projects'] ?? [],
            'cohorts'  => $this->tpl_data['cohorts'] ?? [],
        ];
    }

    /**
     * Include additional CSS files:
     *  1. configuration
     *
     * @return array<string> CSS dependencies
     */
    function getCSSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/configuration/css/configuration.css"]
        );
    }

    /**
     * Add the React entry point for the project manager.
     *
     * @return array<string> JavaScript dependencies
     */
    #[\Override]
    function getJSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . '/configuration/js/formProject.js']
        );
    }
}
