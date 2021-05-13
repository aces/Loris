<?php declare(strict_types=1);

namespace LORIS\dqt\Models;
use \LORIS\lorisInstance as Loris;

/**
 * Either a FilterGroup of a FilterItem
 */
interface QueryFilters extends \JsonSerializable
{
    public function getFilteredSessions(Loris $loris, \User $user): \Traversable;
}

