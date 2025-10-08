<?php declare(strict_types=1);

/**
 * This class features the code that enables access to the containers of the
 * LORIS Biobank Module.
 *
 * PHP Version 8.0
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
 * PHP Version 8.2
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
     * @var \LORIS\LorisInstance $loris
     * @var \Database    $db
     * @var \User        $user
     * @var ContainerDAO $dao
     */
    private $loris;
    private $db;
    private $user;
    public ContainerDAO $dao;        // This should be made private but is being
                        // used by the specimen controller. A new function should
                        // be made in the container controller to request
                        // containers based on parameter values.

    /**
     * Class Constructor
     *
     * @param \LORIS\LorisInstance $loris LORIS Instance.
     * @param \User                $user  User Instance.
     */
    function __construct(\LORIS\LorisInstance $loris, \User $user)
    {
        $this->loris = $loris;
        $this->db    = $loris->getDatabaseConnection();
        $this->user  = $user;
        $this->dao   = $this->_getDataProvisioner();
    }

    /**
     * Get all Container Objects permitted by the Container Data Provisioner (DAO).
     *
     * @return array $containers All permissable Container Objects
     */
    public function getInstances() : array
    {
        $this->_validatePermission('view');
        $containers  = [];
        $this->dao   = $this->dao
            ->filter(new \LORIS\Data\Filters\UserSiteMatch());
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
        $this->_validatePermission('create');
        $containerList = [];
        foreach ($list as $item) {
            $container = (new Container)->fromArray($item);
            $this->validateInstance($container);
            $containerList[] = $container;
        }

        $this->validateInstances($containerList);

        // Save Containers
        $containers = [];
        foreach ($containerList as $container) {
            $containers[] = $this->dao->createInstance($container);
        }

        return $containers;
    }

    /**
     * This method takes in a container array from the front-end,
     * validates them, instantiates them and then sends them to the DAO to be
     * saved to the database.
     *
     * @param array $containerArray container array to be created
     *
     * @return array
     */
    public function updateInstance(array $containerArray) : array
    {
        $this->_validatePermission('update');
        $container = (new Container)->fromArray($containerArray);

        $this->validateInstance($container);
        return $this->dao->updateInstance($container);
    }

    /**
     * Get all data associated with the Container Entity. This will be used
     * for front-end mapping and populating form options.
     *
     * @return array Associative array of option data.
     */
    public function getOptions() : array
    {
        $this->_validatePermission('view');
        return [
            'types'           => $this->dao->getTypes(),
            'typesPrimary'    => $this->dao->getTypes(['Primary' => 1]),
            'typesNonPrimary' => $this->dao->getTypes(['Primary' => 0]),
            'dimensions'      => $this->dao->getDimensions(),
            'stati'           => $this->dao->getStati(),
        ];
    }

    /**
     * XXX: This function can likely be delete completely and the dao can be
     * instatiated at the beginning. This filters can be add at the API endpoint.
     * Treats the Container DAO as a Provisioner that can be iterated through
     * to provide the permissable Container Objects for the current User.
     *
     * @return ContainerDAO
     */
    private function _getDataProvisioner() : ContainerDAO
    {
        return new ContainerDAO($this->db);
    }

    /**
     * Checks User Permissions for creating or updating Container Objects.
     *
     * @param string $method User requested method.
     *
     * @return void
     */
    private function _validatePermission(string $method) : void
    {
        switch ($method) {
        case 'view':
            if (!$this->user->hasPermission('biobank_container_view')) {
                throw new Forbidden('Container: View Permission Denied');
            }
            break;
        case 'update':
            if (!$this->user->hasPermission('biobank_container_update')) {
                throw new Forbidden('Container: Update Permission Denied');
            }
            break;
        case 'create':
            if (!$this->user->hasPermission('biobank_container_create')) {
                throw new Forbidden('Container: Create Permission Denied');
            }
            break;
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
        $this->_validateBarcode($container);
        $this->_validateTypeId($container);
        $this->_validateTemperature($container);
        $this->_validateStatusId($container);
        $this->_validateShipmentBarcodes($container);
        $this->_validateCenterId($container);
        $this->_validateParentContainerId($container);
        $this->_validateCoordinate($container);
        // $this->_validateLotNumber($container);
        // $this->_validateExpirationDate($container);
        // $this->_validateComments($container);
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
                throw new BadRequest('Barcode must be unique for each entry.');
            }
            $barcode = $container->getBarcode();
        }
    }

    /**
     * Validates Container Object Barcode
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation
     *                    requirements
     *
     * @return void
     */
    private function _validateBarcode(Container $container) : void
    {
        if (is_null($container->getBarcode())) {
            throw new BadRequest('Barcode value must be set.');
        }

        $id            = $container->getId();
        $barcode       = $container->getBarcode();
        $containerList = $this->dao->selectInstances(
            [
                ['column'=>'bc.Barcode', 'value'=>$barcode],
            ],
        );
        if (!empty($containerList)) {
            foreach ($containerList as $c) {
                $b = $c->getBarcode();
                $i = $c->getId();
                // If the barcodes are identical but the ids are not
                if ($b === $barcode && $i !== $id) {
                    throw new BadRequest('Barcode must be unique.');
                }
            }
        }

        if ($id) {
            $prevContainer = $this->dao->getInstanceFromId($id);
            if ($prevContainer
                && ($container->getBarcode() !== $prevContainer->getBarcode())
            ) {
                throw new BadRequest('Barcode can not be changed.');
            }
        }

        // TODO: Regex check on Barcode. Currently, regex has been removed from
        // the schema. Once it's reintroduced, this can be implemented.
        //$specimenTypes = $this->dao->getSpecimenTypes();
        //$regex = $specimenTypes[$specimen['typeId']]['regex'];
        //if (isset($regex)) {
        //    if (preg_match($regex, $container['barcode']) !== 1) {
        //        throw new BadRequest('Barcode is not of proper format for the
        //                               selected specimen type');
        //    }
        //}
    }

    /**
     * Validates Container Object Type ID.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation
     *                    requirements
     *
     * @return void
     */
    private function _validateTypeId(Container $container) : void
    {
        if (is_null($container->getTypeId())) {
            throw new BadRequest('Type value must be set');
        }
    }

    /**
     * Validates Container Object Temperature.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation
     *                    requirements
     *
     * @return void
     */
    private function _validateTemperature(Container $container) : void
    {
        $temperature = $container->getTemperature();
        if (is_null($temperature)) {
            throw new BadRequest('Temperature value must be set.');
        }
        if (!(is_numeric($temperature) && is_float(floatval($temperature)))) {
            throw new BadRequest('Temperature must be a number.');
        }
        if ($temperature <= self::MINTEMP || $temperature > self::MAXTEMP) {
            throw new BadRequest(
                'Temperature must be between '
                . self::MINTEMP
                . '°C and '
                . self::MAXTEMP
                . '°C.'
            );
        }
    }

    /**
     * Validates Container Object Status ID.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation
     *                    requirements
     *
     * @return void
     */
    private function _validateStatusId(Container $container) : void
    {
        if ($container->getId()) {
            $prevContainer = $this->dao->getInstanceFromId($container->getId());
            if ($prevContainer) {
                // $stati       = $this->dao->getStati();
                // $statusId    = $prevContainer->getStatusId();
                // $statusLabel = $stati[$statusId ?? '']['label'];
                // TODO: figure out what should not be changed if the
                // container is dispensed.
            }
        }

        if (is_null($container->getStatusId())) {
            throw new BadRequest("Status value must be set.");
        }
    }

    /**
     * Validates Container Object Shipment Barcodes.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation
     *                    requirements
     *
     * @return void
     */
    private function _validateShipmentBarcodes(Container $container) : void
    {
        if (empty($container->getShipmentBarcodes())) {
            // Handle the null case here
            return;
        }
        $shipmentDAO = new ShipmentDAO($this->db);
        foreach ($container->getShipmentBarcodes() as $barcode) {
            error_log($barcode);
            $shipment = $shipmentDAO->getInstanceFromBarcode($barcode);
            if ($shipment->getActive()) {
                throw new BadRequest(
                    "Container ".$container->getBarcode()." cannot
          be manipulated while it is associated with an active shipment."
                );
            }
        }
    }

    /**
     * Validates Container Object Center ID.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation
     *                    requirements
     *
     * @return void
     */
    private function _validateCenterId(Container $container) : void
    {
        if (is_null($container->getCenterID())) {
            throw new BadRequest("Center value must be set.");
        }

        $parentContainerId = $container->getParentContainerId();
        if (false) {
            $parentContainer = $this->dao->getInstanceFromId($parentContainerId);
            if ($container->getCenterID() !== $parentContainer->getCenterID()) {
                throw new BadRequest(
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
    private function _validateParentContainerId(Container $container) : void
    {
        $parentContainerId = $container->getParentContainerId();
        if (isset($parentContainerId)) {
            $childContainerIds = $this->dao->getAllChildContainerIds($container);
            if ($container->getId() == $parentContainerId
                || in_array($container->getId(), $childContainerIds)
            ) {
                throw new BadRequest(
                    'A container can not be placed within itself or
                    within one of its descendant containers.'
                );
            }
        }
    }

    /**
     * Validates Container Object Coordinate.
     *
     * @param Container $container Container to be checked.
     *
     * @throws BadRequest if the provided Container does not meet validation
     *                    requirements
     *
     * @return void
     */
    private function _validateCoordinate(Container $container)
    {
        $coordinate = $container->getCoordinate();
        if (!is_null($coordinate)) {
            if (!((is_int($coordinate) || ctype_digit($coordinate))
                && (int)$coordinate > 0)
            ) {
                throw new BadRequest('Coordinate must be a positive integer.');
            }

            $parentContainerId = $container->getParentContainerId();
            if (!isset($parentContainerId)) {
                throw new BadRequest(
                    'Coordinate can not be set without a Parent
                                       Container.'
                );
            }

            $parentContainer = $this->dao->getInstanceFromId(
                $parentContainerId
            );

            $dimensions = $this->dao->getDimensions()[$parentContainer
                ->getDimensionId() ?? ''];

            $capacity = $dimensions['x'] * $dimensions['y'] * $dimensions['z'];
            if ($container->getCoordinate() > $capacity) {
                throw new BadRequest(
                    'Coordinate value exceeds the capacity of the Parent Container'
                );
            }
        }
    }
}
