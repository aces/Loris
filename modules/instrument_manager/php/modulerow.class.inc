<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * module in the acknowledgements menu table.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\instrument_manager;

/**
 * A ModuleRow represents a row in the instrument_manager menu table.
 *
 * The instrument_manager requires a specific "row" concept because
 * the \Module class does not have any concept of the Active flag
 * for the module in order to serialize it as JSON for the data
 * table.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ModuleRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new HelpRow
     *
     * @param array $row The row
     *                   returns
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
