<?php

/**
 * This class features the code for the menu portion of the Loris imaging
 * browser.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license    Loris License
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\imaging_browser;

/**
 * Provides the PHP code for the menu filter for the imaging browser
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license    Loris License
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Imaging_Browser extends \DataFrameworkMenu
{
    var $AjaxModule      = true;
    public $skipTemplate = true;
    public $fieldOptions;
    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user hass access
     */
    function _hasAccess(\User $user) : bool
    {
        /* User has access if they have an 'all site' permission or if they are
        * part of a study site and are permitted to view their own site.
         */
        return $user->hasAnyPermission(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_phantom_allsites',
                'imaging_browser_phantom_ownsite',
            ]
        )
            || (
                $user->hasStudySite()
                && $user->hasPermission('imaging_browser_view_site')
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
        return [
            'imaging_browser_view_allsites',
            'imaging_browser_phantom_allsites',
        ];
    }

    /**
     * The imaging browser uses the image session's project for filtering projects.
     *
     * @return bool
     */
    public function useProjectFilter() : bool
    {
        return true;
    }

    /**
     * Setup $this->tpl_data for use by Smarty
     *
     * @return array array with fieldOptions
     */
    function getFieldOptions() : array
    {
        // create user object
        $user     = \User::singleton();
        $siteList = [];

        // get list of sites available for the user
        if ($user->hasPermission('imaging_browser_view_allsites')
            || $user->hasPermission('imaging_browser_phantom_allsites')
        ) {
            // get the list of study sites
            $siteList = \Utility::getSiteList();
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            $siteIDs = $user->getCenterIDs();
            foreach ($siteIDs as $val) {
                $site = \Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }

        // get list of projects
        $list_of_projects = [];
        $projectList      = \Utility::getProjectList();
        foreach ($projectList as $key => $project) {
            unset($projectList[$key]);
            $list_of_projects[$project] = $project;
        }

        // get visit QC status options
        $visitQCStatus = [
            'Pass' => 'Pass',
            'Fail' => 'Fail',
        ];

        // get Pending/New options
        $pending = [
            'P' => 'Pending',
            'N' => 'New',
        ];

        $all_scan_types = array_values(\Utility::getScanTypeList());
        $sequenceTypes  = array_combine($all_scan_types, $all_scan_types);

        $config = \NDB_Config::singleton();
        $toTable_scan_types = $config->getSetting('tblScanTypes');

        // get entity type options
        $entityType = [
            'Human'   => 'Human',
            'Scanner' => 'Scanner',
        ];

        return [
            'sites'         => $siteList,
            'projects'      => $list_of_projects,
            'visitQCStatus' => $visitQCStatus,
            'sequenceTypes' => $sequenceTypes,
            'pendingNew'    => $pending,
            'configLabels'  => $toTable_scan_types,
            'entityType'    => $entityType,
        ];

    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new ImagingBrowserRowProvisioner();
    }

    /**
     * Return a data provisioner of the same type as BaseDataProvisioner, with
     * additional LORIS filters applied.
     *
     * @return \LORIS\Data\Provisioner a provisioner with specific filters added
     */
    public function getDataProvisionerWithFilters(): \LORIS\Data\Provisioner
    {

        $provisioner = parent::getDataProvisionerWithFilters();

        $provisioner = $provisioner
            ->filter(new \LORIS\Data\Filters\ScansFilter())
            ->filter(new \LORIS\Data\Filters\PhantomsFilter());

        return $provisioner;
    }

    /**
     * Add CSS dependencies
     *
     * @return array The list of CSS files this page depends on
     */
    function getCSSDependencies(): array
    {
        return [
            '/imaging_browser/css/imaging_browser.css',
        ];
    }

    /**
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/imaging_browser/js/imagingBrowserIndex.js',
        ];
    }
}
