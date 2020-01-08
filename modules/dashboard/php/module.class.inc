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

    /**
     * {@inheritDoc}
     *
     * @param string $type The type of widgets to get
     * @param \User  $user The user widgets are being retrieved for.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user)
    {
        switch($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $config  = $factory->config();
            return [
                $this->_getWelcomeWidget($DB, $config, $user),
                $this->_getTasksWidget()
            ];
        }
        return [];

    }

    /**
     * Get the content for the welcome widget which appears on the dashboard.
     * The welcome widget is (usually) the first widget on the dashboard with
     * a few words about the project.
     *
     * @param \Database   $DB     The database with the welcome message
     * @param \NDB_Config $config The config object with the external links
     * @param \User       $user   The user accessing the dashboard.
     *
     * @return \LORIS\GUI\Widget
     */
    private function _getWelcomeWidget(
        \Database $DB,
        \NDB_Config $config,
        \User $user
    ) {
        $last_login      = $user->getLastLogin($DB);
        $projectdesc     = $config->getSetting('projectDescription');
        $dashboard_links = $config->getExternalLinks('dashboard');
        $links           = [];
        foreach ($dashboard_links as $text => $url) {
            $links[] = array(
                'url'        => $url,
                'label'      => $text,
                'WindowName' => md5($url),
            );
        }

        $footer = "";
        if (!empty($links)) {
            $footer = $this->renderTemplate(
                "welcomefooter.tpl",
                [
                    'dashboard_links' => $links,
                ]
            );
        }

        $logindatestring = "";
        if($last_login === null) {
            $logindatestring = "...never. Welcome!";
        } else {
            // Note: This is the format from MySQL for historical reasons.
            // We might want to make it a more human-friendly since we have
            // a \DateTime object.
            $logindatestring = $last_login->format('Y-m-d H:i:s');
        }
        return new Widget(
            new WidgetContent(
                "",
                $this->renderTemplate(
                    "welcomebody.tpl",
                    [
                        'username'            => $user->getFullname(),
                        'last_login'          => $logindatestring,
                        'project_description' => $projectdesc,
                    ],
                ),
                $footer
            ),
            "normal",
            0,
        );
    }

    /**
     * Get task widget for the dashboard. The task widget is the list of "My Tasks"
     * in the sidebar. It further uses "usertask" type widgets to display a list
     * of tasks for the user.
     *
     * @return \LORIS\GUI\Widget
     */
    private function _getTasksWidget()
    {
        $DB      = \NDB_Factory::singleton()->database();
        $modules = \Module::getActiveModules($DB);
        $user    = \User::singleton();

        $widgets = [];
        foreach ($modules as $module) {
            if ($module->hasAccess($user)) {
                $widgets = array_merge(
                    $widgets,
                    $module->getWidgets('usertasks', $user)
                );
            }
        }
        return new Widget(
            new WidgetContent(
                "My Tasks",
                $this->renderTemplate(
                    "mytasks.tpl",
                    [
                        'tasks' => $widgets
                    ],
                ),
                ""
            ),
            "small",
            1,
        );
    }
}
