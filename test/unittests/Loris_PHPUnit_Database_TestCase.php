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
    protected function setUp()
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
     * Creates LORIS database connection
     *
     * @throws DatabaseException
     * @return void
     */
    protected function createLorisDBConnection()
    {
        $this->database = Database::singleton(
            $this->factory->settings()->dbName(),
            $this->factory->settings()->dbUserName(),
            $this->factory->settings()->dbPassword(),
            $this->factory->settings()->dbHost()
        );
    }

}
