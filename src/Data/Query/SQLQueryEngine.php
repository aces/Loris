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
    public function getDataDictionary() : iterable
    {
        return [];
    }

    /**
     * Return an iterable of CandIDs matching the given criteria.
     *
     * If visitlist is provided, session scoped variables will only match
     * if the criteria is met for at least one of those visit labels.
     */
    public function getCandidateMatches(QueryTerm $criteria, ?array $visitlist = null) : iterable
    {
        return [];
    }

    /**
     * {@inheritDoc}
     *
     * @param DictionaryItem[] $items
     * @param CandID[] $candidates
     * @param ?string[] $visits
     *
     * @return DataInstance[]
     */
    public function getCandidateData(array $items, iterable $candidates, ?array $visitlist) : iterable
    {
        return [];
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\Category $inst       The item category
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The item itself
     *
     * @return string[]
     */
    public function getVisitList(
        \LORIS\Data\Dictionary\Category $inst,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : iterable {
        return [];
    }

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
}
