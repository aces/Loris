<?php declare(strict_types=1);

namespace LORIS\dqt\Factories;
use \LORIS\dqt\Models\Query;
use \LORIS\dqt\Models\QueryFields;
use \LORIS\dqt\Models\QueryFilters;
use \LORIS\dqt\Models\QueryFilter;
use \LORIS\dqt\Models\QueryFilterGroup;


abstract class QueryFactory
{
    /**
     * Handles the creation of the query fields and filter tree.
     *
     * @param array $fields  A list of fields
     * @param array $filters Either a filter or a group of filters
     *
     * @return Query
     */
    public static function create(array $fields, array $filters): Query
    {
        return new Query(
            self::_createFields($fields),
            self::_createFilters($filters)
        );
    }

    private static function _createFields(array $queryfields): QueryFields
    {
        // Maybe some logic should be bring back here instead of in QueryFields's constructor.
        return new QueryFields($queryfields);
    }

    private static function _createFilters(array $queryfilter): QueryFilters
    {
        if (empty($queryfilter)) {
            // When no filter is provided, add one that is true for all sessions.
            return new QueryFilter(
                'isNotNull',
                'demographics',
                'CandID',
                null,
                null
            );
        }

        $type = $queryfilter['type'] ?? null;
        switch ($type) {
        case 'group':
            $requiredfields = [
                'operator',
                'items'
            ];

            $diff = array_diff($requiredfields, array_keys($queryfilter));

            if (!empty($diff)) {
                throw new \LorisException(
                    'Field(s) missing: ' . implode(', ', $diff)
                );
            }

            $operator = $queryfilter['operator'];
            $items    = array_map('self::_createFilters', $queryfilter['items']);

            return new QueryFilterGroup($operator, $items);

        case 'filter':
            $requiredfields = [
                'operator',
                'category',
                'field',
                'visits'
            ];

            $diff = array_diff($requiredfields, array_keys($queryfilter));

            if (!empty($diff)) {
                throw new \LorisException(
                    'Filter missing property(ies): ' . implode(', ', $diff)
                );
            }

            // when then filter applie to all visits
            if ($queryfilter['visits'] == 'all') {
              return new QueryFilter(
                    $queryfilter['operator'],
                    $queryfilter['category'],
                    $queryfilter['field'],
                    null,
                    $queryfilter['value'] ?? null
                );
            }

print_errlog($queryfilter);
            $items = array_map(
                function (string $v) use ($queryfilter) {
                    return new QueryFilter(
                        $queryfilter['operator'],
                        $queryfilter['category'],
                        $queryfilter['field'],
                        $v,
                        $queryfilter['value'] ?? null
                    );
                },
                $queryfilter['visits']
            );

            return new QueryFilterGroup('AND', $items);

        default:
            throw new \LorisException(
                'Unknowned fitler type: ' . print_r($type, true)
            );
        }
    }
}
