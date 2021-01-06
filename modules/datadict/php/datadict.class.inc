<?php
/**
 * Datadict module
 *
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
namespace LORIS\datadict;
/**
 * Datadict module
 *
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Datadict extends \DataFrameworkMenu
{
    /**
     * Overloading this method to allow access to site users (their own site
     * only) and users w/ multisite privs
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('data_dict_view') ||
                $user->hasPermission('data_dict_edit'));
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return null;
    }

    /**
     * Returns a list of instruments to use as the "Source From"
     * filter options
     *
     * @return array Dynamic field options
     */
    public function getFieldOptions() : array
    {
        $instruments     = \Utility::getAllInstruments();
        $dictInstruments = array();
        foreach ($instruments as $instrument => $name) {
            // Since the testname does not always match the table name in the
            // database we need to instantiate the object to get the table name
            $iObj = \NDB_BVL_Instrument::factory(
                $instrument,
                '',
                ''
            );
            $key  = $iObj->usesJSONData() ? $iObj->testName:$iObj->table;
            // Append other testnames if multiple tests use the same table
            $otherNames = '';
            if (isset($dictInstruments[$key])) {
                $otherNames = "/".$dictInstruments[$key];
            }
            $dictInstruments[$key] = $name . $otherNames;
        }
        return array(
            'sourceFrom' => $dictInstruments,
        );
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new DataDictRowProvisioner();
    }

    /**
     * Include the column formatter required to make the content editable in
     * the datadict menu
     *
     * @return array of javascript to be inserted
     **/
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/datadict/js/dataDictIndex.js",
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
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb('Data Dictionary', "/$this->name")
        );
    }

    /**
     * The datadict module does not have any concept of a project.
     *
     * @return bool
     */
    public function useProjectFilter() : bool
    {
        return false;
    }
}
