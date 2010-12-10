<?
require_once "PEAR.php";
define("DEBUG", false);
/**
 * Database abstraction layer presents a unified interface to database
 * connectivity.  Instantiate one object instance per database
 * connection.  
 *
 * Throughout the class, all input arrays follow the same structure:
 * $array['column_name'] = 'value'.
 * @package main
 * @access public
 * @todo run _trackChanges() from insert and delete...
 * @version $Id: Database.class.inc,v 3.18 2006/04/18 17:14:12 jharlap Exp $
 */
class Database extends PEAR
{
    /**
     * the database handle, created by the connect() method
     *
     * @access private
     */
    var $_databaseHandle = null;

    /**
     * integer number of rows affected by the last replace/update/delete/insert
     *
     * @access public
     */
    var $affected;

    /**
     * the auto_increment ID value of the last insert statement, as designated by LAST_INSERT_ID
     *
     * @access public
     */
    var $lastInsertID;
    
    var $_showQueries = false;

    var $_trackChanges = true;

    /**
     * singleton design pattern implementation - creates the object
     * and also connects to the database if necessary
     *
     * @param string $database the database to select
     * @param string $username the username with which to log into the database server
     * @param string $password the password that matches the username
     * @param string $host     the name of the database server - possibly localhost
     * @return object
     * @access public
     */
    function &singleton($database=null, $username=null, $password=null, $host=null)
    {
        static $connections = array();

        // if no arguments, try to get the first connection or choke
        if(is_null($database) && is_null($username) && is_null($password) && is_null($host)) {
            if(!empty($connections)) {
                reset($connections);
                return current($connections);
            } else {
                return PEAR::raiseError('No database connection exists');
            }
        } else {
            // name the connection
            $connection = md5($database.$host.$username.$password);

            // create the connection if none exists
            if(empty($connections[$connection])) {
                $connections[$connection] = new Database;
                $ok = $connections[$connection]->connect($database, $username, $password, $host);
                if($connections[$connection]->isError($ok)) {
                    unset($connections[$connection]);
                    return PEAR::raiseError('Could not connect to database: '.$ok->getMessage());
                }
            }

            // return the connection
            return $connections[$connection];
        }
    }

    /**
     * creates the connection to the database
     *
     * creates the connection to the database server and selects the
     * desired database.  the connection is stored in the Database
     * object, and should never be accessed directly by the user.
     *
     * @param string $database the database to select
     * @param string $username the username with which to log into the database server
     * @param string $password the password that matches the username
     * @param string $host     the name of the database server - possibly localhost
     * @param boolean $trackChanges   whether to use the trackChanges mechanism on this connection (defaults to true)
     * @return none
     * @access public
     */
    function connect($database, $username, $password, $host, $trackChanges = true)
    {
        $this->_trackChanges = $trackChanges;
        $this->_databaseName = $database;

        if(class_exists('NDB_Config')) {
            $config =& NDB_Config::singleton();
            $this->_showQueries = $config->getSetting('showDatabaseQueries');
        }
        
        $this->_databaseHandle = @mysql_connect($host, $username, $password, true);
        if(!$this->_databaseHandle) {
            return $this->raiseError(mysql_error());
        }

        $success = mysql_select_db($database);
        if(!$success) {
            return $this->raiseError(mysql_error());
        }
    }

    /**
     * determines whether the database connection is alive
     *
     * @return boolean
     * @access public
     */
    function isConnected()
    {
        // if we're using PHP 4.3.0 or greater, use mysql_ping,
        // otherwise just make sure we set the handle
        if(version_compare(phpversion(), "4.3.0", ">=")) {
            return mysql_ping($this->_databaseHandle);
        } else {
            return !is_null($this->_databaseHandle);
        }
    }

    /**
     * inserts a row
     *
     * inserts a single row into the specified table, containing the values specified
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     * @return none
     * @access public
     */
    function insert($table, $set)
    {
        $query = "INSERT INTO $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set);

        if(DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
        }

        $this->_printQuery($query);
        $qid = @mysql_query($query, $this->_databaseHandle);
        if(!$qid) {
            // query failed
            return $this->raiseError(mysql_error($this->_databaseHandle));
        }

        // query succeeded: set affected and success
        $this->affected = mysql_affected_rows($this->_databaseHandle);

        // set last insert id
        if($this->affected > 0) {
            $this->lastInsertID = mysql_insert_id($this->_databaseHandle);
        }
    }

