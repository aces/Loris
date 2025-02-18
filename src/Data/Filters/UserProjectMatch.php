<?php declare(strict_types=1);

namespace LORIS\Data\Filters;

/**
 * UserProjectMatch filters out data for any resource which is not part of one of the
 * user's projects. For a DataInstance to be compatible with the UserProjectMatch
 * filter, it must implement a getProjectIDs or getProjectID method which returns
 * an integer (or array) of ProjectIDs that the data belongs to. The data will be
 * filtered out unless the User is a member of at least one project that the resource
 * DataInstance is a member of.
 *
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserProjectMatch implements \LORIS\Data\Filter
{

    /**
     * Constructor
     *
     * @param ?bool     $defaultReturn The default return value to return instead of
     *                                throwing an exception when an exception is
     *                                undesirable.
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
     * @return bool true if the user has a project in common with the data
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        // phan only understands method_exists on simple variables, not
        // Assigning to a variable is the a workaround
        // for false positive 'getProjectIDs doesn't exist errors suggested
        // in https://github.com/phan/phan/issues/2628
        $res = $resource;
        '@phan-var object $res';

        if (method_exists($res, 'getProjectIDs')) {
            // If the Resource belongs to multiple ProjectIDs, the user can
            // access the data if the user is part of any of those projects.
            $resourceProjects = $res->getProjectIDs();
            foreach ($resourceProjects as $project) {
                if ($user->hasProject($project)) {
                    return true;
                }
            }
            return false;
        } elseif (method_exists($res, 'getProjectID')) {
            $resourceProject = $res->getProjectID();
            if (!is_null($resourceProject)) {
                return $user->hasProject(
                    new \ProjectID(strval($resourceProject))
                );
            }
            // We don't know if the resource thought a null ProjectID
            // should mean "no one can access it" or "anyone can access
            // it", so throw an exception.
            if ($this->defaultReturn === null) {
                throw new \LorisException("getProjectID on resource returned null");
            }
            return $this->defaultReturn;
        }
        if ($this->defaultReturn === null) {
            throw new \LorisException(
                "Can not implement UserProjectMatch on a ".
                "resource type that has no projects."
            );
        }
        return $this->defaultReturn;
    }
}
