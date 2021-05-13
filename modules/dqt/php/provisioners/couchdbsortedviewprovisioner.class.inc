<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\dqt\Provisioners;
use \LORIS\Data\Provisioners\CouchDBViewProvisioner;

/**
 * A CouchDBSortedViewProvisioner is an instance of ProvisionerInstance which
 * queries a couchdb view and returns sorted resultsi values as a Traversable.
 *
 * It can be memory consuming since the results need to be copied in memory to
 * be sorted. 
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class CouchDBSortedViewProvisioner extends CouchDBViewProvisioner
{
    /**
     * Implements the execute function for the Provisioner interface.
     * This override accumulates the result row values in an array and returns
     * items sorted.
     *
     * @param \User $user The user who data is being provisioned on behalf of.
     *
     * @return \Traversable of DataInstance objects
     */
    public function execute(\User $user) : \Traversable
    {
        $generator = parent::execute($user);
        $rows      = new \ArrayIterator(
            iterator_to_array(parent::execute($user))
        );

        // Relying on php builtin object comparison 
        $rows->asort();

        yield from $rows;
    }
}
