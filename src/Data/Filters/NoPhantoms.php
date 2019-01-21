<?php
/**
 * This file provides an implementation of the NoPhantoms filter.
 *
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
 * OnlyPhantoms filters out data for any images which is associated to a scanner
 * For a DataInstance to be compatible with the NoPhantoms filter, it must
 * implement a isPhantom  method which returns a boolean. The DataInstance will
 * be filtered out if isPhantom is true.
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class NoPhantoms implements Filter
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
        if (method_exists($resource, 'isPhantom')) {
            return !$resource->isPhantom();
        }
        throw new \LorisException(
            "Can not implement NoPhantomsFilter on that resource."
        );
    }
}
