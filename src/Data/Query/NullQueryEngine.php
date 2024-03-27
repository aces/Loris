<?php declare(strict_types=1);
namespace LORIS\Data\Query;

use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\DataInstance;

/**
 * A NullQueryEngine implements the LORIS QueryEngine interface
 * in a way that doesn't do anything. It has no dictionary, matches
 * no candidates, and returns no data.
 *
 * This is a default QueryEngine for modules that have not otherwise
 * configured their own QueryEngine to query their data.
 */
class NullQueryEngine implements QueryEngine
{
    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary() : iterable
    {
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function getCandidateMatches(QueryTerm $criteria, ?array $visitlist = null) : iterable
    {
        return [];
    }

    /**
     * {@inheritDoc}
     *
     * @param DictionaryItem[] $items Data points to retrieve
     * @param iterable $candidates    Candidates to retrieve data for
     * @param ?string[] $visits       Visit labels to restrict data to
     *
     * @return iterable<string, DataInstance>
     */
    public function getCandidateData(array $items, iterable $candidates, ?array $visitlist) : iterable
    {
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function getVisitList(
        \LORIS\Data\Dictionary\Category $inst,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : iterable {
        return [];
    }
}
