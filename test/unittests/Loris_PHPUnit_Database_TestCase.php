<?php
/**
 * This contains an abstract class for Loris unit tests which
 * will not mock the Database class and therefore will use
 * DBUnit to set up the test database's initial state using fixtures.
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Test
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Class Loris_PHPUnit_Databse_TestCase
 *
 * @category Tests
 * @package  Test
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class Loris_PHPUnit_Database_TestCase extends
    PHPUnit_Extensions_Database_TestCase
{

    /**
     * PDO connection
     *
     * Only instantiate _pdo once for test clean-up/fixture load
     *
     * @var PDO
     */
    static private $_pdo = null;

    /**
     * Note: only instantiate PHPUnit_Extensions_Database_DB_IDatabaseConnection
     * once per test
     *
     * @var PHPUnit_Extensions_Database_DB_IDatabaseConnection
     */
    private $_conn = null;

    /**
     * LORIS config object
     *
     * @var NDB_Config
     */
    protected $config;

    /**
     * LORIS Factory object
     *
     * @var NDB_Factory
     */
    protected $factory;

    protected $database;

    /**
     * Get database connection which will be used by PHPUnit
     * for clean-up and fixture loading into the test DB.
     *
     * @return PHPUnit_Extensions_Database_DB_DefaultDatabaseConnection
     */
    final public function getConnection()
    {
        $this->factory = NDB_Factory::singleton();
        $this->config  = $this->factory->Config(CONFIG_XML);

        $database = $this->config->getSetting('database');

        if ($this->_conn === null) {
            if (self::$_pdo == null) {
                self::$_pdo = new PDO(
                    'mysql:dbname='.$database['database'].';host='.$database['host'],
                    $database['username'],
                    $database['password']
                );
            }
            $this->_conn = $this->createDefaultDBConnection(self::$_pdo);
        }

        return $this->_conn;
    }

    /**
     * Creates LORIS database connection
     *
     * @throws DatabaseException
     * @return void
     */
    protected function createLorisDBConnection()
    {
        $database       = $this->config->getSetting('database');
        $this->database = Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host']
        );
    }

}