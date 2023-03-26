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

namespace LORIS\examiner;

/**
 * A ModuleRow represents a row in the acknowledgements menu table.
 *
 * The acknowledgements requires a specific "row" concept because
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
class ExaminerRow implements
    \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\MultiSiteHaver
{
    protected $DBRow;

    private array $_centerIDs;
    /**
     * Create a new HelpRow
     *
     * @param array        $row  The row
     * @param \CenterID[]  $cids The CenterIDs
     * @param \ProjectID[] $pids The ProjectIDs
     *                           returns
     */
    public function __construct(array $row,array $cids, array $pids)
    {
        $this->_centerIDs = $cids;
        $this->DBRow      = $row;
    }
    /**
     * Returns the CenterIDs for this row.
     *
     * @return \CenterID[] The CenterIDs
     */
    public function getCenterIDs() : array
    {
        return $this->_centerIDs;
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
