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
    /*
     * dataProviders for constructor invalid values
     */
    public function invalidValues(): array
    {
        return array(
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
            // Should fail for using a recent year
            ['Spring2016!'],
            // Should fail for using just a few simple English words
            ['i am cool'],
            // Should fail for common L33T substitutions
            ['p@55w0rd1!']
        );
    }

    /**
     * @dataProvider invalidValues
     * @expectedException \DomainException
     */
    public function testContructorInvalidValues($invalidValue): void
    {
        new Password($invalidValue);
    }

    /**
     * Ensures that a password object is returned when given valid input. No
     * exceptions should be thrown.
     *
     * @return void
     */
    public function testWellFormedPassword(): void {
        $this->assertInstanceOf('Password', new Password(self::VALID_PASSWORD));
    }

    /*
     * Ensures the toString function of Password returns a password hash
     * that can be verified.
     *
     * @return void
     */
    public function testToString(): void
    {
        $password = new Password(self::VALID_PASSWORD);
        $this->assertTrue(
            password_verify(self::VALID_PASSWORD, (string) $password)
        );
    }
}
