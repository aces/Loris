<?php
/**
 * This file provides an implementation of the OnlyPhantoms filter.
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

use \LORIS\Data\Filter;
use \LORIS\Data\DataInstance;

/**
 * OnlyPhantoms filters out data for any images which is not associated to a scanner
 * For a DataInstance to be compatible with the OnlyPhantoms filter, it must
 * implement a isPhantom  method which returns a boolean. The DataInstance will
 * be filtered out if isPhantom is false.
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class OnlyPhantoms implements Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User        $user     The user that request access to the ressouce.
     * @param DataInstance $resource The data being filtered.
     *
     * @return bool true if the data is a phantom image
     */
    public function filter(\User $user, DataInstance $resource) : bool
    {
        if (method_exists($resource, 'isPhantom')) {
            return $resource->isPhantom();
        }
        throw new \LorisException(
            "Can not implement OnlyPhantomsFilter on that resource."
        );
    }
}
