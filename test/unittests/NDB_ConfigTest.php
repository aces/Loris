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
class FakeConfig extends NDB_Config
{
    public function __construct()
    {
    }
}
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

        $this->_config     = FakeConfig::singleton();
        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();
        $this->_factory    = \NDB_Factory::singleton();
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
    }

    /**
     * Test configFilePath() method. Passing a "config.xml" will return "config.xml"
     *
     * @return void
     */
    public function testconfigFilePath()
    {
        $text = $this->_config::configFilePath("config.xml");
        $this->assertContains("config.xml", $text);

    }
    /**
     * Test convertToArray() method. Passing a xml file, it will return an array
     *
     * @return void
     */
    public function testXmltoArray()
    {
        $xml  = new SimpleXMLElement("<test><unit>test</unit></test>");
        $text = $this->_config::convertToArray($xml);
        $this->assertEquals(array('unit' => 'test'), $text);
    }
    /**
     * Test isNumericArray() method. Passing an array will return true.
     * Passing an empty array will return false.
     *
     * @return void
     */
    public function testIsNumericArray()
    {
        $arrayTest1 = array();
        $arrayTest2 = array(
                       '0' => 'zero',
                       '1' => 'one',
                      );
        $text       = $this->_config::isNumericArray($arrayTest1);
        $this->assertEquals(true, $text);
        $text = $this->_config::isNumericArray($arrayTest2);
        $this->assertEquals(true, $text);
    }
    /**
     * Test getSettingFromDB() method. Giving any of (database,sandbox,
     * showDatabaseQueries), it will return null.
     */
    public function testGetSettingFromDB()
    {
        $this->assertNull($this->_config->getSettingFromDB("database"));
        $this->assertNull($this->_config->getSettingFromDB("sandbox"));
        $this->assertNull($this->_config->getSettingFromDB("showDatabaseQueries"));
    }
    /**
     * Test getSettingFromXML() method.Passing an array,
     * it will parse the node value of the array as XML.
     *
     * @return void
     */
    public function testGetSettingFromXML()
    {
        $this->_config->_settings = array('aaa' => array("bbb" => "test"));
        $this->assertEquals("test", $this->_config->getSettingFromXML("bbb"));
    }
    /**
     * Test getSetting() method. Passing an array, it will parse the value.
     *
     * @return void
     */
    public function testGetSetting()
    {
        $this->_config->_settings = array('aaa' => array("bbb" => "unittest"));
        $this->assertEquals("unittest", $this->_config->getSetting("bbb"));

    }
    /**
     * Test getProjectSettings() method. Passing a projecID will return
     * an array of project infomation.
     *
     * @return void
     */
    public function testGetProjectSettings()
    {
        $info   = array(
                   'ProjectID'         => '999',
                   'Name'              => 'test',
                   'recruitmentTarget' => '100',
                  );
        $result =  array(
                    'id'                => '999',
                    'Name'              => 'test',
                    'recruitmentTarget' => '100',
                   );
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($info);
        $this->assertEquals($result, $this->_config->getProjectSettings(999));

    }
    /**
     * Test getSubprojectSettings() method. Passing a projecID will return
     * an array of Subproject infomation.
     *
     * @return void
     */
    public function testGetSubprojectSettings()
    {
        $info1  = array(
                   'SubprojectID'      => '999',
                   'title'             => 'test',
                   'useEDC'            => 'true',
                   'WindowDifference'  => 'optimal',
                   'RecruitmentTarget' => '100',
                  );
        $result =  array(
                    'id'                => '999',
                    'title'             => 'test',
                    'options'           => array(
                                            'useEDC'           => 'true',
                                            'WindowDifference' => 'optimal',
                                           ),
                    'RecruitmentTarget' => '100',
                   );

        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($info1);
        $this->assertEquals($result, $this->_config->getSubprojectSettings(999));

    }
    /**
     * Test getSubprojectSettings() method. Passing a projecID will return
     * an array of Subproject infomation.
     * Giving an invalid id, will return an empty array.
     *
     * @return void
     */
    public function testGetSubprojectSettingsWithFakeID()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(null);
        $this->assertEquals(array(), $this->_config->getSubprojectSettings(111));
    }
    /**
     * Test getExternalLinks() method.Passing a valid ExternalLink, it will return an array.
     *
     * @return void
     */
    public function testGetExternalLinks()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')->willReturn(array(array('LinkURL' => 'github/Loris', 'LinkText' => 'GitHub')));
        $this->assertEquals(array('GitHub' => 'github/Loris'), $this->_config->getExternalLinks('GitHub'));
    }
}
