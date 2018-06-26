<?php
namespace LORIS\integrationtests;

require_once('ApiCase.php');

class Login_Test extends ApiCase
{
    public function setUp() 
    {
    }

    public function tearDown() 
    {
    }

    public function testLoginSuccess()
    {
        $api_credentials = $this->factory->Config()->getSetting('api');
        $post_body = array(
            'username' => $api_credentials['username'],
            'password' => $api_credentials['password']
        );
        
        $response = $this->httpclient->lorisPOST('login/', $post_body);
        $this->assertEquals(200, $response->getStatusCode());
        
        $json = json_decode($response->getBody());
        $this->assertTrue(array_key_exists('token', $json));
    }

    public function testLogin400()
    {
        // Empty request body
        $post_body = array(
        );

        $response = $this->httpclient->lorisPOST('login/', $post_body);
        $this->assertEquals(400, $response->getStatusCode());

        // Missing username key in request body
        $post_body = array(
            'missing_username_key' => 'foo',
            'password' => 'bar'
        );

        $response = $this->httpclient->lorisPOST('login/', $post_body);
        $this->assertEquals(400, $response->getStatusCode());

        // Missing password key in request body
        $post_body = array(
            'username' => 'foo',
            'missing_password_key' => 'bar'
        );

        $response = $this->httpclient->lorisPOST('login/', $post_body);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testLogin401()
    {
        $api_credentials = $this->factory->Config()->getSetting('api');
        $post_body = array(
            'username' => $api_credentials['username'],
            'password' => 'wrong password'
        );

        $response = $this->httpclient->lorisPOST('login/', $post_body);
        $this->assertEquals(401, $response->getStatusCode());
    }
}

