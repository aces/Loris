<?php declare(strict_types=1);

/**
 * Defines the abstract Process class for specimen processes in the Biobank
 * module.
 *
 * This file contains the `Process` class, which implements the
 * `JsonSerializable` interface and provides methods for managing process data,
 * including serialization for storage and retrieval.
 *
 * @category   Entity
 * @package    LORIS
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * Abstract Process class for specimen processing in the Biobank module.
 *
 * This class represents a generic process and provides methods to manage and
 * serialize process data. It implements the `JsonSerializable` interface to
 * allow for JSON serialization of process instances.
 *
 * @category   Entity
 * @package    LORIS
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class Process implements \JsonSerializable
{
    /**
     * Persistent instance variables describing a process.
     *
     * @var int       $protocolId  The ID of the processing protocol.
     * @var int       $centerId    The ID of the processing center.
     * @var int       $examinerId  The ID of the processing examiner.
     * @var \DateTime $date        The date of processing.
     * @var \DateTime $time        The time of processing.
     * @var string    $comments    Comments related to processing.
     * @var array     $data        Custom attributes and values.
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
     * @return int The protocol ID.
     */
    public function getProtocolId() : int
    {
        return $this->protocolId;
    }

    /**
     * Sets the ID of the specimen's processing center.
     *
     * @param int $centerId the ID of the processing center.
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
     * @return int The center ID.
     */
    public function getCenterId() : int
    {
        return $this->centerId;
    }

    /**
     * Sets the ID of the specimen's processing examiner.
     *
     * @param int $examinerId The ID of the processing examiner.
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
     * Gets the ID of the specimen's processing examiner.
     *
     * @return ?int The examiner ID, or null if not set.
     */
    public function getExaminerId() : ?int
    {
        return $this->examinerId ?? null;
    }

    /**
     * Sets the date of processing.
     *
     * @param \DateTime $date The date of processing.
     *
     * @return void
     */
    public function setDate(\DateTime $date) : void
    {
        $this->date = $date;
    }

    /**
     * Gets the date of processing.
     *
     * @return \DateTime The date of processing.
     */
    public function getDate() : \DateTime
    {
        return $this->date;
    }

    /**
     * Sets the time of processing.
     *
     * @param \DateTime $time The time of processing.
     *
     * @return void
     */
    public function setTime(\DateTime $time) : void
    {
        $this->time = $time;
    }

    /**
     * Gets the time of processing.
     *
     * @return \DateTime The time of processing.
     */
    public function getTime() : \DateTime
    {
        return $this->time;
    }

    /**
     * Sets comments related to processing.
     *
     * @param string $comments Comments relating to processing.
     *
     * @return void
     */
    public function setComments(string $comments) : void
    {
        $this->comments = $comments;
    }

    /**
     * Gets the processing comments.
     *
     * @return ?string The comments, or null if not set.
     */
    public function getComments() : ?string
    {
        return $this->comments;
    }

    /**
     * Sets the data array containing custom attributes and values.
     *
     * @param array $data An array of custom attributes and values.
     *
     * @return void
     */
    public function setData(array $data) : void
    {
        $this->data = $data;
    }

    /**
     * Gets the data array containing custom attributes and values.
     *
     * @return ?array The data array, or null if not set.
     */
    public function getData() : ?array
    {
        return $this->data;
    }

    /**
     * Instantiates a Process object from an array of data.
     *
     * Populates the Process instance with the provided data.
     *
     * @param array $data Data to instantiate the Process object.
     *
     * @return Process The current instance for method chaining.
     */
    public function fromArray(array $data) : Process
    {
        if (isset($data['protocolId'])) {
            $this->setProtocolId((int) $data['protocolId']);
        }
        if (isset($data['centerId'])) {
            $this->setCenterId((int) $data['centerId']);
        }

        if (isset($data['examinerId'])) {
            $this->setExaminerId((int) $data['examinerId']);
        }
        if (isset($data['date'])) {
            $this->setDate(new \DateTime($data['date']));
        }
        if (isset($data['time'])) {
            $this->setTime(new \DateTime($data['time']));
        }
        if (isset($data['data'])) {
            $this->setData($data['data']);
        }
        if (isset($data['comments'])) {
            $this->setComments((string) $data['comments']);
        }

        return $this;
    }

    /**
     * Converts the process instance to an array.
     *
     * This method provides an array representation of the process by
     * utilizing the `jsonSerialize` method.
     *
     * @return array The process data as an associative array.
     */
    public function toArray()
    {
        return $this->jsonSerialize();
    }

    /**
     * {@inheritDoc}
     *
     * @return array The process data as an associative array.
     */
    public function jsonSerialize() : array
    {
        return [
            'protocolId' => $this->protocolId,
            'centerId'   => $this->centerId,
            'examinerId' => $this->examinerId,
            'date'       => $this->date->format('Y-m-d'),
            'time'       => $this->time->format('H:i'),
            'comments'   => $this->comments,
            'data'       => $this->data,
        ];
    }
}

