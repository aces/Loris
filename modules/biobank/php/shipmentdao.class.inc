<?php declare(strict_types=1);

/**
 * Shipment Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Shipment Object instances
 *
 * PHP Version 8.2
 *
 * @category   DAO
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * Shipment Data Access Object (DAO) Class
 * This class contains all database handling that is needed to
 * permanently store and retrieve Shipment Object instances
 *
 * PHP Version 8.2
 *
 * @category   DAO
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ShipmentDAO extends \LORIS\Data\ProvisionerInstance
{
    /**
     * Private instance of the Database class.
     *
     * @var \Database $dao
     */
    private $db;

    /**
     * Initializes a new instance of the ShipmentDAO Class
     *
     * @param \Database $db Instance of the LORIS Database class
     */
    function __construct(\Database $db)
    {
        $this->db = $db;
    }

    /**
     * This method is used when the DAO class needs to create a new Shipment
     * instance.
     *
     * @param array $shipmentArray Data to initialize the shipment with
     *
     * @return Shipment
     */
    private function _getInstance($shipmentArray) : Shipment
    {
        return new Shipment($shipmentArray);
    }

    /**
     * This will load all shipment persistence variables from the database for a
     * given $id into a Shipment object, and return the object.
     *
     * @param string $barcode Value of the $barocde for the Shipment that will be
     *                        instantiated
     *
     * @return Shipment $shipment Shipment Instance.
     */
    public function getInstanceFromBarcode(string $barcode) : Shipment
    {
        return $this->selectInstances(
            [
                ['column'=>'s.Barcode', 'value'=>$barcode],
            ],
        )[$barcode];
    }

    /**
     * This will select all shipments from the database that match the
     * attribute values passed by $conditions and will return an array
     * of shipment objects.
     *
     * @param ?array $conditions Conditions to be met by the query
     * @param string $operator   The operator to use to link the conditions
     *
     * @return array $shipments List of Shipment Objects that match the query
     */
    public function selectInstances(
        ?array $conditions = [],
        $operator = 'AND'
    ) : array {
        $query = "SELECT s.ShipmentID as id,
                         s.Barcode as barcode,
                         st.Label as type,
                         s.DestinationCenterID as destinationCenterId,
                         GROUP_CONCAT(bc.ContainerId) as containerIds,
                         GROUP_CONCAT(bc.Barcode) as containerBarcodes
                  FROM shipment s
                  LEFT JOIN shipment_type st
                    USING (ShipmentTypeID)
                  LEFT JOIN psc psc
                    ON (s.DestinationCenterID=psc.CenterID)
                  LEFT JOIN biobank_container_shipment_rel bcsr
                    ON (s.ShipmentID=bcsr.ShipmentID)
                  LEFT JOIN biobank_container bc
                    ON (bcsr.ContainerID=bc.ContainerID)";
        if (!empty($conditions)) {
            $whereClause = [];
            foreach ($conditions as $condition) {
                $whereClause[] = $condition['column']
                    . '='
                    . '"'
                    . $condition['value']
                    . '"';
            }
            $query .= ' WHERE '.implode(" $operator ", $whereClause);
        }
        $query .= " GROUP BY s.ShipmentID";

        $shipments    = [];
        $shipmentRows = $this->db->pselectWithIndexKey($query, [], 'barcode');
        $logs         = $this->getLogs();
        foreach ($shipmentRows as $barcode => $shipmentRow) {
            $shipmentRow['containerIds']      = $shipmentRow['containerIds'] ?
              explode(',', $shipmentRow['containerIds']) : [];
            $shipmentRow['containerBarcodes'] = $shipmentRow['containerBarcodes'] ?
              explode(',', $shipmentRow['containerBarcodes']) : [];
            $shipmentRow['logs'] = $logs[$barcode];
            $shipment            = new Shipment($shipmentRow);
            $shipments[$barcode] = $shipment;
        }

        return $shipments;
    }

    /**
     * Get a list of all shipment logs
     *
     * @return array
     */
    public function getLogs() : array
    {
        $query   = "SELECT s.Barcode as barcode,
                         sl.CenterID as centerId,
                         u.Real_name as user,
                         ss.Label as status,
                         sl.Temperature as temperature,
                         sl.Date as date,
                         sl.Time as time,
                         sl.Comments as comments
                  FROM shipment_log sl
                  LEFT JOIN shipment s
                    ON (sl.ShipmentID=s.ShipmentID)
                  LEFT JOIN psc
                    ON (sl.CenterID=psc.CenterID)
                  LEFT JOIN users u
                    ON (sl.UserID=u.ID)
                  LEFT JOIN shipment_status ss
                    ON (sl.StatusID=ss.StatusID)
                  ORDER BY date, time";
        $logRows = $this->db->pselect($query, []);

        $logs = [];
        foreach ($logRows as $logRow) {
            $logs[$logRow['barcode']][] = $logRow;
        }
        return $logs;
    }

    /**
     * Instantiates an ArrayIterator class that is composed of all the Shipment
     * Objects.
     *
     * @return \Traversable Iterator of Shipment Objects
     */
    protected function getAllInstances() : \Traversable
    {
        return new \ArrayIterator($this->selectInstances());
    }

    /**
     * Get a list of all existing shipment statuses.
     *
     * @return string[]
     */
    public function getStatuses() : array
    {
        $query = "SELECT Label as label, Label FROM shipment_status";
        return $this->db->pselectColWithIndexKey($query, [], 'label');
    }

    /**
     * Get a list of all existing shipment types.
     *
     * @return string[]
     */
    public function getTypes() : array
    {
        $query = "SELECT Label as label, Label FROM shipment_type";
        return $this->db->pselectColWithIndexKey($query, [], 'label');
    }

    /**
     * This function receives a Shipment Object, converts it into a SQL format
     * and inserts it into all relevant tables in the database.
     *
     * @param Shipment $shipment The Shipment Object to be saved the
     *                           database.
     *
     * @return array The Shipment Objects that were saved
     *               to the database.
     */
    public function saveInstance(Shipment $shipment) : array
    {
        //TODO: This should probably have a try catch block of sorts.
        // Converts Shipment Object into SQL format and inserts into database.
        $shipmentSQL = $this->_getSQLFromInstance($shipment);
        $this->db->insertOnDuplicateUpdate(
            'shipment',
            $shipmentSQL
        );

        $shipmentId = $shipment->id ?? $this->db->getLastInsertID();

        foreach ($shipment->logs as $log) {
            $logSQL = $this->_getLogSQLFromInstance($log, $shipmentId);
            $this->db->insertOnDuplicateUpdate(
                'shipment_log',
                $logSQL
            );
        }

        // XXX: This following commands should perhaps be moved to the handler
        // instead of the dao.
        $containerDAO = new ContainerDAO($this->db);

        // XXX: Most of this will likely go into the controller instead of the DAO.
        // Checks out each listed container from their respective parent, if it
        // exists
        $updatedContainers = [];
        // TODO: Change to if "First".
        if (!$shipment->getId()) {
            foreach ($shipment->containerIds as $containerId) {
                $container = $containerDAO->getInstanceFromId((int) $containerId);
                $container->setParentContainerId(null);
                $updatedContainers = array_merge(
                    $updatedContainers,
                    $containerDAO->updateInstance($container)
                );
            }
        }
        // TODO: This will later need to be replaced by a more robust system
        // that relies on the log type, such as active, locked, final, etc.

        $containerIds = $this->_getAllContainerIds($shipment);
        foreach ($containerIds as $containerId) {
            // TODO: Change to if "Final"
            if ($shipment->getId()) {
                // places all containers at destination center
                $container = $containerDAO->getInstanceFromId((int) $containerId);
                $container->setCenterId(
                    new \CenterID(strval($shipment->destinationCenterId))
                );
                $updatedContainers = array_merge(
                    $updatedContainers,
                    $containerDAO->updateInstance($container)
                );
            }
            // TODO: Change to if "First"
            if (!$shipment->getId()) {
                $this->db->insertOnDuplicateUpdate(
                    'biobank_container_shipment_rel',
                    ['ShipmentID' => $shipmentId, 'ContainerID' => $containerId]
                );
                $updatedContainers[] = $containerDAO->getInstanceFromId(
                    (int) $containerId
                );
            }
        }

        return [
            'shipments'  => [$this->getInstanceFromBarcode($shipment->barcode)],
            'containers' => $updatedContainers,
        ];
    }

    /**
     * Get a list of all containers contained in a a shipment.
     *
     * @param Shipment $shipment The shipment
     *
     * @return array
     */
    private function _getAllContainerIds(Shipment $shipment) : array
    {
        $containerDAO      = new ContainerDAO($this->db);
        $childContainerIds = [];
        foreach ($shipment->containerIds as $containerId) {
            $container = $containerDAO->getInstanceFromId((int) $containerId);
            $containerDAO->updateInstance($container)[0];

            $childContainerIds = array_merge(
                $childContainerIds,
                $containerDAO->getAllChildContainerIds($container)
            );
        }
        $allContainerIds = array_merge(
            $childContainerIds,
            $shipment->containerIds
        );
        return array_unique($allContainerIds);
    }

    /**
     * This function takes a Shipment Instance and prepares the data to be
     * inserted into the database by converting it to a data array. This one to
     * one mapping is done to enable the update or insertion of data into the
     * database directly from the resulting arrays.
     *
     * @param Shipment $shipment Shipment Instance to be converted
     *
     * @return array $data Array containing the data to be inserted
     */
    private function _getSQLFromInstance(Shipment $shipment) : array
    {
        $typeId = $this->db->pselectOne(
            'SELECT ShipmentTypeID from shipment_type WHERE Label=:l',
            ['l' => $shipment->type]
        );
        return [
            'ShipmentID'          => $shipment->id,
            'Barcode'             => $shipment->barcode,
            'ShipmentTypeID'      => $typeId,
            'DestinationCenterID' => $shipment->destinationCenterId,
        ];
    }

    /**
     * Get the shipment logs from the SQL database for an instance
     *
     * @param Log    $log        The shipment log to retrieve
     * @param string $shipmentId The shipment id with the log
     *
     * @return array
     */
    private function _getLogSQLFromInstance(Log $log, string $shipmentId) : array
    {
        // TODO: These queries feel clumsy. There is likely a better way to get
        // the ID.
        $statusId = $this->db->pselectOne(
            'SELECT StatusID from shipment_status WHERE Label=:l',
            ['l' => $log->status]
        );
        $userId   = $this->db->pselectOne(
            'SELECT ID FROM users WHERE Real_name=:u',
            ['u' => $log->user]
        );

        return [
            'ShipmentID'  => $shipmentId,
            'CenterID'    => $log->centerId,
            'StatusID'    => $statusId,
            'UserID'      => $userId,
            'Temperature' => $log->temperature,
            'Date'        => $log->date?->format('Y-m-d H:i'),
            'Time'        => $log->time?->format('Y-m-d H:i'),
            'Comments'    => $log->comments,
        ];
    }
}
