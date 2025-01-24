<?php

declare(strict_types=1);

require_once __DIR__ . '/../../vendor/autoload.php';
use PHPUnit\Framework\TestCase;

/**
 * Unit test for SinglePointLogin class
 *
 * @category Tests
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SinglePointLoginTest extends TestCase
{
    /**
     * The SinglePointLogin mock for testing
     *
     * @var \SinglePointLogin
     */
    private $_login;

    /**
     * Maps config names to values
     * Used to set behaviour of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = [];

    /**
     * Setup the test environment
     *
     * @return void
     */
    protected function setUp(): void
    {
        $Factory    = NDB_Factory::singleton();
        $mockdb     = $this->getMockBuilder("\Database")->getMock();
        $mockconfig = $this->getMockBuilder("\NDB_Config")->getMock();

        $this->_configMap = [
            [
                'JWTKey',
                "example_key"
            ],
        ];

        $mockconfig->method('getSetting')
            ->willReturnMap($this->_configMap);

        '@phan-var \Database $mockdb';
        '@phan-var \NDB_Config $mockconfig';
        $Factory->setConfig($mockconfig);
        $Factory->setDatabase($mockdb);

        $method       = ['JWTAuthenticate', 'PasswordAuthenticate', 'authenticate'];
        $AllMethods   = get_class_methods('SinglePointLogin');
        $exceptMethod = array_diff($AllMethods, $method);
        $login        = $this->getMockBuilder('SinglePointLogin')
            ->onlyMethods(array_values($exceptMethod)) // Fixed here
            ->getMock();

        '@phan-var \SinglePointLogin $login';
        $this->_login = $login;
    }

    /**
     * Test JWTAuthenticate with valid token
     *
     * @return void
     */
    function testJWTAuthenticateReturnsTrueForValidToken()
    {
        // Example token for valid authentication
        $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
        . ".eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6IlVuaXRUZXN0ZXIifQ"
        . ".7ehZPgCqOxMfJChi8qn8ZmtfLTlxZmIsrpQLuN3LEEY";
        $this->assertTrue($this->_login->JWTAuthenticate($token));
    }

    /**
     * Test JWTAuthenticate with invalid signature
     *
     * @return void
     */
    function testJWTAuthenticateFailsWithInvalidSignature()
    {
        // Example token with invalid signature
        $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                 . ".eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6IlVuaXRUZXN0ZXIyIn0"
                 . ".7ehZPgCqOxMfJChi8qn8ZmtfLTlxZmIsrpQLuN3LEEY";
        $this->assertFalse($this->_login->JWTAuthenticate($token));
    }

    /**
     * Test JWTAuthenticate with Algorithm None
     *
     * @return void
     */
    function testJWTAuthenticateFailsWithAlgorithmNone()
    {
        $token = "eyJhbGciOiJOb25lIiwidHlwIjoiSldUIn0"
                 . ".eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6IlVuaXRUZXN0ZXIyIn0"
                 . ".ac6UpRubGFg27ALCXBGRCXTjNMi_BxJJqrcCdPdKmuk";
        $this->assertFalse($this->_login->JWTAuthenticate($token));
    }

    /**
     * Test JWTAuthenticate with expired token
     *
     * @return void
     */
    function testJWTAuthenticateFailsWithExpiredToken()
    {
        // Example expired token
        $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                 . ".eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoiNSIsInVzZXIiOi"
                 . "JVbml0VGVzdGVyIn0"
                 . ".oOlr8TmPchulpIOu7N4mzS1UolOIUiLmTXZhAkyrKs4";
        $this->assertFalse($this->_login->JWTAuthenticate($token));
    }
}

