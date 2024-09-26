<?php declare(strict_types=1);
namespace LORIS\dataquery;
use \LORIS\StudyEntities\Candidate\CandID;
use \LORIS\Data\Query\QueryTerm;
use \LORIS\Data\Query\Criteria\Equal;
use \LORIS\Data\Query\Criteria\NotEqual;
use \LORIS\Data\Query\Criteria\In;
use \LORIS\Data\Query\Criteria\LessThan;
use \LORIS\Data\Query\Criteria\LessThanOrEqual;
use \LORIS\Data\Query\Criteria\GreaterThan;
use \LORIS\Data\Query\Criteria\GreaterThanOrEqual;

use \LORIS\Data\Query\Criteria\IsNull;
use \LORIS\Data\Query\Criteria\NotNull;

use \LORIS\Data\Query\Criteria\StartsWith;
use \LORIS\Data\Query\Criteria\Substring;
use \LORIS\Data\Query\Criteria\EndsWith;

use \LORIS\Data\Dictionary\DictionaryItem;

/**
 * A Query object represents a query run from the LORIS Data Query module
 * in PHP.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Query implements \LORIS\StudyEntities\AccessibleResource,
    \LORIS\Data\DataInstance
{
    protected $data;
    /**
     * Construct a Query object
     *
     * @param \LORIS\LorisInstance $loris     The LORIS Instance
     * @param int                  $queryID   The Query ID
     * @param ?array               $query     The serialized form of
     *                                        the query
     * @param ?string              $name      The query name
     * @param ?string              $adminname The name used by an admin
     *                                        pinning the query
     * @param ?array               $sharedBy  List of users who shared
     *                                        this query
     * @param ?bool                $starred   True if this query is starred
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        public readonly int $queryID,
        ?array $query=null,
        public ?string $name=null,
        protected ?string $adminname=null,
        protected ?array $sharedBy=null,
        protected ?bool $starred=null,
    ) {
        if ($query !== null) {
            $this->data = $query;
        } else if ($queryID > 0) {
            $DB = $loris->getDatabaseConnection();

            $data = $DB->pselectOne(
                "SELECT dq.Query
                    FROM dataquery_queries dq
                    WHERE QueryID=:qid",
                ['qid' => $queryID]
            );

            if ($data === null) {
                throw new \NotFound("Query $queryID not found");
            }
            $this->data = json_decode($data, true);
        }
    }

    /**
     * Load metadata that was not loaded by the constructor.
     *
     * @param \User $user The user loading the query;
     *
     * @return void
     */
    public function loadQueryMetadata(\User $user)
    {
        $DB = $this->loris->getDatabaseConnection();
        if ($this->name === null) {
            $dbname = $DB->pselectOne(
                "SELECT Name FROM dataquery_query_names
                    WHERE UserID=:UID AND QueryID=:QID",
                [
                    'UID' => $user->getId(),
                    'QID' => $this->queryID,
                ]
            );
            if (!empty($dbname)) {
                $this->name = $dbname;
            } else {
                $this->name = '';
            }
        }
        if ($this->adminname === null) {
            $dbname = $DB->pselectOne(
                "SELECT Name FROM dataquery_study_queries_rel
                    WHERE QueryID=:QID AND PinType='topquery'",
                [
                    'QID' => $this->queryID,
                ]
            );
            if (!empty($dbname)) {
                $this->adminname = $dbname;
            } else {
                $this->adminname = '';
            }
        }
        if ($this->sharedBy === null) {
            $sharers        = $DB->pselectCol(
                "SELECT u.UserID
                    FROM dataquery_shared_queries_rel dshq
                        JOIN users u ON (u.ID=dshq.SharedBy)
                    WHERE dshq.SharedBy != :UID AND dshq.QueryID=:QID",
                [
                    'UID' => $user->getId(),
                    'QID' => $this->queryID,
                ]
            );
            $this->sharedBy = $sharers;
        }
        if ($this->starred === null) {
            $starred       = $DB->pselect(
                "SELECT StarredBy
                    FROM dataquery_starred_queries_rel 
                    WHERE StarredBy = :UID AND QueryID=:QID",
                [
                    'UID' => $user->getId(),
                    'QID' => $this->queryID,
                ]
            );
            $this->starred = !empty($starred);
        }
    }

    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user) : bool
    {
        // Check module permissions for both fields and criteria
        $modules  = array_map(
            function ($field) {
                return $field['module'];
            },
            $this->data['fields'] ?? []
        );
        $criteria = $this->getCriteria();
        if ($criteria) {
            $modules = array_merge(
                $modules,
                $this->_getAllCriteriaModules($criteria),
            );
        }

        foreach (array_unique($modules) as $module) {
            if (!$this->loris->getModule($module)->hasAccess($user)) {
                return false;
            }
        }

        // Check accessibility for fields
        try {
            $fields = $this->getFields();
            foreach ($fields as $field) {
                if ($field->isAccessibleBy($user) === false) {
                    return false;
                }
            }

            // Check accessibility for dictionary items in the criteria
            $critfields = $this->_getAllCriteriaDictionaries($criteria);
            foreach ($critfields as $field) {
                if ($field->isAccessibleBy($user) === false) {
                    return false;
                }

            }
        } catch (\OutOfBoundsException $e) {
            // The query references a field that no longer exists.
            // The module can not provide the data, so the query is
            // not accessible by anyone.
            return false;
        }
        return true;
    }

    /**
     * Recursively get all modules used by criteria and sub-criteria
     * Returns the module names.
     *
     * @param array $criteria The criteria whose modules we want
     *
     * @return string[]
     */
    private function _getAllCriteriaModules($criteria) : array
    {
        // Ensure it was called with a criteria object and not
        // some other array
        assert(isset($criteria['operator']));
        $modules = [];
        foreach ($criteria['group'] as $item) {
            if (isset($item['group'])) {
                $modules = array_merge(
                    $modules,
                    $this->_getAllCriteriaModules($item),
                );
            } else {
                $modules[] = $item['module'];
            }
        }
        return array_unique($modules);
    }

    /**
     * Recursively get a dictionaryItem for every field used
     * in the criteria including subgroup
     *
     * @param array $criteria The criteria whose dictionaries we want
     *
     * @return DictionaryItem[]
     */
    private function _getAllCriteriaDictionaries($criteria) : array
    {
        if ($criteria === null) {
            return [];
        }
        // Ensure it was called with a criteria object and not
        // some other array
        assert(isset($criteria['operator']));
        $usedDicts = [];
        foreach ($criteria['group'] as $item) {
            if (isset($item['group'])) {
                $usedDicts = array_merge(
                    $usedDicts,
                    $this->_getAllCriteriaDictionaries($item),
                );
            } else {
                $mname = $item['module'];
                $cname = $item['category'];
                $fname = $item['fieldname'];
                $this->_populateModuleDictCache($mname);
                if (!isset(self::$moduleDictCache[$mname][$cname][$fname])) {
                    // This query references a field that no longer exist.
                    throw new \OutOfBoundsException();
                }
                $usedDicts[] = self::$moduleDictCache[$mname][$cname][$fname];
            }
        }
        return $usedDicts;
    }

    /**
     * Return this query as an array
     *
     * @return array
     */
    public function toArray() : array
    {
        return $this->data;
    }

    /**
     * Star a query for a user
     *
     * @param \User $user The user starring the query
     *
     * @return void
     */
    public function star(\User $user)
    {
        $DB = $this->loris->getDatabaseConnection();
        $DB->insertIgnore(
            'dataquery_starred_queries_rel',
            [
                'QueryID'   => $this->queryID,
                'StarredBy' => $user->getId(),
            ]
        );

    }

    /**
     * Unstar a query for a user
     *
     * @param \User $user The user unstarring the query
     *
     * @return void
     */
    public function unstar(\User $user)
    {
        $DB = $this->loris->getDatabaseConnection();
        $DB->delete(
            'dataquery_starred_queries_rel',
            [
                'QueryID'   => $this->queryID,
                'StarredBy' => $user->getId(),
            ]
        );
    }

    /**
     * Shares (marks as public) a query
     *
     * @param \User $user The user sharing the query
     *
     * @return void
     */
    public function share(\User $user)
    {
        $DB = $this->loris->getDatabaseConnection();
        $DB->insertIgnore(
            'dataquery_shared_queries_rel',
            [
                'QueryID'  => $this->queryID,
                'SharedBy' => $user->getId(),
            ]
        );

    }

    /**
     * Unshare a query that was previously shared.
     *
     * @param \User $user The user unsharing the query
     *
     * @return void
     */
    public function unshare(\User $user)
    {
        $DB = $this->loris->getDatabaseConnection();
        $DB->delete(
            'dataquery_shared_queries_rel',
            [
                'QueryID'  => $this->queryID,
                'SharedBy' => $user->getId(),
            ]
        );
    }

    /**
     * Set the name that the user would like to use for this query.
     *
     * @param \User  $user The user naming the query
     * @param string $name The name to give it
     *
     * @return void
     */
    public function setQueryName(\User $user, string $name)
    {
        $DB = $this->loris->getDatabaseConnection();
        $DB->replace(
            'dataquery_query_names',
            [
                'QueryID' => $this->queryID,
                'UserID'  => $user->getId(),
                'Name'    => $name,
            ]
        );

    }

    /**
     * Get the Criteria for this query or null if there is no
     * criteria.
     *
     * @return ?array
     */
    public function getCriteria() : ?array
    {
        return $this->data['criteria'] ?? null;
    }

    /**
     * A cache used for storing a hierarchical version of module
     * data dictionaries used by this query.
     *
     * Entries are of the form
     *     $cache[modulename][categoryname][fieldname]= DictionaryItem
     */
    private static $moduleDictCache = [];

    /**
     * Populate $this->moduleDictCache for a module.
     *
     * @param string $mname The module name to cache
     *
     * @return void
     */
    private function _populateModuleDictCache(string $mname) : void
    {
        if (isset(self::$moduleDictCache[$mname])) {
            return;
        }
        $module = $this->loris->getModule($mname);

        $moduleDict = $module->getQueryEngine()->getDataDictionary();
        foreach ($moduleDict as $category) {
            $cname = $category->getName();
            foreach ($category->getItems() as $cfield) {
                if (!isset(self::$moduleDictCache[$mname])) {
                    self::$moduleDictCache[$mname] = [];
                }
                if (!isset(self::$moduleDictCache[$mname][$cname])) {
                    self::$moduleDictCache[$mname][$cname] = [];
                }
                self::$moduleDictCache[$mname][$cname][$cfield->getName()] = $cfield;
            }
        }
    }

    /**
     * Return the fields in the same format as it was sent over
     * the wire, without first converting to DictionaryItems
     *
     * @return array
     */
    public function getFieldsRaw() : iterable
    {
        return $this->data['fields'] ?? null;
    }

    /**
     * Gets the fields for this query.
     *
     * @return DictionaryItem[]
     */
    public function getFields() : iterable
    {
        if (empty($this->data['fields'])) {
            return [];
        }

        $fields = [];

        assert($this->data !== null);

        foreach ($this->data['fields'] as $field) {
            $mname = $field['module'];
            $cname = $field['category'];
            $fname = $field['field'];

            $this->_populateModuleDictCache($mname);
            if (!isset(self::$moduleDictCache[$mname][$cname][$fname])) {
                // This query references a field that no longer exist.
                throw new \OutOfBoundsException();
            }
            assert(isset(self::$moduleDictCache[$mname][$cname][$fname]));
            $fields[] = self::$moduleDictCache[$mname][$cname][$fname];
        }
        assert($this->data !== null);
        assert(count($fields) == count($this->data['fields']));
        return $fields;
    }

    /**
     * Create a new QueryRun for this Query.
     *
     * @param \User $user The user running the query
     *
     * @return QueryRun
     */
    public function newRun(\User $user) : QueryRun
    {
        $DB = $this->loris->getDatabaseConnection();
        $DB->insert(
            "dataquery_run_queries",
            [
                'QueryID' => $this->queryID,
                'UserID'  => $user->getId(),

            ]
        );
        $queryRunID = $DB->getLastInsertId();

        return new QueryRun($this->loris, $this, intval($queryRunID));
    }

    /**
     * Sets this query as being pinned by an admin.
     *
     * @param \User  $user The admin performing the pin.
     * @param string $name The name that the admin thinks should be
     *                     used for the query
     * @param string $type The type of querypin to remove. Either
     *                     'topquery' or 'dashboard'
     *
     * @return void
     */
    public function setAdminPinnedQuery(
        \User $user,
        string $name,
        string $type,
    ) : void {
        $DB = $this->loris->getDatabaseConnection();
        $DB->replace(
            'dataquery_study_queries_rel',
            [
                'QueryID'  => $this->queryID,
                'PinnedBy' => $user->getId(),
                'Name'     => $name,
                'PinType'  => $type,
            ]
        );
    }

    /**
     * Remove this query from the list of queries pinned by an admin.
     *
     * @param string $type The type of querypin to remove. Either
     *                     'topquery' or 'dashboard'
     *
     * @return void
     */
    public function removeAdminPinnedQuery(string $type) : void
    {
        $DB = $this->loris->getDatabaseConnection();
        $DB->delete(
            'dataquery_study_queries_rel',
            [
                'QueryID' => $this->queryID,
                'PinType' => $type,
            ]
        );
    }

    /**
     * Get a list of CandIDs which match this query for a user
     *
     * @param \User $user The user running the query.
     *
     * @return iterable
     */
    public function matchCandidates(\User $user) : iterable
    {
        $criteria = $this->getCriteria();

        if ($criteria) {
            $candidates = $this->_candidateMatches($criteria);
        } else {
            $candidates = $this->_allCandidates();
        }
        return $this->_filterInaccessibleCandidates($candidates, $user);
    }

    /**
     * Filter CandIDs out of $candIDs which aren't accessible to $user
     *
     * @param CandID[] $candIDs The CandIDs to be filtered
     * @param \User    $user    The user whose access should check.
     *
     * @return iterable
     */
    private function _filterInaccessibleCandidates(
        array $candIDs,
        \User $user,
    ) : iterable {
        if (count($candIDs) == 0) {
            return [];
        }
        $DB = $this->loris->getNewDatabaseConnection();
        $DB->setBuffering(false);

        // Put candidates into a temporary table so that it can be used in a join
        // clause. Directly using "c.CandID IN (candid1, candid2, candid3, etc)" is
        // too slow to be useable.
        $DB->run("DROP TEMPORARY TABLE IF EXISTS accesscandidates");
        $DB->run(
            "CREATE TEMPORARY TABLE accesscandidates(
	    CandID int(6) NOT NULL,
	    PRIMARY KEY(CandID)
        );"
        );
        $insertstmt = "INSERT INTO accesscandidates VALUES"
                . " (" . join('),(', $candIDs) . ')';
        $q          = $DB->prepare($insertstmt);
        $q->execute([]);

        // Get the data which affects accessibility in bulk.
        $rows      = $DB->pselect(
            "SELECT c.CandID, c.RegistrationProjectID, c.RegistrationCenterID,
                s.ProjectID as SProjectID, s.CenterID as SCenterID,
                s.ID as sessionID
            FROM candidate c LEFT JOIN session s ON (s.CandID=c.CandID)
            WHERE c.Active='Y' AND COALESCE(s.Active, 'Y')='Y'
                AND c.CandID IN (SELECT CandID FROM accesscandidates)
            ORDER BY c.CandID",
            []
        );
        $curCandID = '';
        $canddata  = null;

        // Foreach CandID, create the TimePointData object for all timepoints
        // that were returned.
        foreach ($rows as $row) {
            if ($curCandID != $row['CandID']) {
                if ($canddata !== null) {
                     $candidate = new \Candidate($canddata);
                    if ($candidate->isAccessibleBy($user)) {
                        yield $canddata->CandID;
                    }
                }
                $canddata  = new \CandidateData(
                    candID: new CandID(strval($row['CandID'])),
                    registrationProjectID: $row['RegistrationProjectID'] !== null
                    ? \ProjectID::singleton($row['RegistrationProjectID'])
                    : null,
                    registrationCenterID: $row['RegistrationCenterID'] !== null
                    ? \CenterID::singleton($row['RegistrationCenterID'])
                    : null,
                    timepoints: [],
                );
                $curCandID = $row['CandID'];
            }
            if ($row['sessionID'] !== null) {
                $canddata->timepoints[] = new \TimePoint(
                    new \TimePointData(
                        new \SessionID(strval($row['sessionID'])),
                        \ProjectID::singleton($row['SProjectID']),
                        \CenterID::singleton($row['SCenterID']),
                    )
                );
            }
        }

        // check the last candidate that wouldn't have entered the check in the
        // loop
        if ($canddata !== null) {
            $candidate = new \Candidate($canddata);
            if ($candidate->isAccessibleBy($user)) {
                yield $canddata->CandID;
            }
        }
    }

    /**
     * Get all candidates in this LORIS instance.
     *
     * @return CandID[]
     */
    private function _allCandidates() : array
    {
        $db      = $this->loris->getDatabaseConnection();
        $results = $db->pselectCol(
            "SELECT CandID FROM candidate WHERE Active='Y' ORDER BY CandID ",
            [],
        );

        return array_map(
            function ($row) {
                return new CandID(strval($row));
            },
            $results
        );
    }

    /**
     * Get a list of candidates that match all criteria passed
     *
     * @param array $criteria A list of criteria to match
     *
     * @return CandID[]
     */
    private function _candidateMatches(array $criteria) : array
    {
        $results = [];
        if (!$criteria['operator']) {
            throw new \LorisException("Bad criteria");
        }

        foreach ($criteria['group'] as $crit) {
            if (isset($crit['group'])) {
                $subresults = $this->_candidateMatches($crit);
                if (is_array($subresults)) {
                    $results[] = $subresults;
                } else {
                    $results[] = iterator_to_array($subresults);
                }
                continue;
            }
            $modulename = $crit['module'];
            $engine     = $this->loris->getModule($modulename)->getQueryEngine();

            $fulldict = $this->getFlattenedDictionary($engine);
            $dictitem = $fulldict[$crit['fieldname']];

            // Get a new engine for each term to reset the internal state
            switch ($crit['op']) {
            case 'lt':
                $term = new QueryTerm($dictitem, new LessThan($crit['value']));
                break;
            case 'lte':
                $term = new QueryTerm(
                    $dictitem,
                    new LessThanOrEqual($crit['value'])
                );
                break;
            case 'eq':
                $term = new QueryTerm($dictitem, new Equal($crit['value']));
                break;
            case 'neq':
                $term = new QueryTerm($dictitem, new NotEqual($crit['value']));
                break;
            case 'gte':
                $term = new QueryTerm(
                    $dictitem,
                    new GreaterThanOrEqual($crit['value']),
                );
                break;
            case 'gt':
                $term = new QueryTerm($dictitem, new GreaterThan($crit['value']));
                break;
            case 'startsWith':
                $term = new QueryTerm($dictitem, new StartsWith($crit['value']));
                break;
            case 'endsWith':
                $term = new QueryTerm($dictitem, new EndsWith($crit['value']));
                break;
            case 'contains':
                $term = new QueryTerm($dictitem, new Substring($crit['value']));
                break;
            case 'isnotnull':
                $term = new QueryTerm($dictitem, new NotNull());
                break;
            case 'isnull':
                $term = new QueryTerm($dictitem, new IsNull());
                break;
            case 'in':
                $term = new QueryTerm($dictitem, new In(...$crit['value']));
                break;
            default:
                throw new \Exception("Unhandled operator: " . $crit['op']);
            }

            // FIXME: Verify visits, test was done with candidate scope data
            $visitlist = null;
            if (isset($query['visits'])) {
                $visitlist = $query['visits'];
            }

            $matches = $engine->getCandidateMatches($term, $visitlist);
            if (is_array($matches)) {
                $results[] = $matches;
            } else {
                $results[] = iterator_to_array($matches);
            }
        }
        $combinedresult = [];
        if (count($results) == 1) {
            // Doesn't matter if it's 'and' or 'or', there's only 1 criteria
            $combinedresult = $results[0];
        } else {
            if ($criteria['operator'] == 'and') {
                $combinedresult = array_intersect(...$results);
            } else if ($criteria['operator'] == 'or') {
                $combinedresult = array_merge(...$results);
            }

        }
        $candidates = array_values(array_unique($combinedresult));
        return $candidates;
    }

    /**
     * Get a dictionary flatted into an array without categories.
     *
     * @param \LORIS\Data\Query\QueryEngine $engine The QueryEngine with the
     *                                              dictionary.
     *
     * @return DictionaryItem[]
     */
    public function getFlattenedDictionary(
        \LORIS\Data\Query\QueryEngine $engine
    ) : array {
        $rawdict = $engine->getDataDictionary();

        // Flattened dictionary without categories
        $dict = [];

        foreach ($rawdict as $cat) {
            foreach ($cat->getItems() as $item) {
                $dict[$item->getName()] = $item;
            }
        }
        return $dict;
    }

    /**
     * {@inheritDoc}
     *
     * @return mixed
     */
    public function jsonSerialize() : mixed
    {
        $factory = \NDB_Factory::singleton();
        $result  = [
            'self'    => $factory->settings()->getBaseURL()
                . '/dataquery/queries/' . $this->queryID,
            'QueryID' => $this->queryID,
            'Query'   => $this->data,
        ];
        if ($this->name !== null && $this->name !== '') {
            $result['Name'] = $this->name;
        }
        if ($this->adminname !== null && $this->adminname !== '') {
            $result['AdminName'] = $this->adminname;
            $result['Pinned']    = true;
        } else {
            $result['Pinned'] = false;
        }

        if ($this->sharedBy !== null && $this->sharedBy !== []) {
            $result['SharedBy'] = $this->sharedBy;
            $result['Public']   = true;
        } else {
            $result['Public'] = false;
        }
        if ($this->starred !== null) {
            $result['Starred'] = $this->starred;
        }
        return $result;
    }
}
