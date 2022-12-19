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
 * A QueryEngine is an entity which represents a set of data and
 * the ability to query against them.
 *
 * Queries are divided into 2 phases, filtering the data down to
 * a set of CandIDs or SessionIDs, and retrieving the data for a
 * known set of CandID/SessionIDs.
 *
 * There is usually one query engine per module that deals with
 * candidate data.
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
     * Return a data dictionary of data types managed by this QueryEngine.
     * DictionaryItems are grouped into categories and an engine may know
     * about 0 or more categories of DictionaryItems.
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    abstract public function getDataDictionary() : iterable;

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Query\QueryTerm $term      The criteria term.
     * @param ?string[]                   $visitlist The optional list of visits
     *                                               to match at.
     *
     * @return CandID[]
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

        return array_map(
            function ($cid) {
                return new CandID($cid);
            },
            $rows
        );
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

        $DBSettings = $this->loris->getConfiguration()->getSetting("database");

        if (!$this->useBufferedQuery) {
            $DB = new \PDO(
                "mysql:host=$DBSettings[host];"
                ."dbname=$DBSettings[database];"
                ."charset=UTF8",
                $DBSettings['username'],
                $DBSettings['password'],
            );
            if ($DB->setAttribute(
                \PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,
                false
            ) == false
            ) {
                throw new \DatabaseException("Could not use unbuffered queries");
            };

            $this->createTemporaryCandIDTablePDO(
                $DB,
                "searchcandidates",
                $candidates,
            );
        } else {
            $DB = $this->loris->getDatabaseConnection();
            $this->createTemporaryCandIDTable($DB, "searchcandidates", $candidates);
        }

        $sessionVariables = false;
        foreach ($items as $dict) {
            $fields[] = $this->getFieldNameFromDict($dict)
                . ' as '
                . $dict->getName();
            if ($dict->getScope() == 'session') {
                $sessionVariables = true;
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
        $query .= ' ORDER BY c.CandID';

        $rows = $DB->prepare($query);

        $result = $rows->execute($prepbindings);

        if ($result === false) {
            throw new \Exception("Invalid query $query");
        }

        return $this->candidateCombine($items, $rows);
    }

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

    protected function sqlOperator($criteria)
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

    protected function sqlValue($criteria, array &$prepbindings)
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
        $prepbindings[$prepname] = $criteria->getValue();

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

    protected function addTable(string $tablename)
    {
        if (isset($this->tables[$tablename])) {
            // Already added
            return;
        }
        $this->tables[$tablename] = $tablename;
    }

    protected function getTableJoins() : string
    {
        return join(' ', $this->tables);
    }

    private $where;
    protected function addWhereCriteria(string $fieldname, Criteria $criteria, array &$prepbindings)
    {
        $this->where[] = $fieldname . ' '
            . $this->sqlOperator($criteria) . ' '
            . $this->sqlValue($criteria, $prepbindings);
    }

    protected function addWhereClause(string $s)
    {
        $this->where[] = $s;
    }

    protected function getWhereConditions() : string
    {
        return join(' AND ', $this->where);
    }

    protected function resetEngineState()
    {
        $this->where  = [];
        $this->tables = [];
    }

    protected function candidateCombine(iterable $dict, iterable $rows)
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
                                // $key = $this->getCorrespondingKeyField($fname);
                                $key = $row[$fname . ':key'];
                                $val = [
                                        'key'   => $key,
                                        'value' => $row[$fname],
                                       ];
                                if (isset($candval[$fname][$SID]['values'][$key])) {
                                    assert($candval[$fname][$SID]['values'][$key]['value'] == $row[$fname]);
                                } else {
                                    $candval[$fname][$SID]['values'][$key] = $val;
                                }
                            }
                        } else {
                            // This is the first time we've session this sessionID
                            if ($field->getCardinality()->__toString() !== "many") {
                                // It's not many, so just store the value directly.
                                $candval[$fname][$SID] = [
                                                          'VisitLabel' => $row['VisitLabel'],
                                                          'SessionID'  => $row['SessionID'],
                                                          'value'      => $row[$fname],
                                                         ];
                            } else {
                                // It is many, so use an array
                                $key = $row[$fname . ':key'];
                                $val = [
                                        'key'   => $key,
                                        'value' => $row[$fname],
                                       ];
                                $candval[$fname][$SID] = [
                                                          'VisitLabel' => $row['VisitLabel'],
                                                          'SessionID'  => $row['SessionID'],
                                                          'values'     => [$key => $val],
                                                         ];
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

    protected function createTemporaryCandIDTable($DB, string $tablename, array $candidates)
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
        $insertstmt = "INSERT INTO $tablename VALUES (" . join('),(', $candidates) . ')';
        $q          = $DB->prepare($insertstmt);
        $q->execute([]);
    }

    protected function createTemporaryCandIDTablePDO($PDO, string $tablename, array $candidates)
    {
        $query  = "DROP TEMPORARY TABLE IF EXISTS $tablename";
        $result = $PDO->exec($query);

        if ($result === false) {
            throw new \DatabaseException(
                "Could not run query $query"
            );
        }

        $query  = "CREATE TEMPORARY TABLE $tablename (
            CandID int(6)
        );";
        $result = $PDO->exec($query);

        if ($result === false) {
            throw new \DatabaseException(
                "Could not run query $query"
            );
        }

        $insertstmt = "INSERT INTO $tablename VALUES (" . join('),(', $candidates) . ')';
        $q          = $PDO->prepare($insertstmt);
        $q->execute([]);
    }

    protected $useBufferedQuery = false;
    public function useQueryBuffering(bool $buffered)
    {
        $this->useBufferedQuery = $buffered;
    }

    abstract protected function getCorrespondingKeyField($fieldname);

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
            $this->getFieldNameFromDict($dict),
            $term->criteria,
            $prepbindings
        );

        if ($visitlist != null) {
            $this->addTable('LEFT JOIN session s ON (s.CandID=c.CandID)');
            $this->addWhereClause("s.Active='Y'");
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
    abstract protected function getFieldNameFromDict(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : string;
}
