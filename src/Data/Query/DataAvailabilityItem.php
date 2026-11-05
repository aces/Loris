<?php declare(strict_types=1);

namespace LORIS\Data\Query;

use LORIS\Data\Dictionary\Category;
use LORIS\Data\Dictionary\DictionaryItem;
use LORIS\Data\Scope;
use LORIS\Data\Cardinality;
use LORIS\Data\Types\Enumeration;
use LORIS\Data\Query\Criteria\NotNull;
use LORIS\Data\Query\Criteria\IsNull;

/**
 * A DataAvailabilityItem lists the items that a query engine holds in one
 * state for a session or a candidate, such as the scan types that passed
 * QC or the instruments whose data entry is complete. Its values come from
 * one or more DataAvailabilitySources.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataAvailabilityItem extends DictionaryItem
{
    /**
     * The name of the category holding an engine's data availability items
     */
    const CATEGORY = "DataAvailability";

    /**
     * Construct a DataAvailabilityItem
     *
     * @param string                   $name    The field name
     * @param string                   $desc    The field description
     * @param Scope                    $scope   Whether the items are held per
     *                                          session or per candidate
     * @param Enumeration              $items   The items that can be listed
     * @param DataAvailabilitySource[] $sources The SQL sources of the items
     */
    public function __construct(
        string $name,
        string $desc,
        Scope $scope,
        Enumeration $items,
        protected array $sources,
    ) {
        if ($scope->__toString() !== 'session') {
            throw new \DomainException(
                "Data availability items must be session scoped"
            );
        }
        parent::__construct(
            $name,
            $desc,
            $scope,
            $items,
            new Cardinality(Cardinality::MANY),
        );
    }

    /**
     * Return the category holding the data availability items of an engine
     *
     * @param DataAvailabilityItem[] $items The engine's items
     *
     * @return Category
     */
    public static function category(iterable $items) : Category
    {
        $category = new Category(self::CATEGORY, "Data availability");
        return $category->withItems($items);
    }

    /**
     * Return the column the sources are matched against, the session for
     * a session scoped item and the candidate otherwise.
     *
     * @return string
     */
    public function getOuterID() : string
    {
        return $this->getScope() == 'session' ? 's.ID' : 'c.ID';
    }

    /**
     * Return an SQL condition on the session s or the candidate c that
     * holds when the criteria matches one of the listed items.
     *
     * @param Criteria $criteria     The criteria to match
     * @param array    $prepbindings The prepared statement bindings, to
     *                               which the criteria's values are added
     *
     * @return string
     */
    public function getCondition(Criteria $criteria, array &$prepbindings) : string
    {
        $found = [];
        foreach ($this->sources as $source) {
            $where = [$source->id . '=' . $this->getOuterID()];
            if ($source->where !== null) {
                $where[] = $source->where;
            }
            if (!($criteria instanceof NotNull) && !($criteria instanceof IsNull)) {
                $where[] = $source->item . ' '
                    . SQLQueryEngine::sqlOperator($criteria) . ' '
                    . SQLQueryEngine::sqlValue($this, $criteria, $prepbindings);
            }
            // Not EXISTS, which the database can turn into a join over every
            // candidate
            $found[] = '(SELECT 1 FROM ' . $source->from
                . ' WHERE ' . join(' AND ', $where) . ' LIMIT 1) IS NOT NULL';
        }
        $condition = '(' . join(' OR ', $found) . ')';
        if ($criteria instanceof IsNull) {
            return "NOT $condition";
        }
        return $condition;
    }

    /**
     * Return the expression for one item listed by this field, from a
     * table filled by getInserts.
     *
     * @param string $alias The alias of the table
     *
     * @return string
     */
    public function getValue(string $alias) : string
    {
        return "CASE WHEN $alias.State='" . $this->getName()
            . "' THEN $alias.Item END";
    }

    /**
     * Return the statements inserting the items listed by this field for the
     * candidates in the $candidates table into $table, which has the columns
     * State, ID and Item.
     *
     * @param string $table      The table to insert into
     * @param string $candidates The table of candidates to insert items for
     *
     * @return string[]
     */
    public function getInserts(string $table, string $candidates) : array
    {
        $inserts = [];
        foreach ($this->sources as $source) {
            $insert = "INSERT INTO $table (State, ID, Item)"
                . " SELECT DISTINCT '" . $this->getName() . "', "
                . $source->id . ', ' . $source->item
                . ' FROM ' . $this->getSessionRows($source)
                . " JOIN $candidates availability_candidates"
                . " ON (availability_candidates.CandID=availability_c.CandID)";
            if ($source->where !== null) {
                $insert .= ' WHERE ' . $source->where;
            }
            $inserts[] = $insert;
        }
        return $inserts;
    }

    /**
     * Return an SQL select of the visit labels of the active sessions at which
     * this field lists something, in a Visit_label column.
     *
     * @return string
     */
    public function getVisitSelect() : string
    {
        $selects = [];
        foreach ($this->sources as $source) {
            $select = 'SELECT availability_s.Visit_label AS Visit_label FROM '
                . $this->getSessionRows($source)
                . " WHERE availability_s.Active='Y'"
                . " AND availability_c.Active='Y'";
            if ($source->where !== null) {
                $select .= ' AND ' . $source->where;
            }
            $selects[] = $select;
        }
        return join(' UNION ', $selects);
    }

    /**
     * Return the rows of a source joined to their session, aliased
     * availability_s, and its candidate, aliased availability_c.
     *
     * @param DataAvailabilitySource $source The source
     *
     * @return string
     */
    protected function getSessionRows(DataAvailabilitySource $source) : string
    {
        return $source->from
            . " JOIN session availability_s ON (availability_s.ID=" . $source->id . ")"
            . " JOIN candidate availability_c"
            . " ON (availability_c.ID=availability_s.CandidateID)";
    }
}
