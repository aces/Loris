<?php declare(strict_types=1);
/**
 * Unit test for NDB_Factory class
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use PHPUnit\Framework\TestCase;
use \LORIS\StudyEntities\Candidate\CandID;
/**
 * Unit test for NDB_Config class
 *
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Factory_Test extends TestCase
{
    private $_factory;
    private $_config;
    private $_DB;

    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        NDB_Config::$configInstance = null;
        $this->_factory = NDB_Factory::singleton();
        $this->_factory->reset();

        $this->_config = $this->_factory->Config(CONFIG_XML);
        $database      = $this->_config->getSetting('database');
        $this->_DB     = $this->_factory->database(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            true
        );

        $this->_factory->setDatabase($this->_DB);
        $this->_factory->setConfig($this->_config);
    }

    /**
     * Test that the singleton function returns a new NDB_Factory object and
     * that the reset function properly set the properties of
     * the object
     *
     * @covers NDB_Factory::singleton
     * @covers NDB_Factory::reset
     * @return void
     */
    function testSetUp()
    {
        $this->assertEquals(\NDB_Factory::singleton(), $this->_factory);
        $this->_factory->reset();
        $this->assertNull(\NDB_Factory::$testdb);
        $this->assertNull(\NDB_Factory::$db);
        $this->assertNull(\NDB_Factory::$config);
    }

    /**
     * Test that config sets the config variable
     *
     * @covers NDB_Factory::config
     * @return void
     */
    function testConfig()
    {
        $this->_factory->config();
        $this->assertEquals(
            NDB_Config::singleton('../project/config.xml'),
            \NDB_Factory::$config
        );
    }

    /**
     * Test that setConfig correctly sets the config variable
     *
     * @covers NDB_Factory::setConfig
     * @return void
     */
    function testSetConfig()
    {
        $this->assertEquals(
            $this->_factory->setConfig($this->_config),
            $this->_config
        );
    }

    /**
     * Test that user sets the user variable
     *
     * @covers NDB_Factory::user
     * @return void
     */
    function testUser()
    {
        $this->assertEquals(
            \User::singleton(),
            $this->_factory->user()
        );
    }

    /**
     * Test that setUser correctly sets the user variable
     *
     * @covers NDB_Factory::setUser
     * @return void
     */
    function testSetUser()
    {
        $user = \User::singleton();
        $this->assertEquals(
            $this->_factory->setUser($user),
            $user
        );
    }

    /**
     * Test that database sets the db variable and returns a database variable
     *
     * @covers NDB_Factory::database
     * @return void
     */
    function testDatabase()
    {
        $this->assertEquals($this->_DB, $this->_factory->database());
    }

    /**
     * Test that setDatabase sets both the db and testdb variables
     * to a new Database variable
     *
     * @covers NDB_Factory::setDatabase
     * @return void
     */
    function testSetDatabase()
    {
        $this->_factory->setDatabase($this->_DB);
        $this->assertEquals(\NDB_Factory::$db, $this->_DB);
        $this->assertEquals(\NDB_Factory::$testdb, $this->_DB);
    }

    /**
     * Test that couchDB throws an exception if only some of the
     * parameters are given
     *
     * @covers NDB_Factory::couchDB
     * @return void
     */
    function testCouchDBThrowsException()
    {
        $this->expectException('\ConfigurationException');
        $this->_factory->couchDB('test_db', 'test_host', 0);
    }

    /**
     * Test that couchDB sets and returns a couchDB variable
     * with the given parameters
     *
     * @covers NDB_Factory::couchDB
     * @return void
     */
    function testCouchDB()
    {
        $this->assertEquals(
            CouchDB::getInstance("db", "host", 1, "user", "pass"),
            $this->_factory->couchDB("db", "host", 1, "user", "pass")
        );
    }

    /**
     * Test that setCouchDB sets the couchDB variable to the given one
     *
     * @covers NDB_Factory::setCouchDB
     * @return void
     */
    function testSetCouchDB()
    {
        $couch = CouchDB::getInstance("db", "host", 1, "user", "pass");
        $this->assertEquals($couch, $this->_factory->setCouchDB($couch));
    }

    /**
     * Test that settings creates and returns a Settings variable
     * with the given config information and baseURl value. Also tests
     * that setBaseURL correctly sets the baseURL variable.
     *
     * @covers NDB_Factory::settings
     * @covers NDB_Factory::setBaseURL
     * @return void
     */
    function testSettings()
    {
        $this->_factory->setBaseURL("");
        $this->assertEquals(
            new Settings($this->_config, ""),
            $this->_factory->settings("/config.xml")
        );
    }

    /**
     * Test that project returns a Project variable with the given name
     *
     * @covers NDB_Page::project
     * @return void
     */
    function testProject()
    {
        $this->assertEquals(
            \Project::singleton("Rye"),
            $this->_factory->project("Rye")
        );
    }

    /**
     * Test that candidate creates and returns a Candidate object
     * with the given candID
     *
     * @covers NDB_Factory::candidate
     * @return void
     */
    function testCandidate()
    {
        $mockdb = $this->getMockBuilder("\Database")->getMock();
        $mockdb->expects($this->any())
            ->method('pselectRow')
            ->willReturn(['DCCID'=>'300001', 'RegistrationProjectID' => 1]);

        // Mock call for Candidate->select()
        $resultMock = $this->getMockBuilder('\LORIS\Database\Query')
            ->disableOriginalConstructor()
            ->getMock();
        $resultMock->method("getIterator")
            ->willReturn(
                new ArrayIterator(
                    [
                        [
                            "ID"        => 97,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ],
                        [
                            "ID"        => 98,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ]
                    ]
                )
            );
        $mockdb->method('pselect')->willReturn($resultMock);
        '@phan-var \Database $mockdb';

        $this->_factory->setDatabase($mockdb);

        $candID = new CandID("300001");
        $this->assertEquals(
            Candidate::singleton($candID),
            $this->_factory->candidate($candID)
        );
    }

    /**
     * Test that timepoint creates and returns a new TimePoint
     * object with the given SessionID
     *
     * @covers NDB_Factory::timepoint
     * @return void
     */
    function testTimepoint()
    {
        $mockdb     = $this->getMockBuilder("\Database")->getMock();
        $mockconfig = $this->getMockBuilder("\NDB_Config")->getMock();

        $mockdb->expects($this->any())
            ->method('pselectRow')
            ->willReturn(
                [
                    'SessionID' => '1',
                    'ProjectID' => 1,
                    'CandID'    => 123456
                ]
            );

        '@phan-var \NDB_Config $mockconfig';
        '@phan-var \Database $mockdb';

        $this->_factory->setConfig($mockconfig);
        $this->_factory->setDatabase($mockdb);

        '@phan-var \NDB_Config $mockconfig';
        '@phan-var \Database $mockdb';

        $this->_factory->setConfig($mockconfig);
        $this->_factory->setDatabase($mockdb);

        $sessionID = new \SessionID("1");
        $this->assertEquals(
            \TimePoint::singleton($sessionID),
            $this->_factory->timepoint($sessionID)
        );
    }
}
