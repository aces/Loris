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
namespace LORIS\mri_violations;

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
class UserProjectMatchOrNull implements \LORIS\Data\Filter
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
        // phan only understands method_exists on simple variables.
        // Assigning to a variable is the a workaround
        // for false positive 'getProjectID doesn't exist errors suggested
        // in https://github.com/phan/phan/issues/2628
        $res = $resource;
        '@phan-var object $res';

        if (method_exists($res, 'getProjectID')) {
            $resourceProject = $res->getProjectID();
            if (!is_null($resourceProject)) {
                return $user->hasProject($resourceProject);
            }
            return true;
        }
        throw new \LorisException(
            "Can not implement filter on a resource type that has no projects."
        );
    }
}
