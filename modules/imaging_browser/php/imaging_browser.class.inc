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
            array(
                'imaging_browser_view_allsites',
                'imaging_browser_phantom_allsites',
                'imaging_browser_phantom_ownsite',
            )
        )
            || (
                $user->hasStudySite()
                && $user->hasPermission('imaging_browser_view_site')
            );
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserSiteMatch filter.
     *
     * @return bool always false
     */
    public function useSiteFilter() : bool
    {
        return false;
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
        $siteList = array();

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
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site = \Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }

        // get list of projects
        $list_of_projects = array();
        $projectList      = \Utility::getProjectList();
        foreach ($projectList as $key => $project) {
            unset($projectList[$key]);
            $list_of_projects[$project] = $project;
        }

        // get visit QC status options
        $visitQCStatus = array(
            'Pass' => 'Pass',
            'Fail' => 'Fail',
        );

        // get Pending/New options
        $pending = array(
            'P' => 'Pending',
            'N' => 'New',
        );

        // get list of scan types
        $all_scan_types = \Utility::getScanTypeList();

        // get list of scan types that should be present in the data table
        // Get the intersection between all the scan types and those
        // that are desired to go into imaging browser table, based on
        // array values rather than keys (hence the array_flip), then flip
        // the resulting array back to revert it to a key/value (i.e.
        // acquisition protocol ID/scan type) combination.
        $config = \NDB_Config::singleton();
        $toTable_scan_types = $config->getSetting('tblScanTypes');
        $scan_id_types      = array_flip(
            array_intersect_key(
                array_flip($all_scan_types),
                array_flip($toTable_scan_types)
            )
        );

        return [
            'sites'         => $siteList,
            'projects'      => $list_of_projects,
            'visitQCStatus' => $visitQCStatus,
            'sequenceTypes' => $all_scan_types,
            'pendingNew'    => $pending,
            'configLabels'  => $scan_id_types,
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
     * Include additional CSS files:
     *  1. imaging_browser.css
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/imaging_browser/css/imaging_browser.css"]
        );
    }



    /**
     * Include the column formatter
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            array(
                $baseurl . "/imaging_browser/js/imagingBrowserIndex.js",
            )
        );
    }
}
