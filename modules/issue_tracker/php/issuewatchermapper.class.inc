<?php
/**
 * This class implements a data mapper which converts User ID to a boolean
 * in the Issue Tracker.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\issue_tracker;
use \LORIS\Data\{Mapper, DataInstance};

/**
 * A IssueWatcherMapper is a \LORIS\Data\Mapper which maps User ID
 * by setting it to true if it belongs to the current user and false if not.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class IssueWatcherMapper implements Mapper
{
    /**
     * Maps the User ID to 'true' if it belongs to the current user and to 'false'
     * if it does not.
     *
     * @param \User                    $user     The user this data is being mapped
     *                                           for.
     * @param \LORIS\Data\DataInstance $resource The data instance being mapped.
     *
     * @return \LORIS\Data\DataInstance the mapped data
     */
    public function map(
        \User $user,
        DataInstance $resource
    ) : DataInstance {

        static $config = null;
        if ($config === null) {
            $config = \NDB_Config::singleton()->getSetting("imaging_modules");
        }

        $newrow = json_decode($resource->toJSON(), true);
        if ($newrow['userID'] === $user->getUsername()) {
            $newrow['userID'] = true;
        } else {
            $newrow['userID'] = false;
        }

        return new IssueRow($newrow, $resource->getCenterID());
    }
}
