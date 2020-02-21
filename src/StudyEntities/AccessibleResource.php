<?php declare(strict_types=1);
namespace LORIS\StudyEntities;
/**
 * The Accessible interface is used to determine whether
 * a LORIS user should be allowed access to a resource.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
interface AccessibleResource
{
    /**
     * Return true if the entity is accessible by the
     * user.
     *
     * @param \User $user The user whose access should be
     *                    validated
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool;
}
