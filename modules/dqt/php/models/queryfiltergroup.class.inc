<?php declare(strict_types=1);

namespace LORIS\dqt\Models;
use \LORIS\LorisInstance as Loris;

/**
 * A FilterGroup contains Queryfilters (either QueryFilter or QueryGroup).
 * They are in charge of finding the intersection or union between their items
 * sessions.
 */
class QueryFilterGroup implements QueryFilters
{
    public function __construct(string $operator, array $items)
    {
        $this->_operator = $operator;
        $this->_items    = $items;
    }

    public function getFilteredSessions(Loris $loris, \User $user): \Traversable
    {
        return array_reduce(
            $this->_items,
            function ($carry, $item) use ($loris, $user) {
                if ($carry === null) {
                    return $item->getFilteredSessions($loris, $user);
                }

                switch ($this->_operator) {
                case 'AND':
                    return self::_intersect($carry, $item->getFilteredSessions($loris, $user));

                case 'OR':
                    return self::_union($carry, $item->getFilteredSessions($loris, $user));

                default:
                    throw new \LorisException(
                        'Invalid operator in QueryGroup::getFilteredSessions'
                    );
                }
            },
            null
        );
    }

    /**
     * Produce a single ordered Traversable which values are the ones the were present in both
     * provided Traversables.
     *
     * Both parameters MUST be pre ordered.
     *
     * @param \Traversable $iter1
     * @param \Traversable $iter2
     *
     * @return \Traversable
     */
    private static function _intersect(\Traversable $iter1, \Traversable $iter2): \Traversable
    {
        foreach($iter1 as $value1) {
            if (!$iter2->valid()) {
                return;
            }
            switch($value1 <=> $iter2->current()) {
            case -1:
                // iter1 is smaller than iter2.
                // Move to next foreach.
                break;
            case 0:
                // Both iter1 and iter2 are equal.
                // Move iter2 and yield $value before moving to next foreach.
                $iter2->next();
                yield $value1;
                break;
            case 1:
                // iter1 is greater than iter2.
                // Advance iter2 until it is greater or equal to iter1.
                while ($iter2->current() < $value1) {
                    $iter2->next();
                    if (!$iter2->valid()) {
                        return;
                    }
                }
                if ($value1 == $iter2->current()) {
                    // Both iter1 and iter2 are equal.
                    // Yield $value before moving to next foreach.
                    yield $value1;
                }
                break;
            }
        }
    }

    /**
     * Produce a single ordered Traversable which every elements of the provided
     * Traversables without duplicates.
     *
     * Both parameters MUST be pre ordered.
     *
     * @param \Traversable $iter1
     * @param \Traversable $iter2
     *
     * @return \Traversable
     */
    private static function _union(\Traversable $iter1, \Traversable $iter2): \Traversable
    {
        while($iter1->valid()) {
            $value1 = $iter1->current();

            if (!$iter2->valid()) {
                $iter1->next();
                yield $value1;
                continue;
            }

            $value2 = $iter2->current();

            switch($value1 <=> $value2) {
            case -1:
                // iter1 is smaller than iter2.
                $iter1->next();
                yield $value1;
                break;
            case 0:
                // Both iter1 and iter2 are equal.
                $iter1->next();
                $iter2->next();
                yield $value1;
                break;
            case 1:
                // iter1 is greater than iter2.
                $iter2->next();
                yield $value2;
                break;
            }
        }

        while ($iter2->valid()) {
            yield $iter2->current();
            $iter2->next();
        }
    }

    public function jsonSerialize()
    {
        return [
            'type'     => 'group',
            'operator' => $this->_operator,
            'items'    => $this->_items,
        ];
    }
}

