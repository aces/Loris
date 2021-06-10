<?php
namespace LORIS\mri_violations;

/**
 * A ResolvedViolation represents a row in the resolved violations
 * tab.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ResolvedViolation implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    protected $DBRow;
    protected $CenterID;

    /**
     * Create a new ResolvedViolation
     *
     * @param array $row The data from the database.
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
     * Returns the CenterID for this instance, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match against.
     *
     * @return \CenterID
     */
    public function getCenterID(): \CenterID
    {
        return new \CenterID($this->DBRow['CenterId']);
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
        return new \ProjectID($this->DBRow['Project']);
    }
}
