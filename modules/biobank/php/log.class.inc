<?php declare(strict_types=1);
/**
 * Log Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Log Object instances.
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
 * Log Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Log Object instances.
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
class Log implements \JsonSerializable, \LORIS\Data\DataInstance
{
    /**
     * Persistent Instance variables.
     *
     * These properties describe a shipment entity.
     *
     * @var string    $barcode
     * @var string    $centerId
     * @var string    $status
     * @var string    $user
     * @var string    $temperature
     * @var \DateTime $date
     * @var \DateTime $time
     * @var string    $comments
     */
    public $barcode;
    public $centerId;
    public $status;
    public $user;
    public $temperature;
    public $date;
    public $time;
    public $comments;

    /**
     * Initiliazes a new instance of the Log Class
     */
    function __construct(array $data)
    {
        $this->barcode     = $data['barcode'] ?? null;
        $this->centerId    = $data['centerId'] ?? null;
        $this->status      = $data['status'] ?? null;
        $this->user        = $data['user'] ?? null;
        $this->temperature = $data['temperature'] ?? null;
        $this->date        = $data['date'] ?? null;
        $this->time        = $data['time'] ?? null;
        $this->comments    = $data['comments'] ?? null;
    }

    /**
     * Sets the shipment's ID
     *
     * @param int $barcode the shipment's ID
     *
     * @return void
     */
    private function setBarcode(int $barcode) : void
    {
        $this->barcode = $barcode;
    }

    /**
     * Gets the shipment's ID
     *
     * @return ?int
     */
    public function getBarcode() : ?int
    {
        return $this->barcode;
    }

    /**
     * @param string $centerId
     *
     * @return void
     */
    private function setCenterId(string $centerId) : void
    {
        $this->centerId = $centerId;
    }

    /**
     * @return ?string
     */
    public function getCenterId() : ?string
    {
        return $this->centerId;
    }

    /**
     * @param string $status
     *
     * @return void
     */
    private function setStatus(string $status) : void
    {
        $this->status = $status;
    }

    /**
     * @return ?string
     */
    public function getStatus() : ?string
    {
        return $this->status;
    }

    /**
     * @param string $user
     *
     * @return void
     */
    private function setUser(string $user) : void
    {
        $this->user = $user;
    }

    /**
     * @return ?string
     */
    public function getUser() : ?string
    {
        return $this->user;
    }

    /**
     * @param string $temperature
     *
     * @return void
     */
    private function setTemperature(string $temperature) : void
    {
        $this->temperature = $temperature;
    }

    /**
     * @return ?string
     */
    public function getTemperature() : ?string
    {
        return $this->temperature;
    }

    /**
     * @param \DateTime $date
     *
     * @return void
     */
    private function setDate(\DateTime $date) : void
    {
        $this->date = $date;
    }

    /**
     * @return ?DateTime
     */
    public function getDate() : ?\DateTime
    {
        return $this->date;
    }

    /**
     * @param \DateTime $time
     */
    private function setTime(\DateTime $time) : void
    {
        $this->time = $time;
    }

    /**
     * @return ?\DateTime
     */
    public function getTime() : ?\DateTime
    {
        return $this->time;
    }

    /**
     * @return ?string
     */
    public function getComments() : ?string
    {
        return $this->comments;
    }

    /**
     * A wrapper function for the jsonSerialize method of the Log Instance
     * Class. This converts the Log Instance into an array.
     *
     * @return array Log Array.
     */
    public function toArray() : array
    {
        return $this->jsonSerialize();
    }

    /**
     * Returns an array representing the state of the Log
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return [
            'barcode'     => $this->barcode,
            'centerId'    => $this->centerId,
            'status'      => $this->status,
            'user'        => $this->user,
            'temperature' => $this->temperature,
            'date'        => $this->date,
            'time'        => $this->time,
            'comments'    => $this->comments,
        ];
    }

    /**
     * Returns a JSON encoded string of the state of the Log
     *
     * @return string JSON encoded string of Log data
     */
    public function toJSON() : string
    {
        return json_encode($this);
    }
}

