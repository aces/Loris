<?php declare(strict_types=1);
/**
 * This file provides an implementation of the Composite OR filter.
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
 * The OR Filter class allows for the combination of multiple filters using an OR
 * operand to determine the final result.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Rida Abou-Haidar <rida.abou-haidar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class CompositeORFilter implements \LORIS\Data\Filter
{

    protected array $filters;
    
    /**
     * Constructor
     *
     * @param \LORIS\Data\Filter $filters   An array of filter objects.
     */
    public function __construct(\LORIS\Data\Filter ...$filters)
    {
        $this->filters = $filters;
    }

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
        foreach ($this->filters as $filter) {
            if ($filter->filter($user, $resource)) {
                return true;
            }
        }
        return false;
    }
}
