<?php
/**
 * This page displays the list of Resolved violations which have been
 * marked as resolved by one of the following methods: Reran,
 * Emailed site/pending,
 * Inserted, Rejected, Inserted with flag, Other.
 *
 * PHP Version 7
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\mri_violations;
/**
 * Implement the menu filter for searching through resolved violations
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Resolved_Violations extends \DataFrameworkMenu
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
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite'
            ]
        );
    }

   /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
    {
       return [];
    }
    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return ['violated_scans_view_allsites'];
    }

    /**
     * We do not use the base project filter because since it's a violated
     * scan, it's possible that the project will be null. Instead we add
     * our own UserProjectMatchOrNull filter.
     *
     * @return bool false
     */
    public function useProjectFilter() : bool
    {
        return false;
    }

    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return (new ResolvedViolationsProvisioner())
            ->filter(new UserProjectMatchOrNull);
    }
}

