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

class Dashboard extends \NDB_Form
{

    /**
     * Extra CSS URLs that are required for widgets.
     *
     * @var array
     */
    protected $widgetcss = [];

    /**
     * Extra JS URLs that are required for widgets.
     *
     * @var array
     */
    protected $widgetjs = [];

    /**
     * Page constructor for the dashboard main page.
     *
     * @param \Module $module     The test name being accessed
     * @param string  $page       The subtest being accessed (may be an empty string)
     * @param string  $identifier The identifier for the data to load on this page
     * @param string  $commentID  The CommentID to load the data for
     * @param string  $formname   The name to give this form
     */
    function __construct(
        \Module $module,
        string $page,
        string $identifier,
        string $commentID,
        string $formname
    ) {
        parent::__construct($module, $page, $identifier, $commentID, $formname);

        // This needs to be done before setup so that the widget specific CSS and
        // javascript are available for getCSSDependencies and getJSDependencies,
        // otherwise setup() only gets called by handle() of NDB_Page while
        // calculating the body.
        $DB   = \NDB_Factory::singleton()->database();
        $user = \User::singleton();

        $this->modules = \Module::getActiveModules($DB);

        $this->smallwidgets = [];
        $this->mainwidgets  = [];
        foreach ($this->modules as $module) {
            if ($module->hasAccess($user)) {
                $widgets = $module->getWidgets('dashboard', $user);
                foreach ($widgets as $widget) {
                    if (!($widget instanceof Widget)) {
                        continue;
                    }
                    switch ($widget->getSize()) {
                    case "small":
                        $this->smallwidgets[] = $widget;
                        break;
                    default:
                        $this->mainwidgets[] = $widget;
                        break;
                    }
                    $this->widgetcss = array_merge(
                        $this->widgetcss,
                        $widget->getCSSDependencies()
                    );

                    $this->widgetjs = array_merge(
                        $this->widgetjs,
                        $widget->getJSDependencies()
                    );
                }

            }
        }
        usort(
            $this->smallwidgets,
            function ($a, $b) {
                return $a->getOrder() <=> $b->getOrder();
            }
        );
        usort(
            $this->mainwidgets,
            function ($a, $b) {
                return $a->getOrder() <=> $b->getOrder();
            }
        );
    }

    /**
     * Creates the template data for the dashboard
     *
     * @return void
     */
    function setup()
    {

        $this->tpl_data['smallwidgets'] = $this->smallwidgets;
        $this->tpl_data['mainwidgets']  = $this->mainwidgets;
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
            [$baseURL . "/dashboard/css/dashboard.css"],
            $this->widgetcss,
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
        $baseurl = $factory->settings()->getBaseURL();

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
                $baseurl . '/dashboard/js/dashboard-helper.js',
            ),
            $this->widgetjs,
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

