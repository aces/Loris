<?php declare(strict_types=1);

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
        return \CenterID::singleton(intval($this->DBRow['Site']));
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
        return \ProjectID::singleton(intval($this->DBRow['Project']));
    }

    /**
     * Check whether a user can access this data instance.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        if ($user->hasPermission('violated_scans_view_allsites')) {
            return true;
        }

        $center = $this->getCenterID();
        if ($center !== null && !$user->hasCenter($center)) {
            return false;
        }

        $project = $this->getProjectID();
        if ($project !== null && !$user->hasProject($project)) {
            return false;
        }

        return true;
    }
}
