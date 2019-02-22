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
     * These variables are directly mapped to the fields of the database schema
     * that describe a specimen entity.
     *
     * @access private
     */
    private $id;                //int
    private $containerId;       //int
    private $typeId;            //int
    private $quantity;          //float
    private $unitId;            //int
    private $fTCycle;           //int
    private $parentSpecimenIds; //array
    private $candidateId;       //int
    private $sessionId;         //int
    private $poolId;            //int
    private $collection;        //array
    private $preparation;       //array
    private $analysis;          //array

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
    public function setId(?int $id = null) : void
    {
        $this->id = $id;
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

    // XXX: Option of null was added as a temperary fix. This is because specimens
    // can't be created before receiving a container id from their saved container.
    // However, specimens should not be instantiated without have a container ID.
    // Brainstorm a solution to this with Rida.
    /**
     * Sets the ID of the specimen's container
     *
     * @param int $containerId the ID of the specimen's container
     *
     * @return void
     */
    public function setContainerId(?int $containerId = null) : void
    {
        $this->containerId = $containerId;
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
        $this->typeId = $typeId;
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
     * @param float $quantity the current amount of specimen available
     *
     * @return void
     */
    public function setQuantity(float $quantity) : void
    {
        $this->quantity = $quantity;
    }

    /**
     * Gets the current amount of specimen available
     *
     * @return float
     */
    public function getQuantity() : float
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
        $this->unitId = $unitId;
    }

    /**
     * Gets the ID of the specimen's unit of quantity
     *
     * @return int
     */
    public function getUnitId() : int
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
    public function setFTCycle(?int $fTCycle = null) : void
    {
        $this->fTCycle = $fTCycle;
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
    public function setParentSpecimenIds(?array $parentSpecimenIds = null) : void
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
        $this->candidateId = $candidateId;
    }

    /**
     * Gets the ID of the candidate to which the specimen belongs
     *
     * @return int
     */
    public function getCandidateId() : int
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
        $this->sessionId = $sessionId;
    }

    /**
     * Gets the ID of the candidate's session/timepoint in which the specimen
     * was collected.
     *
     * @return int
     */
    public function getSessionId() : int
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
    public function setPoolId(?int $poolId = null) : void
    {
        $this->poolId = $poolId;
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
     * Sets an associative array of data stored for the specimen's collection
     * stage.
     *
     * @param array $data key-value pair data for the specimen's collection
     *                    stage.
     *
     * @return void
     */
    public function setCollection(array $data) : void
    {
        // TODO: This may eventually become the responsibility of
        // getInstanceFromArray.
        $collection = new Collection();
        $collection->setQuantity($data['quantity']);
        $collection->setUnitId($data['unitId']);
        $collection->setCenterId($data['centerId']);
        $collection->setDate($data['date']);
        $collection->setTime($data['time']);
        $collection->setComments($data['comments']);
        $collection->setData($data['data']);
        $this->collection = $collection;
    }

    /**
     * Gets an associative array of data stored for the specimen's collection stage
     *
     * @return Collection
     */
    public function getCollection() : Collection
    {
        return $this->collection;
    }

    /**
     * Sets an associative array of data stored for the specimen's preparation
     * stage.
     *
     * @param array $data key-value pair data for the specimen's preparation
     *                    stage.
     *
     * @return void
     */
    public function setPreparation(?array $data = null) : void
    {
        if (array_filter($data)) {
            $preparation = new Preparation();
            $preparation->setProtocolId($data['protocolId']);
            $preparation->setCenterId($data['centerId']);
            $preparation->setDate($data['date']);
            $preparation->setTime($data['time']);
            $preparation->setData($data['data']);
            $preparation->setComments($data['comments']);
            $this->preparation = $preparation;
        };
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
     * Sets an associative array of data stored for the specimen's analysis
     * stage.
     *
     * @param array $data key-value pair data for the specimen's analysis stage
     *
     * @return void
     */
    public function setAnalysis(?array $data = null) : void
    {
        if (array_filter($data)) {
            $analysis = new Analysis();
            $analysis->setMethodId($data['methodId']);
            $analysis->setCenterId($data['centerId']);
            $analysis->setDate($data['date']);
            $analysis->setTime($data['time']);
            $analysis->setData($data['data']);
            $analysis->setComments($data['comments']);
            $this->analysis = $analysis;
        }
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
    // the Container's CenterID is accesibile by the current User. This function
    // allows this check to happen upon provisioner filtering.
    /**
     * Return Center ID of affiliated specimen container.
     *
     * @return int
     */
    public function getCenterID()
    {
        $db           = \Database::singleton();
        $containerDAO = new ContainerDAO($db);
        $containerId  = $this->getContainerId();
        $container    = $containerDAO->getInstanceFromId($containerId);
        return $container->getCenterID();
    }

    /**
     * Returns an array representing the state of the Specimen.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return array(
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
                'preparation'       => $this->preparation ? $this->preparation->jsonSerialize() : null,
                'analysis'          => $this->analysis ? $this->analysis->jsonSerialize() : null,
               );
        // XXX: This jsonSerializing may cause double jsonSerializing, but it
        // may be necessary??? not sure until I try saving data.
    }

    // XXX: This function must be implemented because this class implements
    // LORIS/Data/DataInstance. However, it is not currently being used anywhere
    // and I don't believe it necessary.
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
