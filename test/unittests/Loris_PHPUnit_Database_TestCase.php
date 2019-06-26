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
use PHPUnit\Framework\TestCase;
/**
 * Class Loris_PHPUnit_Databse_TestCase
 *
 * @category Tests
 * @package  Test
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class Loris_PHPUnit_Database_TestCase extends TestCase
{

    /**
     * PDO connection
     *
     * Only instantiate _pdo once for test clean-up/fixture load
     *
     * @var \PDO
     */
    static private $_pdo = null;

    /**
     * Note: only instantiate PHPUnit_Extensions_Database_DB_IDatabaseConnection
     * once per test
     *
     * @var \PHPUnit\DbUnit\Database\Connection
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
     * Setup test
     * Checks if tests are run on sandbox, otherwise skips them.
     * Some of these tests may be destructive therefore should never be
     * run in production
     *
     * @throws Exception
     * @return void
     */
    protected function setUp(): void
    {
        $this->factory = NDB_Factory::singleton();

        //if not in sandbox mode do not run tests
        if (!$this->factory->settings(CONFIG_XML)->isSandbox()) {
            $this->markTestSkipped(
                "You are not in 'sandbox' mode.
                This is a destructive test, it will be skipped!"
            );
        }
        parent::setUp();
    }

    /**
     * Get database connection which will be used by PHPUnit
     * for clean-up and fixture loading into the test DB.
     *
     * @return \PHPUnit\DbUnit\Database\DefaultConnection
     */
    final public function getConnection()
    {
        $this->factory = NDB_Factory::singleton();

        if ($this->_conn === null) {
            if (self::$_pdo == null) {
                self::$_pdo = new PDO(
                    'mysql:dbname='.$this->factory->settings()->dbName().';
                    host='.$this->factory->settings()->dbHost(),
                    $this->factory->settings()->dbUserName(),
                    $this->factory->settings()->dbPassword()
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
    protected function createLorisDBConnection(): void
    {
        $this->database = Database::singleton(
            $this->factory->settings()->dbName(),
            $this->factory->settings()->dbUserName(),
            $this->factory->settings()->dbPassword(),
            $this->factory->settings()->dbHost()
        );
    }

}
