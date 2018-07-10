<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../htdocs/api/v0.0.1/Login.php';
require_once __DIR__ . '/BaseTestCase.php';

class Login_Test extends BaseTestCase
{
    function setUp() {
        date_default_timezone_set("UTC");
        parent::setUp();
    }

    function testValidMethods() {
        $API = new \Loris\API\Login("POST", array());
        $this->assertEquals($API->AllowedMethods, ['POST']);
    }

    function testInvalidPasswordFails() {
        $Login= $this->getMockBuilder('\SinglePointLogin')->getMock();
        $Login->method("passwordAuthenticate")->will($this->returnValue(false));
        $Login->_lastError = 'I am a test case';

        $API = $this->getMockBuilder('\Loris\API\Login')->disableOriginalConstructor()->setMethods(['getEncodedToken', 'getLoginAuthenticator', 'header'])->getMock();

        $API->expects($this->once())->method('header')->with($this->equalTo("HTTP/1.1 401 Unauthorized"));

        $API->method("getLoginAuthenticator")->will($this->returnValue($Login));
        $API->__construct(
            'POST',
            array(
             'username' => 'MadeUp',
             'password' => 'fake'
            )
        );

        $this->assertEquals($API->JSON, [
            'error' => 'I am a test case'
            ]);

    }

    /**
     * PhanParamTooMany is incorrectly being triggered by the mockBuilders because
     * it uses reflection. Phan thinks it takes 0 parameters for the constructor,
     * but doing so would cause all the tests to fail.
     *
     * @phan-file-suppress PhanParamTooMany
     */
    function testValidPasswordReturnsToken() {
        $Login= $this->getMockBuilder('\SinglePointLogin')->getMock();
        $Login->method("passwordAuthenticate")->will($this->returnValue(true));

        $API = $this->getMockBuilder('\Loris\API\Login')->disableOriginalConstructor()->setMethods(['getEncodedToken', 'getLoginAuthenticator', 'header'])->getMock();

        $API->method("getLoginAuthenticator")->will($this->returnValue($Login));
        $API->method("getEncodedToken")->will($this->returnValue("FakeToken"));

        $API->expects($this->once())->method("getEncodedToken");
        $API->__construct(
            'POST',
            array(
             'username' => 'MadeUp',
             'password' => 'fake'
            )
        );

        $this->assertEquals($API->JSON, [
            "token" => "FakeToken"
        ]);

    }
}

?>
