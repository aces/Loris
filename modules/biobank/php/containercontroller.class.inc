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

    // TODO: These values were decided based on the realm of possible values.
    // These value should instead be queried from the back end so that they
    // are Project configurable.
    const MINTEMP = -273.15;
    const MAXTEMP = 100;

    /**
     * Private instances of the Database, User and ContainerDAO classes.
     *
     * @var \Database    $db
     * @var \User        $user
     * @var ContainerDAO $dao
     */
    private $db;
    private $user;
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
        $this->validatePermission('view');
        $containers  = array();
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
        $this->validatePermission('create');
        $containerList = array();
        foreach ($list as $i => $item) {
            $container = (new Container)->fromArray($item);
            $this->validateInstance($container);
            $containerList[$i] = $container;
        }

        $this->validateInstances($containerList);

        // Save Containers
        $containerIds = array();
        foreach ($containerList as $i => $container) {
            $containerIds[$i] = $this->dao->saveInstance($container);
        }

        return $containerIds;
    }

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
        $this->validatePermission('update');
        $container = (new Container)->fromArray($containerArray);
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
        $this->validatePermission('view');
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
     * @param string $method User requested method.
     *
     * @return void
     */
    private function validatePermission(string $method) : void
    {
        switch($method) {
        case 'view':
            if (!$this->user->hasPermission('biobank_container_view')) {
                throw new \Forbidden('Container: View Permission Denied');
            }
        case 'update':
            if (!$this->user->hasPermission('biobank_container_update')) {
                throw new \Forbidden('Container: Update Permission Denied');
            }
        case 'create':
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
        $this->validateProjectIds($container);
        $this->validateCenterId($container);
        $this->validateParentContainerId($container);
        $this->validateCoordinate($container);
        $this->validateLotNumber($container);
        $this->validateExpirationDate($container);
    }

    /**
     * Validates the container list to ensure that no barcodes are identical
     *
     * @param array $containers List of Containers to be validated
     *
     * @return void
     */
    public function validateInstances(array $containers) : void
    {
        $barcode = null;
        foreach ($containers as $container) {
            if ($container->getBarcode() === $barcode) {
                throw new \BadRequest('Barcode must be unique for each entry.');
            }
            $barcode = $container->getBarcode();
        }
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
    private function validateBarcode(Container $container) : void
    {
        if (is_null($container->getBarcode())) {
            throw new \BadRequest('Barcode value must be set.');
        }

        $id            = $container->getId();
        $barcode       = $container->getBarcode();
        $containerList = $this->dao->selectInstances();
        foreach ($containerList as $c) {
            $b = $c->getBarcode();
            $i = $c->getId();
            // If the barcodes are identical but the ids are not
            if ($b === $barcode && $i !== $id) {
                throw new \BadRequest('Barcode must be unique.');
            }
        }

        if ($container->getId()) {
            $prevContainer = $this->dao->getInstanceFromId($container->getId());
            if ($container->getBarcode() !== $prevContainer->getBarcode()) {
                throw new \BadRequest('Barcode can not be changed.');
            }
        }

        // TODO: Regex check on Barcode. Currently, regex has been removed from
        // the schema. Once it's reintroduced, this can be implemented.
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
    private function validateTypeId(Container $container) : void
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
    private function validateTemperature(Container $container) : void
    {
        $temperature = $container->getTemperature();
        if (is_null($temperature)) {
            throw new \BadRequest('Temperature value must be set.');
        }
        if (!(is_numeric($temperature) && is_float(floatval($temperature)))) {
            throw new \BadRequest('Temperature must be a number.');
        }
        if ($temperature <= self::MINTEMP || $temperature > self::MAXTEMP) {
            throw new \BadRequest('Temperature must be between '.self::MINTEMP.'°C and '.self::MAXTEMP.'°C.');
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
    private function validateStatusId(Container $container) : void
    {
        if ($container->getId()) {
            $prevContainer = $this->dao->getInstanceFromId($container->getId());
            $statusLabel = $this->dao->getStati()[$prevContainer->getStatusId()]['label'];
            if ($statusLabel == 'Dispensed') {
                // TODO: figure out what else should not be changed if the container
                // is dispensed. This should eventually be blocked in the front-end
                // as well. These validations can wait until more testing has 
                // been done on the module.

                if ($prevContainer->getTemperature() != $container->getTemperature()) {
                    throw new \BadRequest("Temperature cannot be changed if Container
                                           is Dispensed.");
                }
            }
        }

        if (is_null($container->getStatusId())) {
            throw new \BadRequest("Status value must be set.");
        }
    }

    /**
     * Validates Container Object Project ID.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateProjectIds(Container $container) : void
    {
        $projectIds = $container->getProjectIds();

        // Check that current container's projects are a subset of the parent 
        // Container's projects.
        $parentContainerId = $container->getParentContainerId();
        if ($parentContainerId) {
            $parentContainer  = $this->dao->getInstanceFromId($parentContainerId);
            $parentProjectIds = $parentContainer->getProjectIds();
            if (array_intersect($projectIds, $parentProjectIds) != $projectIds) {
                $barcode = $container->getBarcode();
                throw new \BadRequest("The Projects to which " . $container->getBarcode() .
                                      " belongs must be a subset of the Projects to 
                                       which ". $parentContainer->getBarcode()
                                      ." belongs.");
            }
        }

        // Check the current container's projects are a superset of the child
        // Containers' projects.
        $childContainerIds = $container->getChildContainerIds();
        if ($childContainerIds) {
            forEach ($childContainerIds as $id) {
                $childContainer = $this->dao->getInstanceFromId((int) $id);
                $childProjectIds = $childContainer->getProjectIds();
                if (array_intersect($childProjectIds, $projectIds) != $childProjectIds) {
                    $barcode = $container->getBarcode();
                    throw new \BadRequest("The projects to which $barcode
                                           belongs must be a superset 
                                           of it's child Containers' Projects");
                }
            }
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
    private function validateCenterId(Container $container) : void
    {
        if (is_null($container->getCenterId())) {
            throw new \BadRequest("Center value must be set.");
        }

        $parentContainerId = $container->getParentContainerId();
        if (isset($parentContainerId)) {
            $parentContainer = $this->dao->getInstanceFromId($parentContainerId);
            if ($container->getCenterID() !== $parentContainer->getCenterID()) {
                $barcode = $container->getBarcode();
                throw new \BadRequest(
                        $container->getBarcode()." must be at the same location 
                        as ".$parentContainer->getBarcode()." to execute this
                        action"
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
    private function validateParentContainerId(Container $container) : void
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
    private function validateParentContainers(Container $container) : void
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
    private function validateCoordinate(Container $container)
    {
        $coordinate = $container->getCoordinate();
        if (!is_null($coordinate)) {
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

            $parentContainer = $this->dao->getInstanceFromId($parentContainerId); 
            $dimensions      = $this->dao->getDimensions()[$parentContainer->getDimensionId()];
            $capacity        = $dimensions['x'] * $dimensions['y'] * $dimensions['z'];
            if ($container->getCoordinate() > $capacity) {
               throw new \BadRequest(
                   'Coordinate value exceeds the capacity of the Parent Container'
               );
            }
        }
    }

    /**
     * Validates Container Lot Number.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateLotNumber(Container $container)
    {
    }

    /**
     * Validates Container Expiration Date.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation requirements
     *
     * @return void
     */
    private function validateExpirationDate(Container $container)
    {
    }
}
