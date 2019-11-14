<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Cecile <cecile.madjar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Filters;

use \Loris\Data\DataInstance;
use \LORIS\Data\Filter;

/**
 * This is meant to be used by a provisioner to filter-out electrophysiology
 * recordings when the user should not see them.
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Cecile <cecile.madjar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class RecordingsFilter implements Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User        $user     The user that request access to the resource.
     * @param DataInstance $resource The data being filtered.
     *
     * @return bool true if the user has permission to view the recording
     */
    public function filter(\User $user, DataInstance $resource) : bool
    {
        if ($user->hasPermission('electrophysiology_browser_view_allsites')) {
            return true;
        }

        if ($user->hasPermission('electrophysiology_browser_view_site')) {
            return $user->hasCenter($resource->getCenterID());
        }

        return false;
    }
}
