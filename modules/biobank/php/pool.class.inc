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
     * These variables are directly mapped to the fields of the database schema
     * that describe a pool entity.
     *
     * @access private
     */
    private $id;          //int
    private $label;       //string
    private $specimenIds; //array
    private $candidateId; //int
    private $sessionId;   //int
    private $centerId;    //int
    private $date;        //string
    private $time;        //string

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
    public function setId(?int $id = null) : void
    {
        $this->id = $id;
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
        $this->candidateId = $candidateId;
    }

    /**
     * Gets the Candidate ID of the pool
     *
     * @return int
     */
    public function getCandidateId() : int
    {
        return $this->candidateId;
    }

    /**
     * Sets the Session ID of the pool
     *
     * @param int $sessionId Session ID of the pool
     *
     * @return void
     */
    public function setSessionId(int $sessionId) : void
    {
        $this->sessionId = $sessionId;
    }

    /**
     * Gets the Session ID of the pool
     *
     * @return int
     */
    public function getSessionId() : int
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
        $this->centerId = $centerId;
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
                'time'        => $this->time->format('H:i',
               );
    }

    // XXX: This function must be implemented because this class implements
    // LORIS/Data/DataInstance. However, it is not currently being used anywhere
    // and I don't believe it necessary.
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

