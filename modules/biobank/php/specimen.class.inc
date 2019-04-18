<?php declare(strict_types=1);
/**
 * Specimen Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Specimen Object instances.
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
 * Specimen Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Specimen Object instances.
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
class Specimen implements \JsonSerializable, \LORIS\Data\DataInstance
{
    /**
     * Persistent Instance variables.
     *
     * These properties describe a specimen entity.
     *
     * @var int         $id
     * @var int         $containerId
     * @var int         $typeId
     * @var string      $quantity
     * @var int         $unitId
     * @var int         $fTCycle
     * @var array       $parentSpecimenIds
     * @var int         $candidateId
     * @var int         $sessionId
     * @var int         $poolId
     * @var Collection  $collection
     * @var Preparation $preparation
     * @var Analysis    $analysis
     */
    private $id;
    private $containerId;
    private $typeId;
    private $quantity;
    private $unitId;
    private $fTCycle;
    private $parentSpecimenIds;
    private $candidateId;
    private $sessionId;
    private $poolId;
    private $collection;
    private $preparation;
    private $analysis;

    /**
     * Initiliazes a new instance of the Specimen Class
     */
    function __construct()
    {
    }

    /**
     * Sets the specimen's ID.
     *
     * @param int $id the specimen's ID
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
     * Gets the specimen's ID
     *
     * @return int
     */
    public function getId() : ?int
    {
        return $this->id;
    }

    /**
     * Sets the ID of the specimen's container
     *
     * @param int $containerId the ID of the specimen's container
     *
     * @return void
     */
    public function setContainerId($containerId) : void
    {
        if ($containerId > 0) {
            $this->containerId = $containerId;
        }
    }

    /**
     * Gets the ID of the specimen's container
     *
     * @return int
     */
    public function getContainerId() : ?int
    {
        return $this->containerId;
    }

    /**
     * Sets the ID of the specimen type
     *
     * @param int $typeId ID of the specimen type
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
     * Gets the ID of the specimen type
     *
     * @return int
     */
    public function getTypeId() : int
    {
        return $this->typeId;
    }

    /**
     * Sets the current amount of specimen available
     *
     * @param string $quantity the current amount of specimen available
     *
     * @return void
     */
    public function setQuantity(string $quantity) : void
    {
        $this->quantity = $quantity;
    }

    /**
     * Gets the current amount of specimen available
     *
     * @return ?string
     */
    public function getQuantity() : ?string
    {
        return $this->quantity;
    }

    /**
     * Sets the ID of the specimen's unit of quantity
     *
     * @param int $unitId the ID of the quantity's unit
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
     * Gets the ID of the specimen's unit of quantity
     *
     * @return ?int
     */
    public function getUnitId() : ?int
    {
        return $this->unitId;
    }

    /**
     * Sets the specimen's current Freeze-Thaw cycle.
     *
     * @param int $fTCycle the specimen's current F-T cycle
     *
     * @return void
     */
    public function setFTCycle(int $fTCycle) : void
    {
        if ($fTCycle >= 0) {
            $this->fTCycle = $fTCycle;
        }
    }

    /**
     * Gets the specimen's current Freeze-Thaw cycle
     *
     * @return int
     */
    public function getFTCycle() : ?int
    {
        return $this->fTCycle;
    }

    /**
     * Sets the parent specimen's ID.
     *
     * @param array $parentSpecimenIds the parent specimen's IDs
     *
     * @return void
     */
    public function setParentSpecimenIds(array $parentSpecimenIds) : void
    {
        $this->parentSpecimenIds = $parentSpecimenIds;
    }

    /**
     * Gets the parent specimen's ID
     *
     * @return array
     */
    public function getParentSpecimenIds() : ?array
    {
        return $this->parentSpecimenIds;
    }

    /**
     * Sets the ID of the candidate to which the specimen belongs
     *
     * @param int $candidateId ID of the specimen's donor
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
     * Gets the ID of the candidate to which the specimen belongs
     *
     * @return ?int
     */
    public function getCandidateId() : ?int
    {
        return $this->candidateId;
    }

    /**
     * Sets the ID of the candidate's session/timepoint in which the specimen was collected
     *
     * @param int $sessionId the ID of the specimen's session of collection
     *
     * @return void
     */
    public function setSessionId(int $sessionId) : void
    {
        if ($sessionId > 0) {
            $this->sessionId = $sessionId;
        }
    }

    /**
     * Gets the ID of the candidate's session/timepoint in which the specimen
     * was collected.
     *
     * @return ?int
     */
    public function getSessionId() : ?int
    {
        return $this->sessionId;
    }

    /**
     * Sets the ID of the specimen's pool group, if it exists.
     *
     * @param int $poolId the ID of the specimen's pool group
     *
     * @return void
     */
    public function setPoolId(int $poolId) : void
    {
        if ($poolId > 0) {
            $this->poolId = $poolId;
        }
    }

    /**
     * Gets the ID of the specimen's pool group.
     *
     * @return int
     */
    public function getPoolId() : ?int
    {
        return $this->poolId;
    }

    /**
     * Sets a Collection object for the Specimen.
     *
     * @param Collection $collection A collection instance
     *
     * @return void
     */
    public function setCollection(Collection $collection) : void
    {
        $this->collection = $collection;
    }

    /**
     * Gets an associative array of data stored for the specimen's collection stage
     *
     * @return ?Collection
     */
    public function getCollection() : ?Collection
    {
        return $this->collection;
    }

    /**
     * Sets a Preparation object for the Specimen.
     *
     * @param Preparation $preparation A Preparation Instance
     *
     * @return void
     */
    public function setPreparation(Preparation $preparation) : void
    {
        $this->preparation = $preparation;
    }

    /**
     * Gets an associative array of data stored for the specimen's preparation
     * stage.
     *
     * @return Preparation|null
     */
    public function getPreparation() : ?Preparation
    {
        return $this->preparation;
    }

    /**
     * Sets an Analysis object for the Specimen.
     *
     * @param Analysis $analysis An Analysis Instance.
     *
     * @return void
     */
    public function setAnalysis(Analysis $analysis) : void
    {
        $this->analysis = $analysis;
    }

    /**
     * Gets an associative array of data stored for the specimen's analysis stage
     *
     * @return Analysis|null
     */
    public function getAnalysis() : ?Analysis
    {
        return $this->analysis;
    }

    // FIXME: THIS IS A MASSIVE HACK. Specimens should not be provisioned if
    // their Container is not provisioned. Therefore, a check must be made that
    // the Container's Center ID is accesibile by the current User. This function
    // allows this check to happen upon provisioner filtering.
    /**
     * Return Center ID of affiliated specimen container.
     *
     * @return int
     */
    public function getCenterId()
    {
        $db           = \Database::singleton();
        $containerDAO = new ContainerDAO($db);
        $containerId  = $this->getContainerId();
        $container    = $containerDAO->getInstanceFromId($containerId);
        return $container->getCenterId();
    }

    /**
     * Instatiates a Specimen Object using the values sent from the front-end.
     *
     * @param array $data Data to be used to instantiate the Specimen Object.
     *
     * @return Specimen $specimen Instantiated Specimen Object
     */
    public function fromArray(array $data) : Specimen
    {
        isset($data['id'])                && $this->setId((int) $data['id']);
        isset($data['containerId'])       && $this->setContainerId((int) $data['containerId']);
        isset($data['typeId'])            && $this->setTypeId((int) $data['typeId']);
        isset($data['quantity'])          && $this->setQuantity((string) $data['quantity']);
        isset($data['unitId'])            && $this->setUnitId((int) $data['unitId']);
        isset($data['fTCycle'])           && $this->setFTCycle((int) $data['fTCycle']);
        isset($data['parentSpecimenIds']) && $this->setParentSpecimenIds($data['parentSpecimenIds']);
        isset($data['candidateId'])       && $this->setCandidateId((int) $data['candidateId']);
        isset($data['sessionId'])         && $this->setSessionId((int) $data['sessionId']);
        isset($data['poolId'])            && $this->setPoolId((int) $data['poolId']);

        if (isset($data['collection'])) {
            $collection = (new Collection())->fromArray($data['collection']);
            $this->setCollection($collection);
        }

        if (isset($data['preparation'])) {
            $preparation = (new Preparation())->fromArray($data['preparation']);
            $this->setPreparation($preparation);
        }
        if (isset($data['analysis'])) {
            $analysis = (new Analysis())->fromArray($data['analysis']);
            $this->setAnalysis($analysis);
        }

        return $this;
    }

    /**
     * A wrapper function for the jsonSerialize method of the Specimen Instance
     * Class. This converts this Specimen Instance into an array
     *
     * @return array
     */
    public function toArray() : array
    {
        return $this->jsonSerialize();
    }

    /**
     * Returns an array representing the state of the Specimen.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        $array = array(
                'id'                => $this->id,
                'containerId'       => $this->containerId,
                'typeId'            => $this->typeId,
                'quantity'          => $this->quantity,
                'unitId'            => $this->unitId,
                'fTCycle'           => $this->fTCycle,
                'parentSpecimenIds' => $this->parentSpecimenIds,
                'candidateId'       => $this->candidateId,
                'sessionId'         => $this->sessionId,
                'poolId'            => $this->poolId,
                'collection'        => $this->collection->jsonSerialize(),
               );
        if ($this->preparation) {
            $array['preparation'] = $this->preparation->jsonSerialize();
        }
        if ($this->analysis) {
            $array['analysis'] = $this->analysis->jsonSerialize();
        }
        return $array;
    }

    /**
     * Returns a JSON encoded string of the state of the Specimen
     *
     * @return string JSON encoded string of Specimen data
     */
    public function toJSON() : string
    {
        return json_encode($this);
    }
}
