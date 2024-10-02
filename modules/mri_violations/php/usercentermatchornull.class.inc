<?php
namespace LORIS\mri_violations;

/**
 * UserCenterMatchOrNull filters out data for any resource which is not
 * part of one of the user's centers. If the resource has no CenterID
 * defined, it is not excluded from the results.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserCenterMatchOrNull implements \LORIS\Data\Filter
{
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

        if (method_exists($res, 'getCenterID')) {
            $resourceCenter = $res->getCenterID();
            if (!is_null($resourceCenter)) {
                return $user->hasCenter($resourceCenter);
            }
            return true;
        }
        throw new \LorisException(
            "Can not implement filter on a resource type that has no centers."
        );
    }
}
