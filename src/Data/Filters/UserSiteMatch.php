<?php declare(strict_types=1);

namespace LORIS\Data\Filters;

/**
 * UserSiteMatch filters out data for any resource which is not part of one of the
 * user's sites. For a DataInstance to be compatible with the UserSiteMatch filter,
 * it must implement a getCenterIDs or getCenterID method which returns an integer
 * (or array) of CenterIDs that the data belongs to. The data will be filtered out
 * unless the User is a member of at least one site that the resource DataInstance
 * is a member of.

 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserSiteMatch implements \LORIS\Data\Filter
{

    /**
     * Constructor
     *
     * @param ?bool     $defaultReturn The default return value to return instead of
     *                                throwing an exception when an exception is
     *                                indesirable.
     *
     */
    public function __construct(protected ?bool $defaultReturn = null)
    {
    }

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
        if ($resource instanceof \LORIS\StudyEntities\MultiSiteHaver) {
            // If the Resource belongs to multiple CenterIDs, the user can
            // access the data if the user is part of any of those centers.
            foreach ($resource->getCenterIDs() as $site) {
                if ($user->hasCenter($site)) {
                       return true;
                }
            }
            return false;
        } elseif ($resource instanceof \LORIS\StudyEntities\SiteHaver) {
            return $user->hasCenter($resource->getCenterID());
        }

        if ($this->defaultReturn === null) {
            throw new \LorisException(
                "Can not implement UserSiteMatch on a resource type that has no sites."
            );
        }
        return $this->defaultReturn;
    }
}
