<?php
/**
 * This file defines the Instance interface.
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
 * A DataInstance represents a single record returned from a Provisioner.
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
interface DataInstance
{
    /**
     * DataInstances must be serializable to JSON.
     *
     * ToJSON must serialize this resource instance to a string of valid JSON.
     *
     * @return string of data in JSON format.
     */
    public function toJSON() : string;
}
