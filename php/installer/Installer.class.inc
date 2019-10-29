<?php
/**
 * The Installer class handles all the logic used by the installdb.php
 * script under htdocs. It's put in a class for testability (even if there
 * aren't currently any tests for it.) and to keep installdb.php neat.
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
 * The Installer class handles all the logic used by the installdb.php
 * script under htdocs. It's put in a class for testability (even if there
 * aren't currently any tests for it.) and to keep installdb.php neat.
 *
 * @category Installer
 * @package  Installer
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Installer
{

    private $_lastErr;

    /**
     * Get the last error that occurred in this install process.
     *
     * @return string
     */
    function getLastError()
    {
        return $this->_lastErr;
    }

    /**
     * Checks that all the preconditions that this script depends upon are
     * met.
     *
     * @return bool if the script is in an environment where it can proceed
     */
    public function checkPreconditionsValid()
    {
        // Check if config.xml already exists
        if ($this->_configXMLExists()) {
            $this->_lastErr = "LORIS appears to already be installed"
            . " (project/config.xml already exists.)\n"
            . "Can not install LORIS on top of existing"
            . " LORIS installation.\n"
            . "Aborting.";
            return false;
        }

        // Check that we have access to the schema files
        if ($this->_schemaFilesExist() == false) {
            $this->_lastErr = "LORIS database schema appears to be missing.\n"
            . "Please verify your LORIS installation and try again.";
            return false;
        }

        // Check that the user ran composer, so we can provide a friendlier
        // error than "autoload.php not found" when the script requires
        // it.
        if ($this->_checkComposerRan() == false) {
            $this->_lastErr = "Must run `composer install` before accessing this"
            . " page.\n"
            . "Please see instructions in README.md";
            return false;
        }
        return true;
    }

    /**
     * Check that config.xml file exists.
     *
     * @return bool
     */
    private function _configXMLExists()
    {
        if (file_exists(__DIR__ . "/../../project/config.xml")) {
            return true;
        }
        return false;
    }

    /**
     * Check that all schema files are accessible.
     *
     * @return bool
     */
    private function _schemaFilesExist()
    {
        return file_exists(__DIR__ . "/../../SQL/0000-00-00-schema.sql")
        && file_exists(__DIR__ . "/../../SQL/0000-00-01-Permission.sql")
        && file_exists(__DIR__ . "/../../SQL/0000-00-02-Menus.sql")
        && file_exists(__DIR__ . "/../../SQL/0000-00-03-ConfigTables.sql")
        && file_exists(__DIR__ . "/../../SQL/0000-00-04-Help.sql");
    }

    /**
     * Check that composer has already been run by.
     *
     * @return bool true if composer has been run
     */
    private function _checkComposerRan()
    {
        return file_exists(__DIR__ . "/../../vendor/autoload.php");
    }

    /**
     * Check that the system being installed on meets all LORIS dependencies
     * which can be checked.
     *
     * @return bool true if system is dependable.
     */
    public function checkSystemDependenciesValid()
    {
        // Check PHP version is supported.
        if (PHP_MAJOR_VERSION < 7) {
            $this->_lastErr = 'PHP version 7 or higher is required to run '
            . 'LORIS. ' . PHP_RELEASE_VERSION . ' is not supported.';
            return false;
        }

        // Check that some standard PHP packages which are removed in Debian
        // without a special package installed are available.
        if (function_exists('json_encode') == false) {
            $this->_lastErr = "JSON functions do not appear to be accessible "
                . "in your PHP installation. If you're running on Debian or "
                . "Ubuntu, please install the php-json package.";
            return false;
        }

        // Check that the PDO is able to connect to MySQL.
        try {
            // and check that the MySQL driver is available.
            $drivers = \PDO::getAvailableDrivers();
            if (in_array("mysql", $drivers) == false) {
                $this->_lastErr = "You do not appear to have MySQL support"
                . " available in PHP. Aborting.\n"
                . " Please check your system dependencies and try again.";
                return false;
            }
        } catch (\Exception $e) {
            $this->_lastErr = "You do not appear to have PDO support in your "
            . "version of PHP, which is required to access the database.";
            return false;
        }

        // Check that the smarty templates_c directory is writable.
        if (is_writable(__DIR__ . "/../../smarty/templates_c") == false) {
            $this->_lastErr = "Web server can not write to template cache "
            . "directory.\n"
            . "Please ensure the LORIS/smarty/templaces_c directory is writable"
            . "by your web server and try again.";
            return false;
        }
        return true;
    }

    /**
     * Connects to a database server and creates a MySQL database, after
     * verifying that it doesn't already exist.
     *
     * @param array $values The POSTed values for the database to be created.
     *
     * @return bool true on success, false on error.
     */
    function createMySQLDB($values)
    {
        if (preg_match(
            '/^[a-zA-Z]+[a-zA-Z0-9_]*$/',
            $values['dbname']
        ) == false
        ) {
            $this->_lastErr = "Database name must only contain letters, "
            . "numbers and underscores and must be at least 2 "
                        . "characters long.";
            return false;
        }
        $DB = Database::singleton();
        try {
            $DB->connectAndCreate(
                $values['dbname'],
                $values['dbadminuser'],
                $values['dbadminpassword'],
                $values['dbhost']
            );
        } catch (\Exception $e) {
            if (!empty($DB->lastErr)) {
                $this->_lastErr = $DB->lastErr;
            } else {
                $this->_lastErr = "Could not connect to MySQL server "
                    . "and create database with credentials provided.";
            }
            return false;
        }
        return true;
    }

    /**
     * Source the LORIS schema files into the database.
     *
     * @param array $values The POSTed values from the client.
     *
     * @return bool true on success, false on failure.
     */
    function sourceSchema($values)
    {
        $DB = Database::singleton();

        if ($DB->connect(
            $values['dbname'],
            $values['dbadminuser'],
            $values['dbadminpassword'],
            $values['dbhost']
        ) === false
        ) {
            if (!empty($DB->lastErr)) {
                $this->_lastErr = $DB->lastErr;
            } else {
                $this->_lastErr = "Could not connect to MySQL server "
                    ."with credentials provided.";
            }
            return false;
        }

        if ($this->_sourceSchemaFile($DB, "00-schema.sql") == false) {
            return false;
        };
        if ($this->_sourceSchemaFile($DB, "01-Permission.sql") == false) {
            return false;
        };
        if ($this->_sourceSchemaFile($DB, "02-Menus.sql") == false) {
            return false;
        };
        if ($this->_sourceSchemaFile($DB, "03-ConfigTables.sql") == false) {
            return false;
        };
        if ($this->_sourceSchemaFile($DB, "04-Help.sql") == false) {
            return false;
        };
        return true;
    }

    /**
     * Returns the base directory of LORIS
     *
     * @return string of LORIS install base directory
     */
    function getBaseDir()
    {
        return preg_replace("#php/installer$#", "", __DIR__);

    }

    /**
     * Get the Base URL that this LORIS instance appears to be installed under
     * by checking the URL that the user is accessing.
     *
     * @return ?string the LORIS base URL.
     */
    function getBaseURL(): ?string
    {
        // This is apparently the most reliable way to figure out if
        // the requery is over http or https.. $_SERVER[REQUEST_SCHEME]
        // is not reliable.
        $RequestScheme = 'http';
        if ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')
            || (isset($_SERVER['HTTP_X_FORWARDED_PROTO'])
            && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        ) {
            $RequestScheme = 'https';
        }
        if (isset($_SERVER['HTTP_HOST']) && isset($_SERVER['REQUEST_URI'])) {
            return $RequestScheme . '://' . $_SERVER['HTTP_HOST']
            . preg_replace("#/installdb.php#", "", $_SERVER['REQUEST_URI']);
        } else {
            return null;
        }

    }
    /**
     * Updates the basic config files required by LORIS.
     *
     * @param array $values The values from the POST request.
     *
     * @return bool true on success, false on error
     */
    function updateBaseConfig($values)
    {
        $DB = Database::singleton();
        try {
            $DB->connect(
                $values['dbname'],
                $values['dbadminuser'],
                $values['dbadminpassword'],
                $values['dbhost']
            );
        } catch (\Exception $e) {
            if (!empty($DB->lastErr)) {
                $this->_lastErr = $DB->lastErr;
            } else {
                $this->_lastErr = "Could not connect to MySQL server "
                    . "with credentials provided.";
            }
            return false;
        }

        // get the LORIS base path, based on what we know about where
        // this file is located.
        $basepath = $this->GetBaseDir();
        // Assume the database name is the same as the project name,
        // in order to not need to prompt.
        $datadir = "/data/$values[dbname]/data/";

        $this->_updateConfig($DB, "base", $basepath);
        $this->_updateConfig($DB, "DownloadPath", $basepath);

        $this->_updateConfig($DB, "imagePath", $datadir);
        $this->_updateConfig($DB, "data", $datadir);
        $this->_updateConfig($DB, "MRICodePath", $datadir);

        // Update the host based and URL based on the location that
        // this request is coming from.
        $this->_updateConfig($DB, "host", $_SERVER['HTTP_HOST']);
        $this->_updateConfig($DB, "url", $this->getBaseURL());

        // Generate a new secret key for JWT tokens. We don't really care
        // what it is, as long as the server always uses the same one to
        // validate tokens. So we use the new user password code to generate a
        // really long password and use that as the key.
        $this->_updateConfig($DB, "JWTKey", \User::newPassword(64));
    }

    /**
     * Updates a config setting in the database.
     *
     * @param Database $DB      A database handler. Must already be connected.
     * @param string   $setting The setting name to be updated.
     * @param string   $value   The value to set $setting to.
     *
     * @return void
     */
    private function _updateConfig($DB, $setting, $value)
    {
        $prepared = $DB->prepare(
            "UPDATE Config SET Value=:q_val WHERE
				ConfigID=(SELECT ID FROM ConfigSettings 
					WHERE Name=:q_sett)"
        );
        $prepared->execute(['q_val' => $value, 'q_sett' => $setting]);
    }

    /**
     * Runs all statements in the file.
     *
     * @param Database $DB   A database handler. Must already be connected.
     * @param string   $file The file to source into the database that $DB
     *                       is connected to.
     *
     * @return bool true on success, false on failure.
     */
    private function _sourceSchemaFile($DB, $file)
    {
        $sqls = file_get_contents(__DIR__ . "/../../SQL/0000-00-$file");
        if ($DB->PDO->exec($sqls) === false) {
            $this->_lastErr = "Unknown error sourcing schema file. $file";
            return false;
        }
        return true;

    }

    /**
     * Creates a non-privileged MySQL account for based on the parameters
     * in $values.
     *
     * @param array $values An associative array of request parameters.
     *                      Must have keys for dbname, dbadminuser,
     *                      dbadminpassword, dbhost, lorismysqluser, and
     *                      lorismysqlpassword
     *
     * @return bool true on success, false on error
     */
    function createMySQLAccount($values)
    {
        $DB = Database::singleton();
        if ($DB->connect(
            $values['dbname'],
            $values['dbadminuser'],
            $values['dbadminpassword'],
            $values['dbhost']
        ) == false
        ) {
            if (!empty($DB->lastErr)) {
                $this->_lastErr = $DB->lastErr;
            } else {
                $this->_lastErr = "Could not connect to MySQL server "
                . "with credentials provided.";
            }
            return false;
        }

        if (!$DB->hasPrivilege("mysql", "user", "SELECT")) {
            $this->_lastErr = $values['dbadminuser'] . " does not have "
                . "privileges to check if a mysql user exists. Please create "
                . "that user manually then use the `Already created` checkbox "
                . "below.";
            return false;
        }
        // This script is being run by the web server, so get the host
        // that the current user is connect from to be the host of the
        // new user, since the new user is also going to be used from
        // the same web server so should have the same address.
        $connectHost = $DB->PDO->query(
            "SELECT host FROM `mysql`.`user`
		WHERE CONCAT(user, '@', host)=CURRENT_USER"
        )->fetch(\PDO::FETCH_ASSOC);

        if (!is_array($connectHost) || empty($connectHost['host'])) {
            // This should never happen. It would mean that the user
            // that we ran the query from isn't connected..
            $this->_lastErr = "Could not retrieve hostname for MySQL user";
            return false;
        }

        $connectHost = $connectHost['host'];

        $userExistsQ = $DB->prepare(
            "SELECT 'x' FROM mysql.user 
			WHERE user=:q_user AND host=:q_host"
        );
        $userExistsQ->execute(
            [
                'q_user' => $values['lorismysqluser'],
                'q_host' => $connectHost,
            ]
        );
        $results    = $userExistsQ->fetchAll(\PDO::FETCH_ASSOC);
        $userExists = false;

        $quotedUser = $DB->PDO->quote($values['lorismysqluser']) .
        '@' . $DB->PDO->quote($connectHost);

        if (!empty($results)) {
            // There is already a user for this username@hostname.
            // Try connecting to see if the MySQL password matches.
            // (the MySQL Password() function has been deprecated,
            // so we can't rely on it to select a hash from the mysql.user
            // table and compare.)
            if (Database::canLogIn(
                $values["dbhost"],
                $values["dbname"],
                $values["lorismysqluser"],
                $values["lorismysqlpassword"]
            )
            ) {
                // the user already exists and the password is valid.
                // we don't need to go any further than this.
                return true;
            } else {
                // the user already exists but we couldn't connect as it.
                $this->_lastErr = "MySQL user $quotedUser already exists and "
                . " password does not match or it does not"
                . " have access to the $values[dbname]"
                . " database.";
                return false;
            }
        }

        if (!$DB->hasPrivilege("*", "*", "CREATE USER")) {
            $this->_lastErr = "User does not have privilege to create "
                . "a mysql user.";
            return false;
        }
        // The user does not exist and needs to be created
        $DB->PDO->exec(
            "CREATE USER $quotedUser IDENTIFIED BY " .
            $DB->PDO->quote($values['lorismysqlpassword'])
        );

        $DB->PDO->exec(
            "GRANT UPDATE,INSERT,SELECT,DELETE,CREATE TEMPORARY TABLES
            ON `$values[dbname]`.* TO $quotedUser"
        );
        return true;
    }

    /**
     * Resets the username and password of the front end admin user.
     *
     * @param array $values an associative array. Must have keys for
     *                      dbname, dbadminuser, dbadminpassword, dbhost,
     *                      frontenduser, and frontendpassword
     *
     * @return bool true on success
     */
    function resetFrontEndAdmin($values)
    {
        if (empty($values['dbname'])
            || empty($values['dbadminuser'])
            || empty($values['dbadminpassword'])
            || empty($values['dbhost'])
            || empty($values['frontenduser'])
            || empty($values['frontendpassword'])
        ) {
            $this->_lastErr = "All entries must be provided.";
            return false;
        }
        $DB = Database::singleton();
        if ($DB->connect(
            $values['dbname'],
            $values['dbadminuser'],
            $values['dbadminpassword'],
            $values['dbhost']
        ) == false
        ) {
            if (!empty($DB->lastErr)) {
                $this->_lastErr = $DB->lastErr;
            } else {
                $this->_lastErr = "Could not connect to MySQL server "
                . "with credentials provided.";
            }
            return false;
        }

        $stmt = $DB->prepare(
            "UPDATE users
             SET
               UserID=:q_userID,
               Password_hash=:q_password,
               Active='Y',
               Password_expiry=DATE_ADD(NOW(),INTERVAL 30 DAY)
             WHERE ID=1"
        );
        return $stmt->execute(
            [
                'q_userID'   => $values['frontenduser'],
                'q_password' => password_hash(
                    $values['frontendpassword'],
                    PASSWORD_DEFAULT
                ),
            ]
        );
    }

    /**
     * Returns whether or not the config.xml file should be writable.
     *
     * @return bool true if the file should be writable.
     */
    function configWritable()
    {
        // config.xml doesn't exist when this is called, so check if the
        // directory is writable, since is_writable returns false for a
        // file that doesn't exist.
        return is_writable(__DIR__ . "/../../project");
    }

    /**
     * Returns the XML for a valid configuration based on the parameters passed.
     *
     * @param array $values An associative array with keys for dbhost,
     *                      lorismysqluser, lorismysqlpassword, and dbname
     *
     * @return string|array The output of str_replace
     */
    function getConfigContent($values)
    {
        // Value cleanup
        $escapedValues = array_map(
            function ($val) {
                return htmlspecialchars($val, ENT_XML1, 'ISO-8859-1');
            },
            $values
        );

        $contents = file_get_contents(__DIR__ . "/../../docs/config/config.xml");
        return str_replace(
            [
                '%HOSTNAME%',
                '%USERNAME%',
                '%PASSWORD%',
                '%DATABASE%',
            ],
            [
                $escapedValues['dbhost'],
                $escapedValues['lorismysqluser'],
                $escapedValues['lorismysqlpassword'],
                $escapedValues['dbname'],
            ],
            $contents
        );
    }

    /**
     * Writes the config.xml file, based on the parameters passed in $values.
     * $values should match the $_POST parameter on the last page of the
     * installer
     *
     * @param array $values An associative array with keys for dbhost,
     *                      lorismysqluser, lorismysqlpassword, and dbname
     *
     * @return bool true
     */
    function writeConfig($values)
    {
        $contents = $this->getConfigContent($values);
        file_put_contents(__DIR__ . "/../../project/config.xml", $contents);
        return true;
    }
}
