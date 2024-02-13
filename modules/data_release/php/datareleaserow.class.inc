<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * entry in the data_release menu table.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Rolando Acosta <rolando.acosta@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\data_release;

/**
 * A DataReleaseRow represents a row in the data_release menu table.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Rolando Acosta <rolando.acosta@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class DataReleaseRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new DataReleaseRow
     *
     * @param array $row The row
     */
    public function __construct(array $row)
    {
        $this->DBRow = $row;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }
}
