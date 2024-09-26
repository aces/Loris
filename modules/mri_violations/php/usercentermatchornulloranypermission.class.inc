<?php
namespace LORIS\mri_violations;

/**
 * UserCenterMatchOrNull filters out data for any resource which is not
 * part of one of the user's centers unless the user has one of the
 * given permissions. If the resource has no CenterID defined, it is not
 * excluded from the results.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserCenterMatchOrNullOrAnyPermission implements \LORIS\Data\Filter
{
    /**
     * {@constructor}
     *
     * @param string[] $permissions - List of possible permissions
     */
    public function __construct(protected array $permissions)
    {
    }

    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user     The user that the data is being
     *                                           filtered for.
     * @param \LORIS\Data\DataInstance $resource The data being filtered.
     *
     * @return bool
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        // phan only understands method_exists on simple variables.
        // Assigning to a variable is the a workaround
        // for false positive 'getProjectID doesn't exist errors suggested
        // in https://github.com/phan/phan/issues/2628
        $res = $resource;
        '@phan-var object $res';

        if ($user->hasAnyPermission($this->permissions)) {
            return true;
        }

        if (method_exists($res, 'getCenterID')) {
            $resourceCenter = $res->getCenterID();
            if (!is_null($resourceCenter)) {
                return $user->hasCenter(
                    \CenterID::singleton($resourceCenter)
                );
            }
            return true;
        }
        throw new \LorisException(
            "Can not implement filter on a resource type that has no centers."
        );
    }
}
