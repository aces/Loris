<?php declare(strict_types=1);
/**
 * This file represents an SQL database abstraction layer for use in Loris
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
define("DEBUG", false);

/**
 * Database abstraction layer presents a unified interface to database
 * connectivity.  Instantiate one object instance per database
 * connection.
 *
 * Throughout the class, all input arrays follow the same structure:
 * $array['column_name'] = 'value'.
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Database
{
    /**
     * The database handle, created by the connect() method
     *
     * @var    PDO
     * @access private
     */
    var $_PDO = null;

    /**
     * The database handle for storing history information.
     * If missing, will be the same as $_PDO
     *
     * @access private
     */
    var $_HistoryPDO = null;

    /**
     * The auto_increment ID value of the last insert statement,
     * as designated by LAST_INSERT_ID
     *
     * @access public
     */
    var $lastInsertID;

    var $_showQueries = false;

    var $_trackChanges = true;

    var $_preparedStoreHistory;

    /**
     * Singleton design pattern implementation - creates the object
     * and also connects to the database if necessary.
     * NOTE There is no return type declaration for this function as it returns
     * the type `Database` which is not supported by PHPs built in return types.
     *
     * @param string  $database     the database to select
     * @param string  $username     the username with which to log into
     *                              the database server
     * @param string  $password     the password that matches the username
     * @param string  $host         the name of the database server
     * @param boolean $trackChanges boolean determining if changes should be
     *                              logged to the history table
     *
     * @return \Database
     * @throws \DatabaseException
     * @access public
     */
    static function &singleton(
        string $database     = '',
        string $username     = '',
        string $password     = '',
        string $host         = '',
        bool   $trackChanges = true
    ): \Database {

        static $connections = array();

        // if no arguments, try to get the first connection or choke
        if (empty($database)
            && empty($username)
            && empty($password)
            && empty($host)
        ) {
            if (!empty($connections)) {
                reset($connections);
                $connection = current($connections);
                return $connection;
            } else {
                throw new DatabaseException("No database connection exists");
            }
        } else {
            // name the connection
            $connection = md5($database.$host.$username.$password.$trackChanges);

            // create the connection if none exists
            if (empty($connections[$connection])) {
                $connections[$connection] = new Database;
                $connections[$connection]->connect(
                    $database,
                    $username,
                    $password,
                    $host,
                    $trackChanges
                );
            }

            // return the connection
            return $connections[$connection];
        }
    }

    /**
     * Creates the connection to the database server and selects the
     * desired database.  the connection is stored in the Database
     * object, and should never be accessed directly by the user.
     *
     * @param string      $database     the database to select
     * @param string|null $username     the username with which to log into
     *                                  the database server
     * @param string|null $password     the password that matches the username
     * @param string|null $host         the name of the database server
     * @param boolean     $trackChanges whether to use the trackChanges
     *                                  mechanism on this connection
     *
     * @return bool True if DB connection established. False otherwise.
     * @access public
     */
    function connect(
        $database,
        ?string $username,
        ?string $password,
        ?string $host,
        bool   $trackChanges = true
    ) : bool {

        $this->_trackChanges = $trackChanges;
        $this->_databaseName = $database;

        $historydb    = null;
        $historytable = "history";

        if (class_exists('NDB_Config')) {
            $config =& NDB_Config::singleton();
            $this->_showQueries = $config->getSetting('showDatabaseQueries');

            // get history database from config
            $dbsettings = $config->getSetting("database");
            if (isset($dbsettings['historydb'])) {
                $historydb = $dbsettings['historydb'];
            }
            if (isset($dbsettings['historytable'])) {
                $historytable = $dbsettings['historytable'];
            }

        }

        try {
            $this->_PDO = new PDO(
                "mysql:host=$host;dbname=$database;charset=UTF8",
                $username,
                $password
            );
        } catch (PDOException $e) {
            // This exception will not be included in the error log as it will
            // likely include credentials.
            throw new DatabaseException(
                "Could not establish a PDO object using the following values: "
                . "username: `$username`, dbname: `$database`, host: `$host` "
                . "and the supplied password."
            );
            return false;
        }
        $this->_PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $this->_PDO->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $this->_preparedStoreHistory = $this->_PDO->prepare(
            "INSERT INTO history (tbl, col, new, old,"
            ." primaryCols, primaryVals, userID, type)"
            ." VALUES"
            ." (:histtable, :histcolumn, :newval, :oldval,"
            ." :primaryKeys, :primaryVals, :userID, :type)"
        );

        if (is_null($this->_HistoryPDO)) {
            if (is_null($historydb)) {
                $this->_HistoryPDO =& $this->_PDO;
            } else {
                $this->_HistoryPDO = new PDO(
                    "mysql:host=$host;dbname=$historydb",
                    $username,
                    $password
                );
            }
        }

        $this->_preparedStoreHistory = $this->_HistoryPDO->prepare(
            "INSERT INTO $historytable
            (tbl, col, new, old, primaryCols, primaryVals, userID, type)
            VALUES
            ( :histtable,
              :histcolumn,
              :newval,
              :oldval,
              :primaryKeys,
              :primaryVals,
              :userID,
              :type
            )"
        );
        return true;
    }

    /**
     * Determines whether the database connection is alive
     *
     * @return boolean
     * @access public
     */
    function isConnected(): bool
    {
        try {
            if (!$this->_PDO) {
                return false;
            }
            $this->_PDO->query("SELECT 'x'");
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    /**
     * Insert a row into the database
     *
     * This will insert a row. HTML from any field in the row will be automatically
     * escaped to avoid injection.
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     *
     * @return void
     */
    public function insert(string $table, array $set): void
    {
        $this->_realinsert($table, $set, true);
    }

    /**
     * Insert a row into the database without validating input.
     *
     * This will insert a row. HTML from any field in the row will *not* be
     * automatically escaped. This should only be called when we know the source of
     * the input is trustworthy and must contain HTML.
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     *
     * @return void
     */
    public function unsafeinsert(string $table, array $set): void
    {
        $this->_realinsert($table, $set, false);
    }

    /**
     * Insert a row into the database
     *
     * This will insert a row. HTML from any field in the row will be automatically
     * escaped to avoid injection.
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     *
     * @return void
     */
    public function insertIgnore(string $table, array $set): void
    {
        $ignore = true;
        $this->_realinsert($table, $set, true, $ignore);
    }

    /**
     * Insert row into the database or update on duplicate key.
     *
     * This will attempt to insert a row into the database. If there is a duplicate
     * value for any unique key, the row where the duplicate is present will be
     * updated.
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the row
     *
     * @return void
     */
    public function insertOnDuplicateUpdate($table, $set)
    {
        return $this->_realinsert($table, $set, true, false, true);
    }

    /**
     * Insert row into the database or update on duplicate key without validating
     * input.
     *
     * This will attempt to insert a row into the database. If there is a duplicate
     * value for any unique key, the row where the duplicate is present will be
     * updated. HTML from any field in the row will *not* be automatically escaped.
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the row
     *
     * @return void
     */
    public function unsafeInsertOnDuplicateUpdate($table, $set)
    {
        return $this->_realinsert($table, $set, false, false, true);
    }

    /**
     * Escape the HTML from an array that is about to be inserted into the
     * database.
     * NOTE this only provide safety when elements are inserted into the
     * "innerHTML" of an element; if a value is instead injected
     * into attribute such as 'name', 'value', 'class', etc.
     * then Javascript injection is still possible.
     *
     * This function alone does not guarantee safety.
     *
     * @param array $set The array to be inserted as a new row
     *
     * @return array A copy of $set with the HTML characters escaped
     */
    private function _HTMLEscapeArray(array $set): array
    {
        $retVal = array();
        foreach ($set as $key => $val) {
            /* FIXME this check is only here because of a quirk of the
             * imaging browser. The module should be refactored and this check
             * removed.
             */
            if ($val === 'Unrated') {
                $retVal[$key] = '';
                continue;
            }
            // Only call htmlspecialchars on strings, or else an error occurs.
            $retVal[$key] = is_string($val) ? htmlspecialchars($val) : $val;
        }
        return $retVal;
    }

    /**
     * Inserts a row
     *
     * Inserts a single row into the specified table, containing the values specified
     *
     * @param string $table             the table into which to insert the row
     * @param array  $set               the values with which to fill the new row
     * @param bool   $autoescape        determines whether the values to be set
     *                                  should automatically have the html escaped
     * @param bool   $ignore            determines whether the insert throws an
     *                                  error or is discarded when value exists in DB
     * @param bool   $onDuplicateUpdate determines whether the row should be updated
     *                                  upon unique key duplication
     *
     * @return bool
     */
    private function _realinsert(
        string $table,
        array  $set,
        bool   $autoescape = true,
        bool   $ignore = false,
        bool   $onDuplicateUpdate = false
    ): bool {
        if ($autoescape === true) {
            $set = $this->_HTMLEscapeArray($set);
        }
        if ($ignore) {
            $query = "INSERT IGNORE INTO $table SET ";
        } else {
            $query = "INSERT INTO $table SET ";
        }
        $prepQ  = $query;
        $query .= $this->_implodeWithKeys(', ', $set, 'set_');

        $exec_params = array();
        $prepQ      .= $this->_implodeAsPrepared(",", $set, $exec_params);

        if ($onDuplicateUpdate) {
            $prepQ .= ' ON DUPLICATE KEY UPDATE ';
            $prepQ .= $this->_implodeAsPrepared(",", $set, $exec_params);
            $query .= ' ON DUPLICATE KEY UPDATE ';
            $query .= $this->_implodeWithKeys(', ', $set);
        }

        if (DEBUG) {
            fwrite(STDERR, $query."\n");
            return true;
        }

        // There is no where clause for an insert, so add a fake
        // one.
        $this->_printQuery($query);
        $prep   = $this->_PDO->prepare($prepQ);
        $result = $prep->execute($exec_params);
        if ($result === false) {
            throw new DatabaseException(
                "Insert statement did not execute successfully: "
                . print_r($prep->errorInfo(), true),
                $prepQ,
                $exec_params
            );
        }

        $this->lastInsertID = $this->_PDO->lastInsertId();

        // Track changes must be called after last insertId is set
        $this->trackChanges($table, $set, '2=1', 'I');
        return true;
    }

    /**
     * Get last insert ID.
     * Will return a valid insert ID only if called after Database::insert() method.
     *
     * @return string ID of the last inserted row
     */
    public function getLastInsertId(): string
    {
        return $this->lastInsertID;
    }

    /**
     * Replaces/inserts a row
     *
     * Replaces into the table such if there already exists a row with
     * the same primary key it will be replaced by the new row
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     *
     * @return void
     * @access public
     */
    function replace(string $table, array $set): void
    {
        $query  = "REPLACE INTO $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set, 'set_');

        if (DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
        }

        $this->_printQuery($query);
        $result = $this->_PDO->exec($query);
        if ($result === false) {
            throw new DatabaseException(
                "Replace statement did not execute successfully.",
                $query
            );
        }
    }

    /**
     * Updates a row
     *
     * Updates a single row in the specified table. This will automatically escape
     * any HTML in the data being inserted for security.
     *
     * @param string $table   the table into which to insert the row
     * @param array  $set     the values with which to fill the new row
     * @param array  $i_where the selection filter, joined as a boolean and
     *
     * @return void
     */
    public function update(string $table, array $set, array $i_where): void
    {
        $this->_realupdate($table, $set, $i_where, true);
    }

    /**
     * Updates a row
     *
     * Updates a single row in the specified table. This will *not* automatically
     * escape and should be used with caution, only when you know you need to
     * insert HTML and know that you can trust it.
     *
     * @param string $table   the table into which to insert the row
     * @param array  $set     the values with which to fill the new row
     * @param array  $i_where the selection filter, joined as a boolean and
     *
     * @return void
     */
    public function unsafeupdate(
        string $table,
        array $set,
        array $i_where
    ): void {

        $this->_realupdate($table, $set, $i_where, false);
    }

    /**
     * Updates a row
     *
     * Updates a single row in the specified table
     *
     * @param string $table      the table into which to insert the row
     * @param array  $set        the values with which to fill the new row
     * @param array  $i_where    the selection filter, joined as a boolean and
     * @param bool   $autoescape determines whether the values to be set should
     *                           automatically have the html escaped
     *
     * @return bool Always true. An exception should be thrown if something goes
     *              wrong.
     * @access public
     */
    private function _realupdate(
        string $table,
        array $set,
        array $i_where,
        bool $autoescape = true
    ): bool {

        if ($autoescape === true) {
            $set = $this->_HTMLEscapeArray($set);
        }
        /* This is still here to print the easily readable version on
         * the top of the page when showDatabaseQueries is on. It isn't
         * actually executed. */
        $query  = "UPDATE $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set, 'set_');
        $query .= " WHERE ";
        $where  = $this->_implodeWithKeys(' AND ', $i_where, 'where_');

        /* This generates the version of the update statement which is
         * executed. */
        $exec_params = array();
        $prepQ       = "UPDATE $table SET ";
        $prepQ      .= $this->_implodeAsPrepared(",", $set, $exec_params, 'set_');
        $prepQ      .= " WHERE ";
        $prepQ      .= $this->_implodeAsPrepared(
            " AND ",
            $i_where,
            $exec_params,
            'where_'
        );

        if (DEBUG) {
            fwrite(STDERR, $query.$where."\n");
            return true;
        }

        if (preg_match("/=NULL/", $where)) {
            throw new DatabaseException(
                "NULL values not allowed in a WHERE structure.",
                $prepQ
            );
        }

        $this->trackChanges($table, $set, $where);
        $this->_printQuery($query.$where);

        $prep   = $this->_PDO->prepare($prepQ);
        $result = $prep->execute($exec_params);
        if ($result === false) {
            throw new DatabaseException(
                "Update statement did not execute successfully.",
                $prepQ,
                $exec_params
            );
        }
        return true;
    }

    /**
     * Deletes a row
     *
     * Deletes a single row in the specified table
     *
     * @param string $table the table into which to insert the row
     * @param array  $where the selection filter, joined as a boolean and
     *
     * @return void
     * @access public
     */
    function delete(string $table, array $where): void
    {
        $query  = "DELETE FROM $table WHERE ";
        $where  = $this->_implodeWithKeys(' AND ', $where, 'where_');
        $query .= $where;

        if (DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
        }

        if (preg_match("/=NULL/", $query)) {
            throw new DatabaseException(
                "NULL values not allowed in a WHERE structure.",
                $query
            );
        }

        // There is no set clause for a delete, so add a fake
        // one.
        $this->trackChanges($table, array(), $where, 'D');

        $this->_printQuery($query);
        $result = $this->_PDO->exec($query);
        if ($result === false) {
            throw new DatabaseException(
                "Database DELETE did not execute successfully."
                . print_r($this->_PDO->errorInfo(), true),
                $query,
                $where
            );
        }
    }

    /**
     * Runs a custom query that can't be handled by other database wrappers.
     *
     * @param string $query The SQL query to run
     *
     * @return void (As a side-effect updates lastInsertID if applicable.)
     */
    function run(string $query): void
    {
        $this->_printQuery($query);
        $result = $this->_PDO->exec($query);

        if ($result === false) {
            throw new DatabaseException(
                "Could not run query $query"
                . print_r($this->_PDO->errorInfo(), true)
            );
        }

        $this->lastInsertID = $this->_PDO->lastInsertId();
    }

    /**
     * Generates a prepared statement for $query without running it.
     * This might sometimes be more efficient than using the pselect
     * wrappers for large datasets, where we don't want to load it all
     * into memory at once
     *
     * @param string $query The query to prepare
     *
     * @return PDOStatement A PDO prepared statement representing $query
     */
    function prepare($query)
    {
        return $this->_PDO->prepare($query);
    }

    /**
     * Executes a previously prepared statements using the variable
     * bindings given.
     *
     * @param PDOStatement $prepared The prepared statement
     * @param array        $params   The values to bind to the statement
     *                               while executing it
     * @param array        $options  A list of key=>value pairs.
     *                               - nofetch : to prevent the fetchAll
     *                                 function to be excuted. Useful for
     *                                 insert or update prepared statements.
     *
     * @return array An array of rows in the format ColName => Value after
     *               executing the statement.
     */
    function execute(
        $prepared,
        array $params,
        array $options = array()
    ): array {

        $execRun = $prepared->execute($params);
        if ($execRun === false) {
            $err = $prepared->errorInfo();
            throw new DatabaseException($err[2], $prepared->queryString, $params);
        }

        if (!empty($options['nofetch']) && $options['nofetch'] == true) {
            return array();
        }

        $rows = $prepared->fetchAll(PDO::FETCH_ASSOC);
        // The fetchAll function will return an empty set if no results are
        // found and FALSE on "failure". We don't expect this case so an
        // exception is thrown.
        if (is_bool($rows) && $rows === false) {
            $err = $prepared->errorInfo();
            throw new DatabaseException($err[2], $prepared->queryString, $params);
        }
        return $rows;
    }
    /**
     * Runs an SQL select statement as a prepared query
     *
     * @param string $query  The SQL SELECT query to be run
     * @param array  $params Values to use for binding to the prepared statement
     *
     * @return array An array of arrays containing the data.
     *               The outside (non-associative array contains 1 element per
     *               row returned by the query, and each element is an associative
     *               array representing the row in the format ColumnName => Value
     */
    function pselect(string $query, array $params)
    {
        $this->_printQuery($query, $params);
        $stmt   = $this->prepare($query);
        $result = $this->execute($stmt, $params);
        return $result;
    }

    /**
     * Runs an SQL select statement as a prepared query and re-indexes
     * the results using the given unique non-nullable key.
     *
     * @param string $query     The SQL SELECT query to be run
     * @param array  $params    Values to use for binding to the prepared statement
     * @param string $uniqueKey Key to use when re-indexing, this key must be a
     *                          single column, must be unique and must not be
     *                          nullable
     *
     * @throws LorisException     If the supplied key is empty or null
     * @throws DatabaseException  If the key is not part of the query itself
     * @throws DatabaseException  If the key is not unique within the resulting set
     *
     * @return array An array of arrays containing the data. The outermost array is
     *                  associative and uses the supplied $uniqueKey parameter as
     *                  a key for each of the sub-arrays with the format
     *                  rowPrimaryKey=>rowValuesArray. Each nested array represents
     *                  a row from the returned by the query. Each element in the
     *                  nested array is an associative array representing the row in
     *                  the format ColumnName => Value
     */
    function pselectWithIndexKey(
        string $query,
        array $params,
        string $uniqueKey
    ) {

        if (is_null($uniqueKey) || empty($uniqueKey)) {
            throw new LorisException(
                "The pselectWithIndexKey() function expects the uniqueKey parameter 
                to not be null or empty. If re-indexing on the primary key is 
                not necessary please use the pselect() function instead."
            );
        }

        $result = $this->pselect($query, $params);

        if (empty($result)) {
            return $result;
        }

        $filteredResult = array();
        // re-order the return array
        foreach ($result as $row) {
            // Check first that the row contains the primary key supplied
            if (!array_key_exists($uniqueKey, $row)) {
                throw new DatabaseException(
                    "The query supplied to pselectWithIndexKey() does not contain 
                    the unique key to re-index on. Make sure to supply the 
                    appropriate key in the SELECT statement to match the supplied 
                    parameter of this function",
                    $query
                );
            }

            // Check that the primary key is indeed unique to avoid overriding data
            // in the result array
            if (isset($filteredResult[$row[$uniqueKey]])) {
                throw new DatabaseException(
                    "The uniqueKey supplied to pselectWithIndexKey() does not appear
                     to be unique or is nullable. This function expects the key to 
                     be both UNIQUE and NOT NULL.",
                    $query
                );
            }

            // If you get here, we just need to build the new array
            $filteredResult[$row[$uniqueKey]] = $row;
            unset($filteredResult[$row[$uniqueKey]][$uniqueKey]);
        }

        return $filteredResult;
    }

    /**
     * Runs a query as a prepared statement and returns the first row as an
     * associative array. Automatically adds a limit clause to the query being
     * run for efficiency.
     *
     * @param string $query  The SQL SELECT query to be run
     * @param array  $params Values to use for binding to prepared statement
     *
     * @return ?array Associative array of form ColumnName => Value for each column
     *                in the first row of the query
     */
    function pselectRow(string $query, array $params) : ?array
    {
        $rows = $this->pselect($query . " LIMIT 2", $params);
        if (count($rows) > 1) {
            throw new \DomainException(
                "Attempt to use pselectRow on a query that returns multiple rows"
            );
        }
        return $rows[0] ?? null;
    }

    /**
     * Runs a query as a prepared statement and returns the values of the
     * column given in the select statement. If multiple columns are given, an error
     * is thrown.
     *
     * @param string $query  The SQL SELECT query to be run
     * @param array  $params Values to use for binding to prepared statement
     *
     * @throws DatabaseException if the query selected more than one column
     *
     * @return array Associative array of form rowID=>value containing all values
     *               for the only column of the select statement
     */
    function pselectCol(string $query, array $params)
    {
        $unprocessed = $this->pselect($query, $params);

        $result = array();
        foreach ($unprocessed as $k=>$row) {
            $colNumber = count($row);
            if ($colNumber !== 1) {
                throw new DatabaseException(
                    "The pselectCol() function expects only one column in the 
                    SELECT clause of the query, $colNumber were passed.",
                    $query
                );
            }
            // Note: reset() rewinds array's internal pointer to the first element
            // and returns the value of the first array element.
            $result[$k] =reset($row);
        }
        return $result;
    }

    /**
     * Runs an SQL select statement as a prepared query and re-indexes
     * the results using the given unique non-nullable key in the same
     * format as the pselectCol() function.
     *
     * @param string $query     The SQL SELECT query to be run
     * @param array  $params    Values to use for binding to the prepared statement
     * @param string $uniqueKey Key to use when re-indexing, this key must be a
     *                          single column, must be unique and must not be
     *                          nullable
     *
     * @throws LorisException     If the supplied key is empty or null
     * @throws DatabaseException  If the key is not part of the query itself or
     *                            if there are not exactly 2 columns selected
     * @throws DatabaseException  If the key is not unique within the resulting set
     *
     * @return array Associative array of form uniqueKey=>value containing all
     *               value for the non-uniqueKey element of the select statement
     */
    function pselectColWithIndexKey(
        string $query,
        array $params,
        string $uniqueKey
    ) {

        if (is_null($uniqueKey) || empty($uniqueKey)) {
            throw new LorisException(
                "The pselectColWithIndexKey() function expects the uniqueKey
                 parameter to not be null or empty. If re-indexing on the primary 
                 key is not necessary please use the pselectCol() function instead."
            );
        }

        $result = $this->pselect($query, $params);

        if (empty($result)) {
            return $result;
        }

        $filteredResult = array();
        // re-order the return array
        foreach ($result as $row) {
            $colNumber = count($row);
            // Check first that the row contains the primary key supplied
            if (!array_key_exists($uniqueKey, $row) || $colNumber !== 2) {
                throw new DatabaseException(
                    "The query supplied to pselectColWithIndexKey() should only 
                    contain the unique key and one other column in the SELECT 
                    clause. Make sure to supply the appropriate key in the SELECT 
                    statement to match the supplied parameter of this function.",
                    $query
                );
            }

            // Check that the primary key is indeed unique to avoid overriding data
            // in the result array
            if (isset($filteredResult[$row[$uniqueKey]])) {
                throw new DatabaseException(
                    "The uniqueKey supplied to pselectColWithIndexKey() does not 
                    appear to be unique or is nullable. This function expects the 
                    key to be both UNIQUE and NOT NULL.",
                    $query
                );
            }

            // Store the value of the key for this specific row then unset that
            // value from the $row array so that the only element remaining is
            // the column desired and its value for this row
            $uniqueKeyValue = $row[$uniqueKey];
            unset($row[$uniqueKey]);

            // Note: reset() rewinds array's internal pointer to the first element
            // and returns the value of the first array element, in this case the
            // desired column value
            $filteredResult[$uniqueKeyValue] = reset($row);
        }

        return $filteredResult;
    }

    /**
     * Runs a query as a prepared statement and returns the value of the first
     * column of the first row.
     *
     * FIXME This function does not have a return type declaration because
     * the function pselectRow will sometimes return a string and sometimes
     * return an array. This behaviour should be made consistent (i.e. perhaps
     * returning an array of a single element) so that we can properly enforce
     * types.
     *
     * @param string $query  The SQL statement to run
     * @param array  $params Values to use for binding in the prepared statement
     *
     * @return mixed The value returned by the query: array, string, or false.
     */
    function pselectOne(string $query, array $params)
    {
        $result = $this->pselectRow($query, $params);
        if (is_array($result) && count($result)) {
            $result = array_values($result)[0];
        }
        return $result;
    }

    /**
     * Implodes a hash including the keys (unlike php's implode)
     *
     * Sets each hash element into the format key='value', and then
     * implodes the resultant array with the specified glue
     *
     * @param string $glue      The glue to pass to php's implode function
     * @param array  $dataArray The array with keys to implode
     * @param string $clause    The type of clause set_|where_
     *
     * @return string
     */
    function _implodeWithKeys(
        string $glue,
        array $dataArray,
        string $clause = 'set_'
    ): string {
        $output = array();
        if (!is_array($dataArray) || count($dataArray)==0) {
            return '';
        }

        foreach ($dataArray as $key => $item ) {
            if (is_null($item)) {
                $output[] = $clause == 'where_'
                ? "`$key` IS NULL" : "`$key` = NULL";
            } else {
                $item     = $this->quote((string) $item);
                $output[] = "`$key`=$item";
            }
        }
        return implode($glue, $output);
    }

    /**
     * Helper function to generate the string for the WHERE part of an update
     * or delete query. Generates the string in a prepared statement format.
     *
     * @param string     $glue      The glue used to combine parts of the
     *                          dataArray (ie " AND ").
     * @param array      $dataArray The array representing the WHERE condition
     *                          to be glued together into a string.
     * @param array|null $exec_vals The values which are being bound to the
     *                          query. Used to generate the prepared variable
     *                          name.
     * @param string     $prefix    A prefix to apply to prepared variable
     *                          names.
     *
     * @return string A string that can be used to generate a prepared statement
     *                with appropriate variable names generated for data
     *                binding.
     */
    private function _implodeAsPrepared(
        string $glue,
        array $dataArray,
        ?array &$exec_vals = null,
        string $prefix = ''
    ): string {

        if (!is_array($dataArray) || count($dataArray)==0) {
            return '';
        }

        $output = array();
        foreach ($dataArray as $key => $item ) {
            $varname = str_replace("%", "_percent_", $key);
            if (is_null($item)) {
                $output[] = $prefix == 'where_'
                ? "`$key` IS NULL" : "`$key` = NULL";
            } else {
                $output[] = "`$key`=:$prefix$varname";
                if ($exec_vals !== null) {
                    $exec_vals["$prefix$varname"] = $item;
                }
            }
        }
        return implode($glue, $output);
    }

    /**
     * Quote a variable to make it safe
     *
     * @param string $value An unsafe string
     *
     * @return string The value appropriately quoted/escaped
     */
    function quote(string $value): string
    {
        return $this->_PDO->quote($value);
    }

    /**
     * Saves changes made to database records
     *
     * Determines the difference between the old values and the new,
     * then saves a reference to that change
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     * @param string $where the selection filter, joined as a boolean and
     * @param string $type  The type of change being tracked (*I*nsert,
     *                      *U*pdate or *D*elete)
     *
     * @return void As a side-effect populates history table
     */
    protected function trackChanges(
        string $table,
        array $set,
        string $where,
        string $type = 'U'
    ): void {

        // Tracking changes on the history table would result in an
        // infinite loop
        if (!$this->_trackChanges || $table == 'history') {
            return;
        }

        // get the table description
        $description = $this->pselect("SHOW INDEX FROM $table", array());

        // find the primary key columns
        $primaryKeys = array();
        if (is_array($description)) {
            foreach ($description AS $column) {
                if ($column['Key_name']=='PRIMARY') {
                    $primaryKeys[] = $column['Column_name'];
                }
            }
        }

        // get the user id
        if (isset($_SESSION['State'])) {
            $userID = $_SESSION['State']->getUsername();
        }

        if (empty($userID)) {
            $userID = getenv('USER');
        }
        if (empty($userID)) {
            $userID = 'unknown';
        }

        $prim_keys = join(",", $primaryKeys);
        $this->_preparedStoreHistory->bindParam(":primaryKeys", $prim_keys);
        $this->_preparedStoreHistory->bindParam(":histtable", $table);
        $this->_preparedStoreHistory->bindParam(":userID", $userID);
        $this->_preparedStoreHistory->bindParam(":type", $type);
        if ($type == 'I') {
            $this->_preparedStoreHistory->bindValue(":oldval", null);
            // Don't need to compare against anything, just insert into the history
            // if it's an insert
            foreach (array_keys($set) AS $column) {
                $this->_preparedStoreHistory->bindParam(":histcolumn", $column);
                // find the primary key values
                $primaryValues = array();

                $usePDOID = false;
                foreach ($primaryKeys AS $key) {
                    if (!isset($set[$key])) {
                        $usePDOID = true;
                        break;
                    }
                    $primaryValues[] = $set[$key];
                }

                if ($usePDOID) {
                    if (is_array($this->lastInsertID)) {
                        $primaryValues = $this->lastInsertID;
                    } else {
                        $primaryValues = array($this->lastInsertID);
                    }
                }

                $prim_vals = join(",", $primaryValues);
                $this->_preparedStoreHistory->bindParam(":newval", $set[$column]);
                $this->_preparedStoreHistory->bindParam(":primaryVals", $prim_vals);
                $this->_preparedStoreHistory->execute();
            }
        } else if ($type == 'U' || $type == 'D') {
            // construct the select query
            $query = "SELECT * FROM $table WHERE $where";

            // select the database data
            $oldRows = $this->pselect($query, array());

            // track history for all affected rows
            foreach ($oldRows AS $oldRow) {
                // compute the difference between the two arrays
                if ($type == 'D') {
                    $delta = $oldRow;
                    $set   = array();
                } else {
                    $delta = array_diff_assoc($set, $oldRow);
                }

                // find the primary key values
                $primaryValues = array();
                foreach ($primaryKeys AS $key) {
                    $primaryValues[] = $oldRow[$key];
                }

                $prim_Vals = join(",", $primaryValues);
                $this->_preparedStoreHistory->bindParam(":primaryVals", $prim_Vals);
                // for every changed column
                foreach (array_keys($delta) AS $column) {
                    $this->_preparedStoreHistory->bindParam(":histcolumn", $column);
                    $this->_preparedStoreHistory->bindParam(
                        ":newval",
                        $set[$column]
                    );
                    $this->_preparedStoreHistory->bindParam(
                        ":oldval",
                        $oldRow[$column]
                    );
                    $this->_preparedStoreHistory->execute();
                } // end foreach delta column
            } // end foreach oldRows
        }
    }

    /**
     * Print a query if showDatabaseQueries defined in config file
     *
     * @param string $query  The query to replace
     * @param array  $params The prepared statement parameters used for this query
     *                       They will be replaced in the print statement so that the
     *                       user knows what parameters were used.
     *
     * @return void As a side-effect, prints to the screen if config option is
     *              enabled
     */
    function _printQuery(string $query, array $params = array()): void
    {
        if (!$this->_showQueries) {
            return;
        }
        if ($params) {
            $query = str_replace(array_keys($params), array_values($params), $query);
        }
        print "$this->_databaseName:"
            . date("j-M-Y G:i:s", time())
            .": $query<br>\n";
    }

    /**
     * This function fakes the data in a table for testing purposes.
     * It replaces the existing table with a temporary table for the
     * session, and then inserts the data passed into the temporary
     * table. This should allow people to write more robust data
     * dependant unit tests that depend on the data in the database
     * without mocking every single query that needs to be used in
     * that test.
     *
     * @param string $tableName The table name to fake
     * @param array  $rowData   An array of data to be inserted into
     *                          the fake table.
     *
     * @return void
     */
    function setFakeTableData(string $tableName, array $rowData): void
    {
        $originalTableQuery = $this->_PDO->query("SHOW CREATE TABLE $tableName");

        if ($originalTableQuery->execute()) {
            $createRslt = $originalTableQuery->fetchAll();
            $createStmt = $createRslt[0]['Create Table'];

            $createStmt = preg_replace(
                "/CREATE TABLE/",
                "CREATE TEMPORARY TABLE",
                $createStmt
            );
            $createStmt = preg_replace(
                "/(\s*)(CONSTRAINT)(.*)(,*)(\s*)/",
                "$4",
                $createStmt
            );
            $createStmt = preg_replace(
                "/,(\s*)(\))/",
                ")",
                $createStmt
            );

            $this->run($createStmt);

            foreach ($rowData as $row) {
                $this->unsafeinsert($tableName, $row);
            }
        } else {
            throw new DatabaseException(
                "Could not retrieve schema of table $tableName"
            );
        };
    }

    /**
     * Checks to see if a table exists in the Database
     *
     * @param string $test_name The table to check for.
     *
     * @return boolean true if the table exists
     */
    function tableExists(string $test_name): bool
    {
        $config   =& NDB_Config::singleton();
        $database = $config->getSetting('database');
        $query    = "SELECT table_name
            FROM information_schema.tables
            WHERE TABLE_SCHEMA=:db
            AND table_name=:tn";

        $result = $this->pselectOne(
            $query,
            array(
             'tn' => $test_name,
             'db' => $database['database'],
            )
        );

        if (!empty($result)) {
            return true;
        }
        return false;
    }

    /**
     * Checks to see if a table contains a specified column
     *
     * @param string $test_name The table to check for a column.
     * @param string $column    The column name to check the table for.
     *
     * @return boolean true if the table has a the given column
     */
    function columnExists(string $test_name, string $column): bool
    {
        $config   =& NDB_Config::singleton();
        $database = $config->getSetting('database');
        $query    = "SELECT DISTINCT table_name
            FROM information_schema.columns
            WHERE table_name = :tn
            AND COLUMN_NAME = :cn
            AND TABLE_SCHEMA = :db";
        $effected = $this->pselectOne(
            $query,
            array(
             'tn' => $test_name,
             'cn' => $column,
             'db' => $database['database'],
            )
        );
        if ($effected) {
            return true;
        }
        return false;
    }

    /**
     * Escapes a string properly for mysql and appends and prepends backticks.
     * Any backticks you append or prepend will be escaped.
     *
     * @param string $tableName The column or table name that needs to be escaped
     *
     * @return string surrounded by backticks and with special characters escaped.
     */
    function escape(string $tableName): string
    {
        //with help from
        // http://php.net/manual/en/function.mysql-real-escape-string.php
        if (!empty($tableName) && is_string($tableName)) {
            $stringWithEscapedChars = str_replace(
                array(
                 '\\',
                 "\0",
                 "\n",
                 "\r",
                 "'",
                 '"',
                 "\x1a",
                 "`",
                ),
                array(
                 '\\\\',
                 '\\0',
                 '\\n',
                 '\\r',
                 "\\'",
                 '\\"',
                 '\\Z',
                 "\\`",
                ),
                $tableName
            );
            $fullyEscapedString     = "`".$stringWithEscapedChars."`";
            return $fullyEscapedString;
        } else {
            return $tableName;
        }
    }

    /**
     * Checks if we're in a transaction
     *
     * @return bool `true`, if in transaction
     * @throws DatabaseException
     */
    public function inTransaction(): bool
    {
        return $this->_PDO->inTransaction();
    }

    /**
     * Attempts to begin a transaction
     *
     * @return bool `true`, on success
     * @throws DatabaseException
     */
    public function beginTransaction(): bool
    {
        if ($this->inTransaction()) {
            throw new DatabaseException(
                "There is already a database transaction in progress; "
                . "rollBack() or commit() the current transaction first"
            );
        }
        try {
            return $this->_PDO->beginTransaction();
        } catch (PDOException $ex) {
            //Probably because the driver doesn't support transactions
            throw new DatabaseException(
                $ex->getMessage()
            );
        }
    }

    /**
     * Attempts to roll back a transaction
     *
     * @return bool `true`, on success
     * @throws DatabaseException
     */
    public function rollBack(): bool
    {
        if (!$this->inTransaction()) {
            throw new DatabaseException(
                "Cannot rollBack() when not in a transaction"
            );
        }
        try {
            return $this->_PDO->rollBack();
        } catch (PDOException $ex) {
            throw new DatabaseException(
                $ex->getMessage()
            );
        }
    }

    /**
     * Attempts to commit a transaction
     *
     * @return bool `true`, on success
     * @throws DatabaseException
     */
    public function commit(): bool
    {
        if (!$this->inTransaction()) {
            throw new DatabaseException(
                "Cannot commit() when not in a transaction"
            );
        }
        try {
            return $this->_PDO->commit();
        } catch (PDOException $ex) {
            throw new DatabaseException(
                $ex->getMessage()
            );
        }
    }
}

