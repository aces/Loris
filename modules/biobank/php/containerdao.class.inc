<?php declare(strict_types=1);
/**
 * Container Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Container Object instances
 *
 * PHP Version 7.2
 *
 * @category   Data
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * Container Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Container Object instances
 *
 * PHP Version 7.2
 *
 * @category   Data
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ContainerDAO extends \LORIS\Data\ProvisionerInstance
{
    /**
     * Private instance of the Database class.
     *
     * @var \Database $dao
     */
    private $db;

    /**
     * Initializes a new instance of the ContainerDAO Class
     *
     * @param Database $db Instance of the LORIS Database class
     */
    function __construct(\Database $db)
    {
        $this->db = $db;
    }

    // XXX: I'm not sure if this function is really necessary since it is only
    // being used once, and should likely not be accessed outside this class.
    /**
     * This method is used when the DAO class needs to create a new Container
     * instance.
     *
     * @return Container
     */
    public function getInstance() : Container
    {
        return new Container();
    }

    /**
     * This will load all container persistence variables from the database
     * for a given $id into a Container object, and return the object.
     *
     * @param int $id Value of the $id for the Container that will be
     *                   instantiated.
     *
     * @return Container $container Container Instance.
     */
    public function getInstanceFromId(int $id) : Container
    {
        $containerData     = $this->getInstanceDataFromId($id);
        $childContainerIds = $this->getChildContainerIds($id);
        $container         = $this->getInstanceFromSQL($containerData, $childContainerIds);

        return $container;
    }

    /**
     * Queries data from the database for the Container at the requested ID.
     *
     * @param int $id Value of the $id for the Container whose data is being
     *                   queried.
     *
     * @return array $container Container Data at that ID.
     */
    private function getInstanceDataFromId(int $id)
    {
        $query     = 'SELECT bc.ContainerID,
                     bc.Barcode,
                     bc.ContainerTypeID,
                     bct.ContainerCapacityID,
                     bct.ContainerDimensionID,
                     bc.ContainerStatusID,
                     bc.Temperature,
                     bc.OriginCenterID,
                     bc.CurrentCenterID,
                     bcp.ParentContainerID,
                     bcp.Coordinate,
                     bc.DateTimeUpdate,
                     bc.DateTimeCreate
                  FROM biobank_container bc
                  LEFT JOIN biobank_container_parent bcp
                    USING (ContainerID)
                  JOIN biobank_container_type bct
                    USING (ContainerTypeID)
                  WHERE bc.ContainerID=:i';
        $container = $this->db->pselectrow($query, array('i' => $id));

        return $container;
    }

    /**
     * Returns an array of all the Child Container IDs associated with
     * the given Container ID from the biobank_container_parent table.
     *
     * @param ?int $id of Container
     *
     * @return array $childContainerIds List of Container IDs that are
     *                                  children of the Container ID
     */
    private function getChildContainerIds(?int $id) : array
    {
         $query = 'SELECT ContainerID
                   FROM biobank_container_parent
                   WHERE ParentContainerID=:i';
         $childContainerIds = $this->db->pselectCol($query, array('i' => $id));

         return $childContainerIds;
    }

    // XXX: Currently this function is never used with any conditions passed as
    // parameters. Decide if this is a necessary feature. It is likely useful,
    // but I need to figure out how to integrate it wit the dataprovisioner.
    /**
     * This will select all containers from the database that match the
     * attribute values passed by $conditions and will return an array
     * of container objects.
     *
     * @param array $conditions Conditions to be met by the query
     *
     * @return array $containers List of Container Objects that match the query
     */
    public function selectInstances(array $conditions = null) : array
    {
        $query  = 'SELECT ContainerID
                  FROM biobank_container
                  LEFT JOIN biobank_container_parent
                    USING (ContainerID)
                  JOIN biobank_container_type
                    USING (ContainerTypeID)';
        $query .= $conditions ? ' WHERE '.$this->db->_implodeWithKeys(' AND ', $conditions) : '';

        $result     = $this->db->pselect($query, array());
        $containers = array();
        if (!empty($result)) {
            foreach ($result as $row) {
                $id        = (int) $row['ContainerID'];
                $container = $this->getInstanceFromId($id);
                $containers[$id] = $container;
            }
        }

        return $containers;
    }

    /**
     * Instantiates an ArrayIterator class that is composed of all the Container
     * Objects.
     *
     * @return traversable Iterator of Container Objects
     */
    protected function getAllInstances() : \Traversable
    {
        return new \ArrayIterator($this->selectInstances());
    }

    // XXX: The conditions parameter is only used to differentiate primary types
    // from non primary types. Decide if this is a front-end concern.
    /**
     * Queries all rows of the biobank_container_type table and returns a nested
     * array with the ID field as the index. Conditions may be passed to filter
     * the results
     *
     * @param array $conditions Conditions to be met by the query
     *
     * @return array $containerTypes All data concerning each container type
     */
    public function getTypes(array $conditions = null) : array
    {
        $query  = 'SELECT ContainerTypeID as id,
                          Brand as brand,
                          ProductNumber as productNumber,
                          Label as label,
                          `Primary` as `primary`,
                          ContainerCapacityID as capacityId,
                          ContainerDimensionID as dimensionId
                   FROM biobank_container_type';
        $query .= $conditions ? ' WHERE '.$this->db->_implodeWithKeys(' AND ', $conditions) : null;
        $types  = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $types;
    }

    // XXX: Althought container capacities were at first thought to be important
    // in the design of this entity, they are not being used in any way
    // throughout the module. Decide if container capacities are still
    // important, or if they should be deprecated.
    /**
     * Queries all rows of the biobank_container_capacity table and returns a
     * nested array with the ID field as the index.
     *
     * @return array $containerCapacities All data concerning each container
     *                                    capacity
     */
    public function getCapacities() : array
    {
        $query      = 'SELECT ContainerCapacityID as id,
                          Quantity as quantity,
                          UnitID as unitId 
                  FROM biobank_container_capacity';
        $capacities = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $capacities;
    }

    // XXX: Although container units were at first thought to be important
    // in the design of this entity, they are only being used by Specimen Objects
    // in this module. Decide if container units are still important, or if they
    // should be deprecated.
    /**
     * Queries all rows of the biobank_unit table and returns a
     * nested array with the ID field as the index.
     *
     * @return array $containerUnits All data concerning each unit
     */
    public function getUnits() : array
    {
        $query = "SELECT UnitID as id,
                         Label as unit 
                  FROM biobank_unit";
        $units = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $units;
    }

    /**
     * Queries all rows of the biobank_container_dimension table and returns a
     * nested array with the ID field as the index.
     *
     * @return array $containerDimensions All data concerning each container dimension
     */
    public function getDimensions() : array
    {
        $query      = "SELECT ContainerDimensionID as id,
                         X as x,
                         XNumerical as xNum,
                         Y as y,
                         YNumerical as yNum,
                         Z as z,
                         ZNumerical as zNum
                  FROM biobank_container_dimension";
        $dimensions = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $dimensions;
    }

    /**
     * Queries all rows of the biobank_container_status table and returns a
     * nested array with the ID field as the index.
     *
     * @return array $containerStati All data concerning each container status
     */
    public function getStati() : array
    {
        $query = "SELECT ContainerStatusID as id,
                         Label as label
                  FROM biobank_container_status";
        $stati = $this->db->pselectWithIndexKey($query, array(), 'id');

        return $stati;
    }

    /**
     * Queries all rows of the biobank_container_parent table and returns a
     * nested array with the Parent Container ID field as the first index, the
     * coordinate value as the second index, and the Child Container ID as the
     * value.
     *
     * If there is no coordinate, the string 'Unassigned' serves as the second
     * index.
     *
     * @return array $coordinates A Nested array of Child Container IDs
     *                            indexed by Parent Container ID and
     *                            Coordinate value or Unassigned.
     */
    public function getCoordinates() : array
    {
        $query       = "SELECT ContainerID as childContainerId,
                         ParentContainerID as parentContainerId,
                         Coordinate as coordinate
                  FROM   biobank_container_parent";
        $result      = $this->db->pselect($query, array());
        $coordinates = array();
        foreach ($result as $row) {
            if (empty($row['coordinate'])) {
                $coordinates[$row['parentContainerId']]['Unassigned'][] = $row['childContainerId'];
            } else {
                $coordinates[$row['parentContainerId']][$row['coordinate']] = $row['childContainerId'];
            }
        }

        return $coordinates;
    }

    /**
     * This function receives a Container Object, converts it into a SQL format
     * and inserts it into all relevant tables in the database. Certain
     * information is then cascaded to the children of the Container.
     *
     * @param Container $container The Container Object to be saved into the
     *                             database.
     *
     * @return int $containerId The ID of the Container that was saved.
     */
    public function saveInstance(Container $container) : int
    {
        // Converts Container Object into SQL format.
        $data = $this->getSQLFromInstance($container);

        // Inserts or Updates the biobank_container table with given data.
        $this->db->insertOnDuplicateUpdate(
            'biobank_container',
            $data['biobank_container']
        );

        if ($container->getId() !== null) {
            // If update:
            $oldContainer         = $this->getInstanceFromId($container->getId());
            $oldParentContainerId = $oldContainer->getParentContainerId();
            // If there is no longer an associated Parent Container ID, delete
            // it from the entry from the biobank_container_parent table.
            if (isset($oldParentContainerId) && !isset($parentContainerId)) {
                $this->db->delete(
                    'biobank_container_parent',
                    array('ContainerID' => $container->getId())
                );
            }
        } else {
            // If insert:
            $container->setId((int) $this->db->getLastInsertId());
            // set the respective data array index to the value of the new
            // container ID.
            $data['biobank_container_parent']['ContainerID'] = $container->getId();
        }

        $parentContainerId = $container->getParentContainerId();
        // If parent container ID exists, create an association in the
        // biobank_container_parent rel table
        if (isset($parentContainerId)) {
            $this->db->insertOnDuplicateUpdate(
                'biobank_container_parent',
                $data['biobank_container_parent']
            );
        }

        //Cascade changes in temperature, status, and center to all child Containers
        $temperature = $container->getTemperature();
        $this->cascadeToChildren($container, 'Temperature', $temperature);
        $statusId = $container->getStatusId();
        $this->cascadeToChildren($container, 'ContainerStatusID', $statusId);
        $centerId = $container->getCenterID();
        $this->cascadeToChildren($container, 'CurrentCenterID', $centerId);

        return $container->getId();
    }

    /**
     * This recursive function cascades the $value to the specified $field of
     * all the children of the $container Object.
     *
     * @param object $container Container Object from which to retrieve children
     * @param string $field     The field at which to associate the $value
     * @param mixed  $value     The value to assigned to the $field in question.
     *                          It is mixed since it may receive multiple types
     *                          of data.
     *
     * @return void
     */
    private function cascadeToChildren(
        Container $container,
        string $field,
        $value
    ) : void {
        $childContainers = $this->getChildContainers($container);

        if (!empty($childContainers)) {
            foreach ($childContainers as $id=>$childContainer) {
                $data = $this->getSQLFromInstance($childContainer);
                $data['biobank_container'][$field] = $value;
                $this->db->insertOnDuplicateUpdate(
                    'biobank_container',
                    $data['biobank_container']
                );

                $this->cascadeToChildren($childContainer, $field, $value);
            }
        }
    }

    /**
     * This function takes a Container Object and retrieves an array of objects
     * representing the childre of the $container.
     *
     * @param object $container Container Object from which to retrieve
     *                          children
     *
     * @return array  $childContainers Array of child container instances
     */
    public function getChildContainers(Container $container) : array
    {
        $childContainers   = array();
        $childContainerIds = $this->getChildContainerIds($container->getId());
        if (!empty($childContainerIds)) {
            foreach ($childContainerIds as $id) {
                $childContainers[$id] = $this->getInstanceFromId((int) $id);
            }
        }
        return $childContainers;
    }

    /**
     * This function takes a Container Object and prepares the data to be
     * inserted into the database by converting it to a data array. This mapping
     * is done to enable the update or insertion of data into the database
     * directly from the resulting arrays.
     *
     * @param Container $container Container Object to be converted
     *
     * @return array $data Array containing the data to be inserted
     */
    private function getSQLFromInstance(Container $container) : array
    {
         $containerData = array(
                           'ContainerID'       => $container->getId(),
                           'Barcode'           => $container->getBarcode(),
                           'ContainerTypeID'   => $container->getTypeId(),
                           'Temperature'       => $container->getTemperature(),
                           'ContainerStatusID' => $container->getStatusId(),
                           'OriginCenterID'    => $container->getOriginId(),
                           'CurrentCenterID'   => $container->getCenterId(),
                          );

         $parentData = array(
                        'ContainerID'       => $container->getId(),
                        'ParentContainerID' => $container->getParentContainerId(),
                        'Coordinate'        => $container->getCoordinate(),
                       );

         return $data = array(
                         'biobank_container'        => $containerData,
                         'biobank_container_parent' => $parentData,
                        );
    }

    /**
     * This function takes an array that resulted from an SQL query and
     * instantiates it as a Container Object
     *
     * @param array $data              Values to be instantiated.
     * @param ?array $childContainerIds List of child container ids.
     *
     * @return Container
     */
    private function getInstanceFromSQL(array $data, ?array $childContainerIds) : Container
    {
        $container = $this->getInstance();
        isset($data['ContainerID'])          && $container->setId((int) $data['ContainerID']);
        isset($data['Barcode'])              && $container->setBarcode((string) $data['Barcode']);
        isset($data['ContainerTypeID'])      && $container->setTypeId((int) $data['ContainerTypeID']);
        isset($data['ContainerDimensionID']) && $container->setDimensionId((int) $data['ContainerDimensionID']);
        isset($data['Temperature'])          && $container->setTemperature((float) $data['Temperature']);
        isset($data['ContainerStatusID'])    && $container->setStatusId((int) $data['ContainerStatusID']);
        isset($data['OriginCenterID'])       && $container->setOriginId((int) $data['OriginCenterID']);
        isset($data['CurrentCenterID'])      && $container->setCenterId((int) $data['CurrentCenterID']);
        isset($data['ParentContainerID'])    && $container->setParentContainerId((int) $data['ParentContainerID']);
        isset($childContainerIds)            && $container->setChildContainerIds($childContainerIds);
        isset($data['Coordinate'])           && $container->setCoordinate((int) $data['Coordinate']);

        return $container;
    }
}
