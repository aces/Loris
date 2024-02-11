<?php declare (strict_types=1);
/**
 * Unit tests for the Role class
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../vendor/autoload.php';
use PHPUnit\Framework\TestCase;
/**
 * Unit tests for the Role class
 *
 * @category Tests
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RoleTest extends TestCase
{
    /**
     * The role code for the private role object
     *
     * @var string
     */
    private const ROLECODE = 'role_test';

    /**
     * Stores role information
     *
     * @var array
     */
    private $_roleInfo = [
        'RoleID'      => 1,
        'Code'        => self::ROLECODE,
        'Name'        => 'Role test',
        'Description' => 'Sufficient length and complexity',
    ];

    /**
     * The roleInfo table that should result from calling the factory function
     *
     * @var array
     */
    private $_roleInfoComplete;

    // private $_permInfo = [
    //     0 => [
    //         'permID' => 1,
    //         'code'        => "superuser",
    //         'description' => "superuser description",
    //         'action'      => null,
    //         'moduleID'    => null
    //     ],
    //     1 => [
    //         'permID' => 2,
    //         'code'        => "test_permission",
    //         'description' => "description 1",
    //         'action'      => 'View',
    //         'moduleID'    => 2
    //     ],
    //     2 => [
    //         'permID' => 3,
    //         'code'        => "test_permission2",
    //         'description' => "description 2",
    //         'action'      => 'Edit',
    //         'moduleID'    => 5
    //     ],
    //     3 => [
    //         'permID' => 4,
    //         'code'        => "test_permission3",
    //         'description' => "description 3",
    //         'action'      => 'View/Create',
    //         'moduleID'    => 5
    //     ]
    // ];

    // private $_userPermInfo = [
    //     0 => [
    //         'permID' => 1,
    //         'userID' => 1
    //     ],
    //     1 => [
    //         'permID' => 2,
    //         'userID' => 1
    //     ],
    //     2 => [
    //         'permID' => 3,
    //         'userID' => 1
    //     ]
    // ];

    /**
     * Role object used for testing
     *
     * @var Role object
     */
    private $_role;
    /**
     * Secondary role object used to test insert and update functions
     *
     * @var Role object
     */
    private $_otherRole;

    /**
     * NDB_Factory used in tests.
     * Test doubles are injected to the factory object.
     *
     * @var NDB_Factory
     */
    private $_factory;
    /**
     * Test double for NDB_Config object
     *
     * @var \NDB_Config&PHPUnit\Framework\MockObject\MockObject
     */
    private $_configMock;
    private $_mockConfig;
    /**
     * Test double for Database object
     *
     * @var \Database&PHPUnit\Framework\MockObject\MockObject
     */
    private $_dbMock;

    // /**
    //  * Test double for Database object for hasLoggedIn method
    //  *
    //  * @note This is needed for User::hasLoggedIn because it declares and uses
    //  *       the database differently than other methods in the User class.
    //  *       This can be changed when the rest of the User class updates how it
    //  *       declares its database. - Alexandra Livadas
    //  *
    //  * @var \Database | PHPUnit\Framework\MockObject\MockObject
    //  */
    // private $_mockDB;

    // /**
    //  * Maps config names to values
    //  * Used to set behaviour of NDB_Config test double
    //  *
    //  * @var array config name => value
    //  */
    // private $_configMap = [];

    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->_factory = \NDB_Factory::singleton();
        $this->_factory->reset();
        $this->_configMock = $this->_factory->Config(CONFIG_XML);
        $this->_dbMock     = $this->_factory->database();

        // $mockconfig = $this->getMockBuilder('NDB_Config')->getMock();
        // $mockdb     = $this->getMockBuilder('Database')->getMock();

        // '@phan-var \Database $mockdb';
        // '@phan-var \NDB_Config $mockconfig';

        // $this->_mockDB     = $mockdb;
        // $this->_mockConfig = $mockconfig;

        $this->_roleInfoComplete = $this->_roleInfo;

        $this->_setUpTestDoublesForFactoryRole();
        $this->_role = \Role::factory(self::ROLECODE);
    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        parent::tearDown();
        $this->_factory->database()->closeConnection();
        $this->_factory->reset();
    }

    /**
     * Test factory() method retrieves all the information of the role
     * and correctly populates the role object. Also tests that getData returns
     * all the role information  as an array when no parameters are given
     *
     * @return void
     * @covers Role::singleton
     * @covers Role::factory
     * @covers Role::getData
     */
    public function testFactoryRetrievesRoleInfo()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        //validate _roleInfo
        $this->assertEquals($this->_roleInfoComplete, $this->_role->getData());
    }

    /**
     * Set up the fake tables in the database to set up a new role object
     *
     * @return void
     */
    private function _setUpTestDoublesForFactoryRole()
    {
        $this->_dbMock->setFakeTableData(
            "roles",
            [0 => $this->_roleInfo]
        );
    }
}

