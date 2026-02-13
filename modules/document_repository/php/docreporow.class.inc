<?php declare(strict_types=1);

/**
 * This class implements a data Instance which represents a single
 * module in the acknowledgements menu table.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\document_repository;

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
class DocRepoRow implements
    \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    protected $DBRow;

    private \CenterID $CenterID;

    /**
     * Create a new HelpRow
     *
     * @param array     $row The row
     * @param \CenterID $cid The CenterID
     */
    public function __construct(array $row, \CenterID $cid)
    {
        $this->DBRow    = $row;
        $this->CenterID = $cid;
    }

    /**
     * Returns the CenterID for this row
     *
     * @return \CenterID
     */
    public function getCenterID(): \CenterID
    {
        return $this->CenterID;
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

    public function isAccessibleBy(\User $user): bool
    {
        return \LORIS\StudyEntities\DataInstanceAccess::centerMatch(
            $user,
            $this
        );
    }
}
