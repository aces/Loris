<?php declare(strict_types=1);
/**
 * Unit test for Password class
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
require_once __DIR__ . '/../../vendor/autoload.php';

use PHPUnit\Framework\TestCase;
/**
 * Unit test for Password class
 *
 * @category Tests
 * @package  Main
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class PasswordTest extends TestCase
{
    protected const VALID_PASSWORD = 'correct horse battery staple';

    /**
     * Test double for NDB_Config object
     *
     * @var \NDB_Config | PHPUnit\Framework\MockObject\MockObject
     */
    private $_configMock;

    /**
     * Test double for Database object
     *
     * @var \Database | PHPUnit\Framework\MockObject\MockObject
     */
    private $_dbMock;

    /**
     * NDB_Factory used in tests.
     * Test doubles are injected to the factory object.
     *
     * @var NDB_Factory
     */
    private $_factory;

    private $_configInfo = [0 => ['65' => 'false']];

    /**
     * Setup
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();

        $this->_factory = NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
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
     * DataProviders for constructor invalid values
     *
     * @return []
     */
    public function invalidValues(): array
    {
        return [
            // Should fail for not meeting length requirements
            [implode('', range(1, Password::getMinimumPasswordLength() - 1))],
            // Should fail for being an alphabet subset
            ['abcdefghi'],
            // Should fail based on dictionary attack ('hunter2' is a meme)
            ['hunter22'],
            // Should fail for simplicity
            ['8chars!!'],
            // Should fail based on using a common name
            ['johnnyloris'],
            // Should fail for obvious reasons
            ['password'],
            // Should fail for using just a few simple English words
            ['i am cool'],
            // Should fail for common L33T substitutions
            ['p@55w0rd1!']
        ];
    }


    /**
     * Test the CandID constructor with invalid values
     *
     * @param string $invalidValue An invalid value
     *
     * @dataProvider invalidValues
     *
     * @expectedException \InvalidArgumentException
     * @return            void
     */
    public function testContructorInvalidValues($invalidValue): void
    {
        $this->expectException("InvalidArgumentException");
        $this->_configMock->expects($this->any())
            ->method('getSetting')
            ->willReturn('false');

        new \Password($invalidValue);
    }

    /**
     * Ensures that a password object is returned when given valid input. No
     * exceptions should be thrown.
     *
     * @return void
     */
    public function testWellFormedPassword(): void
    {
        $this->assertInstanceOf('Password', new \Password(self::VALID_PASSWORD));
    }

    /**
     * Ensures the toString function of Password returns a password hash
     * that can be verified.
     *
     * @return void
     */
    public function testToString(): void
    {
        $password = new \Password(self::VALID_PASSWORD);
        $this->assertTrue(
            password_verify(self::VALID_PASSWORD, (string) $password)
        );
    }
}
