<?php declare(strict_types=1);

namespace LORIS\dqt\Controllers;

use \LORIS\LorisInstance as Loris;
use \User;
use \LORIS\dqt\Controllers\QueryFactory;
use \LORIS\dqt\Models\Query;
use \LORIS\dqt\Models\DataInstances\QueryResultItem;

/**
 * The QueryKeeper act as an interface between the application and the persistence.
 * It knows how to add and update queries in the database and how to access results
 * from those queries.
 *
 * The user passed as a parameter of the contructor can only access/interact with
 * queries, and results, that he is the creator of or that are shared.
 */
class QueryKeeper
{
    /**
     * Contructor
     *
     * @param Loris $loris The LorisInstance
     * @param User $user The user 
     */
    public function __construct(Loris $loris, User $user)
    {
        $this->_loris   = $loris;
        $this->_user = $user;
    }

    /**
     * Build a Query object from a query_id
     *
     * @param string The query_id
     *
     * @return Query
     */
    public function getQuery(string $queryid=null): Query
    {
        $db = $this->_loris->getDatabaseConnection();

        $queryrecord = $db->pselectRow(
            'SELECT
               q.id,
               saved.name,
               u.UserID as creator,
               q.creation_timestamp,
               q.content,
               shared.shared_id
             FROM
               dqt_queries q
             LEFT JOIN
               dqt_saved_queries saved
               ON (q.id = saved.saved_id) 
             LEFT JOIN 
               dqt_shared_queries shared
               ON (saved.saved_id = shared.shared_id)
             LEFT JOIN users u
               ON (q.creator = u.ID)
             WHERE
               q.id = :v_query_id AND
               (
                 q.creator = :v_userid OR
                 shared.shared_id IS NOT NULL
               )   
            ',
            [
                'v_query_id' => $queryid,
                'v_userid' => $this->_user->getId()
            ]
        );

        if (empty($queryrecord)) {
            throw new \NotFound();
        }

        $content = json_decode(base64_decode($queryrecord['content']), true);

        $querymodel = QueryFactory::create(
            $content['fields'],
            $content['filters']
        );

        return $querymodel
            ->withId($queryid)
            ->withName($queryrecord['name'])
            ->withCreator($queryrecord['creator'])
            ->withTimestamp($queryrecord['creation_timestamp'])
            ->withShared(!empty($queryrecord['shared_id']));
         
    }

    /**
     * Add a query to the dqt_queries table
     *
     * @param Query $query The query to add.
     *
     * @return string The query_id
     */
    public function saveQuery(Query $query): string
    {
        $db  = $this->_loris->getDatabaseConnection(); 
        $obj = json_decode(json_encode($query));

        $content = json_encode([
            'fields'  => $obj->fields,
            'filters' => $obj->filters,
        ]);

        $hash = sha1($content);

        $query_id = $db->pselectOne(
            'SELECT id FROM dqt_queries WHERE hash = :v_hash',
            ['v_hash' => $hash]
        );

        
        $db->beginTransaction();

        if (empty($query_id)) {
            $db->insert(
                'dqt_queries',
                [
                    'hash'    => $hash,
                    'content' => base64_encode($content),
                    'creator' => $this->_user->getId(),
                ]
            );

            $query_id = $db->pselectOne(
                'SELECT id FROM dqt_queries WHERE hash = :v_hash',
                ['v_hash' => $hash]
            );
        }


        if (!empty($obj->name)) {
            $db->insertOnDuplicateUpdate(
                'dqt_saved_queries',
                [
                    'saved_id' => $query_id,
                    'name'     => $obj->name
                ]
            );
        }

print_errlog($obj->shared);

        $action = $obj->shared ? 'insertIgnore' : 'delete';
        $db->$action(
            'dqt_shared_queries',
            ['shared_id' => $query_id]
        );

        $db->commit();

        return $query_id;
    }

    /**
     * This checks if the results are cached and yield the file content
     * line by line. If the file do not exists, this calls
     * _saveQueryResults to obtain a file handler for the results.
     *
     * @param string $queryid The id of the query from which results were generated
     *
     * @return \Traversable A traversable of QueryResultsItem
     */
    public function getQueryResults(string $queryid): \Traversable
    {
        $db = $this->_loris->getDatabaseConnection();

        $resultsfilepath = $db->pselectOne(
            'SELECT
               r.filepath
             FROM
               dqt_results r
             LEFT JOIN 
               dqt_queries q
               ON (q.id = r.query_id)
             LEFT JOIN dqt_shared_queries sq
               ON (q.id = sq.shared_id)
             WHERE
               r.query_id = :v_query_id AND
               (
                 q.creator = :v_userid OR
                 sq.shared_id IS NOT NULL
               )',
            [
                'v_query_id' => $queryid,
                'v_userid' => $this->_user->getId()
            ]
        );

        $resultsfileinfo = new \SplFileInfo(
            $resultsfilepath ?? 'foo'
        );

        if (!$resultsfileinfo->isReadable()) {
            $query = $this->getQuery($queryid);
            $resultsfileinfo = $this->_saveQueryResults($query);
        }

        $resultsfile = $resultsfileinfo->openFile('r');

        while (!$resultsfile->eof()) {
            $obj = json_decode($resultsfile->fgets());
            if (empty($obj)) {
                return;
            }
            yield new QueryResultItem($obj->key, $obj->value);
        }
    }

    /**
     * This executes a query and saves the results in a file. A record is added
     * in the dqt_results table to keep track of existing result files.
     *
     * @param Query $query The query to execute
     *
     * @return \SplFileInfo A fileInfo object of the result file
     */
    private function _saveQueryResults(Query $query): \SplFileInfo
    {
        // By default, results will be written in a temporary file in memory
        // unless it can be writen on disk.
        $resultsfileinfo = new \SplTempFileObject();

        // FIXME :: This should probably comme from the configs
        $resultsdirectory = '/tmp/dqt_results/';

        if (is_dir($resultsdirectory) || mkdir($resultsdirectory, 0777, true) ) {
            $resultsfilepath = $resultsdirectory . $query->getId();
            $resultsfileinfo =new \SplFileInfo($resultsfilepath);
        }

        $resultsfile = $resultsfileinfo->openFile('w');
        $results     = $query->execute($this->_loris, $this->_user);

        foreach ($results as $row) {
            $resultsfile->fwrite(json_encode($row) . PHP_EOL);
        }

        // Closing file
        $resultsfile = null;

        $this->_loris->getDatabaseConnection()->insertOnDuplicateUpdate(
            'dqt_results',
            [
                'query_id' => $query->getId(),
                'filepath' => $resultsfileinfo->getRealPath()
            ]
        );

        return $resultsfileinfo;
    }
}
