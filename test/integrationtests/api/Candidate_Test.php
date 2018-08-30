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
        $token           = $this->httpclient->getJWT(
            $api_credentials['username'],
            $api_credentials['password']
        );

        $this->httpclient = $this->httpclient->withJWT($token);
    }

    public function setUp()
    {
        $db = $this->factory->database();
        $db->insert(
            "candidate",
            array(
             'CandID'      => '900000',
             'PSCID'       => 'TST0001',
             'CenterID'    => 1,
             'Active'      => 'Y',
             'UserID'      => 1,
             'Entity_type' => 'Human',
            )
        );
        $db->insert(
            'session',
            array(
             'ID'            => '999999',
             'CandID'        => '900000',
             'Visit_label'   => 'Test',
             'CenterID'      => 1,
             'Current_stage' => 'Not Started',
            )
        );
    }

    public function tearDown()
    {
        $db = $this->factory->database();
        $db->delete("session", array('CandID' => '900000'));
        $db->delete("candidate", array('CandID' => '900000'));
    }

    public function testCandidatesGet()
    {
        $response = $this->httpclient->lorisGET(
            'Candidates.php?PrintCandidates=true'
        );
        $this->assertEquals(200, $response->getStatusCode(), $response->getBody());
    }

    public function testCandidatesCandIdGet()
    {
        $response = $this->httpclient->lorisGET(
            'candidates/Candidate.php?CandID=900000&PrintCandidate=true'
        );
        $this->assertEquals(200, $response->getStatusCode(), $response->getBody());
    }
}
