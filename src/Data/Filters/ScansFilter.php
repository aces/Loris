<?php
/**
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Filters;

use \Loris\Data\DataInstance;
use \LORIS\Data\Filter;

/**
 * This is meant to be used by a provisioner to filter-out images that are
 * not phantoms when the user should not see them.
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ScansFilter implements Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User        $user     The user that request access to the ressource.
     * @param DataInstance $resource The data being filtered.
     *
     * @return bool true if the data is not a phantom image
     */
    public function filter(\User $user, DataInstance $resource) : bool
    {
        if ($resource->isPhantom()) {
            // This filter only have jurisdiction over non-phantom images.
            return true;
        }

        if ($user->hasPermission('imaging_browser_view_allsites')) {
            return true;
        }

        if ($user->hasPermission('imaging_browser_view_site')) {
            return $user->hasCenter($resource->getCenterID());
        }

        return false;
    }
}
