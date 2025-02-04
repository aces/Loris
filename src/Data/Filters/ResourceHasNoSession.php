<?php declare(strict_types=1);

/**
 * This file provides an implementation of the ResourceHasNoSession filter.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Rida Abou-Haidar <rida.abou-haidar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Filters;

/**
 * ResourceHasNoSession filters out data for any resource which does has a session.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Rida Abou-Haidar <rida.abou-haidar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ResourceHasNoSession implements \LORIS\Data\Filter
{
    protected ?bool $defaultReturn;

    /**
     * Constructor
     *
     * @param ?bool     $defaultReturn The default return value to return instead of
     *                                throwing an exception when an exception is
     *                                indesirable.
     *
     */
    public function __construct(?bool $defaultReturn = null)
    {
        $this->defaultReturn = $defaultReturn;
    }

    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user          The user that the data is being
     *                                                filtered for.
     * @param \LORIS\Data\DataInstance $resource      The data being filtered.
     *
     * @return bool true if the resource has no session affiliated with it
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        // phan only understands method_exists on simple variables, not
        // Assigning to a variable is the a workaround
        // for false positive 'getCenterIDs doesn't exist errors suggested
        // in https://github.com/phan/phan/issues/2628
        $res = $resource;
        '@phan-var object $res';

        if (!method_exists($res, 'getSessionID')) {
            if ($this->defaultReturn === null) {
                throw new \LorisException(
                    "ResourceHasNoSession filter requires a getSessionID() method"
                );
            }
            return $this->defaultReturn;
        }

        if ($res->getSessionID() === null) {
            return true;
        }
        return false;
    }
}
