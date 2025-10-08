<?php declare(strict_types=1);

/**
 * Defines the Container class for specimen containers in the Biobank module.
 *
 * This class represents a container entity and provides methods to manage
 * and serialize container data. It implements `JsonSerializable`, `DataInstance`,
 * and `SiteHaver` interfaces.
 *
 * @category Entity
 * @package  LORIS
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\biobank;

use LORIS\Data\DataInstance;
use LORIS\StudyEntities\SiteHaver;

/**
 * Container class for specimen containers in the Biobank module.
 *
 * @category   Entity
 * @package    LORIS
 * @subpackage Biobank
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 */
class Container implements
    DataInstance,
    SiteHaver
{
    /**
     * Persistent Instance variables describing a container entity.
     *
     * @var int          $id
     * @var string       $barcode
     * @var int          $specimenId
     * @var int          $typeId
     * @var int          $dimensionId
     * @var float        $temperature
     * @var int          $statusId
     * @var array        $shipmentBarcodes
     * @var \CenterID    $centerId
     * @var int          $parentContainerId
     * @var ?string      $parentContainerBarcode
     * @var array        $childContainerIds
     * @var int          $coordinate
     * @var string       $lotNumber
     * @var \DateTime    $expirationDate
     * @var string       $comments
     *
     * @access private
     */
    private $id;
    private $barcode;
    private $specimenId;
    private $typeId;
    private $dimensionId;
    private $temperature;
    private $statusId;
    private $shipmentBarcodes;
    private \CenterID $centerId;
    private $parentContainerId;
    private ?string $parentContainerBarcode = null;
    private $childContainerIds;
    private $coordinate;
    private $lotNumber;
    private $expirationDate;
    private $comments;

    /**
     * Initiliazes a new instance of the Container Class
     */
    function __construct()
    {
    }

    /**
     * Sets the container's ID
     *
     * @param int $id the container's ID
     *
     * @return void
     */
    public function setId(int $id) : void
    {
        if ($id > 0) {
            $this->id = $id;
        }
    }

    /**
     * Gets the container's ID
     *
     * @return ?int
     */
    public function getId() : ?int
    {
        return $this->id;
    }

    /**
     * Sets the container's barcode
     *
     * @param string $barcode the container's barcode
     *
     * @return void
     */
    public function setBarcode(string $barcode) : void
    {
        $this->barcode = $barcode;
    }

    /**
     * Gets the container's barcode
     *
     * @return ?string
     */
    public function getBarcode() : ?string
    {
        return $this->barcode;
    }

    /**
     * Sets the ID of the container specimen
     *
     * @param int $specimenId ID of the container specimen
     *
     * @return void
     */
    public function setSpecimenId(int $specimenId) : void
    {
        if ($specimenId > 0) {
            $this->specimenId = $specimenId;
        }
    }

    /**
     * Gets the ID of the container specimen
     *
     * @return ?int
     */
    public function getSpecimenId() : ?int
    {
        return $this->specimenId;
    }

    /**
     * Sets the ID of the container type
     *
     * @param int $typeId ID of the container type
     *
     * @return void
     */
    public function setTypeId(int $typeId) : void
    {
        if ($typeId > 0) {
            $this->typeId = $typeId;
        }
    }

    /**
     * Gets the ID of the container type
     *
     * @return ?int
     */
    public function getTypeId() : ?int
    {
        return $this->typeId;
    }

    /**
     * Sets the ID of the container's dimensions
     *
     * @param int $dimensionId ID of the container's dimensions
     *
     * @return void
     */
    public function setDimensionId(int $dimensionId) : void
    {
        if ($dimensionId > 0) {
            $this->dimensionId = $dimensionId;
        }
    }

    /**
     * Gets the ID of the container's dimensions
     *
     * @return ?int
     */
    public function getDimensionId() : ?int
    {
        return $this->dimensionId;
    }

    /**
     * Sets the container's temperature in Celsius.
     *
     * @param float $temperature the container's temperature.
     *
     * @return void
     */
    public function setTemperature(float $temperature) : void
    {
        $this->temperature = $temperature;
    }

    /**
     * Gets the container's temperature in Celsius.
     *
     * @return ?float
     */
    public function getTemperature() : ?float
    {
        return $this->temperature;
    }

    /**
     * Sets the Barcodes of the container's shipments
     *
     * @param array $shipmentBarcodes the IDs of the container's shipments
     *
     * @return void
     */
    public function setShipmentBarcodes(array $shipmentBarcodes) : void
    {
        $this->shipmentBarcodes = $shipmentBarcodes;
    }

    /**
     * Gets the Barcodes of the container's shipments
     *
     * @return ?array
     */
    public function getShipmentBarcodes() : ?array
    {
        return $this->shipmentBarcodes;
    }

    /**
     * Sets the ID of the container's current status
     *
     * @param int $statusId the ID of the container's current status
     *
     * @return void
     */
    public function setStatusId(int $statusId) : void
    {
        if ($statusId > 0) {
            $this->statusId = $statusId;
        }
    }

    /**
     * Gets the ID of the container's current status
     *
     * @return ?int
     */
    public function getStatusId() : ?int
    {
        return $this->statusId;
    }

    /**
     * Sets the ID of the container's current centerId
     *
     * @param \CenterID $centerId the ID of the container's current centerId
     *
     * @return void
     */
    public function setCenterId(\CenterID $centerId) : void
    {
        $this->centerId = $centerId;
    }

    /**
     * {inheritDoc}
     *
     * @return \CenterID
     */
    public function getCenterId() : \CenterID
    {
        return $this->centerId;
    }

    /**
     * Sets the parent container's ID
     *
     * @param ?int $parentContainerId the parent container's ID
     *
     * @return void
     */
    public function setParentContainerId(?int $parentContainerId) : void
    {
        $this->parentContainerId = $parentContainerId;
    }

    /**
     * Gets the parent container's ID
     *
     * @return ?int
     */
    public function getParentContainerId() : ?int
    {
        return $this->parentContainerId;
    }

    /**
     * Sets the parent container's barcode
     *
     * @param ?string $parentContainerBarcode the parent container's barcode
     *
     * @return void
     */
    public function setParentContainerBarcode(
        ?string $parentContainerBarcode
    ) : void {
        $this->parentContainerBarcode = $parentContainerBarcode;
    }

    /**
     * Gets the parent container's barcode
     *
     * @return ?string
     */
    public function getParentContainerBarcode() : ?string
    {
        return $this->parentContainerBarcode;
    }

    /**
     * Sets the IDs of the children containers
     *
     * @param array $childContainerIds array of IDs of children container
     *
     * @return void
     */
    public function setChildContainerIds(array $childContainerIds) : void
    {
        $this->childContainerIds = $childContainerIds;
    }

    /**
     * Gets the IDs of the children containers
     *
     * @return ?array
     */
    public function getChildContainerIds() : ?array
    {
        return $this->childContainerIds;
    }

    /**
     * Sets the container's current coordinate in storage
     *
     * @param ?int $coordinate the container's current coordinate
     *
     * @return void
     */
    public function setCoordinate(?int $coordinate = null) : void
    {
        if ($coordinate > 0) {
            $this->coordinate = intval($coordinate);
        }
    }

    /**
     * Gets the container's current coordinate in storage
     *
     * @return ?int
     */
    public function getCoordinate() : ?int
    {
        return $this->coordinate;
    }

    /**
     * Sets the container's lot number
     *
     * @param ?string $lotNumber the container's lot number.
     *
     * @return void
     */
    public function setLotNumber(?string $lotNumber = null) : void
    {
        $this->lotNumber = $lotNumber;
    }

    /**
     * Gets the container's lot number in storage
     *
     * @return ?string
     */
    public function getLotNumber() : ?string
    {
        return $this->lotNumber;
    }

    /**
     * Sets the expiration date
     *
     * @param ?\DateTime $date the expiration date
     *
     * @return void
     */
    public function setExpirationDate(?\DateTime $date = null) : void
    {
        $this->expirationDate = $date;
    }

    /**
     * Gets the expiration date
     *
     * @return ?\DateTime
     */
    public function getExpirationDate() : ?\DateTime
    {
        return $this->expirationDate;
    }

    /**
     * Sets the container's status comments.
     *
     * @param string $comments the container's status comments
     *
     * @return void
     */
    public function setComments(string $comments) : void
    {
        $this->comments = $comments;
    }

    /**
     * Gets the container's status comments.
     *
     * @return ?string
     */
    public function getComments() : ?string
    {
        return $this->comments;
    }

    /**
     * Populates the Container instance with the provided data.
     *
     * @param array $data Data to instantiate the Container object.
     *
     * @return self The current instance for method chaining.
     */
    public function fromArray(array $data) : self
    {
        if (isset($data['id'])) {
            $this->setId((int) $data['id']);
        }
        if (isset($data['barcode'])) {
            $this->setBarcode((string) $data['barcode']);
        }
        if (isset($data['specimenId'])) {
            $this->setSpecimenId((int) $data['specimenId']);
        }
        if (isset($data['typeId'])) {
            $this->setTypeId((int) $data['typeId']);
        }
        if (isset($data['dimensionId'])) {
            $this->setDimensionId((int) $data['dimensionId']);
        }
        if (isset($data['temperature'])) {
            $this->setTemperature((float) ($data['temperature']));
        }
        if (isset($data['statusId'])) {
            $this->setStatusId((int) $data['statusId']);
        }
        if (isset($data['shipmentBarcodes'])) {
            $this->setShipmentBarcodes($data['shipmentBarcodes']);
        }
        if (isset($data['centerId'])) {
            $this->setCenterId(new \CenterID(strval($data['centerId'])));
        }
        if (isset($data['parentContainerId'])) {
            $this->setParentContainerId((int) $data['parentContainerId']);
        }
        if (isset($data['parentContainerBarcode'])) {
            $this->setParentContainerBarcode(
                (string) $data['parentContainerBarcode']
            );
        }
        if (isset($data['childContainerIds'])) {
            $this->setChildContainerIds($data['childContainerIds']);
        }
        if (isset($data['coordinate'])) {
            $this->setCoordinate((int) $data['coordinate']);
        }
        if (isset($data['lotNumber'])) {
            $this->setLotNumber((string) $data['lotNumber']);
        }
        if (isset($data['expirationDate'])) {
            $this->setExpirationDate(new \DateTime($data['expirationDate']));
        }
        if (isset($data['comments'])) {
            $this->setComments((string) $data['comments']);
        }

        return $this;
    }

    /**
     * Converts the container instance to an array.
     *
     * @return array The container data as an associative array.
     */
    public function toArray() : array
    {
        return $this->jsonSerialize();
    }

    /**
     * {@inheritDoc}
     *
     * Serializes the container data to a JSON-compatible array.
     *
     * @return array The container data as an associative array.
     */
    public function jsonSerialize() : array
    {
        $expirationDate = $this->expirationDate;
        if ($expirationDate) {
            $expirationDate = $this->expirationDate->format('Y-m-d');
        }

        return [
            'id'                     => $this->id,
            'barcode'                => $this->barcode,
            'specimenId'             => $this->specimenId,
            'typeId'                 => $this->typeId,
            'dimensionId'            => $this->dimensionId,
            'temperature'            => $this->temperature,
            'statusId'               => $this->statusId,
            'shipmentBarcodes'       => $this->shipmentBarcodes,
            'centerId'               => $this->centerId,
            'parentContainerId'      => $this->parentContainerId,
            'parentContainerBarcode' => $this->parentContainerBarcode,
            'childContainerIds'      => $this->childContainerIds,
            'coordinate'             => $this->coordinate,
            'lotNumber'              => $this->lotNumber,
            'expirationDate'         => $expirationDate,
            'comments'               => $this->comments,
        ];
    }

    /**
     * Returns a JSON-encoded string of the container data.
     *
     * @return string JSON-encoded string of container data.
     */
    public function toJSON() : string
    {
        return json_encode($this);
    }
}
