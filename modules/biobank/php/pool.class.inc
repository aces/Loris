<?php declare(strict_types=1);
/**
 * Pool Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Pool Object instances.
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
 * Pool Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Pool Object instances.
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
class Pool implements \JsonSerializable, \LORIS\Data\DataInstance
{
    /**
     * Persistent Instance variables.
     *
     * These properties describe a pool entity.
     *
     * @var string    $id
     * @var string    $label
     * @var array     $specimenIds
     * @var int       $candidateId
     * @var int       $sessionId
     * @var int       $centerId
     * @var \DateTime $date
     * @var \DateTime $time
     */
    private $id;
    private $label;
    private $specimenIds;
    private $candidateId;
    private $sessionId;
    private $centerId;
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
     * Sets the Center ID of the pool
     *
     * @param array $centerId Center ID of the pool
     *
     * @return void
     */
    public function setCenterId(int $centerId) : void
    {
        if ($centerId > 0) {
            $this->centerId = $centerId;
        }
    }

    /**
     * Gets the Center ID of the pool
     *
     * @return int
     */
    public function getCenterId() : int
    {
        return $this->centerId;
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
        isset($data['id'])          && $this->setId((int) ($data['id']));                                              
        isset($data['label'])       && $this->setLabel((string) $data['label']);                                        
        isset($data['specimenIds']) && $this->setSpecimenIds($data['specimenIds']);                            
        isset($data['candidateId']) && $this->setCandidateId((int) $data['candidateId']);                            
        isset($data['sessionId'])   && $this->setSessionId((int) $data['sessionId']);                                
        isset($data['centerId'])    && $this->setCenterId((int) $data['centerId']);                                  
        isset($data['date'])        && $this->setDate(new \DateTime($data['date']));                           
        isset($data['time'])        && $this->setTime(new \DateTime($data['time']));                           
                                                                                
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
        return array(
                'id'          => $this->id,
                'label'       => $this->label,
                'specimenIds' => $this->specimenIds,
                'candidateId' => $this->candidateId,
                'sessionId'   => $this->sessionId,
                'centerId'    => $this->centerId,
                'date'        => $this->date->format('d-m-Y'),
                'time'        => $this->time->format('H:i'),
               );
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
}

