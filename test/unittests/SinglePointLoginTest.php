<?php declare(strict_types=1);

/**
 * SinglePointLogin tests
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

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
     * JWT key used for testing
     *
     * @var string
     */
    private $_jwtKey;
    /**
     * Maps config names to values
     * Used to set behaviour of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = [];

    /**
     * Setup
     *
     * @return void
     */
    protected function setUp(): void
    {
        $factory    = NDB_Factory::singleton();
        $mockdb     = $this->getMockBuilder("\Database")->getMock();
        $mockconfig = $this->getMockBuilder("\NDB_Config")->getMock();

        $key = 'example_key_that_is_long_enough_for_hs256';

        $mockconfig->method('getSetting')
            ->willReturnMap(
                [
                    ['JWTKey', $key],
                ]
            );

        '@phan-var \Database $mockdb';
        '@phan-var \NDB_Config $mockconfig';
        $factory->setConfig($mockconfig);
        $factory->setDatabase($mockdb);

        $methodsToKeep = ['JWTAuthenticate', 'PasswordAuthenticate', 'authenticate'];
        $allMethods    = get_class_methods('SinglePointLogin');
        $exceptMethods = array_values(array_diff($allMethods, $methodsToKeep));

        $login = $this->getMockBuilder('SinglePointLogin')
            ->onlyMethods($exceptMethods)
            ->getMock();

        '@phan-var \SinglePointLogin $login';
        $this->_login = $login;

        // Store the key for tests
        $this->_jwtKey = $key;
    }

    /**
     * Test JWTAuthenticate with valid token
     *
     * @return void
     */
    function testJWTAuthenticateReturnsTrueForValidToken()
    {
        $payload = [
            'sub'  => '1234567890',
            'user' => 'UnitTester'
        ];

        $token = \Firebase\JWT\JWT::encode($payload, $this->_jwtKey, 'HS256');

        $this->assertTrue($this->_login->JWTAuthenticate($token));
    }

    /**
     * Test JWTAuthenticate with invalid signature
     *
     * @return void
     */
    function testJWTAuthenticateFailsWithInvalidSignature()
    {
        // Same token as testJWTAuthenticateReturnsTrueForValidToken,
        // except with the payload changed to
        // {
        //   "sub": "1234567890",
        //   "user": "UnitTester2"
        // }
        // and the signature not changed
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
        // Valid token with payload
        // {
        //   "sub": "1234567890",
        //   "exp" : "5",
        //   "user": "UnitTester"
        // }
        $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                 . ".eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoiNSIsInVzZXIiOi"
        . "JVbml0VGVzdGVyIn0"
                 . ".oOlr8TmPchulpIOu7N4mzS1UolOIUiLmTXZhAkyrKs4";

        $this->assertFalse($this->_login->JWTAuthenticate($token));
    }
}
