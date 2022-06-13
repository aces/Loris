<?php declare(strict_types=1);
namespace LORIS\user_accounts;

/**
 * This class implements a data Instance which represents a single
 * user account in the user_accounts menu table.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserAccountRow implements
    \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\MultiSiteHaver
{
    protected $DBRow;
    protected $ProjectIDs;

    private array $_centerIDs;
    private array $_projectIDs;

     /**
      * Create a new ModuleRow Instance.
      *
      * @param array        $row  The ModuleRow Instance
      * @param \CenterID[]  $cids The CenterIDs
      * @param \ProjectID[] $pids The ProjectIDs
      */
    public function __construct(array $row, array $cids, array $pids)
    {
        $this->_centerIDs  = $cids;
        $this->_projectIDs = $pids;

        $this->DBRow = $row;
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
     * Returns the ProjectID for this row.
     *
     * @return \ProjectID[] The ProjectIds
     */
    public function getProjectIDs() : array
    {
        return $this->_projectIDs;
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
