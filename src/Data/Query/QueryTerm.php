<?php
namespace LORIS\Data\Query;

use LORIS\Data\Dictionary\DictionaryItem;

/**
 * A QueryTerm represents a single criteria used as part of a query
 * For instance "age < 5"
 */
class QueryTerm
{
    /**
     * Construct a query term.
     *
     * @param DictionaryItem $dictionary The term being compared.
     * @param Criteria       $criteria   The criteria to compare the
     *                                   term against.
     */
    public function __construct(
        public \LORIS\Data\Dictionary\DictionaryItem $dictionary,
        public Criteria $criteria
    ) {
    }
}
