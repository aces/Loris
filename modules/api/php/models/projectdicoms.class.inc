<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Simon Pelletier <simon.pelletier@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Models;

/**
 * A ProjectDicoms contains values from a Dicom file of a project.
 *
 * @category API
 * @package  Loris
 * @author   Simon Pelletier <simon.pelletier@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectDicoms implements \LORIS\Data\DataInstance
{
    /**
     * Implements \LORIS\Data\DataInstance interface for this object.
     *
     * @return array the object data.
     */
    public function jsonSerialize() : array
    {
        $obj = get_object_vars($this);
        $obj['FileName'] = basename($obj['Archive']);
        return $obj;
    }
}
