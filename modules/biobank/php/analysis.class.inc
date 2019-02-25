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
     * These variables are directly mapped to the fields of the database schema
     * that describe a specimen entity.
     *
     * @access private
     */
    private $methodId; //int

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

