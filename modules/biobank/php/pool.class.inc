<?php declare(strict_types=1);

/**
 * Pool Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Pool Object instances.
 *
 * PHP Version 8.2
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
 * Pool Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Pool Object instances.
 *
 * PHP Version 8.2
 *
 * @category   Entity
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Pool implements
    \JsonSerializable,
    \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    /**
     * Persistent Instance variables.
     *
     * These properties describe a pool entity.
     *
     * @var ?int       $id
     * @var string     $label
     * @var float      $quantity
     * @var int        $unitId
     * @var array      $specimenIds
     * @var array      $specimenBarcodes
     * @var int        $candidateId
     * @var string     $candidatePSCID
     * @var int        $sessionId
     * @var int        $typeId
     * @var \CenterID  $centerId
     * @var \ProjectID $projectId
     * @var \DateTime  $date
     * @var \DateTime  $time
     */
    private $id;
    private $label;
    private $quantity;
    private $unitId;
    private $specimenIds;
    private array $specimenBarcodes;
    private $candidateId;
    private string $candidatePSCID;
    private $sessionId;
    private $typeId;
    private \CenterID $centerId;
    private \ProjectID $projectId;
    private $date;
    private $time;

    /**
     * Initiliazes a new instance of the Pool Class
     */
    function __construct()
    {
    }

    /**
     * Sets the pool's ID
     *
     * @param int $id the pool's ID
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
     * Gets the pool's ID
     *
     * @return ?int
     */
    public function getId() : ?int
    {
        return $this->id;
    }

    /**
     * Sets the label of the pool
     *
     * @param string $label the pool's label
     *
     * @return void
     */
    public function setLabel(string $label) : void
    {
        $this->label = $label;
    }

    /**
     * Gets the label of the pool
     *
     * @return string
     */
    public function getLabel() : string
    {
        return $this->label;
    }

    /**
     * Sets the quantity of the pool
     *
     * @param float $quantity the pool's quantity
     *
     * @return void
     */
    public function setQuantity(float $quantity) : void
    {
        $this->quantity = $quantity;
    }

    /**
     * Gets the quantity of the pool
     *
     * @return float
     */
    public function getQuantity() : float
    {
        return $this->quantity;
    }

    /**
     * Sets the Unit ID of the pool
     *
     * @param int $unitId Unit ID of the pool
     *
     * @return void
     */
    public function setUnitId(int $unitId) : void
    {
        if ($unitId > 0) {
            $this->unitId = $unitId;
        }
    }

    /**
     * Gets the Unit ID of the pool
     *
     * @return ?int
     */
    public function getUnitId() : ?int
    {
        return $this->unitId;
    }

    /**
     * Sets the Specimen IDs of the pool
     *
     * @param array $specimenIds Specimen IDs of the pool
     *
     * @return void
     */
    public function setSpecimenIds(array $specimenIds) : void
    {
        $this->specimenIds = $specimenIds;
    }

    /**
     * Gets the Specimen IDs of the pool
     *
     * @return array
     */
    public function getSpecimenIds() : array
    {
        return $this->specimenIds;
    }

    /**
     * Sets the Specimen Barcodes of the pool
     *
     * @param array $specimenBarcodes Specimen Barcodes of the pool
     *
     * @return void
     */
    public function setSpecimenBarcodes(array $specimenBarcodes) : void
    {
        $this->specimenBarcodes = $specimenBarcodes;
    }

    /**
     * Gets the Specimen Barcodess of the pool
     *
     * @return array
     */
    public function getSpecimenBarcodes() : array
    {
        return $this->specimenBarcodes;
    }

    /**
     * Sets the Candidate ID of the pool
     *
     * @param int $candidateId Candidate ID of the pool
     *
     * @return void
     */
    public function setCandidateId(int $candidateId) : void
    {
        if ($candidateId > 0) {
            $this->candidateId = $candidateId;
        }
    }

    /**
     * Gets the Candidate ID of the pool
     *
     * @return ?int
     */
    public function getCandidateId() : ?int
    {
        return $this->candidateId;
    }

    /**
     * Sets the Candidate PSCID of the pool
     *
     * @param string $candidatePSCID Candidate ID of the pool
     *
     * @return void
     */
    public function setCandidatePSCID(string $candidatePSCID) : void
    {
        $this->candidatePSCID = $candidatePSCID;
    }

    /**
     * Gets the Candidate PSCID of the pool
     *
     * @return string
     */
    public function getCandidatePSCID() : string
    {
        return $this->candidatePSCID;
    }

    /**
     * Sets the Session ID of the pool
     *
     * @param ?int $sessionId Session ID of the pool
     *
     * @return void
     */
    public function setSessionId(?int $sessionId) : void
    {
        if ($sessionId > 0) {
            $this->sessionId = $sessionId;
        }
    }

    /**
     * Gets the Session ID of the pool
     *
     * @return ?int
     */
    public function getSessionId() : ?int
    {
        return $this->sessionId;
    }

    /**
     * Sets the Type ID of the pool
     *
     * @param ?int $typeId Type ID of the pool
     *
     * @return void
     */
    public function setTypeId(?int $typeId) : void
    {
        if ($typeId > 0) {
            $this->typeId = $typeId;
        }
    }

    /**
     * Gets the Type ID of the pool
     *
     * @return ?int
     */
    public function getTypeId() : ?int
    {
        return $this->typeId;
    }

    /**
     * Sets the Center ID of the pool
     *
     * @param \CenterID $centerId Center ID of the pool
     *
     * @return void
     */
    public function setCenterId(\CenterID $centerId) : void
    {
        $this->centerId = $centerId;
    }

    /**
     * Gets the Center ID of the pool
     *
     * @return \CenterID
     */
    public function getCenterId() : \CenterID
    {
        return $this->centerId;
    }

    /**
     * Sets the Project ID of the constituent specimens
     *
     * @param \ProjectID $projectId Project ID of the pool
     *
     * @return void
     */
    public function setProjectId(\ProjectID $projectId) : void
    {
         $this->projectId = $projectId;
    }

    /**
     * Gets the Project ID of the pool
     *
     * @return \ProjectID
     */
    public function getProjectId() : \ProjectID
    {
        return $this->projectId;
    }

    /**
     * Sets the date at which the pool was created.
     *
     * @param \DateTime $date the date of the pool
     *
     * @return void
     */
    public function setDate(\DateTime $date) : void
    {
        $this->date = $date;
    }

    /**
     * Gets the date that the pool was created.
     *
     * @return \DateTime
     */
    public function getDate() : \DateTime
    {
        return $this->date;
    }

    /**
     * Sets the time at which the pool was created.
     *
     * @param \DateTime $time the time of the pool
     *
     * @return void
     */
    public function setTime(\DateTime $time) : void
    {
        $this->time = $time;
    }

    /**
     * Gets the time of pool at which the pool was created.
     *
     * @return \DateTime
     */
    public function getTime() : \DateTime
    {
        return $this->time;
    }

    /**
     * Loads a Pool Object from an array.
     *
     * @param array $data Data to be used to load the Pool Object.
     *
     * @return Pool
     */
    public function fromArray(array $data) : Pool
    {
        if (isset($data['id'])) {
            $this->setId((int) ($data['id']));
        }
        if (isset($data['label'])) {
            $this->setLabel((string) $data['label']);
        }
        if (isset($data['quantity'])) {
            $this->setQuantity((float) $data['quantity']);
        }
        if (isset($data['unitId'])) {
            $this->setUnitId((int) $data['unitId']);
        }
        if (isset($data['specimenIds'])) {
            $this->setSpecimenIds($data['specimenIds']);
        }
        if (isset($data['specimenBarcodes'])) {
            $this->setSpecimenBarcodes($data['specimenBarcodes']);
        }
        if (isset($data['candidateId'])) {
            $this->setCandidateId((int) $data['candidateId']);
        }
        if (isset($data['candidatePSCID'])) {
            $this->setCandidatePSCID((string) $data['candidatePSCID']);
        }
        if (isset($data['sessionId'])) {
            $this->setSessionId((int) $data['sessionId']);
        }
        if (isset($data['typeId'])) {
            $this->setTypeId((int) $data['typeId']);
        }
        if (isset($data['centerId'])) {
            $this->setCenterId(new \CenterID(strval($data['centerId'])));
        }
        if (isset($data['projectId'])) {
            $this->setProjectId($data['projectId']);
        }
        if (isset($data['date'])) {
            $this->setDate(new \DateTime($data['date']));
        }
        if (isset($data['time'])) {
            $this->setTime(new \DateTime($data['time']));
        }

        return $this;
    }

    /**
     * A wrapper function for the jsonSerialize method of the Pool Instance
     * Class. This converts the Pool Instance into an array.
     *
     * @return array Pool Array.
     */
    public function toArray() : array
    {
        return $this->jsonSerialize();
    }

    /**
     * Returns an array representing the state of the Pool.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        // TODO: Date and Time formats should be gotten from some sort of
        // config setting.
        return [
            'id'               => $this->id,
            'label'            => $this->label,
            'quantity'         => $this->quantity,
            'unitId'           => $this->unitId,
            'specimenIds'      => $this->specimenIds,
            'specimenBarcodes' => $this->specimenBarcodes,
            'candidateId'      => $this->candidateId,
            'candidatePSCID'   => $this->candidatePSCID,
            'sessionId'        => $this->sessionId,
            'typeId'           => $this->typeId,
            'centerId'         => $this->centerId,
            'projectId'        => $this->projectId,
            'date'             => $this->date->format('d-m-Y'),
            'time'             => $this->time->format('H:i'),
        ];
    }

    /**
     * Returns a JSON encoded string of the state of the Pool
     *
     * @return string JSON encoded string of Pool data
     */
    public function toJSON() : string
    {
        return json_encode($this);
    }

    public function isAccessibleBy(\User $user): bool
    {
        return \LORIS\StudyEntities\DataInstanceAccess::centerAndProjectMatch(
            $user,
            $this
        );
    }
}
