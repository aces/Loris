<?php declare(strict_types=1);

/**
 * This class features the code for the menu portion
 * of the Loris dicom archive.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\dicom_archive;

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

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('dicom_archive_view_allsites');
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
        return false;
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

