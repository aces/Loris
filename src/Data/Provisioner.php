<?php
/**
 * This file defines the concept of a data Provisioner.
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
namespace LORIS\Data;

/**
 * A Provisioner is something which retrieves data from a source (usually
 * the SQL database) and applies filters or maps to the data. It represents
 * arbitrarily structured data such as a row in a table. Implementations
 * know the details of the data, but a Provisioner itself only deals with
 * DataInstance objects, Filters and Mappers.
 *
 * Filters generally do things like site based or project based permissions to
 * the data, while mappers do things like anonymization of data.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
interface Provisioner
{
    /**
     * Filter must return a new Provisioner which is identical to this one, except
     * any rows which do not match $filter are removed from the result set when
     * executed.
     *
     * @param Filter $filter The filter to apply
     *
     * @return Provisioner a new data provisioner with $filter applied
     */
    public function filter(Filter $filter) : Provisioner;

    /**
     * Map returns a new Provisioner which is identical to this one, except
     * with the given map applied to the DataInstance objects returned
     * by execute.
     *
     * @param Mapper $map The map to apply
     *
     * @return Provisioner a new data provisioner with $map applied
     */
    public function map(Mapper $map) : Provisioner;

    /**
     * Execute must return all the rows for this provisioner, having applied
     * appropriate maps and filters.
     *
     * @param \User $user The user who data is being provisioned on behalf of.
     *
     * @return \Traversable of DataInstance objects
     */
    public function execute(\User $user) : \Traversable;
}
