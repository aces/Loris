<?php declare(strict_types=1);
/**
 * This class features the code that enables access to the containers of the
 * LORIS Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Controller
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * This class features the code that enables access to the containers of the
 * LORIS Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Controller
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
class ContainerController
{
    /**
     * Global variable $db
     *
     * @access private
     */
    private $db;

    /**
     * Global variable $user
     *
     * @access private
     */
    private $user;

    /**
     * Global variable $dao
     *
     * @access private
     */
    private $dao;

    /**
     * Class Constructor
     *
     * @param Database $db   Database Instance.
     * @param User     $user User Instance.
     */
    function __construct(\Database $db, \User $user)
    {
        $this->db   = $db;
        $this->user = $user;
        $this->dao  = $this->getDataProvisioner();
    }

    /**
     * Get all Container Objects permitted by the Container Data Provisioner (DAO).
     *
     * @return array $specimens All permissable Container Objects
     */
    public function getInstances() : array
    {
        $this->validatePermission('GET');
        $containers  = [];
        $containerIt = $this->dao->execute($this->user);
        foreach ($containerIt as $id => $container) {
            $containers[$id] = $container;
        }

        return $containers;
    }

    /**
     * This method takes in a list of container arrays from the front-end,
     * validates them, instantiates them and then sends them to the DAO to be
     * saved to the database.
     *
     * @param array $list A list of container arrays to be created.
     *
     * @return array $containerIds A list of IDs from the containers that were
     *                             created.
     */
    public function createInstances(array $list) : array
    {
        $this->validatePermission('POST');
        $containerList = array();
        foreach ($list as $i => $item) {
            $container = $this->dao->getInstanceFromArray($item);
            $this->validateInstance($container);
            $containerList[$i] = $container;
        }

        // Save Containers
        $containerIds = [];
        foreach ($containerList as $i => $container) {
            $containerIds[$i] = $this->dao->saveInstance($container);
        }

        return $containerIds;
    }

    // TODO: Decide if this function should take a list of containers, rather
    // than a singular container.
    /**
     * This method takes in a container array from the front-end,
     * validates them, instantiates them and then sends them to the DAO to be
     * saved to the database.
     *
     * @param array $containerArray container array to be created
     *
     * @return void
     */
    public function updateInstance(array $containerArray) : void
    {
        $this->validatePermission('PUT');
        $container = $this->dao->getInstanceFromArray($containerArray);
        $this->validateInstance($container);
        $this->dao->saveInstance($container);
    }

    /**
     * Get all data associated with the Container Entity. This will be used
     * for front-end mapping and populating form options.
     *
     * @return array Associative array of option data.
     */
    public function getOptions() : array
    {
        $this->validatePermission('GET');
        return array(
                'types'           => $this->dao->getTypes(),
                'typesPrimary'    => $this->dao->getTypes(['Primary' => 1]),
                'typesNonPrimary' => $this->dao->getTypes(['Primary' => 0]),
                'dimensions'      => $this->dao->getDimensions(),
                'coordinates'     => $this->dao->getCoordinates(),
                'stati'           => $this->dao->getStati(),
               );
    }

    /**
     * Treats the Container DAO as a Provisioner that can be iterated through
     * to provide the permissable Container Objects for the current User.
     *
     * @return \LORIS\Data\Provisioner
     */
    private function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $dao = new ContainerDAO($this->db);
        if ($this->user->hasPermission('access_all_profiles') === false) {
            $dao = $dao->filter(new \LORIS\Data\Filters\UserSiteMatch());
        }
        if ($this->user->hasPermission('biobank_container_view') === false) {
            $dao = $dao->filter(new PrimaryContainerFilter(0));
        }
        if ($this->user->hasPermission('biobank_specimen_view') === false) {
            $dao = $dao->filter(new PrimaryContainerFilter(1));
        }
        return $dao;
    }

    /**
     * Checks User Permissions for creating or updating Container Objects.
     *
     * @param string $action User requested action.
     *
     * @return void
     */
    private function validatePermission(string $action) : void
    {
        switch($action) {
        case 'GET':
            if (!$this->user->hasPermission('biobank_container_view')) {
                throw new \Forbidden('Container: View Permission Denied');
            }
        case 'PUT':
            if (!$this->user->hasPermission('biobank_container_update')) {
                throw new \Forbidden('Container: Update Permission Denied');
            }
        case 'POST':
            if (!$this->user->hasPermission('biobank_container_create')) {
                throw new \Forbidden('Container: Create Permission Denied');
            }
        }
    }

    /**
     * Validates Container Object before being saved
     *
     * @param Container $container Container to be validated
     *
     * @return void
     */
    public function validateInstance(Container $container) : void
    {
        $this->validateBarcode($container);
        $this->validateTypeId($container);
        $this->validateTemperature($container);
        $this->validateStatusId($container);
        $this->validateCenterId($container);
        $this->validateParentContainerId($container);
        $this->validateCoordinate($container);
    }

    /**
     * Validates Container Object Barcode
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateBarcode($container) : void
    {
        $barcode = $container->getBarcode();
        if (is_null($barcode)) {
            throw new \BadRequest('Barcode value must be set');
        }

        $id = $container->getId();
        if (!isset($id)) {
            $containerList = $this->dao->selectInstances();
            foreach ($containerList as $c) {
                $b = $c->getBarcode();
                if ($b === $barcode) {
                    throw new \BadRequest('Barcode must be unique');
                }
            }
        }

        //TODO: Regex check on Barcode.
        //i.e.
        //$specimenTypes = $this->dao->getSpecimenTypes();
        //$regex = $specimenTypes[$specimen['typeId']]['regex'];
        //if (isset($regex)) {
        //    if (preg_match($regex, $container['barcode']) !== 1) {
        //        throw new \BadRequest('Barcode is not of proper format for the
        //                               selected specimen type');
        //    }
        //}
    }

    /**
     * Validates Container Object Type ID.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateTypeId($container) : void
    {
        if (is_null($container->getTypeId())) {
            throw new \BadRequest('Type value must be set');
        }
    }

    /**
     * Validates Container Object Temperature.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateTemperature($container) : void
    {
        $temperature = $container->getTemperature();
        if (is_null($temperature)) {
            throw new \BadRequest('Temperature value must be set.');
        }
        if (!(is_numeric($temperature) && is_float(floatval($temperature)))) {
            throw new \BadRequest('Temperature must be a number.');
        }
        if ($temperature < -273 || $temperature > 999) {
            throw new \BadRequest('Temperature must be between -273.15 and 1000.');
        }
    }

    /**
     * Validates Container Object Status ID.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateStatusId($container) : void
    {
        if (is_null($container->getStatusId())) {
            throw new \BadRequest("Status value must be set.");
        }
    }

    /**
     * Validates Container Object Center ID.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateCenterId($container) : void
    {
        if (is_null($container->getCenterId())) {
            throw new \BadRequest("Center value must be set.");
        }

        $parentContainerId = $container->getParentContainerId();
        if (isset($parentContainerId)) {
            $parentContainer = $this->dao->getInstanceFromId($parentContainerId);
            if ($container->getCenterID() !== $parentContainer->getCenterID()) {
                throw new \BadRequest(
                    'A container must be checked out before
                     moving location.'
                );
            }
        }
    }

    /**
     * Validates Container Object Parent Container ID.
     *
     * @param Container $container Container to be checked.
     *
     * @return void
     */
    private function validateParentContainerId($container) : void
    {
        $this->validateParentContainers($container);
    }

    /**
     * Recursive function that checks if the Parent Container is a child of the
     * Container Object
     *
     * @param Container $container Container to be validated
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateParentContainers($container) : void
    {
        $parentContainerId = $container->getParentContainerId();
        if (isset($parentContainerId)) {
            if ($container->getId() == $parentContainerId) {
                throw new \BadRequest(
                    'A container can not be placed within itself or
                    within one of its descendant containers.'
                );
            }
            $childContainers = $this->dao->getChildContainers($container);
            if (isset($childContainers)) {
                foreach ($childContainers as $child) {
                    $this->validateParentContainerId($child);
                }
            }
        }
    }

    /**
     * Validates Container Object Coordinate.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateCoordinate($container)
    {
        $coordinate = $container->getCoordinate();
        if (isset($coordinate)) {
            if (!((is_int($coordinate) || ctype_digit($coordinate)) && (int)$coordinate > 0)) {
                throw new \BadRequest('Coordinate must be a positive integer.');
            }

            $parentContainerId = $container->getParentContainerId();
            if (!isset($parentContainerId)) {
                throw new \BadRequest(
                    'Coordinate can not be set without a Parent
                                       Container.'
                );
            }

            // TODO: Check that the coordinate value is within the container's
            // dimension capacity.
        }
    }
}
