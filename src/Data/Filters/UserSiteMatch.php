<?php
/**
 * This file provides an implementation of the UserSiteMatch filter.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Filters;

/**
 * UserSiteMatch filters out data for any resource which is not part of one of the
 * user's sites. For a DataInstance to be compatible with the UserSiteMatch filter,
 * it must implement a getCenterIDs or getCenterID method which returns an integer
 * (or array) of CenterIDs that the data belongs to. The data will be filtered out
 * unless the User is a member of at least one site that the resource DataInstance
 * is a member of.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class UserSiteMatch implements \LORIS\Data\Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user     The user that the data is being
     *                                           filtered for.
     * @param \LORIS\Data\DataInstance $resource The data being filtered.
     *
     * @return bool true if the user has a site in common with the data
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        if (method_exists($resource, 'getCenterIDs')) {
            // If the Resource belongs to multiple CenterIDs, the user can
            // access the data if the user is part of any of thos centers.
            $resourceSites = $resource->getCenterIDs();
            foreach ($resourceSites as $site) {
                if ($user->hasCenter($site)) {
                       return true;
                }
            }
            return false;
        } elseif (method_exists($resource, 'getCenterID')) {
            $resourceSite = $resource->getCenterID();
            if (!is_null($resourceSite)) {
                return $user->hasCenter($resourceSite);
            }
            // We don't know if the resource thought a null CenterID
            // should mean "no one can access it" or "anyone can access
            // it", so throw an exception.
            throw new \LorisException("getCenterID on resource returned null");
        }
        throw new \LorisException(
            "Can not implement UserSiteMatch on a resource type that has no sites."
        );
    }
}
