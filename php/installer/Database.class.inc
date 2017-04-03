<?php
/**
 * The Installer Database class is like the LORIS database class, except it
 * at the time of the installer the config.xml doesn't exist, so it can't
 * connect using the connection info from there, so this class does the
 * minimal amount that's necessary to bootstrap the installation.
 *
 * PHP Version 5
 *
 * @category Installer
 * @package  Installer
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The Installer Database class is like the LORIS database class, except it
 * at the time of the installer the config.xml doesn't exist, so it can't
 * connect using the connection info from there, so this class does the
 * minimal amount that's necessary to bootstrap the installation.
 *
 * @category Installer
 * @package  Installer
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Database
{
    public $PDO;

    /**
     * Returns one and only one Database object.
     *
     * @return Database
     */
    public static function singleton()
    {
        static $DB = null;
        if (is_null($DB)) {
            $DB = new Database;
        }
        return $DB;
    }

    /**
     * On executing `SHOW GRANT;`, rows with a single column are returned.
     * Each row's value is a string that lists the MySQL user's privileges for
     * a given table.
     *
     * @param string $raw The string of each row returned by `SHOW GRANT;`
     *
     * @see https://dev.mysql.com/doc/refman/5.7/en/show-grants.html
     *
     * @return object The parsed privilege for a string returned by `SHOW GRANT;`
     */
    private function _parsePrivilege($raw)
    {
        $token_arr = explode(" ON ", $raw);
        if (count($token_arr) != 2) {
            //Avoid letting the user see the "privileges", output to error_log()
            error_log(
                "Database::_parsePrivilege():Received {$raw}, could not split in two"
            );
            throw new Exception("Could not parse privilege");
        }
        $database_table_end = strpos($token_arr[1], " ");
        $database_table     = substr($token_arr[1], 0, $database_table_end);

        $privilege_arr_raw = substr($token_arr[0], strlen("GRANT "));
        $privilege_arr     = explode(", ", $privilege_arr_raw);

        return (object)array(
                        "database_table" => $database_table,
                        "privilege_arr"  => $privilege_arr,
                       );
    }
    private $_privileges = null;
    /**
     * Fetches and caches all the current MySQL user's privileges.
     * Subsequent calls return a cached copy.
     *
     * @see    https://dev.mysql.com/doc/refman/5.7/en/show-grants.html
     * @return array An associative array mapping "`<database>`.`<table>`" strings
     *               to an array of privileges
     */
    public function getOrFetchAllPrivileges()
    {
        if (is_null($this->_privileges)) {
            $stmt = $this->PDO->query("SHOW GRANTS");
            $arr  = $stmt->fetchAll(PDO::FETCH_COLUMN);
            $stmt->closeCursor();

            $this->_privileges = array();
            foreach ($arr as $raw) {
                $obj = $this->_parsePrivilege($raw);
                $this->_privileges[$obj->database_table] = $obj->privilege_arr;
            }
        }
        return $this->_privileges;
    }
    /**
     * Checks if the current MySQL user has the specified privilege.
     *
     * @param string $database  The database to check
     * @param string $table     The table to check
     * @param string $privilege A string representing the privilege
     *
     * @see https://dev.mysql.com/doc/refman/5.5/en/privileges-provided.html
     *      Table 6.2 Permissible Privileges for GRANT and REVOKE; "Privilege" column
     *
     * @return bool Returns true if current MySQL user has the specified privilege
     */
    public function hasPrivilege($database, $table, $privilege)
    {
        $arr = $this->getOrFetchAllPrivileges();
        if (!isset($arr[$database_table])) {
            return false;
        }

        $database_escaped = ($database == "*") ?
            "*" : "`{$database}`";
        $table_escaped    = ($table == "*") ?
            "*" : "`{$table}`";
        $database_table   = "{$database_escaped}.{$table_escaped}";
        if (isset($arr[$database_table])) {
            $privilege_arr = $arr[$database_table];
            /*
            This passes phpcs. Putting the URL on a single-line comment
            will make it fail. Thank you, phpcs.
            https://dev.mysql.com/doc/refman/5.5/en/privileges-provided.html#priv_all
            */
            if (in_array("ALL", $privilege_arr)
                || in_array("ALL PRIVILEGES", $privilege_arr)
                || in_array($privilege, $privilege_arr)
            ) {
                return true;
            }
        }

        //Privilege was not found at this level, try to look higher
        //@see https://dev.mysql.com/doc/refman/5.7/en/grant.html
        if ($table == "*") {
            if ($database == "*") {
                //*.*
                //Already checked the highest level and privilege was not found
                return false;
            } else {
                //`<database>`.*
                return $this->hasPrivilege("*", "*", $privilege);
            }
        } else if ($database == "*") {
            //*.`<table>` makes no sense.
            throw new Exception("Invalid database-table combination");
        } else {
            //`<database>`.`<table>`
            return $this->hasPrivilege($database, "*", $privilege);
        }
    }

    /**
     * Checks if the database exists
     *
     * @param bool $database The database name
     *
     * @return bool Returns true if the database exists
     */
    public function databaseExists($database)
    {
        $exists = $this->PDO->query("SHOW DATABASES LIKE '$database'")
            ->fetch(PDO::FETCH_ASSOC);
        // this needs to be !empty, because otherwise if there's
        // no results returned count($dbexists) == 1 when no
        // results are returned, because the result isn't an array
        // Something to do with how the Countable interface is
        // implemented in PHP..
        return !empty($exists);
    }

    /**
     * Checks if we can access the database with the given info
     *
     * @param string $host     The host
     * @param string $database The database
     * @param string $username The username
     * @param string $password The password
     *
     * @return bool Returns true of the user can log in with the given info
     */
    public static function canLogIn($host, $database, $username, $password)
    {
        try {
            $test = new PDO(
                "mysql:host={$host};dbname={$database};charset=UTF8",
                $username,
                $password
            );
            return true;
        } catch (Exception $ex) {
            return false;
        }
    }
    /**
     * This wrapper connects differently than the normal database wrapper.
     * Instead of connecting to a database, it will connect to the server,
     * check that the user has create user and create privileges, make sure
     * the database doesn't already exist, and if so create it and use it.
     * If any of these conditions fail, it's an error.
     * This is because this wrapper is only used to connect from the install
     * script, so we want to ensure that the preconditions for the install
     * script are satisfied while we're connecting. This will only happen
     * once.
     *
     * @param string $database The database to be created
     * @param string $username The username to connect as
     * @param string $password The password to connect with
     * @param string $host     The hostname that the SQL server is running
     *                         on.
     *
     * @return bool true on success, false on failure.
     */
    public function connectAndCreate(
        $database,
        $username,
        $password,
        $host
    ) {
        try {
            $this->PDO = new PDO(
                "mysql:host=$host;charset=UTF8",
                $username,
                $password
            );
            $this->PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

            if (!$this->hasPrivilege("*", "*", "CREATE")) {
                if ($this->databaseExists($database)) {
                     $this->lastErr = "User does not have create database ".
                        "privileges but the database `{$database}` already exists.".
                        "Consider checking the 'use existing database checkbox'.";
                } else {
                     $this->lastErr = "User does not have create database "
                    . "privileges; cannot create `{$database}`";
                }
                return false;
            }

            $this->PDO->exec("CREATE DATABASE $database");
            $this->PDO->exec("USE $database");
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    /**
     * This connects to a database, but doesn't try to create it if it doesn't
     * already exist.
     *
     * @param string $database     The database to be created
     * @param string $username     The username to connect as
     * @param string $password     The password to connect with
     * @param string $host         The hostname that the SQL server is running
     *                             on.
     * @param bool   $trackChanges Unused. For signature compatibility with the
     *                             "real" Database class.
     *
     * @return bool true on success, false on failure.
     */
    public function connect(
        $database,
        $username,
        $password,
        $host,
        $trackChanges = true
    ) {
        if ($this->isConnected() === true) {
            if (!$this->databaseExists($database)) {
                $this->lastErr = "Database `{$database}` does not ".
                    "exist; consider creating it first";
                return false;
            }
            $this->PDO->exec("USE $database");
            return true;
        }
        try {
            $this->PDO = new PDO(
                "mysql:host=$host;charset=UTF8",
                $username,
                $password
            );
            $this->PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            if (!$this->databaseExists($database)) {
                $this->lastErr = "Database `{$database}` does not exist; ".
                    "consider creating it first";
                return false;
            }
            $this->PDO->exec("USE $database");
            return true;
        } catch(Exception $e) {
            $this->lastErr = "Exceptional error connecting to the database "
            . $database . ".";
            return false;
        }

        // Unreachable
        return false;
    }

    /**
     * Returns true if this Database instance is connected to a database.
     *
     * @return bool
     */
    public function isConnected()
    {
        try {
            if (!$this->PDO) {
                return false;
            }
            $this->PDO->query("SELECT 'x'");
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    /**
     * Prepares a query to run.
     *
     * @param string $query The SQL query to be prepared
     *
     * @return PDOStatement of prepared statement
     */
    public function prepare($query)
    {
        return $this->PDO->prepare($query);
    }

    /**
     * Stub to prevent PHP from crashing if something autloads and tries
     * to call pselect
     *
     * @return the empty array
     */
    public function pselect()
    {
        return array();
    }
}
