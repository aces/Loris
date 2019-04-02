<?php
/**
 * Unit test for NDB_BVL_Instrument class
 *
 * PHP Version 7.3
 *
 * @category Tests
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use PHPUnit\Framework\TestCase;
/**
 * Unit test for NDB_BVL_Instrument class
 *
 * @category Tests
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_BVL_Instrument_Test extends TestCase
{
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
     * Maps config names to values
     * Used to set behavior of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = array();


    /**
     * Sets up fixtures:
     *  - _candidate object
     *  - config and Database test doubles
     *  - _factory
     *
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();


        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();

        $this->_factory   = \NDB_Factory::singleton();

        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
//        $this->_page = $this->getMockBuilder('NDB_BVL_Page')->getMock();
//        $this->_Instrument = $this->getMockBuilder('NDB_BVL_Instrument')->getMock();
        
        
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
     * Test select() method retrieves all _candidate and related info
     * @expectedException        Exception
     */
    public function testFactory()
    {
        $this->expectException(\NDB_BVL_Instrument::factory("test_instrument", "", "", true));
    }
    
}
