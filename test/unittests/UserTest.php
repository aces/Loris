<?php declare (strict_types=1);
/**
 * Unit tests for the User and UserPermissions class
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../vendor/autoload.php';
use PHPUnit\Framework\TestCase;
/**
 * Unit tests for the User and UserPermissions class
 *
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UserTest extends TestCase
{
    /**
     * The username for the private user object
     *
     * @var string
     */
    private const USERNAME = '968775';
    /**
     * Stores user information
     *
     * @var array
     */
    private $_userInfo
        = ['ID'                     => 1,
            'UserID'                 => self::USERNAME,
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
        ];
    /**
     * The userInfo table that should result from calling the factory function
     *
     * @var array
     */
    private $_userInfoComplete;

    /**
     * Psc table information
     *
     * @var array
     */
    private $_pscInfo = [0 => ['CenterID' => '1',
        'Name'     => 'psc_test'
    ],
        1 => ['CenterID' => '4',
            'Name'     => 'psc_test2'
        ]
    ];
    /**
     * Project table information
     *
     * @var array
     */
    private $_projectInfo = [0 => ['ProjectID' => '1',
        'Name'      => 'project_test',
        'Alias'     => 'TST1',
    ],
        1 => ['ProjectID' => '3',
            'Name'      => 'project_test2',
            'Alias'     => 'TST2',
        ]
    ];


    /**
     * Examiners table information
     *
     * @var array
     */
    private $_examinerInfo = [0 => ['full_name' => 'John Doe',
        'userID'      => '1',
        'examinerID'  => 1,
        'radiologist' => 1
    ]
    ];
    /**
     * User_psc_rel table information
     *
     * @var array
     */
    private $_uprInfo = [0 => ['UserID' => '1',
        'CenterID' => '1'
    ],
        1 => ['UserID' => '1',
            'CenterID' => '4'
        ]
    ];

    /**
     * User_psc_rel table information
     *
     * @var array
     */
    private $_uprojrInfo = [0 => ['UserID' => '1',
        'ProjectID' => '1'
    ],
        1 => ['UserID' => '1',
            'ProjectID' => '3'
        ]
    ];
    /**
     * Examiners_psc_rel table information
     *
     * @var array
     */
    private $_eprInfo = [0 => ['centerID' => '1',
        'examinerID'       => 1,
        'active'           => 'Y',
        'pending_approval' => 'N'
    ],
        1 => ['centerID' => '4',
            'examinerID'       => 1,
            'active'           => 'Y',
            'pending_approval' => 'N'
        ]
    ];

    private $_permInfo = [
        0 => ['permID' => 1,
            'code'        => "superuser",
            'description' => "superuser description",
            'categoryID'  => 1,
            'action'      => null,
            'moduleID'    => null
        ],
        1 => ['permID' => 2,
            'code'        => "test_permission",
            'description' => "description 1",
            'categoryID'  => 2,
            'action'      => 'View',
            'moduleID'    => 2
        ],
        2 => ['permID' => 3,
            'code'        => "test_permission2",
            'description' => "description 2",
            'categoryID'  => 3,
            'action'      => 'Edit',
            'moduleID'    => 5
        ],
        3 => ['permID' => 4,
            'code'        => "test_permission3",
            'description' => "description 3",
            'categoryID'  => 4,
            'action'      => 'View/Create',
            'moduleID'    => 5
        ]
    ];

    private $_moduleInfo = [
        0 => [
            'ID'     => 2,
            'Name'   => 'candidate_list',
            'Active' => 'Y',
        ],
        1 => [
            'ID'     => 5,
            'Name'   => 'timepoint_list',
            'Active' => 'Y',
        ],

    ];

    private $_userPermInfo = [0 => ['permID' => 1,
        'userID' => 1
    ],
        1 => ['permID' => 2,
            'userID' => 1
        ],
        2 => ['permID' => 3,
            'userID' => 1
        ]
    ];
    private $_categoryInfo = [0 => ['ID' => 1,
        'Description' => "superuser category"
    ],
        1 => ['ID' => 2,
            'Description' => "category 1"
        ],
        2 => ['ID' => 3,
            'Description' => "category 2"
        ]
    ];
    /**
     * User object used for testing
     *
     * @var User object
     */
    private $_user;
    /**
     * Secondary user object used to test insert and update functions
     *
     * @var User object
     */
    private $_otherUser;

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
     * Test double for Database object for hasLoggedIn method
     *
     * @note This is needed for User::hasLoggedIn because it declares and uses
     *       the database differently than other methods in the User class.
     *       This can be changed when the rest of the User class updates how it
     *       declares its database. - Alexandra Livadas
     *
     * @var \Database | PHPUnit\Framework\MockObject\MockObject
     */
    private $_mockDB;

    /**
     * Maps config names to values
     * Used to set behaviour of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = [];
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

        $mockconfig = $this->getMockBuilder('NDB_Config')->getMock();
        $mockdb     = $this->getMockBuilder('Database')->getMock();

        '@phan-var \Database $mockdb';
        '@phan-var \NDB_Config $mockconfig';

        $this->_mockDB     = $mockdb;
        $this->_mockConfig = $mockconfig;

        $this->_userInfoComplete       = $this->_userInfo;
        $this->_userInfoComplete['ID'] = '1';
        $this->_userInfoComplete['Privilege']           = '1';
        $this->_userInfoComplete['language_preference'] = '2';
        $this->_userInfoComplete['Sites']      = 'psc_test;psc_test2';
        $this->_userInfoComplete['examiner']   = ['pending' => 'N',
            '1'       => ['Y',
                1
            ],
            '4'       => ['Y',
                1
            ]
        ];
        $this->_userInfoComplete['CenterIDs']  = ['1', '4'];
        $this->_userInfoComplete['ProjectIDs'] = ['1', '3'];
        $passwordHash = (new \Password(
            $this->_userInfo['Password']
        ))->__toString();
        $this->_userInfo['Password_hash']         = $passwordHash;
        $this->_userInfoComplete['Password_hash'] = $passwordHash;

        $this->_setUpTestDoublesForFactoryUser();
        $this->_user = \User::factory(self::USERNAME);
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
     * Test factory() method retrieves all the information of the user
     * and correctly populates the user object. Also tests that getData returns
     * all the user information  as an array when no parameters are given
     *
     * @return void
     * @covers User::singleton
     * @covers User::factory
     * @covers User::getData
     */
    public function testFactoryRetrievesUserInfo()
    {
        $this->_user = \User::factory(self::USERNAME);
        //validate _user Info
        $this->assertEquals($this->_userInfoComplete, $this->_user->getData());
    }

    /**
     * Test that getData retrieves the correct information when given a
     * specific attribute
     *
     * @return void
     * @covers User::getData
     */
    public function testGetDataForLanguagePreferences()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            $this->_userInfoComplete['language_preference'],
            $this->_user->getData('language_preference')
        );
    }

    /**
     * Test that getFullname returns the correct full name of the user
     *
     * @return void
     * @covers User::getFullname
     */
    public function testGetFullname()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            $this->_userInfoComplete['Real_name'],
            $this->_user->getFullname()
        );
    }

    /**
     * Test that getId returns the correct ID of the user
     *
     * @return void
     * @covers User::getId
     */
    public function testGetId()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            $this->_userInfoComplete['ID'],
            $this->_user->getId()
        );
    }

    /**
     * Test that getUsername returns the correct UserID of the user
     *
     * @return void
     * @covers User::getUsername
     */
    public function testGetUsername()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            $this->_userInfoComplete['UserID'],
            $this->_user->getUsername()
        );
    }

    /**
     * Test that getSiteNames returns the site names in the correct format
     *
     * @return void
     * @covers User::getSiteNames
     */
    public function testSiteNames()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            ['psc_test', 'psc_test2'],
            $this->_user->getSiteNames()
        );
    }

    /**
     * Test that getCenterIDs returns the correct array of center IDs of the user
     *
     * @return void
     * @covers User::getCenterIDs
     */
    public function testGetCenterIDs()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            $this->_userInfoComplete['CenterIDs'],
            $this->_user->getCenterIDs()
        );
    }

    /**
     * Test that getProjectIDs returns the correct array of project IDs of the user
     *
     * @return void
     * @covers User::getProjectIDs
     */
    public function testGetProjectIDs()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            $this->_userInfoComplete['ProjectIDs'],
            $this->_user->getProjectIDs()
        );
    }

    /**
     * Test that getLanguagePreference returns the correct integer from the user
     *
     * @return void
     * @covers User::getLanguagePreference
     */
    public function testGetLanguagePreference()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertEquals(
            $this->_userInfoComplete['language_preference'],
            $this->_user->getLanguagePreference()
        );
    }

    /**
     * Test that getExaminerSites returns the correct array of sites for the user
     * and that the array is formatted correctly
     *
     * @return void
     * @covers User::getExaminerSites
     */
    public function testGetExaminerSites()
    {
        $this->_user = \User::factory(self::USERNAME);
        $result      = ['1' => ['Y', 1],
            '4' => ['Y', 1]
        ];
        $this->assertEquals(
            $result,
            $this->_user->getExaminerSites()
        );
    }

    /**
     * Test that getStudySites returns the correct array of sites
     * that are classified as study sites for the user
     * and that the array is formatted correctly
     *
     * @return void
     * @covers User::getStudySites
     */
    public function testGetStudySites()
    {
        $this->_user = \User::factory(self::USERNAME);
        $result      = ['1' => 'psc_test',
            '4' => 'psc_test2'
        ];
        $this->assertEquals(
            $result,
            $this->_user->getStudySites()
        );
    }

    /**
     * Test that hasStudySite returns true when the user has study sites
     *
     * @return void
     * @covers User::hasStudySite
     */
    public function testHasStudySites()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertTrue($this->_user->hasStudySite());
    }

    /**
     * Test that isEmailValid returns true when the email is valid
     *
     * @return void
     * @covers User::isEmailValid
     */
    public function testIsEmailValid()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertTrue($this->_user->isEmailValid());
    }

    /**
     * Test that isEmailValid returns false when the email has an invalid format
     *
     * @return void
     * @covers User::isEmailValid
     */
    public function testIsEmailValidWhenInvalid()
    {
        $this->_dbMock->run("DROP TEMPORARY TABLE users");
        $invalidEmailInfo          = $this->_userInfo;
        $invalidEmailInfo['Email'] = 'invalidemail.ca';
        $this->_dbMock->setFakeTableData(
            "users",
            [0=> $invalidEmailInfo]
        );
        $this->_user = \User::factory(self::USERNAME);
        $this->assertFalse($this->_user->isEmailValid());
    }

    /**
     * Test that hasCenter returns true when the user has this center ID
     *
     * @return void
     * @covers User::hasCenter
     */
    public function testHasCenterWhenTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertTrue($this->_user->hasCenter(new CenterID("4")));
    }

    /**
     * Test that hasCenter returns false when the user does not have this center ID
     *
     * @return void
     * @covers User::hasCenter
     */
    public function testHasCenterWhenFalse()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertFalse($this->_user->hasCenter(new CenterID("5")));
    }

    /**
     * Test that hasProject returns true when the user has this project ID
     *
     * @return void
     * @covers User::hasProject
     */
    public function testHasProjectWhenTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertTrue($this->_user->hasProject(new \ProjectID("3")));
    }

    /**
     * Test that hasProject returns false when the user does not have this project ID
     *
     * @return void
     * @covers User::hasProject
     */
    public function testHasProjectWhenFalse()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertFalse($this->_user->hasProject(new \ProjectID("5")));
    }

    /**
     * Test that isUserDCC returns true when the user belongs to DCC
     *
     * @return void
     * @covers User::isUserDCC
     */
    public function testIsUserDCC()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->assertTrue($this->_user->isUserDCC());
    }

    /**
     * Test that insert correctly adds a user to the users table
     *
     * @note   The factory method is used here to check that the information has
     *         been added to the database and can then be correctly populated
     *         into a new user object.
     * @return void
     * @covers User::insert
     */
    public function testInsert()
    {
        $newUserInfo           = $this->_userInfo;
        $newUserInfo['ID']     = 2;
        $newUserInfo['UserID'] = '968776';
        $newUserInfo['Email']  = 'notjohn.doe@mcgill.ca';
        \User::insert($newUserInfo);
        $this->_otherUser = \User::factory('968776');
        $this->assertEquals('968776', $this->_otherUser->getUsername());
    }

    /**
     * Test that update correctly updates a field of the given user object
     *
     * @return void
     * @covers User::update
     */
    public function testUpdate()
    {
        // Insert the user so that it can be updated.
        $newUserInfo           = $this->_userInfo;
        $newUserInfo['ID']     = 2;
        $newUserInfo['UserID'] = '968776';
        $newUserInfo['Email']  = 'notjohn.doe@mcgill.ca';
        \User::insert($newUserInfo);

        // Test the update.
        $this->_otherUser = \User::factory('968776');
        $newInfo          = ['ID' => '3'];
        $this->_otherUser->update($newInfo);
        $this->_otherUser = \User::factory('968776');
        $this->assertEquals('3', $this->_otherUser->getData('ID'));
    }

    /**
     * Test that updatePassword updates
     * the 'Password_hash' and 'PasswordChangeRequired'
     * fields when both the new password and expiration are specified
     *
     * @return void
     * @covers User::updatePassword
     */
    public function testUpdatePasswordWithExpiration()
    {
        $this->_user     = \User::factory(self::USERNAME);
        $oldHash         = $this->_user->getData('Password_hash');
        $passwordExpired = true;

        // Cause usePwnedPasswordsAPI config option to return false.
        $mockConfig = &$this->_mockConfig;

        $this->_factory->setConfig($mockConfig);

        '@phan-var \PHPUnit\Framework\MockObject\MockObject $mockConfig';
        $mockConfig->expects($this->any())
            ->method('settingEnabled')
            ->willReturn(false);

        $this->_user->updatePassword(
            new \Password(\Utility::randomString(16)),
            $passwordExpired
        );
        //Re-populate the user object now that the password has been changed
        $this->_user = \User::factory(self::USERNAME);

        $this->assertEquals(true, $this->_user->getData('PasswordChangeRequired'));
        // This checks that the hash has been updated. There is no way to predict
        // what the new hash will be, so simply check that it changed!
        $this->assertNotEquals($oldHash, $this->_user->getData('Password_hash'));
    }

    /**
     * Test that updatePassword causes a new password to not be expired by
     * default.
     *
     * @return void
     * @covers User::updatePassword
     */
    public function testUpdatePasswordWithoutExpiry()
    {
        $this->_user = \User::factory(self::USERNAME);

        $oldHash = $this->_user->getData('Password_hash');

        // Cause usePwnedPasswordsAPI config option to return false.
        $this->_mockConfig->expects($this->any())
            ->method('settingEnabled')
            ->willReturn(false);

        $mockConfig = &$this->_mockConfig;
        $this->_factory->setConfig($mockConfig);

        $this->_user->updatePassword(
            new \Password(\Utility::randomString(16))
        );

        //Re-populate the user object now that the password has been changed
        $this->_user = \User::factory(self::USERNAME);

        $this->assertEquals(0, $this->_user->getData('PasswordChangeRequired'));
        $this->assertNotEquals($oldHash, $this->_user->getData('Password_hash'));
    }

    /**
     * Test that hasLoggedIn returns true when the user has succesfully logged in
     * once, which is specified in the 'user_login_history_table'
     *
     * @return void
     * @covers User::hasLoggedIn
     */
    public function testHasLoggedInWhenTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        $count       = 1;
        $this->_mockDB->expects($this->any())
            ->method('pselectOneInt')
            ->with(
                $this->stringContains("FROM user_login_history")
            )
            ->willReturn($count);
        $this->_factory->setDatabase($this->_mockDB);

        $this->assertTrue($this->_user->hasLoggedIn());
    }

    /**
     * Test that hasLoggedIn returns false when the user has never succesfully
     * logged in once, which is specified in the 'user_login_history_table'
     *
     * @return void
     * @covers User::hasLoggedIn
     */
    public function testHasLoggedInWhenFalse()
    {
        $this->_user = \User::factory(self::USERNAME);
        $count       = 0;
        $this->_mockDB->expects($this->any())
            ->method('pselectOneInt')
            ->with(
                $this->stringContains("FROM user_login_history")
            )
            ->willReturn($count);
        $this->assertFalse($this->_user->hasLoggedIn());
    }

    /**
     * Test that isPasswordDifferent returns true when the input does not match
     * the Password_hash in the database.
     *
     * @return void
     * @covers User::isPasswordDifferent
     */
    public function testPasswordChangedReturnsTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        // Should return true (i.e. the password has changed) because random
        // strings should not generate a match.
        $this->assertTrue(
            $this->_user->isPasswordDifferent(
                \Utility::randomString()
            )
        );
    }

    /**
     * Test that isPasswordDifferent returns false when the input matches the
     * Password_hash in the database.
     *
     * @return void
     * @covers User::isPasswordDifferent
     */
    public function testPasswordChangedReturnsFalse()
    {
        // Update the password again to make sure another test hasn't
        // interfered.
        $this->_user = \User::factory(self::USERNAME);
        $password    = $this->_userInfo['Password'];
        $this->_user->updatePassword(
            new \Password($password)
        );

        //Re-populate the user object now that the password has been changed
        $this->_user = \User::factory(self::USERNAME);

        $this->assertFalse($this->_user->isPasswordDifferent($password));
    }

    /**
     * Test that getLastLogin returns a \DateTime object when the query returns
     * a timestamp
     *
     * @return void
     * @covers User::getLastLogin
     */
    public function testGetLastLoginWhenNotEmpty()
    {
        $this->_user = \User::factory(self::USERNAME);
        $timestamp   = '2020-06-15 09:49:23';
        $this->_mockDB->expects($this->any())
            ->method('pselectOne')
            ->with(
                $this->stringContains("WHERE Login_timestamp <")
            )
            ->willReturn($timestamp);

        $this->assertEquals(
            new \DateTime('2020-06-15 09:49:23'),
            $this->_user->getLastLogin($this->_mockDB)
        );
    }

    /**
     * Test that getLastLogin returns null when the query returns empty
     *
     * @return void
     * @covers User::getLastLogin
     */
    public function testGetLastLoginWhenEmpty()
    {
        $this->_user = \User::factory(self::USERNAME);
        $timestamp   = '';
        $this->_mockDB->expects($this->any())
            ->method('pselectOne')
            ->with(
                $this->stringContains("WHERE Login_timestamp <")
            )
            ->willReturn($timestamp);

        $this->assertEquals(
            null,
            $this->_user->getLastLogin($this->_mockDB)
        );
    }

    /**
     * Test that isAccessibleBy returns true if the given user
     * has a matching center ID and project ID
     *
     * @return void
     * @covers User::isAccessibleBy
     */
    public function testIsAccessibleByTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        $mockUser    = $this->getMockBuilder('\User')->getMock();
        $mockUser->expects($this->once())->method("getCenterIDs")
            ->willReturn([1, 2]);
        $mockUser->expects($this->once())->method("getProjectIDs")
            ->willReturn([1, 3]);
        '@phan-var \User $mockUser';
        $this->assertTrue($this->_user->isAccessibleBy($mockUser));
    }

    /**
     * Test that isAccessibleBy returns false if the given user
     * has no matching center IDs or project IDs
     *
     * @return void
     * @covers User::isAccessibleBy
     */
    public function testIsAccessibleByFalse()
    {
        $this->_user = \User::factory(self::USERNAME);
        $mockUser    = $this->getMockBuilder('\User')->getMock();
        $mockUser->expects($this->once())->method("getCenterIDs")
            ->willReturn([2, 2]);
        $mockUser->expects($this->once())->method("getProjectIDs")
            ->willReturn([4, 4]);
        '@phan-var \User $mockUser';

        $this->assertFalse($this->_user->isAccessibleBy($mockUser));
    }

    /**
     * Test that the select function from UserPermissions returns false
     * if there is no user for the given username
     *
     * @covers UserPermissions::select
     * @return void
     */
    public function testUserPermissionsSelectFalse()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->assertFalse($this->_user->select("111111"));
    }

    /**
     * Test that the select function from UserPermissions returns true
     * if the user exists and correctly sets the permissions of the user.
     * Also tests that hasPermission returns true when given a correct
     * permission code
     *
     * @covers UserPermissions::select
     * @covers UserPermissions::hasPermission
     * @return void
     */
    public function testUserPermissionsSelectTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->assertTrue($this->_user->select(self::USERNAME));
        $this->assertTrue($this->_user->hasPermission("test_permission"));
    }

    /**
     * Test that hasAllPermissions throws an exception if an
     * empty array is given
     *
     * @covers UserPermissions::hasAllPermissions
     * @return void
     */
    public function testHasAllPermissionsThrowsException()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->expectException('LorisException');
        $this->_user->hasAllPermissions([]);
    }

    /**
     * Test that hasAllPermissions returns true if the user
     * has all the permissions in the array
     *
     * @covers UserPermissions::hasAllPermissions
     * @return void
     */
    public function testHasAllPermissionsReturnsTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->assertTrue(
            $this->_user->hasAllPermissions(
                ["superuser", "test_permission", "test_permission2"]
            )
        );
    }

    /**
     * Test that hasAllPermissions returns false if the user does not have
     * all of the permissions given in the array
     *
     * @covers UserPermissions::hasAllPermissions
     * @covers UserPermissions::removePermissions
     * @return void
     */
    public function testHasAllPermissionsReturnsFalse()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_user->removePermissions([3]);
        $this->assertFalse(
            $this->_user->hasAllPermissions(
                ["superuser", "test_permission", "test_permission2"]
            )
        );
    }

    /**
     * Test that hasAnyPermission throws an exception if the array
     * given is void
     *
     * @covers UserPermissions::hasAnyPermission
     * @return void
     */
    public function testHasAnyPermissionThrowsException()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->expectException('LorisException');
        $this->_user->hasAnyPermission([]);
    }

    /**
     * Test that hasAnyPermission returns true if the user has the
     * given permissions
     *
     * @covers UserPermissions::hasAnyPermission
     * @return void
     */
    public function testHasAnyPermissionReturnsTrue()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->assertTrue(
            $this->_user->hasAnyPermission(["superuser", "test_permission2"])
        );
    }

    /**
     * Test that getPermissions returns the array of permissions the user has
     *
     * @covers UserPermissions::getPermissions
     * @return void
     */
    public function testGetPermissions()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->assertEquals(
            $this->_user->getPermissions(),
            ['superuser' => true,
                'test_permission'  => true,
                'test_permission2' => true,
                'test_permission3' => false
            ]
        );
    }

    /**
     * Test that addPermissions adds the permission with the given permID
     * to the list of user permissions
     *
     * @covers UserPermissions::addPermissions
     * @return void
     */
    public function testAddPermissions()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_user->addPermissions([4]);
        $this->assertEquals(
            $this->_user->getPermissions(),
            ['superuser' => true,
                'test_permission'  => true,
                'test_permission2' => true,
                'test_permission3' => true
            ]
        );
    }

    /**
     * Test that removePermissions removes all the user's permissions
     * if there is no parameter given
     *
     * @covers UserPermissions::removePermissions
     * @return void
     */
    public function testRemoveAllPermissions()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_user->removePermissions();
        $this->assertEquals(
            $this->_user->getPermissions(),
            ['superuser' => false,
                'test_permission'  => false,
                'test_permission2' => false,
                'test_permission3' => false
            ]
        );
    }

    /**
     * Test that removePermissions removes the permission with the given
     * permID from the user's permissions
     *
     * @covers UserPermissions::removePermissions
     * @return void
     */
    public function testRemovePermissions()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_user->removePermissions([3, 4]);
        $this->assertEquals(
            $this->_user->getPermissions(),
            ['superuser' => true,
                'test_permission'  => true,
                'test_permission2' => false,
                'test_permission3' => false
            ]
        );
    }

    /**
     * Test that getPermissionIDs returns the list of permission IDs for the user
     *
     * @covers UserPermissions::getPermissionIDs
     * @return void
     */
    public function testGetPermissionIDs()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->assertEquals($this->_user->getPermissionIDs(), [1, 2, 3]);
    }

    /**
     * Test that getPermissionsVerbose returns the list of user permissions
     * with all the information from the database
     *
     * @covers UserPermissions::getPermissionsVerbose
     * @return void
     */
    public function testGetPermissionsVerbose()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_dbMock->setFakeTableData(
            "permissions_category",
            $this->_categoryInfo
        );
        $this->_dbMock->setFakeTableData(
            "modules",
            $this->_moduleInfo
        );

        $loris = new \LORIS\LorisInstance(
            $this->_dbMock,
            new \NDB_Config(),
            [__DIR__ . "/../../modules"],
        );
        $this->assertEquals(
            $this->_user->getPermissionsVerbose($loris),
            [
                0 => ['permID' => '2',
                    'code'        => "test_permission",
                    'description' => "description 1",
                    'type'        => "category 1",
                    'action'      => "View",
                    'moduleID'    => '2',
                    'label'       => "Access Profile: View description 1"
                ],
                1 => ['permID' => '3',
                    'code'        => "test_permission2",
                    'description' => "description 2",
                    'type'        => "category 2",
                    'action'      => "Edit",
                    'moduleID'    => '5',
                    'label'       => "Timepoint List: Edit description 2"
                ],
                2 => ['permID' => '4',
                    'code'        => 'test_permission3',
                    'description' => 'description 3',
                    'type'        => null,
                    'action'      => 'View/Create',
                    'moduleID'    => '5',
                    'label'       => 'Timepoint List: View/Create description 3'
                ]
            ]
        );
    }

    /**
     * Test that hasCenterPermission returns true when the user
     * has superuser permissions
     *
     * @covers User::hasCenterPermission
     * @return void
     */
    public function testHasCenterPermissionTrueWithSuperuser()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->assertTrue(
            $this->_user->hasCenterPermission(
                "test_permission",
                new CenterID("1"),
            )
        );
    }

    /**
     * Test that hasCenterPermission returns true if the user does not have
     * superuser permissions but has the given permission code and center ID
     *
     * @covers User::hasCenterPermission
     * @covers UserPermissions::removePermissions
     * @return void
     */
    public function testHasCenterPermissionTrueWithoutSuperuser()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_user->removePermissions([1]);
        $this->assertTrue(
            $this->_user->hasCenterPermission(
                "test_permission",
                new \CenterID("1"),
            )
        );
    }

    /**
     * Test that hasCenterPermission returns false if the user does not have
     * the given permissions code
     *
     * @covers User::hasCenterPermission
     * @covers UserPermissions::removePermissions
     * @return void
     */
    public function testHasCenterPermissionIncorrectPermission()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_user->removePermissions([1, 3]);
        $this->assertFalse(
            $this->_user->hasCenterPermission(
                "test_permission2",
                new \CenterID("1"),
            )
        );
    }

    /**
     * Test that hasCenterPermission returns false if the user does not have
     * superuser permissions and does not have the given center ID
     *
     * @covers User::hasCenterPermission
     * @covers UserPermissions::removePermissions
     * @return void
     */
    public function testHasCenterPermissionIncorrectCenter()
    {
        $this->_user = \User::factory(self::USERNAME);
        $this->_setPermissions();
        $this->_user->removePermissions([1]);
        $this->assertFalse(
            $this->_user->hasCenterPermission(
                "test_permission",
                new \CenterID("2"),
            )
        );
    }

    /**
     * Set up user permissions. Used to reset the permissions at the beginning of
     * every permissions-related unit test
     *
     * @return void
     */
    private function _setPermissions()
    {
        $this->_dbMock->run("DROP TEMPORARY TABLE IF EXISTS permissions");
        $this->_dbMock->run("DROP TEMPORARY TABLE IF EXISTS user_perm_rel");
        $this->_dbMock->setFakeTableData(
            "permissions",
            $this->_permInfo
        );
        $this->_dbMock->setFakeTableData(
            "user_perm_rel",
            $this->_userPermInfo
        );
        $this->_user->select(self::USERNAME);
    }

    /**
     * Set up the fake tables in the database to set up a new user object
     *
     * @return void
     */
    private function _setUpTestDoublesForFactoryUser()
    {
        $this->_dbMock->setFakeTableData(
            "users",
            [0 => $this->_userInfo]
        );
        $this->_dbMock->setFakeTableData(
            "psc",
            $this->_pscInfo
        );
        $this->_dbMock->setFakeTableData(
            "Project",
            $this->_projectInfo
        );
        $this->_dbMock->setFakeTableData(
            "user_psc_rel",
            $this->_uprInfo
        );
        $this->_dbMock->setFakeTableData(
            "user_project_rel",
            $this->_uprojrInfo
        );
        $this->_dbMock->setFakeTableData(
            "examiners",
            $this->_examinerInfo
        );
        $this->_dbMock->setFakeTableData(
            "examiners_psc_rel",
            $this->_eprInfo
        );
    }
}

