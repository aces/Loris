<?php
namespace LORIS\mri_violations;

/**
 * A MRIViolation represents a row in the MRI Violations table.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class MRIViolation implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    protected $CenterID;

    /**
     * Create a new MRIViolation Instance.
     *
     * @param array $row The database values
     */
    public function __construct(array $row)
    {
        $this->DBRow = $row;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }

    /**
     * Returns the CenterID for this instance, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match against.
     *
     * @return ?\CenterID
     */
    public function getCenterID(): ?\CenterID
    {
        if ($this->DBRow['Site'] === null) {
            return null;
        }
        return \CenterID::singleton($this->DBRow['Site']);
    }

    /**
     * Returns the ProjectID for this instance, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match against.
     *
     * @return ?\ProjectID
     */
    public function getProjectID(): ?\ProjectID
    {
        if ($this->DBRow['Project'] === null) {
            return null;
        }
        return \ProjectID::singleton($this->DBRow['Project']);
    }
}
