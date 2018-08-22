<?php
namespace LORIS\integrationtests;

require_once 'ApiTestCase.php';

class Canditate_Test extends ApiTestCase
{
    public function __construct()
    {
        parent::__construct();

        $config = $this->factory->Config(CONFIG_XML);
        $db     = $this->factory->database();
        $users  = $dp->pselect(
            'SELECT * FROM users',
            array()
        );
        var_dump($users);

        $api_credentials = $config->getSetting('api');
        $token           = $this->httpclient->getAuthorizationToken(
            $api_credentials['username'],
            $api_credentials['password']
        );

        $this->httpclient = $this->httpclient->withAuthorizationToken($token);
    }

    public function setUp()
    {
    }

    public function tearDown()
    {
    }

    public function testCandidatesGet()
    {
        $response = $this->httpclient->lorisGET('candidates/');
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testCandidatesCandIdGet()
    {
        $response = $this->httpclient->lorisGET('candidates/105657');
        $this->assertEquals(200, $response->getStatusCode());
    }
}
