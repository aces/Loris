<?php
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
     * Integer number of rows affected by the last replace/update/delete/insert
     *
     * @access public
     */
    var $affected;

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
     * and also connects to the database if necessary
     *
     * @param string  $database     the database to select
     * @param string  $username     the username with which to log into
     *                              the database server
     * @param string  $password     the password that matches the username
     * @param string  $host         the name of the database server
     * @param boolean $trackChanges boolean determining if changes should be
     *                              logged to the history table
     *
     * @return Database
     * @throws DatabaseException
     * @access public
     */
    static function &singleton(
        $database=null,
        $username=null,
        $password=null,
        $host=null,
        $trackChanges=true
    ) {
        static $connections = array();

        // if no arguments, try to get the first connection or choke
        if (is_null($database)
            && is_null($username)
            && is_null($password)
            && is_null($host)
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
                $ok = $connections[$connection]->connect(
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
     * Creates the connection to the database
     *
     * Creates the connection to the database server and selects the
     * desired database.  the connection is stored in the Database
     * object, and should never be accessed directly by the user.
     *
     * @param string  $database     the database to select
     * @param string  $username     the username with which to log into
     *                              the database server
     * @param string  $password     the password that matches the username
     * @param string  $host         the name of the database server
     * @param boolean $trackChanges whether to use the trackChanges mechanism on
     *                              this connection (defaults to true)
     *
     * @return none
     * @access public
     */
    function connect($database, $username, $password, $host, $trackChanges = true)
    {
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

        $this->_PDO = new PDO(
            "mysql:host=$host;dbname=$database;charset=UTF8",
            $username,
            $password
        );
        $this->_PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

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
    }

    /**
     * Determines whether the database connection is alive
     *
     * @return boolean
     * @access public
     */
    function isConnected()
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
     * @return none
     */
    public function insert($table, $set)
    {
        return $this->_realinsert($table, $set, true);
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
     * @return none
     */
    public function unsafeinsert($table, $set)
    {
        return $this->_realinsert($table, $set, false);
    }

    /**
     * Escapes the HTML from an array that is about to be inserted into the database
     *
     * @param array $set The array to be inserted as a new row
     *
     * @return A copy of $set with the HTML characters escaped
     */
    private function _HTMLEscapeArray($set)
    {
        $retVal = array();
        foreach ($set as $key => $val) {
            $retVal[$key] = is_null($val) ? null : htmlspecialchars($val);
        }
        return $retVal;
    }

    /**
     * Inserts a row
     *
     * Inserts a single row into the specified table, containing the values specified
     *
     * @param string $table      the table into which to insert the row
     * @param array  $set        the values with which to fill the new row
     * @param bool   $autoescape determines whether the values to be set should
     *                           automatically have the html escaped
     *
     * @return none
     */
    private function _realinsert($table, $set, $autoescape = true)
    {
        if ($autoescape === true) {
            $set = $this->_HTMLEscapeArray($set);
        }
        $query  = "INSERT INTO $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set);

        $prepQ       = "INSERT INTO $table SET ";
        $exec_params = array();
        $prepQ      .= $this->_implodeAsPrepared(",", $set, $exec_params);

        if (DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
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

        $this->affected     = $prep->rowCount();
        $this->lastInsertID = $this->_PDO->lastInsertId();

        // Track changes must be called after last insertId is set
        $err = $this->trackChanges($table, $set, '2=1', 'I');
        return true;
    }

    /**
     * Get last insert ID.
     * Will return a valid insert ID only if called after Database::insert() method.
     *
     * @return string ID of the last inserted row
     */
    public function getLastInsertId()
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
     * @return none
     * @access public
     */
    function replace($table, $set)
    {
        $query  = "REPLACE INTO $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set);

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
        } elseif ($result === 0) {
            $this->insert('empty_queries', array('query' => $query));
        }

        $this->affected = $result;
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
     * @return none
     */
    public function update($table, $set, $i_where)
    {
        return $this->_realupdate($table, $set, $i_where, true);
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
     * @return none
     */
    public function unsafeupdate($table, $set, $i_where)
    {
        return $this->_realupdate($table, $set, $i_where, false);
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
     * @return none
     * @access public
     */
    private function _realupdate($table, $set, $i_where, $autoescape = true)
    {
        if ($autoescape === true) {
            $set = $this->_HTMLEscapeArray($set);
        }
        /* This is still here to print the easily readable version on
         * the top of the page when showDatabaseQueries is on. It isn't
         * actually executed. */
        $query  = "UPDATE $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set);
        $query .= " WHERE ";
        $where  = $this->_implodeWithKeys(' AND ', $i_where);

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
            return;
        }

        if (preg_match("/=NULL/", $where)) {
            throw new DatabaseException(
                "NULL values not allowed in a WHERE structure.",
                $prepQ
            );
        }

        $err = $this->trackChanges($table, $set, $where);
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
        $this->affected = $prep->rowCount();
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
     * @return none
     * @access public
     */
    function delete($table, $where)
    {
        $query  = "DELETE FROM $table WHERE ";
        $where  = $this->_implodeWithKeys(' AND ', $where);
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
        $err = $this->trackChanges($table, array(), $where, 'D');

        $this->_printQuery($query);
        $result = $this->_PDO->exec($query);
        if ($result === false) {
            throw new DatabaseException(
                "Database DELETE did not execute successfully."
                . print_r($this->_PDO->errorInfo(), true),
                $query,
                $where
            );
        } elseif ($result === 0) {
            $this->insert('empty_queries', array('query' => $query));
        }

        $this->affected = $result;
    }

    /**
     * Selects data from the database
     *
     * Selects any amount of data from the database and stores the
     * result into the $result array (accepted by reference - it will
     * be overwritten so make sure it's empty or garbage before
     * passing it in...)
     *
     * @param string $query  the SQL string which defines the SELECT query.
     * @param array  $result an array into which the results of the select
     *                       will be stored - this array gets overwritten completely
     *
     * @return     none
     * @access     public
     * @deprecated Use pselect wrappers instead
     */
    function select($query, &$result)
    {
        error_log(
            "LORIS's Database::select() wrappers are deprecated and will be "
            . "removed in a future version of LORIS. Please use prepared statements "
            . " in the Database::pselect() variety instead."
        );
        $result = array();

        if (strpos(strtoupper($query), 'SELECT') !== 0
            && strpos(strtoupper($query), 'SHOW') !== 0
            && strpos(strtoupper($query), 'DESCRIBE') !== 0
        ) {
            throw new DatabaseException(
                "Only SELECT statements can be run with Database::select().",
                $query
            );
        }

        try {
            $this->_printQuery($query);
            $stmt = $this->_PDO->query($query);
            if ($stmt) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                // This will be caught directly below
                throw new Exception("Error");
            }
            return $result;
        } catch(Exception $e) {
            throw new DatabaseException("Invalid SELECT statement", $query);
        }
    }

    /**
     * Selects a single row from the database
     *
     * Selects a single row from the database and stores the
     * result into the $result array (accepted by reference - it will
     * be overwritten so make sure it's empty or garbage before
     * passing it in...)
     *
     * *** This should not be used as it does not support prepared statements.
     * *** It is left here for legacy reasons/instruments
     *
     * @param string $query  the SQL string which defines the SELECT query.
     * @param array  $result an array into which the results of the select will
     *                       be stored - this array gets overwritten completely
     *
     * @return     none
     * @access     public
     * @deprecated Use pselect wrappers instead
     */
    function selectRow($query, &$result)
    {
        $this->select($query, $result);
        if (is_array($result) && isset($result[0])) {
            $result = $result[0];
        }
    }

    /**
     * Selects a single value from the database
     *
     * Selects a single value from the database and directly return the value.
     *
     * *** This should not be used as it does not support prepared statements.
     * *** It is left here for legacy reasons/instruments
     *
     * @param string $query The SQL string which defines the SELECT query.
     *
     * @return     string
     * @access     public
     * @deprecated Use pselect wrappers instead
     */
    function selectOne($query)
    {
        $result = null;
        $this->select($query, $result);
        if (is_array($result) && count($result)) {
            list(,$result) = each($result[0]);
        }
        return $result;
    }

    /**
     * Runs a custom query that can't be handled by other database wrappers.
     *
     * @param string $query The SQL query to run
     *
     * @return None As a side-effect updates affected and lastInsertID
     *              if applicable
     */
    function run($query)
    {
        $this->_printQuery($query);
        $result = $this->_PDO->exec($query);

        if ($result === false) {
            throw new DatabaseException(
                "Could not run query $query"
                . print_r($this->_PDO->errorInfo(), true)
            );
        } elseif ($result === 0) {
            $this->insert('empty_queries', array('query' => $query));
        }

        $this->affected = $result;

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
    function execute($prepared, $params, $options = array())
    {
        $execRun = $prepared->execute($params);
        if ($execRun === false) {
            $err = $prepared->errorInfo();
            throw new DatabaseException($err[2], $prepared->queryString, $params);
        }

        if (!empty($options['nofetch']) && $options['nofetch'] == true) {
            return;
        }

        $rows = $prepared->fetchAll(PDO::FETCH_ASSOC);
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
    function pselect($query, $params)
    {
        $this->_printQuery($query, $params);
        $stmt   = $this->prepare($query);
        $result = $this->execute($stmt, $params);
        return $result;
    }

    /**
     * Runs a query as a prepared statement and returns the first row as an
     * associative array. Automatically adds a limit clause to the query being
     * run for efficiency.
     *
     * @param string $query  The SQL SELECT query to be run
     * @param array  $params Values to use for binding to prepared statement
     *
     * @return array Associative array of form ColumnName => Value for each column
     *               in the first row of the query
     */
    function pselectRow($query, $params)
    {
        $rows = $this->pselect($query . " LIMIT 1", $params);
        if (isset($rows[0])) {
            return $rows[0];
        }
        return $rows;
    }

    /**
     * Runs a query as a prepared statement and returns the value of the first
     * column of the first row
     *
     * @param string $query  The SQL statement to run
     * @param array  $params Values to use for binding in the prepared statement
     *
     * @return mixed The value returned by the query.
     */
    function pselectOne($query, $params)
    {
        $result = $this->pselectRow($query, $params);
        if (is_array($result) && count($result)) {

            list(,$result) = each($result);
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
     *
     * @return string the string containing the imploded array
     * @access private
     */
    function _implodeWithKeys($glue, $dataArray)
    {
        $output = array();
        if (!is_array($dataArray) || count($dataArray)==0) {
            return '';
        }

        foreach ($dataArray as $key => $item ) {
            if ($item===null || $item==='') {
                $output[] = "`$key`=NULL";
            } else {
                $item     = $this->quote($item);
                $output[] = "`$key`=$item";
            }
        }
        return implode($glue, $output);
    }

    /**
     * Helper function to generate the string for the WHERE part of an update
     * or delete query. Generates the string in a prepared statement format.
     *
     * @param string $glue      The glue used to combine parts of the dataArray
     *                          (ie " AND ")
     * @param array  $dataArray The array representing the WHERE condition to be
     *                          glued together into a string
     * @param array  $exec_vals The values which are being bound to the query. Used
     *                          to generate the prepared variable name.
     * @param string $prefix    A prefix to apply to prepared variable names.
     *
     * @return string A string that can be used to generate a prepared statement with
     *                appropriate variable names generated for data binding.
     */
    private function _implodeAsPrepared(
        $glue, $dataArray, &$exec_vals = null, $prefix=''
    ) {
        if (!is_array($dataArray) || count($dataArray)==0) {
            return '';
        }

        $output = array();
        foreach ($dataArray as $key => $item ) {
            $varname  = str_replace("%", "_percent_", $key);
            $output[] = "`$key`=:$prefix$varname";
            if ($exec_vals !== null) {
                $exec_vals["$prefix$varname"] = $item;
            }

        }
        return implode($glue, $output);
    }

    /**
     * Quote a variable to make it safe
     *
     * @param string $value An unsafe string
     *
     * @return The value appropriately quoted/escaped
     */
    function quote($value)
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
     * @param array  $where the selection filter, joined as a boolean and
     * @param char   $type  The type of change being tracked (*I*nsert,
     *                      *U*pdate or *D*elete)
     *
     * @return none As a side-effect populates history table
     */
    protected function trackChanges($table, $set, $where, $type='U')
    {
        // Tracking changes on the history table would result in an
        // infinite loop
        if (!$this->_trackChanges || $table == 'history') {
            return;
        }

        // get the table description
        $description = $this->pselect("SHOW INDEX FROM $table", array());

        // find the primary key columns
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
                $history = $this->_preparedStoreHistory->execute();
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
     * @return null As a side-effect, prints to the screen if config option is
     *              enabled
     */
    function _printQuery($query, $params=null)
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
     * Returns the number of rows affected by last statement
     *
     * @return integer The number of rows affected
     */
    function getAffected()
    {
        return $this->affected;
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
     * @return none
     */
    function setFakeTableData($tableName, $rowData)
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
     * Database class no longer extends PEAR
     *
     * @param mixed $data    The variable to check
     * @param mixed $msgcode Additional error message / error code to check
     *
     * @return     none
     * @deprecated Database class no longer extends PEAR
     */
    function isError($data, $msgcode)
    {
        throw new DatabaseException(
            "Database class no longer extends PEAR"
        );
    }
    /**
     * Checks to see if a table exists in the Database
     *
     * @param string $test_name The table to check for.
     *
     * @return boolean true if the table exists
     */
    function tableExists($test_name)
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
    function columnExists($test_name,$column)
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
             'db' => $database,
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
    function escape($tableName)
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

}
?>
