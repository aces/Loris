<?php
/**
 * This file provides an implementation of the UserProjectMatch filter.
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
 * UserProjectMatch filters out data for any resource which is not part of one of the
 * user's projects. For a DataInstance to be compatible with the UserProjectMatch
 * filter, it must implement a getProjectIDs or getProjectID method which returns
 * an integer (or array) of ProjectIDs that the data belongs to. The data will be
 * filtered out unless the User is a member of at least one project that the resource
 * DataInstance is a member of.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class UserProjectMatch implements \LORIS\Data\Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user     The user that the data is being
     *                                           filtered for.
     * @param \LORIS\Data\DataInstance $resource The data being filtered.
     *
     * @return bool true if the user has a project in common with the data
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        if (method_exists($resource, 'getProjectIDs')) {
            // If the Resource belongs to multiple ProjectIDs, the user can
            // access the data if the user is part of any of those projects.
            $resourceProjects = $resource->getProjectIDs();
            foreach ($resourceProjects as $project) {
                if ($user->hasProject($project)) {
                    return true;
                }
            }
            return false;
        } elseif (method_exists($resource, 'getProjectID')) {
            $resourceProject = $resource->getProjectID();
            if (!is_null($resourceProject)) {
                return $user->hasProject($resourceProject);
            }
            // We don't know if the resource thought a null ProjectID
            // should mean "no one can access it" or "anyone can access
            // it", so throw an exception.
            throw new \LorisException("getProjectID on resource returned null");
        }
        throw new \LorisException(
            "Can not implement UserProjectMatch on a resource type that has no projects."
        );
    }
}
