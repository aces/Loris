<?php
/**
 * Dashboard: displays recruitment and study progression charts,
 * user tasks and document repository notifications
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

namespace LORIS\dashboard;
/**
 * Dashboard: displays recruitment and study progression charts,
 * user tasks and document repository notifications
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class Dashboard extends \NDB_Page
{

    /**
     * Creates the template data for the dashboard
     *
     * @return void
     */
    function setup()
    {
        $DB      = \NDB_Factory::singleton()->database();
        $modules = \Module::getActiveModules($DB);
        $user   = \User::singleton();

        $smallwidgets = [];
        $mainwidgets = [];
        foreach ($modules as $module) {
            if ($module->hasAccess($user)) {
                $widgets = $module->getWidgets('dashboard', $user);
                foreach ($widgets as $widget) {
                    switch ($widget->getSize()) {
                    case "small":
                        $smallwidgets[] = $widget;
                        break;
                    default:
                        $mainwidgets[] = $widget;
                        break;
                    }
                }
            }
        }
        usort(
            $smallwidgets,
            function($a, $b) {
                return $a->getOrder() <=> $b->getOrder();
            }
        );
        usort(
            $mainwidgets,
            function($a, $b) {
                return $a->getOrder() <=> $b->getOrder();
            }
        );
        $this->tpl_data['smallwidgets'] = $smallwidgets;
        $this->tpl_data['mainwidgets'] = $mainwidgets;
    }

    /**
     * Include additional CSS files:
     *  1. dashboard.css
     *
     * @return array of css to be included
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/dashboard/css/dashboard.css"]
        );
    }

    /**
     * Add dependency on D3 and C3 javascript libraries
     * for the pretty dashboards in the chart
     *
     * @return array of javascript files to be included
     */

    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting('www');
        $baseurl = $www['url'];

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
                $baseurl . '/js/d3.min.js',
                $baseurl . '/js/c3.min.js',
                $baseurl . '/dashboard/js/dashboard-helper.js',
            )
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail();
    }
}

