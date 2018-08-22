<?php
namespace LORIS\integrationtests;

require_once 'ApiTestCase.php';

class Canditate_Test extends ApiTestCase
{
    public function __construct()
    {
        parent::__construct();

        $config = $this->factory->Config(CONFIG_XML);

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
        $response = $this->httpclient->lorisGET(
            'Candidates.php?PrintCandidates=true'
        );
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testCandidatesCandIdGet()
    {
        $response = $this->httpclient->lorisGET(
            'candidates/Candidate.php?CandID=105657&PrintCandidate=true'
        );
        $this->assertEquals(200, $response->getStatusCode());
    }
}
