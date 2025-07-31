<?php declare(strict_types=1);

namespace LORIS\Data\Filters;

/**
 * This class will filters data based on the user having or not the permissions
 * provided to the constructor
 *
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserHasAnyPermission implements \LORIS\Data\Filter
{

    /**
     * Constructor
     *
     * @param string[] $permissions An array of permission objects.
     */
    public function __construct(protected array $permissions)
    {
    }

    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user          The user that the data is being
     *                                                filtered for.
     * @param \LORIS\Data\DataInstance $resource      The data being filtered.
     *
     * @return bool
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        if ($user->hasAnyPermission($this->permissions)) {
            return true;
        }
        return false;
    }
}
