<?php declare(strict_types=1);

/**
 * Defines the Collection class for specimen collections in the Biobank module.
 *
 * This file contains the `Collection` class, which extends the `Process` class
 * and provides methods for managing collection data, including serialization
 * for storage and retrieval.
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
 * Collection class for specimen collection processes in the Biobank module.
 *
 * This class represents a specimen collection and provides methods to manage
 * and serialize collection data. It extends the `Process` class to inherit
 * common processing functionality.
 *
 * @category   Entity
 * @package    LORIS
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Collection extends Process
{
    /**
     * Persistent instance variables describing a collection.
     *
     * @var string $quantity The current quantity of specimen available.
     * @var int    $unitId   The ID of the specimen's unit of quantity.
     */
    private $quantity;
    private $unitId;

    /**
     * Sets the current quantity of specimen available.
     *
     * The associated unit can be found in the `biobank_unit` table using the
     * unit ID.
     *
     * @param string $quantity The current amount of specimen available.
     *
     * @return void
     */
    public function setQuantity(string $quantity) : void
    {
        $this->quantity = $quantity;
    }

    /**
     * Gets the current amount of specimen available.
     *
     * @return ?string The current quantity, or null if not set.
     */
    public function getQuantity() : ?string
    {
        return $this->quantity;
    }

    /**
     * Sets the ID of the specimen's unit of quantity.
     *
     * @param int $unitId The ID of the quantity's unit.
     *
     * @return void
     */
    public function setUnitId(int $unitId) : void
    {
        $this->unitId = $unitId;
    }

    /**
     * Gets the ID of the specimen's unit of quantity.
     *
     * @return ?int The unit ID, or null if not set.
     */
    public function getUnitId() : ?int
    {
        return $this->unitId;
    }

    /**
     * {@inheritDoc}
     *
     * @param array $data the data representing the collection
     *
     * @return Process $this a Collection object
     */
    public function fromArray(array $data) : Process
    {
        parent::fromArray($data);
        isset($data['quantity']) &&
            $this->setQuantity((string) $data['quantity']);
        isset($data['unitId']) &&
            $this->setUnitId((int) $data['unitId']);

        return $this;
    }

    /**
     * {@inheritDoc}
     *
     * @return array $data the data representing the collection.
     */
    public function jsonSerialize() : array
    {
        $parent = parent::jsonSerialize();
        return array_merge(
            $parent,
            [
                'quantity' => $this->quantity,
                'unitId'   => $this->unitId,
            ]
        );
    }
}

