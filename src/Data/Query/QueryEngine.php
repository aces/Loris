<?php declare(strict_types=1);
namespace LORIS\Data\Query;

use \LORIS\StudyEntities\Candidate\CandID;
use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\DataInstance;

/**
 * A QueryEngine is an entity which represents a set of data and
 * the ability to query against them.
 *
 * Queries are divided into 2 phases, filtering the data down to
 * a set of CandIDs, and retrieving the data for a known set of
 * CandID/SessionIDs.
 *
 * There is usually one query engine per module that deals with
 * candidate data.
 */
interface QueryEngine
{
    /**
     * Return a data dictionary of data types managed by this QueryEngine.
     * DictionaryItems are grouped into categories and an engine may know
     * about 0 or more categories of DictionaryItems.
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary() : iterable;

    /**
     * Return an iterable of CandIDs matching the given criteria.
     *
     * If visitlist is provided, session scoped variables will match
     * if the criteria is met for at least one of those visit labels.
     */
    public function getCandidateMatches(
        QueryTerm $criteria,
        ?array $visitlist = null
    ) : iterable;

    /**
     * Retrieve the data for a given list of DictionaryItems from this
     * engine's data dictionary and a given list of CandIDs.
     *
     * The returned value is a type where the key is the CandID (as
     * a string) and the value is a DataInstance.
     *
     * If visits is declared, only include data for those visits labels.
     *
     * @param DictionaryItem[] $items Data points to retrieve
     * @param CandID[] $candidates    Candidates to retrieve data for
     * @param ?string[] $visits       Visit labels to restrict data to
     *
     * @return iterable<string, DataInstance>
     */
    public function getCandidateData(array $items, iterable $candidates, ?array $visitlist) : iterable;

    /**
     * Get the list of visits at which a DictionaryItem is valid
     *
     * @return string[]
     */
    public function getVisitList(
        \LORIS\Data\Dictionary\Category $inst,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : iterable;
}
