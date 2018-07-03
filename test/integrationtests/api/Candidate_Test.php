<?php
namespace LORIS\integrationtests;

require_once('ApiTestCase.php');

class Canditate_Test extends ApiTestCase
{
    public function __construct()
    {
        parent::__construct();
 
        $config   = $this->factory->Config(CONFIG_XML);

        $token = $this->httpclient->getAuthorizationToken(
            'admin',
            'testpassword'
        );
 
        $this->httpclient = $this->httpclient->withAuthorizationToken($token);
    }

    public function setUp() {
    }

    public function tearDown() {
    }

    public function testCandidatesGet() {
        $response = $this->httpclient->lorisGET('candidates/');
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testCandidatesCandIdGet() {
        $response = $this->httpclient->lorisGET('candidates/105657');
        $this->assertEquals(200, $response->getStatusCode());
    }
}
