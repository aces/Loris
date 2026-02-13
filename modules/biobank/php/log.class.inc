<?php declare(strict_types=1);

/**
 * Log Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Log Object instances.
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
 * Log Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Log Object instances.
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
class Log implements \JsonSerializable, \LORIS\Data\DataInstance
{
    /**
     * Persistent Instance variables.
     *
     * These properties describe a shipment entity.
     *
     * @var string    $barcode
     * @var \CenterID $centerId
     * @var string    $status
     * @var string    $user
     * @var string    $temperature
     * @var \DateTime $date
     * @var \DateTime $time
     * @var string    $comments
     */
    public ?string $barcode;
    public ?\CenterID $centerId;
    public ?string $status;
    public ?string $user;
    public ?string $temperature;
    public ?\DateTime $date;
    public ?\DateTime $time;
    public ?string $comments;

    /**
     * Initiliazes a new instance of the Log Class
     *
     * @param array $data The data to initialize the log with
     */
    function __construct(array $data)
    {
        $this->barcode     = $data['barcode'] ?? null;
        $this->centerId    = new \CenterID($data['centerId'] ?? null);
        $this->status      = $data['status'] ?? null;
        $this->user        = $data['user'] ?? null;
        $this->temperature = $data['temperature'] ?? null;
        $this->date        = new \DateTime($data['date'] ?? null);
        $this->time        = new \DateTime($data['time'] ?? null);
        $this->comments    = $data['comments'] ?? null;
    }

    /**
     * Gets the shipment's ID
     *
     * @return ?string
     */
    public function getBarcode() : ?string
    {
        return $this->barcode;
    }

    /**
     * Get the center for this log
     *
     * @return \CenterID
     */
    public function getCenterId() : \CenterID
    {
        return $this->centerId;
    }

    /**
     * Get the status of this shipment log
     *
     * @return ?string
     */
    public function getStatus() : ?string
    {
        return $this->status;
    }

    /**
     * Get the user(?)
     *
     * @return ?string
     */
    public function getUser() : ?string
    {
        return $this->user;
    }

    /**
     * Get the temperature during this shipment log
     *
     * @return ?string
     */
    public function getTemperature() : ?string
    {
        return $this->temperature;
    }

    /**
     * Get the date (without time) for this log
     *
     * @return ?\DateTime
     */
    public function getDate() : ?\DateTime
    {
        return $this->date;
    }

    /**
     * Get the time of this log
     *
     * @return ?\DateTime
     */
    public function getTime() : ?\DateTime
    {
        return $this->time;
    }

    /**
     * Get the comments for this log
     *
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

    public function isAccessibleBy(\User $user): bool
    {
        return \LORIS\StudyEntities\DataInstanceAccess::centerMatch(
            $user,
            $this
        );
    }
}
