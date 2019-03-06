<?php declare(strict_types=1);
/**
 * Collection Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Collection Object instances.
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
 * Collection Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Collection Object instances.
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
class Collection extends Process
{
    /**
     * Persistent Instance variables.
     *
     * These variables describe a collection instance.
     *
     * @var string $quantity
     * @var int    $unitId
     */
    private $quantity;
    private $unitId;

    /**
     * Sets the current quantity of specimen available. This associated unit
     * can be found in the `biobank_unit` using the unit ID.
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
     * @return string
     */
    public function getQuantity() : string
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
     * Instatiates a Collection Object using the values sent from the client-side.
     *
     * @param array $data Data to be used to instantiate the Collection Object.
     *
     * @return Process
     */
    public function fromArray(array $data) : Process
    {
        parent::fromArray($data);
        $this->setQuantity($data['quantity']);
        $this->setUnitId(intval($data['unitId']));

        return $this;
    }

    /**
     * A wrapper function for the jsonSerialize method of the Collection Instance
     * Class. This converts this Specimen Collection into an array
     *
     * @return array Collection Array
     */
    public function toArray()
    {
        return $this->jsonSerialize();
    }

    /**
     * Returns an array representing the state of the Collection.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        $parent = parent::jsonSerialize();
        return array_merge(
            $parent,
            array(
             'quantity' => $this->quantity,
             'unitId'   => $this->unitId,
            )
        );
    }
}

