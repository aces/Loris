<?php declare(strict_types=1);
namespace LORIS\roles;

/**
 * This class implements a data Instance which represents a single
 * role in the roles menu table.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RoleRow implements \LORIS\Data\DataInstance
{
    /**
     * A row.
     */
    protected $DBRow;

     /**
      * Create a new ModuleRow Instance.
      *
      * @param array $row  The ModuleRow Instance
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
