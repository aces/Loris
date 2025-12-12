<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

/**
 * Implement the menu filter for searching through redcap data
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class REDCap extends \DataFrameworkMenu
{
    /**
     * Check if user should be allowed to see this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if the user is permitted to see violated scans
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'redcap_ui_view',
            ]
        );
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
     * Set up the variables required by NDB_Menu_Filter class for
     * constructing a query
     *
     * @return array list of sites
     */
    public function getFieldOptions(): array
    {
        return [];
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool always true
     */
    public function useProjectFilter(): bool
    {
        return false;
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new REDCapProvisioner($this->loris);
    }

    /**
     * Overrides base getJSDependencies() to add support for a React file.
     *
     * @return array of extra JS files that this page depends on
     */
    public function getJSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            [$baseurl . "/redcap/js/redcapIndex.js"]
        );
    }
}
