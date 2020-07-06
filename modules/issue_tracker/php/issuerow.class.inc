<?php
namespace LORIS\issue_tracker;

/**
 * An IssueRow represents a row in the Issue Tracker menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class IssueRow implements \JsonSerializable
{
    protected $DBRow;
    protected $CenterIDs;
    protected $Module;

    /**
     * Create a new IssueRow
     *
     * @param array   $row    The row (in the same format as \Database::pselectRow
     *                        returns.
     * @param array   $cids   The centerIDs affiliated with this row.
     * @param \Module $module The module that this issue is for.
     */
    public function __construct(array $row, array $cids, \Module $module)
    {
        $this->DBRow     = $row;
        $this->CenterIDs = $cids;
        $this->Module    = $module;

        $this->DBRow['module'] = $module->getLongName();
    }

    /**
     * Implements \JsonSerializable interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return array The CenterIDs
     */
    public function getCenterIDs()
    {
        return $this->CenterIDs;
    }

    /**
     * Return the module that this issue is an issue for.
     *
     * @return \Module the module descriptor
     */
    public function getModule() : \Module
    {
        return $this->Module;
    }
}
