<?php
namespace LORIS\Data\Filters;

/**
 * The AccessibleResouceFilter is a data filter which enforces access permissions
 * on entities which implement the \LORIS\StudyEntities\AccessibleResource interface.
 *
 * It filters out any rows which the user does not have access to.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class AccessibleResourceFilter implements \LORIS\Data\Filter
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
        if (!($resource instanceof \LORIS\StudyEntities\AccessibleResource)) {
            throw new \LorisException("Resource is not an AccessibleResource instance");
        }
        return $resource->isAccessibleBy($user);
    }
}
