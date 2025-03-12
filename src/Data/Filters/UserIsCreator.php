<?php declare(strict_types=1);

namespace LORIS\Data\Filters;

/**
 * This class filters data based on whether the user is the creator of the resource.
 *
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserIsCreator implements \LORIS\Data\Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user     The user that the data is being
     *                                           filtered for.
     * @param \LORIS\Data\DataInstance $resource The data being filtered.
     *
     * @return bool true if the user is the creator of the resource
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        // phan only understands method_exists on simple variables, not
        // Assigning to a variable is the a workaround
        // for false positive 'CreatedBy()' doesn't exist errors suggested
        // in https://github.com/phan/phan/issues/2628
        $res = $resource;
        '@phan-var object $res';
        return $res->createdBy()->getId() === $user->getId();
    }
}
