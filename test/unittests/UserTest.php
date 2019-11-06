<?php declare (strict_types=1);
/**
 * Unit tests for the User class
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
 * Unit tests for the User class
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
        = array('ID'                     => 1,
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
                'Password_expiry'        => '2020-07-16',
                'Pending_approval'       => 'Y',
                'Doc_Repo_Notifications' => 'Y',
                'language_preference'    => 2,
                'active_from'            => '2017-07-16',
                'active_to'              => '2020-07-16'
          );
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
    private $_pscInfo = array(0 => array('CenterID' => '1',
                                         'Name' => 'psc_test'),
                              1 => array('CenterID' => '4',
                                         'Name' => 'psc_test2')
                        );
    /**
     * Project table information
     *
     * @var array
     */
    private $_projectInfo = array(0 => array('ProjectID' => '1',
                                         'Name' => 'project_test'),
                              1 => array('ProjectID' => '3',
                                         'Name' => 'project_test2')
                        );


    /**
     * Examiners table information
     *
     * @var array
     */
    private $_examinerInfo = array(0 => array('full_name' => 'John Doe',
                                              'examinerID' => 1,
                                              'radiologist' => 1)
                             );
    /**
     * User_psc_rel table information
     *
     * @var array
     */
    private $_uprInfo = array(0 => array('UserID' => '1',
                                         'CenterID' => '1'),
                              1 => array('UserID' => '1',
                                         'CenterID' => '4')
                        );

    /**
     * User_psc_rel table information
     *
     * @var array
     */
    private $_uprojrInfo = array(0 => array('UserID' => '1',
                                         'ProjectID' => '1'),
                              1 => array('UserID' => '1',
                                         'ProjectID' => '3')
                        );
    /**
     * Examiners_psc_rel table information
     *
     * @var array
     */
    private $_eprInfo = array(0 => array('centerID' => '1',
                                         'examinerID' => 1,
                                         'active' => 'Y',
                                         'pending_approval' => 'N'),
                              1 => array('centerID' => '4',
                                         'examinerID' => 1,
                                         'active' => 'Y',
                                         'pending_approval' => 'N')
                        );
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
     * @var \NDB_Config | PHPUnit_Framework_MockObject_MockObject
     */
    private $_configMock;
    /**
     * Test double for Database object
     *
     * @var \Database | PHPUnit_Framework_MockObject_MockObject
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
     *@var \Database | PHPUnit_Framework_MockObject_MockObject
     */
    private $_mockDB;
    /**
     * Test double for Database object for hasLoggedIn method
     * 
     * @note This is needed for User::hasLoggedIn because it declares and uses
     *       the database differently than other methods in the User class.
     *       This can be changed when the rest of the User class updates how it
     *       declares its database. - Alexandra Livadas
     *
     * @var NDB_Factory
     */
    private $_mockFactory;
    /**
     * Maps config names to values
     * Used to set behavior of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = array();
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
        $this->_factory->setTesting(false);
        $this->_configMock = $this->_factory->Config(CONFIG_XML);
        $database          = $this->_configMock->getSetting('database');
        $this->_dbMock     = \Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            true
        );

        $this->_mockConfig = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_mockDB = $this->getMockBuilder('Database')->getMock();
        $this->_mockFactory = \NDB_Factory::singleton();
        $this->_mockFactory->setDatabase($this->_mockDB);
        $this->_factory->setConfig($this->_mockConfig);

        $this->_userInfoComplete = $this->_userInfo;
        $this->_userInfoComplete['ID'] = '1';
        $this->_userInfoComplete['Privilege'] = '1';
        $this->_userInfoComplete['language_preference'] = '2';
        $this->_userInfoComplete['Sites'] = 'psc_test;psc_test2';
        $this->_userInfoComplete['examiner'] = array('pending' => 'N',
                                                     '1'       => array('Y',
                                                                        1
                                                                  ),
                                                     '4'       => array('Y',
                                                                        1
                                                                  )
                                               );
        $this->_userInfoComplete['CenterIDs'] = array('1', '4');
        $this->_userInfoComplete['ProjectIDs'] = array('1', '3');

        $this->_user = \User::factory(self::USERNAME);
    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown()
    {
        parent::tearDown();
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
        $this->_setUpTestDoublesForFactoryUser();
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
            array('psc_test', 'psc_test2'),
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
        $result = array('1' => array('Y', 1),
                        '4' => array('Y', 1));
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
        $result = array('1' => 'psc_test',
                        '4' => 'psc_test2');
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
        $invalidEmailInfo = $this->_userInfo;
        $invalidEmailInfo['Email'] = 'invalidemail.ca';
        $this->_dbMock->setFakeTableData(
            "users", 
            array(0=> $invalidEmailInfo)
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
        $this->assertTrue($this->_user->hasCenter(4));
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
        $this->assertFalse($this->_user->hasCenter(5));
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
        $newUserInfo = $this->_userInfo;
        $newUserInfo['ID'] = 2;
        $newUserInfo['UserID'] = '968776';
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
        $this->_otherUser = \User::factory('968776');
        $newInfo = array('ID' => '3');
        $this->_otherUser->update($newInfo);
        $this->_otherUser = \User::factory('968776');
        $this->assertEquals('3', $this->_otherUser->getData('ID'));
    }

    /**
     * Test that updatePassword updates the 'Password_hash' and 'Password_expiry'
     * fields when both the new password and expiry date are specified
     *
     * @return void
     * @covers User::updatePassword
     */
    public function testUpdatePasswordWithExpiryDate()
    {
        $this->_user = \User::factory(self::USERNAME);
        $oldHash = $this->_user->getData('Password_hash');
        $customDate = '2021-07-18';

        // Cause usePwnedPasswordsAPI config option to return false.
        $this->_mockConfig->expects($this->any())
            ->method('settingEnabled')
            ->willReturn(false);

        $this->_user->updatePassword(
            new \Password(\Utility::randomString(16)), 
            new DateTime($customDate)
        );
        //Re-populate the user object now that the password has been changed
        $this->_user = \User::factory(self::USERNAME);

        $this->assertEquals($customDate, $this->_user->getData('Password_expiry'));
        // This checks that the hash has been updated. There is no way to predict
        // what the new hash will be, so simply check that it changed!
        $this->assertNotEquals($oldHash, $this->_user->getData('Password_hash'));
    }

    /**
     * Test that updatePassword updates the 'Password_hash' and 'Password_expiry'
     * fields when only the password is specified. The 'Password_expiry' should
     * be updated to today's date plus 6 months if not specified!
     *
     * @return void
     * @covers User::updatePassword
     */
    public function testUpdatePasswordWithoutExpiry()
    {
        $this->_user = \User::factory($this->_username);

        $oldHash = $this->_user->getData('Password_hash');
        $newDate = date('Y-m-d', strtotime('+6 months'));

        // Cause usePwnedPasswordsAPI config option to return false.
        $this->_mockConfig->expects($this->any())
            ->method('settingEnabled')
            ->willReturn(false);

        $this->_user->updatePassword(
            new \Password(\Utility::randomString(16))
        );
        //Re-populate the user object now that the password has been changed
        $this->_user = \User::factory($this->_username);

        $this->assertEquals($newDate, $this->_user->getData('Password_expiry'));
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
        $this->_user = \User::factory($this->_username);
        $count = 1;
        $this->_mockDB->expects($this->any())
            ->method('pselectOne')
            ->with(
                $this->stringContains("FROM user_login_history")
            )
            ->willReturn($count);

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
        $this->_user = \User::factory($this->_username);
        $count = 0;
        $this->_mockDB->expects($this->any())
            ->method('pselectOne')
            ->with(
                $this->stringContains("FROM user_login_history")
            )
            ->willReturn($count);
        $this->assertFalse($this->_user->hasLoggedIn());
    }

    /**
     * Test that isPasswordDifferent returns true when the input does not match
     * the Password_hash in the database.
     * Both the hash and the input are set to different random strings so a
     * match should never occur in this function.
     *
     * @return void
     * @covers User::isPasswordDifferent
     */
    public function testPasswordChangedReturnsTrue() {
        $this->_user = \User::factory(self::USERNAME);
        $this->_userInfo['Password_hash'] = password_hash(
            \Utility::randomString(),
            PASSWORD_DEFAULT
        );
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
    public function testPasswordChangedReturnsFalse() {
        $this->_user = \User::factory(self::USERNAME);
        $password = $this->_userInfo['Password'];
        $this->_userInfo['Password_hash'] = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        $this->assertFalse($this->_user->isPasswordDifferent($password));
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
            array(0 => $this->_userInfo)
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

