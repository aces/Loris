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

/**
 * Fake NDB_Config class
 *
 * @category Tests
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class FakeConfig extends NDB_Config
{
    /**
     * Fake NDB_Config method to construct a fake config object
     *
     * @return void
     */
    public function __construct()
    {
    }
}
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
     * @var NDB_Config | PHPUnit\Framework\MockObject\MockObject
     */
    private $_configMock;

    /**
     * Test double for Database object
     *
     * @var \Database | PHPUnit\Framework\MockObject\MockObject
     */
    private $_dbMock;

    /**
     * Maps config names to values
     * Used to set behaviour of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = [];

    /**
     * A mock NDB_Config object
     *
     * @var \NDB_Config
     */
    private $_config;

    /**
     * Test double for User object
     *
     * @var User | PHPUnit\Framework\MockObject\MockObject
     */
    private $_user;

    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->_config = FakeConfig::singleton();
        $this->_config->clearCache();

        $configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $dbMock     = $this->getMockBuilder('Database')->getMock();
        $user       = $this->getMockBuilder('User')->getMock();

        '@phan-var \NDB_Config $configMock';
        '@phan-var \Database $dbMock';
        '@phan-var \User $user';

        $this->_configMock = $configMock;
        $this->_dbMock     = $dbMock;
        $this->_user       = $user;

        $this->_factory = \NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
        $this->_factory->setUser($this->_user);
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
        $this->_factory->reset();
    }

    /**
     * Test configFilePath() method. Given a config file name (i.e.: "config.xml")
     * it should return the absolute path to the file.
     *
     * @covers NDB_Config::configFilePath
     * @return void
     */
    public function testConfigFilePath()
    {
        $text = $this->_config->configFilePath("config.xml");
        $this->assertStringContainsString("config.xml", $text);

    }

    /**
     * Test convertToArray() method. Given an xml file,
     * it should return the array representation.
     *
     * @covers NDB_Config::convertToArray
     * @return void
     */
    public function testXmltoArray()
    {
        $xml  = new SimpleXMLElement("<test><unit>test</unit></test>");
        $text = $this->_config::convertToArray($xml);
        $this->assertEquals(['unit' => 'test'], $text);
    }

    /**
     * Test isNumericArray() method.
     * Passing an array with key range [0-n] should return true.
     *
     * @covers NDB_Config::isNumericArray
     * @return void
     */
    public function testIsNumericArray()
    {
        $arrayTest = [
            '0' => 'zero',
            '1' => 'one',
        ];
        $text      = $this->_config::isNumericArray($arrayTest);
        $this->assertEquals(true, $text);
    }

    /**
     * Test getSettingFromDB() method. Given any of (database,sandbox),
     * it will return null.
     * If database class exists and the dabase returns 'AllowMultiple' => '0',
     * 'ParentID' => 'test', this method should return a non-null value.
     *
     * @covers NDB_Config::getSettingFromDB
     * @return void
     */
    public function testGetSettingFromDB()
    {
        $this->assertNull($this->_config->getSettingFromDB("database"));
        $this->assertNull($this->_config->getSettingFromDB("sandbox"));
        $this->_dbMock->expects($this->any())
            ->method('isConnected')
            ->willReturn(true);
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn([['AllowMultiple' => '0', 'ParentID' => 'test']]);
        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->willReturn('test');
        $this->assertNotNull($this->_config->getSettingFromDB("test"));

    }
    /**
     * Test getSettingFromXML() method. Given an array,
     * it should return the value associated to a key.
     *
     * @covers NDB_Config::getSettingFromXML
     * @return void
     */
    public function testGetSettingFromXML()
    {
        $this->_config->_settings = ['aaa' => ["bbb" => "test"]];
        $this->assertEquals("test", $this->_config->getSettingFromXML("bbb"));
    }
    /**
     * Test getSetting() method. Giving an array, it should parse the value.
     *
     * @covers NDB_Config::getSetting
     * @return void
     */
    public function testGetSetting()
    {
        $this->_config->_settings = ['aaa' => ["bbb" => "unittest"]];
        $this->assertEquals("unittest", $this->_config->getSetting("bbb"));

    }

    /**
     * Test settingEnabled() method. If the setting is set to 'true' or 1,
     * the method should return true
     *
     * @covers NDB_Config::settingEnabled
     * @return void
     */
    public function testSettingEnabledWhenTrue()
    {
        $this->_config->_settings = ['aaa' => ["bbb" => "true",
            "ccc" => '1'
        ]
        ];
        $this->assertTrue($this->_config->settingEnabled("bbb"));
        $this->assertTrue($this->_config->settingEnabled("ccc"));
    }

    /**
     * Test settingEnabled() method. If the setting is not set to 'true' or 1,
     * the method should return false
     *
     * @covers NDB_Config::settingEnabled
     * @return void
     */
    public function testSettingEnabledWhenFalse()
    {
        $this->_config->_settings = ['aaa' => ["bbb" => "false"]];
        $this->assertFalse($this->_config->settingEnabled("bbb"));
    }

    /**
     * Test getProjectSettings() method. Given a projectID, it should
     * return an array containing the project information.
     *
     * @covers NDB_Config::getProjectSettings
     * @return void
     */
    public function testGetProjectSettings()
    {
        $info   = [
            'ProjectID'         => '999',
            'Name'              => 'test',
            'Alias'             => 'TST',
            'recruitmentTarget' => '100',
        ];
        $result =  [
            'id'                => '999',
            'Name'              => 'test',
            'Alias'             => 'TST',
            'recruitmentTarget' => '100',
        ];
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($info);
        $this->assertEquals($result, $this->_config->getProjectSettings(999));

    }
    /**
     * Test getCohortSettings() method. Given a projectID, it should
     * return an array containing the cohort information.
     *
     * @covers NDB_Config::getCohortSettings
     * @return void
     */
    public function testGetCohortSettings()
    {
        $info1  = [
            'CohortID'          => '999',
            'title'             => 'test',
            'useEDC'            => 'true',
            'WindowDifference'  => 'optimal',
            'RecruitmentTarget' => '100',
        ];
        $result =  [
            'id'                => '999',
            'title'             => 'test',
            'options'           => [
                'useEDC'           => 'true',
                'WindowDifference' => 'optimal',
            ],
            'RecruitmentTarget' => '100',
        ];

        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($info1);
        $this->assertEquals($result, $this->_config->getCohortSettings(999));

    }

    /**
     * Test getCohortSettings() method. Given a projectID, it should
     * return an array containing the cohort information.
     * Giving an invalid ID, it should return an empty array.
     *
     * @covers NDB_Config::getCohortSettings
     * @return void
     */
    public function testGetCohortSettingsWithFakeID()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(null);
        $this->assertEquals([], $this->_config->getCohortSettings(111));
    }

    /**
     * Test getExternalLinks() method. Given a valid ExternalLink, it should
     * return an array containing the URL associated with the link text.
     *
     * @covers NDB_Config::getExternalLinks
     * @return void
     */
    public function testGetExternalLinks()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['LinkURL' => 'github/Loris', 'LinkText' => 'GitHub']
                ]
            );
        $this->assertEquals(
            ['GitHub' => 'github/Loris'],
            $this->_config->getExternalLinks('GitHub')
        );
    }

}
