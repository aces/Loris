<?php
/**
 * This file defines the Instance interface. (It's effectively an interface,
 * even though it's implemented as an abstract class. The toJSON is a thin
 * wrapper around toArray to avoid boilerplate. For all intents and purposes,
 * you can consider the interface to simply be the toArray method which must be
 * implemented.)
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data;

/**
 * An Instance represents a single record returned from a Provisioner.
 *
 * Resources must be serializable to JSON, but the JSON content is flexible and
 * can be of any format that makes sense to the Instance.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class Instance
{
    /**
     * ToJSON must serialize this resource instance to a string of valid JSON.
     *
     * This is provided as a convenience. toArray is the only thing that needs
     * to be implemented for this interface.
     *
     * @return string of data in JSON format.
     */
    function toJSON() : string
    {
        return json_encode($this->toArray());
    }

    /**
     * Returns a representation of this data in a PHP associative array which
     * can be serialized in JSON. The structure of the array is up to the
     * implementor of the concrete class.
     *
     * @return array
     */
    abstract function toArray() : array;
};
