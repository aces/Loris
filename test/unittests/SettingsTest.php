<?php
/**
 * Setting class tests
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Test
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

use PHPUnit\Framework\TestCase;
/**
 * Unit test for Setting class
 *
 * @category Tests
 * @package  Main
 * @author   Karolina Marasinska <karolina.marasinska@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SettingsTest extends TestCase
{
    /**
     * Test double for NDB_Config object
     *
     */
    private $_configMock;

    /**
     * Setting object used for testing
     *
     */
    private $_settings;

    /**
     * Database config values returned by NDB_Config::getSetting()
     *
     */
    private $_databaseConfigValues = array();

    /**
     * Sets up fixtures:
     *  - config
     *  - _factory
     *
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->_configMock = $this->getMockBuilder('\NDB_Config')->getMock();

        $this->_settings = new Settings($this->_configMock);

        $this->_databaseConfigValues = array(
                                        'database' => 'LorisTestDB',
                                        'username' => 'testUser',
                                        'password' => 'APassWord',
                                        'host'     => 'localhost',
                                       );
    }

    /**
     * Data provider for testIsSandboxReturnsTrue($sandboxVal)
     * Returns different TRUE values
     *
     * @return array list of values equivalent to true
     */
    public function getTrueValue(): array
    {
        return array(
                array(true),
                array('TRUE'),
                array('1'),
                array(1),
                array('5'),
               );
    }

    /**
     * Test isSandbox() returns true when config value is
     *  - string 'TRUE'
     *  - number 1
     *  - string '5'
     *
     * @param mixed $sandboxVal sandbox config value to be returned
     *              by getSetting() mock
     *
     * @dataProvider getTrueValue
     *
     * @covers Settings::isSandbox
     * @return void
     */
    public function testIsSandboxReturnsTrue($sandboxVal): void
    {
        $this->_configMock->method('getSetting')
            ->willReturn($sandboxVal);

        $this->assertTrue($this->_settings->isSandbox());
    }

    /**
     * Data provider for testIsSandboxReturnsFalse($sandboxVal)
     * Returns different values equivalent to false
     *
     * @return array list of values equivalent to false
     */
    public function getFalseValue(): array
    {
        return array(
                array(false),
                array('FAlse'),
                array(0),
                array('0'),
                array(''),
                array(null),
               );
    }


    /**
     * Test isSandbox() returns false when config value is
     *  - string 'FAlse'
     *  - number 0
     *  - string '0'
     *  - an empty string
     *
     * @param mixed $sandboxVal sandbox config value to be returned
     *                          by getSetting() mock
     *
     * @dataProvider getFalseValue
     *
     * @covers Settings::isSandbox
     * @return void
     */
    public function testIsSandboxReturnsFalse($sandboxVal): void
    {
        $this->_configMock->method('getSetting')
            ->willReturn($sandboxVal);

        $this->assertFalse($this->_settings->isSandbox());
    }

    /**
     * Test that getBaseURL() calls getSetting('www') on the config object 
     * and returns the correct string if the 'LORIS_BASEURL' is empty
     *
     * @return void
     * @covers Settings::getBaseURL
     */
    public function testGetBaseURL()
    {
        $this->_configMock->expects($this->any())
            ->method('getSetting')
            ->with($this->equalTo('www'))
            ->willReturn(array('url' => 'test1.loris.ca'));

        $this->assertEquals("test1.loris.ca", $this->_settings->getBaseURL());
    }

    /**
     * Test that getBaseURL() returns the correct value from the 
     * 'LORIS_BASEURL' environment variable if it is set
     *
     * @return void
     * @covers Settings::getBaseURL
     */
    public function testGetBaseURLWithLorisBaseURL()
    {
        //putenv sets the environment variable:
        putenv("LORIS_BASEURL=test2.loris.ca");
        $this->assertEquals("test2.loris.ca", $this->_settings->getBaseURL());
        //Unset the environment variable:
        putenv("LORIS_BASEURL");
    }

    /**
     * Test dbName() returns correct database name
     *
     * @covers Settings::dbName
     * @return void
     */
    public function testDbNameReturnCorrectName(): void
    {
        $this->_setUpConfigDatabaseTestDouble();
        $this->assertEquals(
            $this->_databaseConfigValues['database'],
            $this->_settings->dbName()
        );
    }

    /**
     * Test dbHost() returns correct database name
     *
     * @covers Settings::dbHost
     * @return void
     */
    public function testDbHostReturnCorrectHost(): void
    {
        $this->_setUpConfigDatabaseTestDouble();
        $this->assertEquals(
            $this->_databaseConfigValues['host'],
            $this->_settings->dbHost()
        );
    }

    /**
     * Test dbUserName() returns correct user name
     *
     * @covers Settings::dbUserName
     * @return void
     */
    public function testDbUserNameReturnCorrectUserName(): void
    {
        $this->_setUpConfigDatabaseTestDouble();
        $this->assertEquals(
            $this->_databaseConfigValues['username'],
            $this->_settings->dbUserName()
        );
    }

    /**
     * Test dbPassword() returns correct password
     *
     * @covers Settings::dbPassword
     * @return void
     */
    public function testDbPasswordReturnCorrectPassword(): void
    {
        $this->_setUpConfigDatabaseTestDouble();
        $this->assertEquals(
            $this->_databaseConfigValues['password'],
            $this->_settings->dbPassword()
        );
    }

    /**
     * Test dbPassword() throws ConfigurationException when password
     * is not specified in config
     *
     * @covers Settings::dbPassword
     * @return void
     */
    public function testExceptionThrownWhenNoPasswordInConfig(): void
    {
        unset($this->_databaseConfigValues['password']);
        $this->_setUpConfigDatabaseTestDouble();

        $this->expectException('ConfigurationException');
        $this->_settings->dbPassword();
    }

    /**
     * Set up test doubles behavior for NDB_Config::getSetting() method
     * when called with 'database' param
     *
     * @return void
     */
    private function _setUpConfigDatabaseTestDouble(): void
    {
        $this->_configMock->expects($this->any())
            ->method('getSetting')
            ->with($this->equalTo('database'))
            ->willReturn($this->_databaseConfigValues);
    }
}

