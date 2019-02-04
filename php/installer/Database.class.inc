<?php
/**
 * The Installer Database class is like the LORIS database class, except it
 * at the time of the installer the config.xml doesn't exist, so it can't
 * connect using the connection info from there, so this class does the
 * minimal amount that's necessary to bootstrap the installation.
 *
 * PHP Version 7
 *
 * @category Installer
 * @package  Installer
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Installer;

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
     * Checks if the current MySQL user has a specified privilege.
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
        $stmt    = $this->PDO->query("SHOW GRANTS");
        $results = $stmt->fetchAll(\PDO::FETCH_COLUMN);
        $stmt->closeCursor();
        if ($database == '*') {
            $database = '\*';
        }
        if ($table == '*') {
            $table = '\*';
        }
        $pattern = "/GRANT .*(ALL|${privilege}).* ON" .
            " `?([*]|${database})`?[.]`?([*]|${table})`?/";

        // Test all privileges return from SHOW GRANTS against the pattern
        return array_reduce(
            $results,
            function ($carry, $privilege) use ($pattern) {
                // Return true if a previous iteration returned true or the
                // current privileges matches the pattern.
                return $carry || (preg_match($pattern, $privilege) === 1);
            },
            false
        );
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
        $stmt = $this->PDO->prepare("SHOW DATABASES LIKE :v_db");
        $stmt->execute(array('v_db' => $database ));
        $exists = !empty($stmt->fetchAll());

        return $exists;
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
        } catch (\PDOException $ex) {
            return false;
        } catch (\Exception $e) {
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
            $this->PDO = new \PDO(
                "mysql:host=$host;charset=UTF8",
                $username,
                $password
            );

            $this->PDO->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING);

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
        } catch(\Exception $e) {
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
            $this->PDO = new \PDO(
                "mysql:host=$host;charset=UTF8",
                $username,
                $password
            );
            $this->PDO->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING);
            if (!$this->databaseExists($database)) {
                $this->lastErr = "Database `{$database}` does not exist; ".
                    "consider creating it first";
                return false;
            }
            $this->PDO->exec("USE $database");
            return true;
        } catch(\Exception $e) {
            error_log($e->getMessage());
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
        } catch(\Exception $e) {
            return false;
        }
    }

    /**
     * Prepares a query to run.
     *
     * @param string $query The SQL query to be prepared
     *
     * @return \PDOStatement of prepared statement
     */
    public function prepare($query)
    {
        return $this->PDO->prepare($query);
    }
}
