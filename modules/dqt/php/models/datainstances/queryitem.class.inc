<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category DQT
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\dqt\Models\DataInstances;

use \LORIS\Data\DataInstance;

class QueryItem implements DataInstance
{
    private $_id;
    private $_creator_username;
    private $_creation_timestamp;
    private $_content;
    private $_name;
    private $_shared_id;

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return [
            'id'                => $this->_id,
            'creatorUsername'   => $this->_creator_username,
            'creationTimestamp' => $this->_creation_timestamp,
            'link'              => '/dqt/queries/' . $this->_id,
            'name'              => $this->_name ?? null,
            'shared'            => !is_null($this->_shared_id),
        ];
    }
}
