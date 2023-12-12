<?php declare(strict_types=1);
/**
 * This contains tests relevant to the Login endpoint
 *
 * PHP Version 7
 *
 * @category   API
 * @package    Tests
 * @subpackage Login
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\api\Test;

use \PHPUnit\Framework\TestCase;
use \Laminas\Diactoros\ServerRequest;

/**
 * PHPUnit class for API Login tests
 *
 * @category   API
 * @package    Tests
 * @subpackage Login
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class LoginTest extends TestCase
{
    /**
     * A PSR Request object representing the incoming request
     * to test.
     *
     * @var \Psr\Http\Message\ServerRequestInterface
     */
    private $_request;

    /**
     * A SinglePointLogin instances used for authentication
     *
     * @var \SinglePointLogin
     */
    private $_authenticator;

    /**
     * Provide an autoloader for the api module namespace.
     *
     * @return void
     */
    public static function setUpBeforeClass(): void
    {
        spl_autoload_register(
            function ($class) {
                if (strpos($class, "LORIS\\api\\") === 0) {
                    $fpath = __DIR__ . "/../php/"
                    . strtolower(substr($class, strlen("LORIS\\api\\")))
                    . ".class.inc";
                    $fpath = str_replace('\\', '/', $fpath);
                    if (!file_exists($fpath)) {
                        throw new \NotFound(
                            "Could not load module `api`: file `$fpath` " .
                            "does not exist"
                        );
                    }
                    include $fpath;
                }
            }
        );
    }

    /**
     * Set a blank server request and the mock authenticator.
     *
     * @return void
     */
    public function setUp(): void
    {
        $this->_request = new ServerRequest();

        $authenticator = $this->createMock('\SinglePointLogin');
        '@phan-var \SinglePointLogin $authenticator';
        $this->_authenticator = $authenticator;
    }

    /**
     * This checks if, given correct credentials, an HTTP 200 response
     * is return and that its body is a JSON string with a token key.
     *
     * @return void
     */
    public function testLoginSuccess(): void
    {
        $authenticator = $this->_authenticator;
        '@phan-var \PHPUnit\Framework\MockObject\MockObject $authenticator';

        $authenticator->expects($this->once())
            ->method('passwordAuthenticate')
            ->with('test_username', 'test_password')
            ->willReturn(true);

        $handler = $this->getMockBuilder('\LORIS\api\Endpoints\Login')
            ->addMethods(['getLoginAuthenticator', 'getEncodedToken'])
            ->getMock();

        $handler->expects($this->once())
            ->method('getLoginAuthenticator')
            ->willReturn($authenticator);

        $handler->expects($this->once())
            ->method('getEncodedToken')
            ->willReturn('jwt_token');
        '@phan-var \LORIS\api\Endpoints\Login $handler';

        $request = $this->_request
            ->withAttribute('pathparts', ['login'])
            ->withAttribute('LORIS-API-Version', 'v0.0.3')
            ->withAttribute('user', new \LORIS\AnonymousUser())
            ->withMethod('POST')
            ->withBody(
                new \LORIS\Http\StringStream(
                    '{"username":"test_username", "password":"test_password"}'
                )
            );

        $response = $handler->handle($request);

        $this->assertEquals(
            200,
            $response->getStatusCode()
        );

        $this->assertEquals(
            ['token' => 'jwt_token'],
            json_decode((string) $response->getBody(), true)
        );
    }
}

