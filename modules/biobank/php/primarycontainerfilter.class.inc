<?php declare(strict_types=1);
/**
 * This file provides an implementation of the Primary Container Filter.
 *
 * PHP Version 7.2
 *
 * @category   Filter
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * PrimaryContainerFilter filters out primary or non primary containers,
 * depending on the value passed to the constructor.
 *
 * PHP Version 7.2
 *
 * @category   Filter
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class PrimaryContainerFilter implements \LORIS\Data\Filter
{

    /**
     * $primary determines whether to filter primary or non primary containers.
     * If the value is '1', primary containers will be filtered. If the value
     * '0', non primary containers will be filtered.
     */
    private $primary;

    function __construct($primary) {
        $this->primary = $primary;
    }

    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param User      $user      The user that the data is being filtered for.
     * @param Container $container The container being filtered.
     *
     * @return bool true if the container is of type primary.
     */
    public function filter(\User $user, \Loris\Data\DataInstance $container) : bool
    {
        $db           = \Database::singleton();
        $containerDAO = new ContainerDAO($db);
        $containerTypes = $containerDAO->getContainerTypes();
        return $containerTypes[$container->getTypeId()]['primary'] === $this->primary;
    }
}
