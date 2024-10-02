<?php declare(strict_types=1);
namespace LORIS\Data\Query;

use LORIS\StudyEntities\Candidate\CandID;

use LORIS\Data\DataInstance;
use LORIS\Data\Dictionary\DictionaryItem;

use LORIS\Data\Query\Criteria;

use LORIS\Data\Query\Criteria\Equal;
use LORIS\Data\Query\Criteria\NotEqual;
use LORIS\Data\Query\Criteria\LessThan;
use LORIS\Data\Query\Criteria\LessThanOrEqual;
use LORIS\Data\Query\Criteria\GreaterThanOrEqual;
use LORIS\Data\Query\Criteria\GreaterThan;
use LORIS\Data\Query\Criteria\In;

use LORIS\Data\Query\Criteria\NotNull;
use LORIS\Data\Query\Criteria\IsNull;

use LORIS\Data\Query\Criteria\StartsWith;
use LORIS\Data\Query\Criteria\Substring;
use LORIS\Data\Query\Criteria\EndsWith;

/**
 * An SQLQueryEngine is a type of QueryEngine which queries
 * against the LORIS SQL database. It implements most of the
 * functionality of the QueryEngine interface, while leaving
 * a few necessary methods abstract for the concretized QueryEngine
 * to fill in the necessary details.
 *
 * The concrete implementation must provide the getDataDictionary
 * and getVisitList functions from the QueryEngine interface, but
 * default getCandidateMatches and getCandidateData implementations
 * are provided by the SQLQueryEngine.
 *
 * The implementation must provide getFieldNameFromDict,
 * which returns a string of the database fieldname (and calls
 * $this->addTable as many times as it needs for the joins) and
 * getCorrespondingKeyField to get the primary key for any Cardinality::MANY
 * fields.
 */
abstract class SQLQueryEngine implements QueryEngine
{
    /**
     * Construct an SQLQueryEngine
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance being queried
     */
    public function __construct(protected \LORIS\LorisInstance $loris)
    {
    }

