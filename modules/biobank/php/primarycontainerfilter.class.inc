<?php declare(strict_types=1);

/**
 * This file provides an implementation of the Primary Container Filter.
 *
 * PHP Version 8.2
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
 * PHP Version 8.2
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

    private $loris;

    /**
     * Class constructor.
     *
     * @param \LORIS\LorisInstance $loris   The LORIS instance
     * @param int                  $primary A value of '0' or '1' which
     *                                      indicates if the container is
     *                                      primary.
     */
    function __construct(\LORIS\LorisInstance $loris, int $primary)
    {
        $this->loris   = $loris;
        $this->primary = $primary;
    }

    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user      The user that the data is
     *                                            being filtered for.
     * @param \Loris\Data\DataInstance $container The container being filtered.
     *
     * @return bool true if the container is of type primary.
     */
    public function filter(\User $user, \Loris\Data\DataInstance $container) : bool
    {
        $containerDAO   = new ContainerDAO($this->loris->getDatabaseConnection());
        $containerTypes = $containerDAO->getTypes();

        assert($container instanceof Container);
        $typeId = $container->getTypeId();
        if ($typeId === null) {
            return false;
        }
        $types = $containerTypes[$typeId];
        return $types['primary'] === $this->primary;
    }
}
