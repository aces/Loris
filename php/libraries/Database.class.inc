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
 * @version $Id: Database.class.inc,v 1.1 2010-07-08 18:31:10 samir Exp $
 */
class Database extends PEAR
{
    /**
     * the database handle, created by the connect() method
     *
     * @access private
     */
    var $_PDO = null;
    //var $_databaseHandle = null;

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

    var $_preparedStoreHistory;
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
    function &singleton($database=null, $username=null, $password=null, $host=null, $trackChanges=true)
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
            $connection = md5($database.$host.$username.$password.$trackChanges);

            // create the connection if none exists
            if(empty($connections[$connection])) {
                $connections[$connection] = new Database;
                $ok = $connections[$connection]->connect($database, $username, $password, $host,$trackChanges);
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
        
        $this->_PDO = new PDO("mysql:host=$host;dbname=$database", $username, $password);
        $this->_preparedStoreHistory = $this->_PDO->prepare("INSERT INTO history (tbl, col, new, old, primaryCols, primaryVals, userID, type) VALUES (:histtable, :histcolumn, :newval, :oldval, :primaryKeys, :primaryVals, :userID, :type)");
    }

    /**
     * determines whether the database connection is alive
     *
     * @return boolean
     * @access public
     */
    function isConnected()
    {
        try { 
            $this->_PDO->query("SELECT 'x'");
            return true;
        } catch(Exception $e) {
            return false;
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

        $prepQ = "INSERT INTO $table SET ";
        $exec_params = array();
        $prepQ .= $this->_implodeAsPrepared(",", $set, &$exec_params);

        if(DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
        }

        // There is no where clause for an insert, so add a fake
        // one.
        $err = $this->_trackChanges($table, $set, '2=1', 'I');
        if($this->isError($err)) {
            return $err;
        }

        $this->_printQuery($query);
        $prep = $this->_PDO->prepare($prepQ);
        $prep->execute($exec_params);
        $this->affected = $prep->rowCount(); 
        $this->lastInsertId = $this->_PDO->lastInsertId;
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
        $this->affected = $this->_PDO->exec($query);
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
    function update($table, $set, $i_where)
    {
        /* This is still here to print the easily readable version on the top of the page when showDatabaseQueries is on */
        $query = "UPDATE $table SET ";
        $query .= $this->_implodeWithKeys(', ', $set);
        $query .= " WHERE ";
        $where = $this->_implodeWithKeys(' AND ', $i_where);

        $exec_params = array();
        $prepQ = "UPDATE $table SET ";
        $prepQ .= $this->_implodeAsPrepared(",", $set, &$exec_params, 'set_');
        $prepQ .= " WHERE ";
        $prepQ .= $this->_implodeAsPrepared(" AND ", $i_where, &$exec_params, 'where_');
        
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

        $prep = $this->_PDO->prepare($prepQ);
        $prep->execute($exec_params);
        $this->affected = $prep->rowCount(); 
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
        $where = $this->_implodeWithKeys(' AND ', $where);
        $query .= $where;

        if(DEBUG) {
            fwrite(STDERR, $query."\n");
            return;
        }

        if(preg_match("/=NULL/", $query)) {
            return $this->raiseError("NULL values not allowed in a WHERE structure.");
        }

        // There is no set clause for a delete, so add a fake
        // one.
        $err = $this->_trackChanges($table, array(), $where, 'D');
        if($this->isError($err)) {
            return $err;
        }
    
        $this->_printQuery($query);
        $this->affected = $this->_PDO->exec($query.$where);
        /*
        $qid = @mysql_query($query, $this->_databaseHandle);
        if(!$qid) {
            return $this->raiseError(mysql_error($this->_databaseHandle));
        }

        $this->affected = mysql_affected_rows($this->_databaseHandle);
        */
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
        //trigger_error('$DB->select is going to be deprecated in favour of pselect instead', E_USER_DEPRECATED);
        $result = array();

        if(strpos(strtoupper($query), 'SELECT') !== 0 && strpos(strtoupper($query), 'SHOW') !== 0 && strpos(strtoupper($query), 'DESCRIBE') !== 0) {
            $result = $this->raiseError("Only SELECT statements can be run with Database::select().  Query was '$query'");
            return;
        }
        

        try {
            $this->_printQuery($query);
            $stmt = $this->_PDO->query($query);
            if($stmt) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                // This will be caught directly below
                throw new Exception("Error");
            }
            return $result;
        } catch(Exception $e) {
            $result = $this->raiseError("Invalid SELECT statement, $query");
            return $result;
        }
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
        $this->affected = $this->_PDO->exec($query);
        $this->lastInsertId = $this->_PDO->lastInsertId;
    }

    function prepare($query) {
        return $this->_PDO->prepare($query);
    }
    function execute($prepared, $params) {
        $execRun = $prepared->execute($params);
        $rows = $prepared->fetchAll(PDO::FETCH_ASSOC);
        return $rows;
    }
    /** Prepared select.
     *  prepares the statement query, then executes it with the parameters
     *  and returns the rows.
     */
    function pselect($query, $params) {
        $stmt = $this->prepare($query);
        return $this->execute($stmt, $params);
    }

    function pselectRow($query, $params) {
        $rows = $this->pselect($query . " LIMIT 1", $params);
        return $rows[0];
    }
    function pselectOne($query, $params) {
        $result = $this->pselectRow($query, $params);
        if(!$this->isError($result) && is_array($result) && count($result)) {

            list(,$result) = each($result);
        }
        return $result;
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

    function _implodeAsPrepared($glue, $dataArray, &$exec_vals = NULL, $prefix='') {

        if(!is_array($dataArray) || count($dataArray)==0) return '';
        $output = array();
        foreach( $dataArray as $key => $item ) {
            $varname= str_replace("%", "_percent_", $key);
            $output[] = "`$key`=:$prefix$varname";
            if($exec_vals !== NULL) {
                $exec_vals["$prefix$varname"] = $item;
            }

        }
        return implode($glue, $output);


    }
    /**
     * Quote a variable to make it safe
     */
    function quote($value)
    {
        return $this->_PDO->quote($value);
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
    function _trackChanges($table, $set, $where, $type='U') {
        // Tracking changes on the history table would result in an
        // infinite loop
        if(!$this->_trackChanges || $table == 'history') return;

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
        $this->_preparedStoreHistory->bindParam(":primaryKeys", join(",", $primaryKeys));
        $this->_preparedStoreHistory->bindParam(":histtable", $table);
        $this->_preparedStoreHistory->bindParam(":userID", $userID);
        $this->_preparedStoreHistory->bindParam(":type", $type);
        if($type == 'I') 
        {
            $this->_preparedStoreHistory->bindValue(":oldval", NULL);
            // Don't need to compare against anything, just insert into the history if it's an insert
            foreach(array_keys($set) AS $column) {
                $this->_preparedStoreHistory->bindParam(":histcolumn", $column);
                // find the primary key values
                $primaryValues = array();
                foreach($primaryKeys AS $key) {
                    $primaryValues[] = $set[$key];
                }

                $this->_preparedStoreHistory->bindParam(":newval", $set[$column]);
                $this->_preparedStoreHistory->bindParam(":primaryVals", join(",", $primaryValues));
                $this->_preparedStoreHistory->execute();
            }
        }
        else if($type == 'U' || $type == 'D')
        {
            // construct the select query
            $query = "SELECT * FROM $table WHERE $where";
        
            // select the database data
            $this->select($query, $oldRows);
            if($this->isError($oldRows)) {
                return $oldRows;
            }

            // track history for all affected rows
            foreach($oldRows AS $oldRow) {
                // compute the difference between the two arrays
                if($type == 'D') {
                    $delta = $oldRow;
                    $set = array();
                } else  {
                    $delta = array_diff_assoc($set, $oldRow);
                }
            
                // find the primary key values
                $primaryValues = array();
                foreach($primaryKeys AS $key) {
                    $primaryValues[] = $oldRow[$key];
                }
                $this->_preparedStoreHistory->bindParam(":primaryVals", join(",", $primaryValues));
                // for every changed column
                 foreach(array_keys($delta) AS $column) {
                    $this->_preparedStoreHistory->bindParam(":histcolumn", $column);
                    $this->_preparedStoreHistory->bindParam(":newval", $set[$column]);
                    $this->_preparedStoreHistory->bindParam(":oldval", $oldRow[$column]);
                    $this->_preparedStoreHistory->execute();
                } // end foreach delta column
            } // end foreach oldRows
        }
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
