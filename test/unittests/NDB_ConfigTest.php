<?php
/**
 * Unit test for NDB_Config class
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use PHPUnit\Framework\TestCase;
/**
 * Unit test for NDB_Config class
 *
 * @category Tests
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_ConfigTest extends TestCase
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
     * @var NDB_Config | PHPUnit_Framework_MockObject_MockObject
     */
    private $_configMock;

    /**
     * Test double for Database object
     *
     * @var Database | PHPUnit_Framework_MockObject_MockObject
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
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();


        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_config     = NDB_Config::singleton();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();

        $this->_factory   = NDB_Factory::singleton();

        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
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
        unset($this->_config);
         $this->_config     = NDB_Config::singleton();
    }

    /**
     * Test select() method retrieves all _candidate and related info
     *
     * @return void
     */
    public function testconfigFilePath()
    {
        $text = $this->_config::configFilePath("config.xml");
        $this->assertContains("config.xml", $text);
        

    }
    /**
     * Test select() method retrieves all _candidate and related info
     *
     * @return void
     */
    public function testXmltoArray()
    {
        $xml = new SimpleXMLElement("<test><unit>1</unit></test>");
        $text = $this->_config::convertToArray($xml);
        $this->assertEquals(array('unit'=>'1'), $text);
    }
    /**
     * Test select() method retrieves all _candidate and related info
     *
     * @return void
     */
    public function testIsNumericArray()
    { 
        $arrayTest1 = array();
        $arrayTest2 = array('0'=>'zero','1'=>'one');
        $text = $this->_config::isNumericArray($arrayTest1);
        $this->assertEquals(true, $text);
        $text = $this->_config::isNumericArray($arrayTest2);
        $this->assertEquals(true, $text);
    }
    /**
     * Test select() method retrieves all _candidate and related info
     *
     * @return void
     */
    public function testGetSettingFromDB()
    {
        $this->assertNull($this->_config::getSettingFromDB("database"));
        $this->assertNull($this->_config::getSettingFromDB("sandbox"));
        $this->assertNull($this->_config::getSettingFromDB("showDatabaseQueries"));
    }
    /**
     * Test select() method retrieves all _candidate and related info
     *
     * @return void
     */
    public function testGetSettingFromXML()
    {
        $this->_config->_settings = array('aaa' => array("bbb"=>"test"));
        $this->assertEquals("test",$this->_config->getSettingFromXML("bbb"));
    }
//todo change comments. add more test cases.

}
