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
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/js/d3.min.js',
            '/js/c3.min.js',
            '/dqt/js/react.fieldselector.js',
            '/dqt/js/react.filterBuilder.js',
            '/dqt/js/react.tabs.js',
            '/dqt/js/react.sidebar.js',
            '/dqt/js/react.app.js',
            '/js/flot/jquery.flot.min.js',
            '/js/components/PaginationLinks.js',
            '/js/jszip/jszip.min.js',
            '/js/components/MultiSelectDropdown.js',
        ];
    }

    /**
     * Add CSS dependencies
     *
     * @return array The list of CSS files this page depends on
     */
    function getCSSDependencies(): array
    {
        return [
            '/dqt/css/dataquery.css',
            '/css/c3.css',
        ];
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
}
