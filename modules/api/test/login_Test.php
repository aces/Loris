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

use PHPUnit\Framework\TestCase;
use \Zend\Diactoros\ServerRequest;

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
     * Set a blank server request and the mock authenticator.
     *
     * @return void
     */
    public function setUp()
    {
        $this->_request = new ServerRequest();

        $this->_authenticator = $this->createMock('\SinglePointLogin');
    }

    /**
     * This checks if, given correct credentials, a HTTP 200 response
     * is return and that its body is a JSON string with a token key.
     *
     * @return void
     */
    public function testLoginSuccess(): void
    {
        $this->_authenticator->expects($this->once())
            ->method('passwordAuthenticate')
            ->with('test_username', 'test_password')
            ->willReturn(true);

        $handler = $this->getMockBuilder('\LORIS\Api\Endpoints\Login')
            ->setMethods(['getLoginAuthenticator', 'getEncodedToken'])
            ->getMock();

        $handler->expects($this->once())
            ->method('getLoginAuthenticator')
            ->willReturn($this->_authenticator);

        $handler->expects($this->once())
            ->method('getEncodedToken')
            ->willReturn('jwt_token');

        $request = $this->_request
            ->withAttribute('pathparts', array('login'))
            ->withAttribute('LORIS-API-Version', 'v0.0.3-dev')
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
            array('token' => 'jwt_token'),
            json_decode((string) $response->getBody(), true)
        );
    }
}

