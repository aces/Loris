<?php
/**
 * Thie file defines the \LORIS\Data\Mapper interface.
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
 * A Mapper represents an object that maps data from one DataInstance type to
 * another.
 *
 * It can be used to add, remove, or modify data coming from a Provisioner
 * before being returned to the caller.
 *
 * This may be used for anything that modifies the data such as (possibly
 * conditional) anonymization, or dictionary translations for data submissions.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
interface Mapper
{
    /**
     * Map returns a copy of $resource that has been modified in some way
     * It must return a new DataInstance without having modified the original.
     *
     * The data mapping should be a pure function of the original data and
     * the user that it's being mapped for.
     *
     * @param \User        $user     The user that this is being mapped on
     *                               behalf of.
     * @param DataInstance $resource The data being mapped from.
     *
     * @return DataInstance a new DataInstance with the map applied.
     */
    public function map(\User $user, DataInstance $resource) : DataInstance;
}
