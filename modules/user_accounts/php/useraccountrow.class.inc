<?php declare(strict_types=1);
namespace LORIS\user_accounts;

/**
 * This class implements a data Instance which represents a single
 * user account in the user_accounts menu table.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class UserAccountRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

     /**
      * Create a new ModuleRow Instance.
      *
      * @param array $row  The ModuleRow Instance
      * @param array $cids The CenterIDs
      * @param array $pids The ProjectIDs
      */
    public function __construct(array $row, array $cids, array $pids)
    {
        $this->CenterIDs  = $cids;
        $this->ProjectIDs = $pids;
        $this->DBRow      = $row;
    }

    /**
     * Returns the CenterIDs for this row.
     *
     * @return array The CenterIDs
     */
    public function getCenterIDs() : array
    {
        return $this->CenterIDs;
    }

    /**
     * Returns the ProjectID for this row.
     *
     * @return array The ProjectIds
     */
    public function getProjectIDs() : array
    {
        return $this->ProjectIDs;
    }

     /**
      * Implements \LORIS\Data\DataInstance interface for this row.
      *
      * @return string the instance data.
      */
    public function toJSON(): string
    {
        return json_encode($this->DBRow);
    }
}
