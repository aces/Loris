<?php
/**
 * Data Querying Module
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Loris
 * @subpackage DQT
 * @author     Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\dqt;

/**
 * Data Querying Module
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Loris
 * @subpackage DQT
 * @author     Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Dqt extends \NDB_Form
{
    public $skipTemplate = true;

    /**
     * Check user access permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . '/js/d3.min.js',
                $baseURL . '/js/c3.min.js',
                $baseURL . '/dqt/js/react.fieldselector.js',
                $baseURL . '/dqt/js/react.filterBuilder.js',
                $baseURL . '/dqt/js/react.tabs.js',
                $baseURL . '/dqt/js/react.sidebar.js',
                $baseURL . '/dqt/js/react.app.js',
                $baseURL . '/js/flot/jquery.flot.min.js',
                $baseURL . '/js/components/PaginationLinks.js',
                $baseURL . '/js/jszip/jszip.min.js',
                $baseURL . '/js/components/MultiSelectDropdown.js',
            ]
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb('Data Query Tool', "/$this->name")
        );
    }

    /**
     * Include additional CSS files:
     *  1. dataquery.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . '/dqt/css/dataquery.css',
                $baseURL . '/css/c3.css',
            ]
        );
    }
}
