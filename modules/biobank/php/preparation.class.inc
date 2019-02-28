<?php declare(strict_types=1);
/**
 * Preparation Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Preparation Object instances.
 *
 * PHP Version 7.2
 *
 * @category Entity
 * @package  Biobank
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\biobank;

/**
 * Preparation Object Class
 * This class contains an instance of a database handling that is needed to
 * permanently store and retrieve Preparation Object instances.
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
class Preparation extends Process
{
    /**
     * Persistent Instance variables.
     *
     * These variables described a preparation instance.
     *
     * @var int $protocolId
     */
    private $protocolId;

    /**
     * Sets the ID of the specimen's protocol
     *
     * @param int $protocolId Protocol ID to be set.
     *
     * @return void
     */
    public function setProtocolId(int $protocolId) : void
    {
        $this->protocolId = $protocolId;
    }

    /**
     * Gets the ID of the specimen's protocol
     *
     * @return int
     */
    public function getProtocolId() : int
    {
        return $this->protocolId;
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
             'protocolId' => $this->protocolId,
            )
        );
    }
}

