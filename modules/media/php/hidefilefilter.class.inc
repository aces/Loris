<?php
/**
 * This file provides an implementation of the hide files filter.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\media;

/**
 * HideFilesFilter filters out data for any resource that has a value of 'true'
 * for the attribute 'hide_file'
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class HideFileFilter implements \LORIS\Data\Filter
{
    /**
     * Implements the HideFileFilter interface
     *
     * @param \User                    $user     The user that the data is being
     *                                           filtered for.
     * @param \LORIS\Data\DataInstance $resource The data being filtered.
     *
     * @return bool true if the file passes the filter and should not be hidden.
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        if ($resource->hideFile) {
            return false;
        } else {
            return true;
        }
    }
}
