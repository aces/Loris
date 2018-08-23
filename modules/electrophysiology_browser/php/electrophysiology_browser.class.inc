<?php declare(strict_types=1);

/**
 * This class features the code for the menu portion of the LORIS
 * electrophysiology browser module.
 *
 * PHP version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */
namespace LORIS\electrophysiology_browser;
/**
 * Provides the PHP code for the menu filter for the electrophysiology browser
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */

class Electrophysiology_Browser extends \DataFrameworkMenu
{

    public $AjaxModule   = true; // stops from running the query twice
    public $skipTemplate = true; // stops from looking for a smarty template

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
     * Tells the base class that this page's provisioner can support
     * the UserSiteMatch filter.
     *
     * @return bool always true
     */
    public function useSiteFilter(): bool
    {
        return true;
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
    function getFieldOptions(): array
    {
        // create user object
        $user          = \NDB_Factory::singleton()->user();
        $list_of_sites = array();

        // grep the sites available to the user
        if ($user->hasPermission('electrophysiology_browser_view_allsites')) {
            // get the list of study sites - to be replaced by the Site object
            $siteNames     = array_values(\Utility::getSiteList());
            $list_of_sites = array_combine($siteNames, $siteNames);
        } else {
            // allow only to view own site data
            $siteIDs = $user->getCenterIDs();
            // Index sites using their names (used to filter react tables)
            foreach ($siteIDs as $val) {
                $site = \Site::singleton($val);
                if ($site->isStudySite()) {
                    $list_of_sites[$site->getCenterName()] = $site->getCenterName();
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

        return array(
            'sites'    => $list_of_sites,
            'projects' => $list_of_projects,
        );

    }



    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new ElectrophysiologyBrowserRowProvisioner();
    }




    /**
     * Include additional JS files
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            array(
                $baseURL
                . '/electrophysiology_browser/js/electrophysiologyBrowserIndex.js',
            )
        );
    }

}