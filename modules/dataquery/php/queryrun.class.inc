<?php
namespace LORIS\dataquery;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * A QueryRun represents a single run of a query in the Data Query
 * tool
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class QueryRun implements \LORIS\StudyEntities\AccessibleResource,
    \LORIS\Data\DataInstance
{
    protected int $runID;

    /**
     * Construct a QueryRun object.
     *
     * @param \LORIS\LorisInstance $loris   The LorisInstance the query is from
     * @param Query                $query   The query that was ran for this run
     * @param ?int                 $RunID   The ID of this run
     * @param string               $runTime The time of the run
     * @param bool                 $starred Whether the query is starred
     * @param bool                 $shared  Whether the query is public
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        protected Query $query,
        ?int $RunID=null,
        public readonly string $runTime='',
        public readonly bool $starred=false,
        public readonly bool $shared=false
    ) {
        if ($RunID !== null) {
            $this->runID = $RunID;
        }
    }

    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose accessibility is being checked.
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user) : bool
    {
        return $this->query->isAccessibleBy($user);
    }

    /**
     * Get the Query object for this run
     *
     * @return Query
     */
    public function getQuery() : Query
    {
        return $this->query;
    }

    /**
     * Insert the candidates that match the query for $user into the LORIS
     * database results table.
     *
     * @param \User $user The user running the query
     *
     * @return void
     */
    public function insertCandidates(\User $user) : void
    {
        $DB      = $this->loris->getDatabaseConnection();
        $candIDs = \iterator_to_array($this->query->matchCandidates($user));
        if (count($candIDs) == 0) {
            return;
        }
        $insertstmt = "INSERT INTO dataquery_run_results (RunID, CandID) VALUES 
            ($this->runID, " . join("),($this->runID, ", $candIDs) . ')';
        $q          = $DB->prepare($insertstmt);
        $q->execute([]);
        return;
    }

    /**
     * Get a data provisioner for the results of this query run.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getQueryDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new QueryDataProvisioner($this->loris, $this);
    }

    /**
     * Get the candidates that matched this run.
     *
     * @return CandID[]
     */
    public function getCandidates() : array
    {
        $DB      = $this->loris->getDatabaseConnection();
        $candIDs = $DB->pselectCol(
            "SELECT CandID FROM dataquery_run_results WHERE RunID=:run",
            ['run' => $this->runID],
        );

        return array_map(
            function ($val) {
                return new CandID($val);
            },
            $candIDs
        );

    }

    /**
     * {@inheritDoc}
     *
     * @return mixed
     */
    public function jsonSerialize() : mixed
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $result  = [
            'self'       => $baseURL
                . '/dataquery/queries/' . $this->query->queryID
                . '/run/' . $this->runID,
            'QueryURI'   => $baseURL
                . '/dataquery/queries/' . $this->query->queryID,
            'RunTime'    => $this->runTime,
            'QueryID'    => $this->query->queryID,
            'QueryRunID' => $this->runID,
        ];
        return $result;
    }
}

