<?php declare(strict_types=1);

/**
 * This class features the code for the menu portion of the LORIS
 * electrophysiology browser module.
 *
 * PHP version 7
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
     * Get dynamic field options needed for React to render the
     * page.
     *
     * @return array
     */
    function getFieldOptions(): array
    {
        $user = \User::singleton();
        $db   =  $this->loris->getDatabaseConnection();

        // get list of types
        $list_of_types = [];
        $typeList      = $db->pselect(
            "SELECT OutputTypeName FROM physiological_output_type",
            []
        );
        foreach ($typeList as $row) {
            $list_of_types[$row['OutputTypeName']] = ucfirst($row['OutputTypeName']);
        }

        return [
            'sites'    => $this->getSiteOptions($user, false),
            'projects' => $this->getProjectOptions($user, false),
            'types'    => $list_of_types
        ];
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
            [
                $baseURL
                . '/electrophysiology_browser/js/electrophysiologyBrowserIndex.js',
            ]
        );
    }

}