    /**
     * replaces/inserts a row
     *
     * replaces into the table such if there already exists a row with
     * the same primary key it will be replaced by the new row
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     * @return none
     * @access public
     */
    function replace($table, $set) 
    {
        $query = "REPLACE INTO $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set);
        
        if(DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
        }

        $this->_printQuery($query);
        $qid = @mysql_query($query, $this->_databaseHandle);
        if(!$qid) {
            return $this->raiseError(mysql_error($this->_databaseHandle));
        }

        $this->affected = mysql_affected_rows($this->_databaseHandle);
    }

    /**
     * updates a row
     *
     * updates a single row in the specified table
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     * @param array  $where the selection filter, joined as a boolean and
     * @return none
     * @access public
     */
    function update($table, $set, $where)
    {
        $query = "UPDATE $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set);
        $query .= " WHERE ";
        $where = $this->_implodeWithKeys(' AND ', $where);

        if(DEBUG) {
            fwrite(STDERR, $query.$where."\n");
            return;
        }

        if(preg_match("/=NULL/", $where)) {
            return $this->raiseError("NULL values not allowed in a WHERE structure.");
        }

        $err = $this->_trackChanges($table, $set, $where);
        if($this->isError($err)) {
            return $err;
        }
        $this->_printQuery($query.$where);
        $qid = @mysql_query($query.$where, $this->_databaseHandle);
        if(!$qid) {
            return $this->raiseError(mysql_error($this->_databaseHandle));
        }

        $this->affected = mysql_affected_rows($this->_databaseHandle);
    }

    /**
     * deletes a row
     *
     * deletes a single row in the specified table
     *
     * @param string $table the table into which to insert the row
     * @param array  $where the selection filter, joined as a boolean and
     * @return none
     * @access public
     */
    function delete($table, $where)
    {
        $query = "DELETE FROM $table WHERE ";
        $query .= $this->_implodeWithKeys(' AND ', $where);

        if(DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
        }

        if(preg_match("/=NULL/", $query)) {
            return $this->raiseError("NULL values not allowed in a WHERE structure.");
        }

        $this->_printQuery($query);
        $qid = @mysql_query($query, $this->_databaseHandle);
        if(!$qid) {
            return $this->raiseError(mysql_error($this->_databaseHandle));
        }

        $this->affected = mysql_affected_rows($this->_databaseHandle);
    }

    /**
     * selects data from the database
     *
     * selects any amount of data from the database and stores the
     * result into the $result array (accepted by reference - it will
     * be overwritten so make sure it's empty or garbage before
     * passing it in...)
     *
     * @param string $query  the SQL string which defines the SELECT query.
     * @param array  $result an array into which the results of the select will be stored - this array gets overwritten completely
     * @return none
     * @access public
     */
    function select($query, &$result)
    {
        $result = array();

        if(strpos(strtoupper($query), 'SELECT') !== 0 && strpos(strtoupper($query), 'SHOW') !== 0 && strpos(strtoupper($query), 'DESCRIBE') !== 0) {
            $result = $this->raiseError("Only SELECT statements can be run with Database::select().  Query was '$query'");
            return;
        }

        $this->_printQuery($query);
        $qid = @mysql_query($query, $this->_databaseHandle);

        // invalid query, throw an error
        if(!$qid) {
            $result = $this->raiseError(mysql_error($this->_databaseHandle));
            return;
        }

        if(mysql_num_rows($qid) > 0) {
            while($row = mysql_fetch_array($qid, MYSQL_ASSOC)) {
                $result[] = $row;
            }
        }
        mysql_free_result($qid);
    }

    /**
     * selects a single row from the database
     *
     * selects a single row from the database and stores the
     * result into the $result array (accepted by reference - it will
     * be overwritten so make sure it's empty or garbage before
     * passing it in...)
     *
     * @param string $query  the SQL string which defines the SELECT query.
     * @param array  $result an array into which the results of the select will be stored - this array gets overwritten completely
     * @return none
     * @access public
     */
    function selectRow($query, &$result)
    {
        $this->select($query, $result);
        if(!$this->isError($result) && is_array($result)) {
            $result = $result[0];
        }
    }

