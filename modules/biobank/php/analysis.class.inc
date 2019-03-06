<?php declare(strict_types=1);
/**
 * Specimen Analysis Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Specimen Analysis instances.
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
 * Specimen Analysis Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Specimen Analysis instances.
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

class Analysis extends Process
{
    /**
     * Persistent Instance variables.
     *
     * These variables describe an analysis instance.
     *
     * @var int $methodId
     */
    private $methodId;

    /**
     * Sets the ID of the specimen's method
     *
     * @param int $methodId Method ID to be set
     *
     * @return void
     */
    public function setMethodId(int $methodId) : void
    {
        $this->methodId = $methodId;
    }

    /**
     * Gets the ID of the specimen's method
     *
     * @return int
     */
    public function getMethodId() : int
    {
        return $this->methodId;
    }

    /**
     * Instatiates a Analysis Object using the values sent from the client-side.
     *
     * @param array $data Data to be used to instantiate the Analysis Object.
     *
     * @return Process
     */
    public function fromArray(array $data) : Process
    {
        parent::fromArray($data);
        $this->setMethodId($data['methodId']);

        return $this;
    }

    /**
     * A wrapper function for the jsonSerialize method of the Analysis Instance
     * Class. This converts this Specimen Analysis into an array
     *
     * @return array Specimen Array
     */
    public function toArray()
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
        $parent = parent::jsonSerialize();
        return array_merge(
            $parent,
            array(
             'methodId' => $this->methodId,
            )
        );
    }
}

