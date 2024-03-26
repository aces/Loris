<?php

namespace LORIS\electrophysiology_uploader;

/**
 * Provides the PHP code for the menu filter for the electrophysiology uploader
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */
class Electrophysiology_Uploader extends \DataFrameworkMenu
{

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The use whose access if being checked
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('electrophysiology_browser_view_allsites')
            || ($user->hasPermission('electrophysiology_browser_view_site')
                && $user->hasStudySite()
            )
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
        return ['electrophysiology_browser_view_allsites'];
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool always true
     */
    public function useProjectFilter(): bool
    {
        return true;
    }

    /**
     * Set up the variables required by NDB_Menu_Filter class for
     * constructing a query
     *
     * @return array list of sites
     */
    protected function getFieldOptions(): array
    {
        // create user object
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();

        if ($user->hasPermission('access_all_profiles')) {
            $list_of_sites = \Utility::getSiteList();
        } else {
            $list_of_sites = $user->getStudySites();
        }

        $site_options = [];
        foreach (array_values($list_of_sites) as $name) {
            $site_options[$name] = $name;
        }

        return [
            'sites'      => $site_options,
            'visitLabel' => \Utility::getVisitList(),
        ];
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return new ElectrophysiologyUploaderProvisioner();
    }

    /**
     * {@inheritDoc}
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL .
                "/electrophysiology_uploader/js/ElectrophysiologyUploader.js",
            ]
        );
    }
}
