<?php declare(strict_types=1);

namespace LORIS\mri_violations;

/**
 * A ProtocolViolation represents a violation of the mri_protocol
 * table for the ProtocolViolationProvisioner.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ProtocolViolation implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new ProtocolViolation instance.
     *
     * @param array $row The Media File Instance
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
     * Check whether a user can access this data instance.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        return $user->hasAnyPermission(
            [
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite',
            ]
        );
    }
}
