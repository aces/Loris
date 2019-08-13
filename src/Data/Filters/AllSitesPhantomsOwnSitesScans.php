<?php
/**
 * This file provides an implementation of the OnlyPhantoms filter.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Filters;

use \LORIS\Data\Filter;
use \LORIS\Data\DataInstance;

/**
 * AllSitesPhantomsOwnSitesScans filters out data for any image which is either
 * associated to a scanner candidate or associated with the user's sites.
 * For a DataInstance to be compatible with the AllSitesPhantomsOwnSitesScans filter,
 * it must implement isPhantom and getCenterID methods which return a boolean.
 * The DataInstance will be filtered out if isPhantom is false.
 *
 * @category   Data
 * @package    Main
 * @subpackage Images
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class AllSitesPhantomsOwnSitesScans implements Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User        $user     The user that request access to the ressouce.
     * @param DataInstance $resource The data being filtered.
     *
     * @return bool true if the data is a phantom image or if the user has a site
     * in common with the data
     */
    public function filter(\User $user, DataInstance $resource) : bool
    {
        if (method_exists($resource, 'isPhantom')
            && method_exists($resource, 'getCenterID')
        ) {
            $resourceSite = $resource->getCenterID();
            if (!is_null($resourceSite)) {
                return $user->hasCenter($resourceSite) || $resource->isPhantom();
            }
        }
        throw new \LorisException(
            "Can not implement AllSitesPhantomsOwnSitesScansFilter on that resource."
        );
    }
}