    /**
     * selects a single value from the database
     *
     * selects a single value from the database
     *
     * @param string $query  the SQL string which defines the SELECT query.
     * @return string
     * @access public
     */
    function selectOne($query)
    {
        $result = null;
        $this->select($query, $result);
        if(!$this->isError($result) && is_array($result) && count($result)) {
            list(,$result) = each($result[0]);
        }
        return $result;
    }

    /**
     * runs a custom query
     *
     * @param string $query  the SQL query to run
     * @return none
     * @throws PEAR::Error
     * @access public
     */
    function run($query)
    {
        $this->_printQuery($query);
        $result = @mysql_query($query, $this->_databaseHandle);
        $this->affected = mysql_affected_rows($this->_databaseHandle);
        if($result === FALSE) {
            return $this->raiseError(mysql_error($this->_databaseHandle));
        }
    }

    /**
     * implodes a hash including the keys (unlike php's implode)
     *
     * sets each hash element into the format key='value', and then
     * implodes the resultant array with the specified glue
     *
     * @param string $glue   the glue to pass to php's implode function
     * @param array  $array  the array with keys to implode
     * @return string the string containing the imploded array
     * @access private
     */
    function _implodeWithKeys($glue, $dataArray) {
        $output = array();
        if(!is_array($dataArray) || count($dataArray)==0) return '';

        foreach( $dataArray as $key => $item )
            if($item===null || $item==='') {
                $output[] = "`$key`=NULL";
            } else {
                $item = mysql_escape_string($item);
                $output[] = "`$key`='$item'";
            }
        
        return implode($glue, $output);
    }

    /**
     * Quote a variable to make it safe
     */
    function quote($value)
    {
        // Stripslashes if we need to
        if (get_magic_quotes_gpc()) {
            $value = stripslashes($value);
        }
        
        // Quote it if it's not an integer
        if (!is_int($value)) {
            $value = "'" . mysql_real_escape_string($value) . "'";
        }
        
        return $value;
    }

    /**
     * saves changes made to database records
     *
     * determines the difference between the old values and the new,
     * then saves a reference to that change
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     * @param array  $where the selection filter, joined as a boolean and
     * @return none
     * @access private
     */
    function _trackChanges($table, $set, $where) {

        if(!$this->_trackChanges) return;

        // construct the select query
        $query = "SELECT * FROM $table WHERE $where";
        
        // select the database data
        $this->select($query, $oldRows);
        if($this->isError($oldRows)) {
            return $oldRows;
        }

        // get the table description
        $this->select("SHOW INDEX FROM $table", $description);
        if($this->isError($description)) {
            return $description;
        }
        
        // find the primary key columns
        foreach($description AS $column) {
            if($column['Key_name']=='PRIMARY') {
                $primaryKeys[] = $column['Column_name'];
            }
        }

        // get the user id
        if(isset($_SESSION['State'])) {
            $userID = $_SESSION['State']->getUsername();
        }

        if(empty($userID)) {
            $userID = $_ENV['USER'];
        }

	if(empty($userID)) {
	  $userID = 'unknown';
	}

        // track history for all affected rows
        foreach($oldRows AS $oldRow) {
        
            // compute the difference between the two arrays
            $delta = array_diff($set, $oldRow);
            

            // find the primary key values
            $primaryValues = array();
            foreach($primaryKeys AS $key) {
                $primaryValues[] = $oldRow[$key];
            }
            
            // for every changed column
            foreach(array_keys($delta) AS $column) {
                // insert a change record into the history table
                $err = $this->insert('history', 
                                     array('tbl'=>$table,
                                           'col'=>$column,
                                           'old'=>$oldRow[$column],
                                           'new'=>$set[$column],
                                           'primaryCols'=>join(',', $primaryKeys),
                                           'primaryVals'=>join(',', $primaryValues),
                                           'changeDate'=>null,
                                           'userID'=>$userID
                                           )
                                     );
                
                // make sure the insert was successful
                if($this->isError($err)) {
                    return $err;
                }
            } // end foreach delta column
        } // end foreach oldRows
    } // end function _trackChanges

    function _printQuery($query) {
        if(!$this->_showQueries) return;

        print "$this->_databaseName: $query<br>\n";
    }

    /**
     * returns the affected rows.
     * @return string
     * @access public 
     */
    function getAffected() {
        return $this->affected;
    }
}
?>