<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\dashboard;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Dashboard";
    }

    public function getWidgets(string $type, \User $user) {
        switch($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $DB = $factory->database();
            $config = $factory->config();
            return [
                $this->getWelcomeWidget($DB, $config, $user),
                $this->getTasksWidget()
            ];
        }
        return [];
        
    }

    private function getWelcomeWidget(\Database $DB, \NDB_Config $config, \User $user) {
            $last_login = $user->getLastLogin($DB);
            $projectdesc = $config->getSetting('projectDescription');
            $dashboard_links = $config->getExternalLinks('dashboard');
            $links = [];
            foreach ($dashboard_links as $text => $url) {
                $links[] = array(
                            'url'        => $url,
                            'label'      => $text,
                            'WindowName' => md5($url),
                        );
            }

        return new SmartyWidget(
            $this,
            "welcome.tpl",
            [
                'username' => $user->getFullname(),
                'last_login' => $last_login ?? "...never. Welcome!",
                'project_description' => $projectdesc,
                'dashboard_links' => $links,
            ],
            "",
            "normal",
            0,
        );
    }
    private function getTasksWidget() {
        $DB      = \NDB_Factory::singleton()->database();
        $modules = \Module::getActiveModules($DB);
        $user   = \User::singleton();

        $widgets = [];
        foreach($modules as $module) {
            if($module->hasAccess($user)) {
                $widgets = array_merge($widgets, $module->getWidgets('usertasks', $user));
            }
        }
        return new SmartyWidget(
            $this,
            "mytasks.tpl",
            [
                'tasks' => $widgets
            ],
            "My Tasks",
            "small",
            1,
        );
    }
}
