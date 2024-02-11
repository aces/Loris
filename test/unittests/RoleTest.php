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
use function PHPUnit\Framework\assertEquals;
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

    private $_roleOthersInfo = [
        0 => [
            'RoleID'      => 2,
            'Code'        => 'role2',
            'Name'        => 'Role2',
            'Description' => 'Role2 description',
        ],
        1 => [
            'RoleID'      => 3,
            'Code'        => 'role3',
            'Name'        => 'Role3',
            'Description' => 'Role3 description',
        ],
        2 => [
            'RoleID'      => 4,
            'Code'        => 'role4',
            'Name'        => 'Role4',
            'Description' => 'Role4 description',
        ],
    ];

    private $_usersInfo = [
        0 => [
            'ID'                     => 1,
            'UserID'                 => '123456',
            'Password'               => 'sufficient length and complexity',
            'Real_name'              => 'John Doe',
            'First_name'             => 'John',
            'Last_name'              => 'Doe',
            'Degree'                 => 'Eng.D',
            'Position_title'         => 'Doctor',
            'Institution'            => 'MCIN',
            'Department'             => 'Neuroscience',
            'Address'                => '123 Main St',
            'City'                   => 'Montreal',
            'State'                  => 'Quebec',
            'Zip_code'               => '123',
            'Country'                => 'Canada',
            'Phone'                  => '123-456-7890',
            'Fax'                    => null,
            'Email'                  => 'john.doe@mcgill.ca',
            'Privilege'              => 1,
            'PSCPI'                  => 'Y',
            'DBAccess'               => '123',
            'Active'                 => 'Y',
            'Password_hash'          => null,
            'PasswordChangeRequired' => 0,
            'Pending_approval'       => 'Y',
            'Doc_Repo_Notifications' => 'Y',
            'language_preference'    => 2,
            'active_from'            => '2017-07-16',
            'active_to'              => '2020-07-16',
            'account_request_date'   => null
        ],
        1 => [
            'ID'                     => 2,
            'UserID'                 => '234567',
            'Password'               => 'sufficient length and complexity',
            'Real_name'              => 'John Doe2',
            'First_name'             => 'John2',
            'Last_name'              => 'Doe2',
            'Degree'                 => 'Eng.D2',
            'Position_title'         => 'Doctor2',
            'Institution'            => 'MCIN',
            'Department'             => 'Neuroscience',
            'Address'                => '234 Main St',
            'City'                   => 'Montreal',
            'State'                  => 'Quebec',
            'Zip_code'               => '234',
            'Country'                => 'Canada',
            'Phone'                  => '123-456-7890',
            'Fax'                    => null,
            'Email'                  => 'john.doe2@mcgill.ca',
            'Privilege'              => 1,
            'PSCPI'                  => 'Y',
            'DBAccess'               => '123',
            'Active'                 => 'Y',
            'Password_hash'          => null,
            'PasswordChangeRequired' => 0,
            'Pending_approval'       => 'Y',
            'Doc_Repo_Notifications' => 'Y',
            'language_preference'    => 2,
            'active_from'            => '2017-07-16',
            'active_to'              => '2020-07-16',
            'account_request_date'   => null
        ],
        2 => [
            'ID'                     => 3,
            'UserID'                 => '345678',
            'Password'               => 'sufficient length and complexity',
            'Real_name'              => 'John Doe3',
            'First_name'             => 'John3',
            'Last_name'              => 'Doe3',
            'Degree'                 => 'Eng.D3',
            'Position_title'         => 'Doctor3',
            'Institution'            => 'MCIN',
            'Department'             => 'Neuroscience',
            'Address'                => '345 Main St',
            'City'                   => 'Montreal',
            'State'                  => 'Quebec',
            'Zip_code'               => '345',
            'Country'                => 'Canada',
            'Phone'                  => '123-456-7890',
            'Fax'                    => null,
            'Email'                  => 'john.doe3@mcgill.ca',
            'Privilege'              => 1,
            'PSCPI'                  => 'Y',
            'DBAccess'               => '123',
            'Active'                 => 'Y',
            'Password_hash'          => null,
            'PasswordChangeRequired' => 0,
            'Pending_approval'       => 'Y',
            'Doc_Repo_Notifications' => 'Y',
            'language_preference'    => 2,
            'active_from'            => '2017-07-16',
            'active_to'              => '2020-07-16',
            'account_request_date'   => null
        ],
    ];

    private $_permInfo = [
        0 => [
            'permID'      => 1,
            'code'        => "test_permission1",
            'description' => "description 1",
            'action'      => 'View',
            'moduleID'    => 2
        ],
        1 => [
            'permID'      => 2,
            'code'        => "test_permission2",
            'description' => "description 2",
            'action'      => 'Edit',
            'moduleID'    => 5
        ],
        2 => [
            'permID'      => 3,
            'code'        => "test_permission3",
            'description' => "description 3",
            'action'      => 'View/Create',
            'moduleID'    => 5
        ],
        3 => [
            'permID'      => 4,
            'code'        => "test_permission4",
            'description' => "description 4",
            'action'      => null,
            'moduleID'    => null
        ]
    ];

    private $_rolePermissionInfo = [
        // role 1 = p1 + p2
        0 => [
            'RoleID' => 1,
            'permID' => 1,
        ],
        1 => [
            'RoleID' => 1,
            'permID' => 2,
        ],
        // role 2 = p2 + p3
        2 => [
            'RoleID' => 2,
            'permID' => 2,
        ],
        3 => [
            'RoleID' => 2,
            'permID' => 3,
        ],
        // role 3 = p3 + p4
        4 => [
            'RoleID' => 3,
            'permID' => 3,
        ],
        5 => [
            'RoleID' => 3,
            'permID' => 4,
        ],
        // role 4 = p2 + p3 + p4
        6 => [
            'RoleID' => 4,
            'permID' => 2,
        ],
        7 => [
            'RoleID' => 4,
            'permID' => 3,
        ],
        8 => [
            'RoleID' => 4,
            'permID' => 4,
        ],
    ];

    private $_userRoleInfo = [
        // user 1 = r1 + r2 (= p1 + p2 + p3)
        0 => [
            'userID' => 1,
            'RoleID' => 1,
        ],
        1 => [
            'userID' => 1,
            'RoleID' => 2,
        ],
        // user 2 = r1 + r4 (= p1 + p2 + p3 + p4)
        2 => [
            'userID' => 2,
            'RoleID' => 1,
        ],
        3 => [
            'userID' => 2,
            'RoleID' => 4,
        ],
        // user 3 = r3 (= p3 + p4)
        4 => [
            'userID' => 3,
            'RoleID' => 3,
        ],
    ];

    private $_userPermInfo = [
        // user 1 = p1 + p2 + p3
        0 => [
            'userID' => 1,
            'permID' => 1,
        ],
        1 => [
            'userID' => 1,
            'permID' => 2,
        ],
        2 => [
            'userID' => 1,
            'permID' => 3,
        ],
        // user 2 = p1 + p2 + p3 + p4
        3 => [
            'userID' => 2,
            'permID' => 1,
        ],
        4 => [
            'userID' => 2,
            'permID' => 2,
        ],
        5 => [
            'userID' => 2,
            'permID' => 3,
        ],
        6 => [
            'userID' => 2,
            'permID' => 4,
        ],
        // user 3 = p3 + p4
        7 => [
            'userID' => 3,
            'permID' => 3,
        ],
        8 => [
            'userID' => 3,
            'permID' => 4,
        ],
    ];

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
     * Test that getData retrieves the correct information when given a
     * specific attribute
     *
     * @return void
     * @covers Role::getData
     */
    public function testGetDataForRoleID()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['RoleID'],
            $this->_role->getData('RoleID')
        );
    }

    /**
     * Test that getData retrieves the correct information when given a
     * specific attribute
     *
     * @return void
     * @covers Role::getData
     */
    public function testGetDataForRoleCode()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['Code'],
            $this->_role->getData('Code')
        );
    }

    /**
     * Test that getData retrieves the correct information when given a
     * specific attribute
     *
     * @return void
     * @covers Role::getData
     */
    public function testGetDataForRoleName()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['Name'],
            $this->_role->getData('Name')
        );
    }

    /**
     * Test that getData retrieves the correct information when given a
     * specific attribute
     *
     * @return void
     * @covers Role::getData
     */
    public function testGetDataForRoleDescription()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['Description'],
            $this->_role->getData('Description')
        );
    }

    /**
     * Test that getId returns the correct role id
     *
     * @return void
     * @covers Role::getId
     */
    public function testGetId()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['RoleID'],
            $this->_role->getId()
        );
    }

    /**
     * Test that getCode returns the correct role code
     *
     * @return void
     * @covers Role::getCode
     */
    public function testGetCode()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['Code'],
            $this->_role->getCode()
        );
    }

    /**
     * Test that getName returns the correct role name
     *
     * @return void
     * @covers Role::getName
     */
    public function testGetName()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['Name'],
            $this->_role->getName()
        );
    }

    /**
     * Test that getDescription returns the correct role description
     *
     * @return void
     * @covers Role::getId
     */
    public function testGetDescription()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $this->assertEquals(
            $this->_roleInfoComplete['Description'],
            $this->_role->getDescription()
        );
    }

    /**
     * Test that exists found the correct role
     *
     * @return void
     * @covers Role::exists
     */
    public function testExists()
    {
        $exists = \Role::exists(self::ROLECODE);
        $this->assertTrue($exists);
    }

    /**
     * Test that exists on unknown code cannot found a correct role
     *
     * @return void
     * @covers Role::exists
     */
    public function testNotExists()
    {
        $notExists = \Role::exists('nope');
        $this->assertFalse($notExists);
    }

    /**
     * Test that all roles can be found from db
     *
     * @return void
     * @covers Role::getAllRoles
     */
    public function testGetAllRoles()
    {
        $allRoles      = \Role::getAllRoles();
        $insertedRoles = array_merge(
            [0 => $this->_roleInfo],
            $this->_roleOthersInfo
        );
        assertEquals($allRoles, $insertedRoles);
    }

    /**
     * Test that getPermissions returns the array of permissions the role has
     *
     * @return void
     * @covers Role::setPermissions
     * @covers Role::getPermissions
     */
    public function testGetPermissions()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        $permissions = $this->_role->getPermissions();
        // check that all permissions are here
        $this->assertEquals(count($permissions), count($this->_permInfo));
        $expectedCodes = array_map(fn($p) => $p['code'], $this->_permInfo);
        foreach ($this->_permInfo as $pCode => $pValues) {
            $this->assertTrue(in_array($pCode, $expectedCodes, true));
        }
        // check that specific permissions are attributed to the role
        // role 1 = p1 + p2 only
        $p1 = $this->_permInfo[0];
        $p2 = $this->_permInfo[1];
        $p3 = $this->_permInfo[2];
        $p4 = $this->_permInfo[3];
        $this->assertTrue($permissions[$p1['code']]['roleHasPermission']);
        $this->assertTrue($permissions[$p2['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p3['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p4['code']]['roleHasPermission']);
    }

    /**
     * Test that insert correctly adds a role to the roles table
     *
     * @note   The factory method is used here to check that the information has
     *         been added to the database and can then be correctly populated
     *         into a new role object.
     * @return void
     * @covers Role::insert
     */
    public function testInsert()
    {
        $newRoleInfo           = $this->_roleInfo;
        $newRoleInfo['RoleID'] = 10;
        $newRoleInfo['Code']   = 'new_test';
        $newRoleInfo['Name']   = 'New Test';
        $newRoleInfo['Description'] = 'New description';
        \Role::insert($newRoleInfo);
        $otherRole = \Role::factory('new_test');
        $this->assertEquals('new_test', $otherRole->getCode());
    }

    /**
     * Test that update correctly updates a field of the given role object
     *
     * @return void
     * @covers Role::update
     */
    public function testUpdate()
    {
        // Insert the user so that it can be updated.
        $newRoleInfo           = $this->_roleInfo;
        $newRoleInfo['RoleID'] = 10;
        $newRoleInfo['Code']   = 'new_test';
        $newRoleInfo['Name']   = 'New Test';
        $newRoleInfo['Description'] = 'New description';
        \Role::insert($newRoleInfo);

        // Test the update.
        $otherRole = \Role::factory('new_test');
        $newInfo   = ['RoleID' => '11'];
        $otherRole->update($newInfo);
        $otherRole = \Role::factory('new_test');
        $this->assertEquals('11', $otherRole->getId());
    }

    /**
     * Test that addPermissions adds the permission with the given permID
     * to the list of role permissions
     *
     * @covers Role::addPermissions
     * @return void
     */
    public function testAddPermissions()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        // role 1 = p1 + p2, add p3.
        $this->_role->addPermissions([3]);

        $permissions = $this->_role->getPermissions();
        // check that all permissions are here
        $this->assertEquals(count($permissions), count($this->_permInfo));
        $expectedCodes = array_map(fn($p) => $p['code'], $this->_permInfo);
        foreach ($this->_permInfo as $pCode => $pValues) {
            $this->assertTrue(in_array($pCode, $expectedCodes, true));
        }
        // check that specific permissions are attributed to the role
        // role 1 = p1 + p2 AND + p3 now
        $p1 = $this->_permInfo[0];
        $p2 = $this->_permInfo[1];
        $p3 = $this->_permInfo[2];
        $p4 = $this->_permInfo[3];
        $this->assertTrue($permissions[$p1['code']]['roleHasPermission']);
        $this->assertTrue($permissions[$p2['code']]['roleHasPermission']);
        $this->assertTrue($permissions[$p3['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p4['code']]['roleHasPermission']);
    }

    /**
     * Test that addPermissions adds x permission with the given permID
     * to the list of role permissions
     *
     * @covers Role::addPermissions
     * @return void
     */
    public function testAddPermissionsMulitple()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        // role 1 = p1 + p2, add p3, p4.
        $this->_role->addPermissions([3, 4]);

        $permissions = $this->_role->getPermissions();
        // check that all permissions are here
        $this->assertEquals(count($permissions), count($this->_permInfo));
        $expectedCodes = array_map(fn($p) => $p['code'], $this->_permInfo);
        foreach ($this->_permInfo as $pCode => $pValues) {
            $this->assertTrue(in_array($pCode, $expectedCodes, true));
        }
        // check that specific permissions are attributed to the role
        // role 1 = p1 + p2 AND + p3 now
        $p1 = $this->_permInfo[0];
        $p2 = $this->_permInfo[1];
        $p3 = $this->_permInfo[2];
        $p4 = $this->_permInfo[3];
        $this->assertTrue($permissions[$p1['code']]['roleHasPermission']);
        $this->assertTrue($permissions[$p2['code']]['roleHasPermission']);
        $this->assertTrue($permissions[$p3['code']]['roleHasPermission']);
        $this->assertTrue($permissions[$p4['code']]['roleHasPermission']);
    }

    /**
     * Test that addPermissions adds no permission when it is calls empty
     *
     * @covers Role::addPermissions
     * @return void
     */
    public function testAddPermissionsNone()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        // role 1 = p1 + p2, add p3, p4.
        $this->_role->addPermissions([]);

        $permissions = $this->_role->getPermissions();
        // check that all permissions are here
        $this->assertEquals(count($permissions), count($this->_permInfo));
        $expectedCodes = array_map(fn($p) => $p['code'], $this->_permInfo);
        foreach ($this->_permInfo as $pCode => $pValues) {
            $this->assertTrue(in_array($pCode, $expectedCodes, true));
        }
        // check that specific permissions are attributed to the role
        // role 1 = p1 + p2 AND + p3 now
        $p1 = $this->_permInfo[0];
        $p2 = $this->_permInfo[1];
        $p3 = $this->_permInfo[2];
        $p4 = $this->_permInfo[3];
        $this->assertTrue($permissions[$p1['code']]['roleHasPermission']);
        $this->assertTrue($permissions[$p2['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p3['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p4['code']]['roleHasPermission']);
    }

    /**
     * Test that removePermissions removes the permission with the given
     * permID from the role's permissions
     *
     * @covers Role::removePermissions
     * @return void
     */
    public function testRemovePermissions()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        // role 1 = p1 + p2, remove p2.
        $this->_role->removePermissions([2]);

        $permissions = $this->_role->getPermissions();
        // check that all permissions are here
        $this->assertEquals(count($permissions), count($this->_permInfo));
        $expectedCodes = array_map(fn($p) => $p['code'], $this->_permInfo);
        foreach ($this->_permInfo as $pCode => $pValues) {
            $this->assertTrue(in_array($pCode, $expectedCodes, true));
        }
        // check that specific permissions are attributed to the role
        // role 1 = p1 + p2 AND + p3 now
        $p1 = $this->_permInfo[0];
        $p2 = $this->_permInfo[1];
        $p3 = $this->_permInfo[2];
        $p4 = $this->_permInfo[3];
        $this->assertTrue($permissions[$p1['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p2['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p3['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p4['code']]['roleHasPermission']);
    }

    /**
     * Test that removePermissions removes a list of permission with the given
     * permID from the role's permissions
     *
     * @covers Role::removePermissions
     * @return void
     */
    public function testRemovePermissionsMultiple()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        // role 1 = p1 + p2, remove p1, p2.
        $this->_role->removePermissions([1,2]);

        $permissions = $this->_role->getPermissions();
        // check that all permissions are here
        $this->assertEquals(count($permissions), count($this->_permInfo));
        $expectedCodes = array_map(fn($p) => $p['code'], $this->_permInfo);
        foreach ($this->_permInfo as $pCode => $pValues) {
            $this->assertTrue(in_array($pCode, $expectedCodes, true));
        }
        // check that specific permissions are attributed to the role
        // role 1 = p1 + p2 AND + p3 now
        $p1 = $this->_permInfo[0];
        $p2 = $this->_permInfo[1];
        $p3 = $this->_permInfo[2];
        $p4 = $this->_permInfo[3];
        $this->assertFalse($permissions[$p1['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p2['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p3['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p4['code']]['roleHasPermission']);
    }

    /**
     * Test that removePermissions removes all permission with the given
     * permID from the role's permissions
     *
     * @covers Role::removePermissions
     * @return void
     */
    public function testRemovePermissionsAll()
    {
        $this->_role = \Role::factory(self::ROLECODE);
        // role 1 = p1 + p2, remove p1, p2.
        $this->_role->removePermissions();

        $permissions = $this->_role->getPermissions();
        // check that all permissions are here
        $this->assertEquals(count($permissions), count($this->_permInfo));
        $expectedCodes = array_map(fn($p) => $p['code'], $this->_permInfo);
        foreach ($this->_permInfo as $pCode => $pValues) {
            $this->assertTrue(in_array($pCode, $expectedCodes, true));
        }
        // check that specific permissions are attributed to the role
        // role 1 = p1 + p2 AND + p3 now
        $p1 = $this->_permInfo[0];
        $p2 = $this->_permInfo[1];
        $p3 = $this->_permInfo[2];
        $p4 = $this->_permInfo[3];
        $this->assertFalse($permissions[$p1['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p2['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p3['code']]['roleHasPermission']);
        $this->assertFalse($permissions[$p4['code']]['roleHasPermission']);
    }

    /**
     * Set up the fake tables in the database to set up a new role object
     *
     * @return void
     */
    private function _setUpTestDoublesForFactoryRole()
    {
        // main
        $this->_dbMock->setFakeTableData(
            "roles",
            array_merge([0 => $this->_roleInfo], $this->_roleOthersInfo)
        );
        $this->_dbMock->setFakeTableData(
            "users",
            $this->_usersInfo
        );
        $this->_dbMock->setFakeTableData(
            "permissions",
            $this->_permInfo
        );

        // rel
        $this->_dbMock->setFakeTableData(
            "user_role_rel",
            $this->_userRoleInfo
        );
        $this->_dbMock->setFakeTableData(
            "role_permission_rel",
            $this->_rolePermissionInfo
        );
        $this->_dbMock->setFakeTableData(
            "user_perm_rel",
            $this->_userPermInfo
        );
    }
}

