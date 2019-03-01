<?php declare(strict_types=1);
/**
 * Container Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Container Object instances.
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
 * Container Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Container Object instances.
 *
 * PHP Version 7.2
 *
 * @category Loris
 * @package  Biobank
 * @author   Henri Rabalais <hrabalais.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Container implements \JsonSerializable, \LORIS\Data\DataInstance
{
    /**
     * Persistent Instance variables.
     *
     * These properties describe a container entity.
     *
     * @var int   $id
     * @var int   $barcode
     * @var int   $typeId
     * @var int   $dimensionId
     * @var float $temperature
     * @var int   $statusId
     * @var int   $originId
     * @var int   $centerId
     * @var int   $parentContainerId
     * @var array $childContainerIds
     * @var int   $coordinate
     *
     * @access private
     */
    private $id;
    private $barcode;
    private $typeId;
    private $dimensionId;
    private $temperature;
    private $statusId;
    private $originId;
    private $centerId;
    private $parentContainerId;
    private $childContainerIds;
    private $coordinate;

    /**
     * Initiliazes a new instance of the Container Class
     */
    function __construct()
    {
    }

    /**
     * Sets the container's ID
     *
     * @param ?int $id the container's ID
     *
     * @return void
     */
    public function setId(?int $id = null) : void
    {
        $this->id = $id;
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
     * @return string
     */
    public function getBarcode() : string
    {
        return $this->barcode;
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
        $this->typeId = $typeId;
    }

    /**
     * Gets the ID of the container type
     *
     * @return int
     */
    public function getTypeId() : int
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
        $this->dimensionId = $dimensionId;
    }

    /**
     * Gets the ID of the container's dimensions
     *
     * @return int
     */
    public function getDimensionId() : int
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
     * @return float
     */
    public function getTemperature() : float
    {
        return $this->temperature;
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
        $this->statusId = $statusId;
    }

    /**
     * Gets the ID of the container's current status
     *
     * @return int
     */
    public function getStatusId() : int
    {
        return $this->statusId;
    }

    /**
     * Sets the ID of the container's origin
     *
     * @param int $originId the ID of the container's origin
     *
     * @return void
     */
    public function setOriginId(int $originId) : void
    {
        $this->originId = $originId;
    }

    /**
     * Gets the ID of the container's origin
     *
     * @return int
     */
    public function getOriginId() : int
    {
        return $this->originId;
    }

    /**
     * Sets the ID of the container's current centerId
     *
     * @param int $centerId the ID of the container's current centerId
     *
     * @return none
     */
    public function setCenterId(int $centerId) : void
    {
        $this->centerId = $centerId;
    }

    /**
     * Gets the ID of the container's current centerId
     *
     * @return int
     */
    public function getCenterId() : int
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
    public function setParentContainerId(?int $parentContainerId = null) : void
    {
        $this->parentContainerId = $parentContainerId;
    }

    /**
     * Gets the parent container's ID
     *
     * @return int|null
     */
    public function getParentContainerId() : ?int
    {
        return $this->parentContainerId;
    }

    /**
     * Sets the IDs of the children containers
     *
     * @param ?array $childContainerIds array of IDs of children container
     *
     * @return void
     */
    public function setChildContainerIds(?array $childContainerIds = null) : void
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
        $this->coordinate = $coordinate;
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
     * Gets an array representing the state of the Container
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return array(
                'id'                => $this->id,
                'barcode'           => $this->barcode,
                'typeId'            => $this->typeId,
                'dimensionId'       => $this->dimensionId,
                'temperature'       => $this->temperature,
                'statusId'          => $this->statusId,
                'originId'          => $this->originId,
                'centerId'          => $this->centerId,
                'parentContainerId' => $this->parentContainerId,
                'childContainerIds' => $this->childContainerIds,
                'coordinate'        => $this->coordinate,
               );
    }

    /**
     * Returns a JSON encoded string of the state of the Container
     *
     * @return string JSON encoded string of Container data
     */
    public function toJSON() : string
    {
        return json_encode($this);
    }
}

