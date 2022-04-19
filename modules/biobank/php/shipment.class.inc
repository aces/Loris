<?php declare(strict_types=1);
/**
 * Shipment Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Shipment Object instances.
 *
 * PHP Version 7.2
 *
 * @category   Entity
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * Shipment Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Shipment Object instances.
 *
 * PHP Version 7.2
 *
 * @category   Entity
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Shipment implements \JsonSerializable, \LORIS\Data\DataInstance
{
    /**
     * Persistent Instance variables.
     *
     * These properties describe a shipment entity.
     *
     * @var string  $id
     * @var string  $barcode
     * @var string  $type
     * @var string  $destinationCenterId
     * @var array   $containerIds
     * @var array   $logs
     */
    public ?string $id;
    public ?string $barcode;
    public ?string $type;
    public ?string $destinationCenterId;
    public ?array $containerIds;
    public ?array $logs;

    /**
     * Initiliazes a new instance of the Shipment Class
     *
     * @param array $data The data for the shipment in array format.
     */
    function __construct(array $data)
    {
        $this->id      = $data['id'] ?? null;
        $this->barcode = $data['barcode'] ?? null;
        $this->type    = $data['type'] ?? null;
        $this->destinationCenterId = $data['destinationCenterId'] ?? null;
        $this->containerIds        = $data['containerIds'] ?? null;
        $this->_setLogs($data['logs']) ?? null;
    }

    /**
     * Sets the shipment's ID
     *
     * @param string $id the shipment's ID
     *
     * @return void
     */
    private function _setId(string $id) : void
    {
        $this->id = $id;
    }

    /**
     * Gets the shipment's ID
     *
     * @return ?string
     */
    public function getId() : ?string
    {
        return $this->id;
    }

    /**
     * Gets the tracking number of the shipment
     *
     * @return ?string
     */
    public function getBarcode() : ?string
    {
        return $this->barcode;
    }

    /**
     * Gets the type of the shipment
     *
     * @return ?string
     */
    public function getType() : ?string
    {
        return $this->type;
    }

    /**
     * Gets the origin center of the shipment
     *
     * @return ?string
     */
    public function getOriginCenterId() : ?string
    {
        if (!empty($this->getLogs())) {
            return $this->getLogs()[0]->centerId;
        }
    }

    /**
     * Gets the destination center of the shipment
     *
     * @return ?string
     */
    public function getDestinationCenterId() : ?string
    {
        return $this->destinationCenterId;
    }

    /**
     * Gets the status of the shipment
     *
     * @return ?string
     */
    public function getStatus() : ?string
    {
        if (!empty($this->getLogs())) {
            $latestLog = $this->getLogs()[array_key_last($this->getLogs())];
            return $latestLog->status;
        }
    }

    /**
     * Returns true if the shipment is not received.
     *
     * @return bool
     */
    public function getActive() : bool
    {
        return $this->getStatus() !== 'received';
    }

    /**
     * Gets the containers of the shipment
     *
     * @return ?array
     */
    public function getContainerIds() : ?array
    {
        return $this->containerIds;
    }

    /**
     * Sets the logs for the shipment
     *
     * @param array $logs the shipment's logs
     *
     * @return void
     */
    private function _setLogs(array $logs) : void
    {
        // TODO: THis should maybe go in the SHipment Handler.
        foreach ($logs as $i => $log) {
            $this->logs[$i] = new Log($log);
        }
    }

    /**
     * Gets the logs of the shipment
     *
     * @return array
     */
    public function getLogs() : array
    {
        return $this->logs;
    }

    /**
     * A wrapper function for the jsonSerialize method of the Shipment Instance
     * Class. This converts the Shipment Instance into an array.
     *
     * @return array Shipment Array.
     */
    public function toArray() : array
    {
        return $this->jsonSerialize();
    }

    /**
     * Returns an array representing the state of the Shipment
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return [
            'id'                  => $this->id,
            'barcode'             => $this->barcode,
            'type'                => $this->type,
            'originCenterId'      => $this->getOriginCenterId(),
            'destinationCenterId' => $this->destinationCenterId,
            'containerIds'        => $this->containerIds,
            'status'              => $this->getStatus(),
            'active'              => $this->getActive(),
            'logs'                => $this->logs,
        ];
    }

    /**
     * Returns a JSON encoded string of the state of the Shipment
     *
     * @return string JSON encoded string of Shipment data
     */
    public function toJSON() : string
    {
        return json_encode($this);
    }
}