    /**
     * {@inheritDoc}
    *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    abstract public function getDataDictionary() : iterable;

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\Category $inst       The item category
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The item itself
     *
     * @return string[]
     */
    abstract public function getVisitList(
        \LORIS\Data\Dictionary\Category $inst,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : iterable;

    /**
     * Return the field name that can be used to get the value for
     * this field.
     *
     * The implementation should call $this->addTable() to add any
     * tables necessary for the field name to be valid.
     *
     * @return string
     */
    abstract protected function getFieldNameFromDict(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : string;

    /**
     * Return the field name that can be used to get the value for
     * the primary key of any Cardinality::MANY fields.
     *
     * The implementation should call $this->addTable() to add any
     * tables necessary for the field name to be valid.
     *
     * @return string
     */
    abstract protected function getCorrespondingKeyField(\LORIS\Data\Dictionary\DictionaryItem $field);
    abstract public function getCorrespondingKeyFieldType(\LORIS\Data\Dictionary\DictionaryItem $item) : string;

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Query\QueryTerm $term      The criteria term.
     * @param ?string[]                   $visitlist The optional list of visits
     *                                               to match at.
     *
     * @return \Generator<CandID>
     */
    public function getCandidateMatches(
        \LORIS\Data\Query\QueryTerm $term,
        ?array $visitlist = null
    ) : iterable {
        $this->resetEngineState();
        $this->addTable('candidate c');
        $this->addWhereClause("c.Active='Y'");
        $prepbindings = [];

        $this->buildQueryFromCriteria($term, $prepbindings);

        $query = 'SELECT DISTINCT c.CandID FROM';

        $query .= ' ' . $this->getTableJoins();

        $query .= ' WHERE ';
        $query .= $this->getWhereConditions();
        $query .= ' ORDER BY c.CandID';

        $DB   = $this->loris->getDatabaseConnection();
        $rows = $DB->pselectCol($query, $prepbindings);
        foreach ($rows as $candID) {
            yield new CandID(strval($candID));
        }
    }

    /**
     * {@inheritDoc}
     *
     * @param DictionaryItem[] $items      Items to get data for
     * @param iterable         $candidates CandIDs to get data for
     * @param ?string[]        $visitlist  Possible list of visits
     *
     * @return iterable<string, DataInstance>
     */
    public function getCandidateData(
        array $items,
        iterable $candidates,
        ?array $visitlist
    ) : iterable {
        if (count($candidates) == 0) {
            return [];
        }
        $this->resetEngineState();

        $this->addTable('candidate c');

        // Always required for candidateCombine
        $fields = ['c.CandID'];

        $DB = $this->loris->getDatabaseConnection();

        $this->createTemporaryCandIDTable($DB, "searchcandidates", $candidates);

        $DB->setBuffering($this->useBufferedQuery);


        $sessionVariables = false;
        $keyFields        = [];
        foreach ($items as $dict) {
            $fields[] = $this->getFieldNameFromDict($dict)
                . ' as '
                . "`{$dict->getName()}`";
            if ($dict->getScope() == 'session') {
                $sessionVariables = true;
            }
            if ($dict->getCardinality()->__toString() === "many") {
                $keyFields[] = $this->getCorrespondingKeyField($dict) . " as `{$dict->getName()}:key`";
            }
        }

        if ($sessionVariables) {
            if (!in_array('s.Visit_label as VisitLabel', $fields)) {
                $fields[] = 's.Visit_label as VisitLabel';
            }
            if (!in_array('s.SessionID', $fields)) {
                $fields[] = 's.ID as SessionID';
            }
        }
        if (!empty($keyFields)) {
            $fields = array_merge($fields, $keyFields);
        }

        $query  = 'SELECT ' . join(', ', $fields) . ' FROM';
        $query .= ' ' . $this->getTableJoins();

        $prepbindings = [];
        $query       .= ' WHERE c.CandID IN (SELECT CandID from searchcandidates)';

        if ($visitlist != null) {
            $inset = [];
            $i     = count($prepbindings);
            foreach ($visitlist as $vl) {
                $prepname = ':val' . $i++;
                $inset[]  = $prepname;
                $prepbindings[$prepname] = $vl;
            }
            $query .= 'AND s.Visit_label IN (' . join(",", $inset) . ')';
        }
        $whereCond = $this->getWhereConditions();
        if (!empty($whereCond)) {
            $query .= ' AND ' . $this->getWhereConditions();
        }
        $query .= ' ORDER BY c.CandID';
        $rows   = $DB->prepare($query);

        $result = $rows->execute($prepbindings);

        if ($result === false) {
            throw new \Exception("Invalid query $query");
        }

        // Yield the generator ourself, so that when it's done we can restore the
        // buffered query attribute
        foreach ($this->candidateCombine($items, $rows) as $candid => $val) {
            yield $candid => $val;
        };

        // Restore the default now that the generator has finished yielding.
        $DB->setBuffering($this->useBufferedQuery, true);
    }

    /**
     * Converts a Criteria object to the equivalent SQL operator.
     *
     * @return string
     */
    public static function sqlOperator(Criteria $criteria) : string
    {
        if ($criteria instanceof LessThan) {
            return '<';
        }
        if ($criteria instanceof LessThanOrEqual) {
            return '<=';
        }
        if ($criteria instanceof Equal) {
            return '=';
        }
        if ($criteria instanceof NotEqual) {
            return '<>';
        }
        if ($criteria instanceof GreaterThanOrEqual) {
            return '>=';
        }
        if ($criteria instanceof GreaterThan) {
            return '>';
        }
        if ($criteria instanceof In) {
            return 'IN';
        }
        if ($criteria instanceof IsNull) {
            return "IS NULL";
        }
        if ($criteria instanceof NotNull) {
            return "IS NOT NULL";
        }

        if ($criteria instanceof StartsWith) {
            return "LIKE";
        }
        if ($criteria instanceof EndsWith) {
            return "LIKE";
        }
        if ($criteria instanceof Substring) {
            return "LIKE";
        }
        throw new \Exception("Unhandled operator: " . get_class($criteria));
    }

    /**
     * Converts a Criteria object to the equivalent SQL value, putting
     * any bindings required into $prepbindings
     *
     * @return string
     */
    public static function sqlValue(DictionaryItem $dict, Criteria $criteria, array &$prepbindings) : string
    {
        static $i = 1;

        if ($criteria instanceof In) {
            $val        = '(';
            $critvalues = $criteria->getValue();
            foreach ($critvalues as $critnum => $critval) {
                $prepname = ':val' . $i++;
                $prepbindings[$prepname] = $critval;
                $val .= $prepname;
                if ($critnum != count($critvalues)-1) {
                    $val .= ', ';
                }
            }
            $val .= ')';
            return $val;
        }

        if ($criteria instanceof IsNull) {
            return "";
        }
        if ($criteria instanceof NotNull) {
            return "";
        }

        $prepname = ':val' . $i++;
        if ($dict->getDataType() instanceof \LORIS\Data\Types\BooleanType) {
            $val = $criteria->getValue();
            $prepbindings[$prepname] = !empty($val) && $val !== "false";
        } else {
            $prepbindings[$prepname] = $criteria->getValue();
        }

        if ($criteria instanceof StartsWith) {
            return "CONCAT($prepname, '%')";
        }
        if ($criteria instanceof EndsWith) {
            return "CONCAT('%', $prepname)";
        }
        if ($criteria instanceof Substring) {
            return "CONCAT('%', $prepname, '%')";
        }
        return $prepname;
    }

    private $tables;

    /**
     * Adds a to be joined to the internal state of this QueryEngine
     * $tablename should be the full "LEFT JOIN tablename x" string
     * required to be added to the query. If an identical join is
     * already present, it will not be duplicated.
     *
     * @param string $tablename The join string
     *
     * @return void
     */
    protected function addTable(string $tablename)
    {
        if (isset($this->tables[$tablename])) {
            // Already added
            return;
        }
        $this->tables[$tablename] = $tablename;
    }

    /**
     * Get the full SQL join statement for this query.
     */
    protected function getTableJoins() : string
    {
        return join(' ', $this->tables);
    }

    private $where;

    /**
     * Adds a where clause to the query based on converting Criteria
     * to SQL.
     */
    protected function addWhereCriteria(DictionaryItem $dict, Criteria $criteria, array &$prepbindings)
    {

        $fieldname     = $this->getFieldNameFromDict($dict);
        $this->where[] = $fieldname . ' '
            . $this->sqlOperator($criteria) . ' '
            . $this->sqlValue($dict, $criteria, $prepbindings);
    }

    /**
     * Add a static where clause directly to the query.
     */
    protected function addWhereClause(string $s)
    {
        $this->where[] = $s;
    }

    /**
     * Get a list of WHERE conditions.
     */
    protected function getWhereConditions() : string
    {
        return join(' AND ', $this->where);
    }

    /**
     * Reset the internal engine state (tables and where clause)
     */
    protected function resetEngineState()
    {
        $this->where  = [];
        $this->tables = [];
    }

    /**
     * Combines the rows from $rows into a CandID =>DataInstance for
     * getCandidateData.
     *
     * The DataInstance returned is an array where the i'th index is
     * the Candidate's value of item i from $items.
     *
     * @param DictionaryItem[] $items      Items to get data for
     * @param iterable         $candidates CandIDs to get data for
     *
     * @return <string,DataInstance>
     */
    protected function candidateCombine(iterable $dict, iterable &$rows)
    {
        $lastcandid = null;
        $candval    = [];

        foreach ($rows as $row) {
            if ($lastcandid !== null && $row['CandID'] !== $lastcandid) {
                yield $lastcandid => $candval;
                $candval = [];
            }
            $lastcandid = $row['CandID'];
            foreach ($dict as $field) {
                $fname = $field->getName();
                if ($field->getScope() == 'session') {
                    // Session variables exist many times per CandID, so put
                    // the values in an array.
                    if (!isset($candval[$fname])) {
                        $candval[$fname] = [];
                    }
                    // Each session must have a VisitLabel and SessionID key.
                    if ($row['VisitLabel'] === null || $row['SessionID'] === null) {
                        // If they don't exist and there's a value, there was a bug
                        // somewhere. If they don't exist and the value is also null,
                        // the query might have just done a LEFT JOIN on session.
                        assert($row[$fname] === null);
                    } else {
                        $SID = $row['SessionID'];
                        if (isset($candval[$fname][$SID])) {
                            // There is already a value stored for this session ID.

                            // Assert that the VisitLabel and SessionID are the same.
                            assert($candval[$fname][$SID]['VisitLabel'] == $row['VisitLabel']);
                            assert($candval[$fname][$SID]['SessionID'] == $row['SessionID']);
                            if ($field->getCardinality()->__toString() !== "many") {
                                // It's not cardinality many, so ensure it's the same value. The
                                // Query may have returned multiple rows with the same value as
                                // the result of a JOIN, so it's not a problem to see it many
                                // times.
                                assert($candval[$fname][$SID]['value'] == $row[$fname]);
                            } else {
                                // It is cardinality many, so append the value.
                                // A null val in a cardinality many column means the row came from a left join
                                // and shouldn't be included (as opposed to a cardinality:optional where it
                                // means that the value was the value null)
                                $key = $row[$field->getName() . ':key'];
                                $val = $this->displayValue($field, $row[$fname]);
                                if ($key !== null && $val !== null) {
                                    if (isset($candval[$fname][$SID]['values']['key'])) {
                                        assert($candval[$fname][$SID]['values']['key'] == $val);
                                    } else {
                                        $candval[$fname][$SID]['values'][$key] = $val;
                                    }
                                }
                            }
                        } else {
                            // This is the first time we've session this sessionID
                            if ($field->getCardinality()->__toString() !== "many") {
                                // It's not many, so just store the value directly.
                                $candval[$fname][$SID] = [
                                                          'VisitLabel' => $row['VisitLabel'],
                                                          'SessionID'  => $row['SessionID'],
                                                          'value'      => $this->displayValue($field, $row[$fname]),
                                                         ];
                            } else {
                                // It is many, so use an array
                                $key = $row[$field->getName() . ':key'];
                                $val = $this->displayValue($field, $row[$fname]);
                                // A null val in a cardinality many column means the row came from a left join
                                // and shouldn't be included (as opposed to a cardinality:optional where it
                                // means that the value was the value null)
                                if ($key !== null && $val !== null) {
                                    $candval[$fname]['keytype'] = $this->getCorrespondingKeyFieldtype($field);

                                    // This is just to get around PHPCS complaining about line
                                    // length.
                                    $sarray = [
                                               'VisitLabel' => $row['VisitLabel'],
                                               'SessionID'  => $row['SessionID'],
                                               'values'     => [$key => $val],
                                              ];
                                    $candval[$fname][$SID] = $sarray;
                                }
                            }
                        }
                    }
                } elseif ($field->getCardinality()->__toString() === 'many') {
                    // FIXME: Implement this.
                    throw new \Exception("Cardinality many for candidate variables not handled");
                } else {
                    // It was a candidate variable that isn't cardinality::many.
                    // Just store the value directly.
                    $candval[$fname] = $row[$fname];
                }
            }
        }
        if (!empty($candval)) {
            yield $lastcandid => $candval;
        }
    }

    private function displayValue(DictionaryItem $field, mixed $value) : mixed
    {
        // MySQL queries turn boolean columns into 0/1, so if it's a boolean dictionary
        // item we need to convert it back to true/false
        if ($field->getDataType() instanceof \LORIS\Data\Types\BooleanType) {
            return !empty($value);
        }
        return $value;
    }

    /**
     * Create a temporary table containing the candIDs from $candidates using the
     * LORIS database connection $DB.
     */
    protected function createTemporaryCandIDTable(\Database $DB, string $tablename, array &$candidates)
    {
        // Put candidates into a temporary table so that it can be used in a join
        // clause. Directly using "c.CandID IN (candid1, candid2, candid3, etc)" is
        // too slow.
        $DB->run("DROP TEMPORARY TABLE IF EXISTS $tablename");
        $DB->run(
            "CREATE TEMPORARY TABLE $tablename (
            CandID int(6)
        );"
        );


        $insertstmt = "INSERT INTO $tablename VALUES"
                . " (" . join('),(', $candidates) . ')';
        $q          = $DB->prepare($insertstmt);
        $q->execute([]);
    }

    protected $useBufferedQuery = true;

    /**
     * Enable or disable MySQL query buffering by PHP. Disabling query
     * buffering is more memory efficient, but bypasses LORIS and does
     * not share the internal state of the LORIS database such as temporary tables.
     */
    public function useQueryBuffering(bool $buffered)
    {
        $this->useBufferedQuery = $buffered;
    }


    /**
     * Adds the necessary fields and tables to run the query $term
     *
     * @param \LORIS\Data\Query\QueryTerm $term         The term being added to the
     *                                                  query.
     * @param array                       $prepbindings Any prepared statement
     *                                                  bindings required.
     * @param ?array                      $visitlist    The list of visits.
     *
     * @return void
     */
    protected function buildQueryFromCriteria(
        \LORIS\Data\Query\QueryTerm $term,
        array &$prepbindings,
        ?array $visitlist = null
    ) {
        $dict = $term->dictionary;
        $this->addWhereCriteria(
            $dict,
            $term->criteria,
            $prepbindings
        );

        if ($visitlist != null) {
            $this->addTable("LEFT JOIN session s ON (s.CandID=c.CandID AND s.Active='Y')");
            $inset = [];
            $i     = count($prepbindings);
            foreach ($visitlist as $vl) {
                $prepname = ':val' . ++$i;
                $inset[]  = $prepname;
                $prepbindings[$prepname] = $vl;
            }
            $this->addWhereClause('s.Visit_label IN (' . join(",", $inset) . ')');
        }
    }
}
