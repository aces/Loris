<?php
namespace LORIS\mri_violations;

/**
 * A class which represents a single instance of a ProtocolCheck
 * violation.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ProtocolCheckViolation implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new ProtocolCheckViolation instance
     *
     * @param array $row The data from the database
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

    /**
     * Return the CenterID for this violation if known.
     *
     * @return ?\CenterID
     */
    public function getCenterID() : ?\CenterID
    {
        if (($this->DBRow['CenterID'] ?? null) == null) {
            return null;
        }
        return \CenterID::singleton($this->DBRow['CenterID']);
    }
}
