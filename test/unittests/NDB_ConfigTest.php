<?php declare(strict_types=1);
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
use \LORIS\Installer\Database as Database;
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
    protected function setUp(): void
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
     * Test configFilePath() method. Giving a config file name (i.e.: "config.xml")
     * it should return the absolute path to the file.
     *
     * @return void
     */
    public function testconfigFilePath()
    {
        $text = $this->_config::configFilePath("config.xml");
        $this->assertContains("config.xml", $text);

    }
    /**
     * Test convertToArray() method. Giving an xml file,
     * it should return the array representation.
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
     * Test isNumericArray() method.
     * Passing an array with key range [0-n] should return true.
     *
     * @return void
     */
    public function testIsNumericArray()
    {
        $arrayTest = array(
                      '0' => 'zero',
                      '1' => 'one',
                     );
        $text      = $this->_config::isNumericArray($arrayTest);
        $this->assertEquals(true, $text);
    }
    /**
     * Test getSettingFromDB() method. Giving any of (database,sandbox,
     * showDatabaseQueries), it will return null.
     * If database class exists and the dabase returns 'AllowMultiple' => '0',
     * 'ParentID' => 'test', this method should return a non-null value.
     *
     */
    public function testGetSettingFromDB()
    {
        $this->assertNull($this->_config->getSettingFromDB("database"));
        $this->assertNull($this->_config->getSettingFromDB("sandbox"));
        $this->assertNull($this->_config->getSettingFromDB("showDatabaseQueries"));
        $this->_dbMock->expects($this->any())
            ->method('isConnected')
            ->willReturn('ture');
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(array(array('AllowMultiple' => '0', 'ParentID' => 'test')));
        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->willReturn('test');
        $this->assertNotNull($this->_config->getSettingFromDB("test"));

    }
    /**
     * Test getSettingFromXML() method.Giving an array,
     * it should return the value associated to a key.
     *
     * @return void
     */
    public function testGetSettingFromXML()
    {
        $this->_config->_settings = array('aaa' => array("bbb" => "test"));
        $this->assertEquals("test", $this->_config->getSettingFromXML("bbb"));
    }
    /**
     * Test getSetting() method. Giving an array, it should parse the value.
     *
     * @return void
     */
    public function testGetSetting()
    {
        $this->_config->_settings = array('aaa' => array("bbb" => "unittest"));
        $this->assertEquals("unittest", $this->_config->getSetting("bbb"));

    }
    /**
     * Test getProjectSettings() method. Giving a projectID, it should
     * return an array containing the project information.
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
     * Test getSubprojectSettings() method. Giving a projectID, it should
     * return an array containing the subproject information.
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
     * Test getSubprojectSettings() method. Giving a projectID, it should
     * return an array containing the subproject information.
     * Giving an invalid ID, it should return an empty array.
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
     * Test getExternalLinks() method.Giving a valid ExternalLink, it should
     * return an array containing the URL associated with the link text.
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
