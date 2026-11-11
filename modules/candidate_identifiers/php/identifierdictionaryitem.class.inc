<?php declare(strict_types=1);

/**
 * Dictionary item for configurable candidate identifiers.
 *
 * PHP Version 8
 *
 * @category LORIS
 * @package  LORIS
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\candidate_identifiers;

use LORIS\Data\Scope;
use LORIS\Data\Type;
use LORIS\Data\Cardinality;
use LORIS\Data\Dictionary\DictionaryItem;

/**
 * Describes a dictionary item for a configurable candidate identifier.
 *
 * Extends DictionaryItem to enforce identifier-specific permissions.
 *
 * @category LORIS
 * @package  LORIS
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class IdentifierDictionaryItem extends DictionaryItem
{
    /**
     * Construct an IdentifierDictionaryItem.
     *
     * @param string      $name           The field name
     * @param string      $desc           The field description
     * @param Scope       $scope          The data scope
     * @param Type        $type           The data type
     * @param Cardinality $cardinality    The data cardinality
     * @param string|null $permissionCode Required permission code
     */
    public function __construct(
        string $name,
        string $desc,
        Scope $scope,
        Type $type,
        Cardinality $cardinality,
        protected ?string $permissionCode
    ) {
        parent::__construct($name, $desc, $scope, $type, $cardinality);
    }

    /**
     * Check whether the user can access this identifier type.
     *
     * @param \User $user The user requesting access
     *
     * @return bool Whether the user has access
     */
    public function isAccessibleBy(\User $user): bool
    {
        return $this->permissionCode === null
            || $user->hasPermission($this->permissionCode);
    }
}
