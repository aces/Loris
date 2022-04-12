<?php declare(strict_types=1);
/**
 * Process Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Process Object instances.
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
 * Process Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Process Object instances.
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
abstract class Process implements \JsonSerializable
{
    /**
     * Persistent Instance variables.
     *
     * These variables describe a process instance.
     *
     * @var int       $protocolId
     * @var int       $centerId
     * @var int       $examinerId
     * @var \DateTime $date
     * @var \DateTime $time
     * @var string    $comments
     * @var array     $data
     */
    private $protocolId;
    private $centerId;
    private $examinerId;
    private $date;
    private $time;
    private $comments;
    private $data;

    /**
     * Initiliazes a new instance of the Process Class
     */
    function __construct()
    {
    }

    /**
     * Sets the ID of the specimen's processing protocol.
     *
     * @param int $protocolId the ID of the processing protocol
     *
     * @return void
     */
    public function setProtocolId(int $protocolId) : void
    {
        if ($protocolId > 0) {
            $this->protocolId = $protocolId;
        }
    }

    /**
     * Gets the ID of the specimen's processing protocol.
     *
     * @return int
     */
    public function getProtocolId() : int
    {
        return $this->protocolId;
    }

    /**
     * Sets the ID of the specimen's center at time of processing.
     *
     * @param int $centerId the ID of the processing center
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
     * Gets the ID of the specimen's processing center
     *
     * @return int
     */
    public function getCenterId() : int
    {
        return $this->centerId;
    }

    /**
     * Sets the ID of the specimen's examiner at time of processing.
     *
     * @param int $examinerId the ID of the processing center
     *
     * @return void
     */
    public function setExaminerId(int $examinerId) : void
    {
        if ($examinerId > 0) {
            $this->examinerId = $examinerId;
        }
    }

    /**
     * Gets the ID of the specimen's processing examiner
     *
     * @return int
     */
    public function getExaminerId() : int
    {
        return $this->examinerId;
    }

    /**
     * Sets the date of collection
     *
     * @param \DateTime $date the date of processing
     *
     * @return void
     */
    public function setDate(\DateTime $date) : void
    {
        $this->date = $date;
    }

    /**
     * Gets the date of processing
     *
     * @return \DateTime
     */
    public function getDate() : \DateTime
    {
        return $this->date;
    }

    /**
     * Sets the time of processing
     *
     * @param \DateTime $time the time of processing
     *
     * @return void
     */
    public function setTime(\DateTime $time) : void
    {
        $this->time = $time;
    }

    /**
     * Gets the time of processing
     *
     * @return DateTime
     */
    public function getTime() : \DateTime
    {
        return $this->time;
    }

    /**
     * Sets processing comments
     *
     * @param string $comments comments relating to processing
     *
     * @return void
     */
    public function setComments(string $comments) : void
    {
        $this->comments = $comments;
    }

    /**
     * Gets the processing comments
     *
     * @return ?string
     */
    public function getComments() : ?string
    {
        return $this->comments;
    }

    /**
     * Sets the Data array that contains custom attributes and values.
     *
     * @param array $data of custom attributes and values.
     *
     * @return void
     */
    public function setData(array $data) : void
    {
        $this->data = $data;
    }

    /**
     * Gets the Data array that contains custom attributes and values.
     *
     * @return ?array
     */
    public function getData() : ?array
    {
        return $this->data;
    }

    /**
     * Instatiates a Process Object using the values sent from the client-side.
     *
     * @param array $data Data to be used to instantiate the Process Object.
     *
     * @return Process
     */
    public function fromArray(array $data) : Process
    {
        isset($data['protocolId']) && $this->setProtocolId((int) $data['protocolId']);
        isset($data['centerId'])   && $this->setCenterId((int) $data['centerId']);
        isset($data['examinerId']) && $this->setExaminerId((int) $data['examinerId']);
        isset($data['date'])       && $this->setDate(new \DateTime($data['date']));
        isset($data['time'])       && $this->setTime(new \DateTime($data['time']));
        isset($data['data'])       && $this->setData($data['data']);
        isset($data['comments'])   && $this->setComments((string) $data['comments']);

        return $this;
    }


    /**
     * Returns an array representing the state of the Process.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        // TODO: Date and Time formats should be gotten from some sort of config
        // setting.
        return array(
                'protocolId' => $this->protocolId,
                'centerId'   => $this->centerId,
                'examinerId' => $this->examinerId,
                'date'       => $this->date->format('Y-m-d'),
                'time'       => $this->time->format('H:i'),
                'comments'   => $this->comments,
                'data'       => $this->data,
               );
    }
}

