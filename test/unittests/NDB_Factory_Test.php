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

    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->_factory = \NDB_Factory::singleton();
        //$this->_config = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_config = \NDB_Config::singleton();
    }

    /**
     * Test that the singleton function returns a new NDB_Factory object and
     * that the reset and setTesting functions properly set the properties of
     * the object
     *
     * @covers NDB_Factory::singleton
     * @covers NDB_Factory::reset
     * @covers NDB_Factory::setTesting
     * @return void
     */
    function testSetUp()
    {
        $this->assertEquals(\NDB_Factory::singleton(), $this->_factory);
        $this->_factory->reset();
        $this->assertNull(\NDB_Factory::$testdb);
        $this->assertNull(\NDB_Factory::$db);
        $this->assertNull(\NDB_Factory::$config);
        $this->_factory->setTesting(true);
        $this->assertTrue($this->_factory->Testing);
    }

    /**
     * Test that config sets the config variable
     *
     * @covers NDB_Factory::config
     * @return void
     */
    function testConfig()
    {
        $this->markTestSkipped("This method is never used");
        $this->_factory->setTesting(false);
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
            $this->_factory->setConfig($this->_config), $this->_config
        );
    }
}