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
    public function connectAndCreate(
        $database,
        $username,
        $password,
        $host,
        $trackChanges = true
    ) {
        try {
            $this->PDO = new PDO(
                "mysql:host=$host;charset=UTF8",
                $username,
                $password
            );
            $this->PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

            $userperms = $this->PDO->query(
                "SELECT
                   Create_user_priv, Create_priv
                 FROM `mysql`.`user`
                 WHERE CONCAT(user, '@', host)=CURRENT_USER"
            );

            $userperms = $userperms->fetchall(PDO::FETCH_ASSOC);

            if (count($userperms) != 1) {
                $this->lastErr = "Error retrieving user permissions for $username.";
                return false;
            }

            $userperms = $userperms[0];
            if ($userperms['Create_priv'] != 'Y') {
                $this->lastErr = "User does not have create "
                . "privileges.";
                return false;
            }
            if ($userperms['Create_user_priv'] != 'Y') {
                $this->lastErr = "Specified user can not create new "
                ." user for LORIS to connect as.";
                return false;
            }

            $dbexists = $this->PDO->query("SHOW DATABASES LIKE '$database'")
                ->fetch(PDO::FETCH_ASSOC);
            // this needs to be !empty, because otherwise if there's
            // no results returned count($dbexists) == 1 when no
            // results are returned, because the result isn't an array
            // Something to do with how the Countable interface is
            // implemented in PHP..
            if (!empty($dbexists)) {
                $this->lastErr = "Database $database already exists."
                . " Can only install new databases.";
                return false;
            }

            $this->PDO->exec("CREATE DATABASE $database");
            $this->PDO->exec("USE $database");
            return true;
        } catch(Exception $e) {
            return false;
        }
        // should be inaccessible, but include it just in case we
        // somehow get here.
        return false;
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
            return true;
        }
        try {
             $this->PDO = new PDO(
                 "mysql:host=$host;dbname=$database;charset=UTF8",
                 $username,
                 $password
             );
             $this->PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
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
