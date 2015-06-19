<?php
/**
 * Created by PhpStorm.
 * User: kmarasinska
 * Date: 19/06/15
 * Time: 12:17 PM
 */

class NDB_FactoryTest extends PHPUnit_Framework_TestCase {

    /**
     * Instance of NDB_Factory used in tests
     *
     * @var NDB_Factory
     */
    private $_factory;

    /**
     * Creates instance of NDB_Factory
     *
     * @return void
     */
    protected function setUp()
    {
        $this->_factory = NDB_Factory::singleton();
    }

    /**
     * Unset factory static variables between each test
     *
     * @return void
     */
    protected function tearDown()
    {
        $this->_factory->reset();
    }


    /**
     * Test config() method returns instance of NDB_Config object
     *
     * @covers NDB_Factory::config
     * @return void
     */
    public function testConfigReturnsConfigObject()
    {
        $this->assertInstanceOf('NDB_Config', $this->_factory->config(CONFIG_XML));
    }

    /**
     * Test user() method returns instance of User object
     *
     * @covers NDB_Factory::user
     * @return void
     */
    public function testUserReturnsUserObject()
    {
        $userStub = $this->getMockBuilder('User')->getMock();
        $this->_factory->setUser($userStub);

        $this->assertInstanceOf('User', $this->_factory->user());
    }

    /**
     * Test database() method returns instance of Database object
     *
     * @covers NDB_Factory::database
     * @return void
     */
    public function testDatabaseReturnsDatabaseObject()
    {
        $dbStub = $this->getMockBuilder('Database')->getMock();
        $this->_factory->setDatabase($dbStub);

        $this->assertInstanceOf('Database', $this->_factory->database());
    }

    /**
     * Test couchDB() method returns instance of CouchDB object
     *
     * @covers NDB_Factory::couchDB
     * @return void
     */
    public function testCouchDBReturnsCouchDBObject()
    {
        $this->assertInstanceOf('CouchDB', $this->_factory->couchDB());
    }
}
