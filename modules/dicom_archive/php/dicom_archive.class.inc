<?php declare(strict_types=1);

/**
 * This class features the code for the menu portion
 * of the Loris dicom archive.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\dicom_archive;

use LORIS\Data\Filters\CompositeORFilter;
use LORIS\Data\Filters\CompositeANDFilter;
use LORIS\Data\Filters\UserSiteMatch;
use LORIS\Data\Filters\UserHasAnyPermission;
use LORIS\Data\Filters\UserProjectMatch;
use LORIS\Data\Filters\ResourceHasNoSession;
use LORIS\Data\Filters\UserIsCreator;

/**
 * Provides the PHP code for the menu filter for the dicom archive
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Dicom_Archive extends \DataFrameworkMenu
{
    protected $dataSessionCanBeNull = true;

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'dicom_archive_view_allsites',
                'dicom_archive_view_ownsites',
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
        return ['dicom_archive_view_allsites'];
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool always false
     */
    public function useProjectFilter() : bool
    {
        // Only enable project filtering if the site project permissions are enabled
        // to be compatible with projects not requiring a session ID for all DICOMS
        $config           = \NDB_Factory::singleton()->config();
        $siteprojectperms = $config->getSetting(
            'useAdvancedPermissions'
        );
        return $siteprojectperms === 'true';
    }

    /**
     * Determines which permissions (if any) allows the user access to resources
     * where the project is null.
     *
     * @return ?array
     */
    public function nullSessionPermissionNames() : ?array
    {
        return ['dicom_archive_nosessionid'];
    }

    /**
     * Return the list of field options required to be serialized to JSON
     * in order to render the frontend.
     *
     * @return array
     */
    function getFieldOptions() : array
    {
        // Create an associative array that uses the Site name for both the
        // keys and the values.
        $site_names   = array_values(\Utility::getSiteList());
        $site_options = array_combine($site_names, $site_names);

        return [ 'sites' => $site_options ];
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        $provisioner = new DicomArchiveRowProvisioner($this->loris);

        $provisioner = $provisioner->map(new DICOMArchiveAnonymizer());

        return $provisioner;
    }

    /**
     * Return a data provisioner of the same type as BaseDataProvisioner, with
     * default LORIS filters applied. A subclass may override this to remove (or
     * change) filters.
     *
     * @return \LORIS\Data\Provisioner a provisioner with default filters added
     */
    public function getDataProvisionerWithFilters() : \LORIS\Data\Provisioner
    {
        $provisioner      = $this->getBaseDataProvisioner();
        $allSitePerms     = $this->allSitePermissionNames();
        $nullSessionPerms = $this->nullSessionPermissionNames();

        // Set filter default returns based on if the data loaded by this module can
        // have or not a null session
        $defaultReturn = $this->dataSessionCanBeNull ? false : null;

        //Default filter to User Site Match
        $filter = new UserSiteMatch($defaultReturn);

        //Combine filter with Null session permissions if data can have null sessions
        if ($this->dataSessionCanBeNull) {
            $filter = new CompositeORFilter(
                $filter,
                new CompositeANDFilter(
                    new UserHasAnyPermission($nullSessionPerms),
                    new ResourceHasNoSession(),
                ),
            );
        }

        // If the user has any of the All Site permissions, combine as an OR filter
        if (!empty($allSitePerms)) {
            $filter = new CompositeORFilter(
                $filter,
                new UserHasAnyPermission($allSitePerms),
            );
        }

        // Check if module uses Project filters
        if ($this->useProjectFilter()) {
            //Default project filter to User Project Match
            $projectFilter = new UserProjectMatch($defaultReturn);

            // Check if resources with null project should be included in the results
            if (!empty($nullSessionPerms)) {
                $projectFilter = new CompositeORFilter(
                    new CompositeANDFilter(
                        new ResourceHasNoSession(),
                        new UserHasAnyPermission($nullSessionPerms)
                    ),
                    new UserProjectMatch($defaultReturn)
                );
            }

            $filter = new CompositeANDFilter($filter, $projectFilter);
        }

        // Final filter, check if the user looking at the data is the user that
        // uploaded the data
        $filter = new CompositeORFilter(
            $filter,
            new UserIsCreator(),
        );

        $provisioner = $provisioner->filter($filter);
        return $provisioner;
    }

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/dicom_archive/js/dicom_archive.js",
            ]
        );
    }
}

