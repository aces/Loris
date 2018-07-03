<?php
namespace LORIS\integrationtests;

require_once('ApiTestCase.php');

class Project_Test extends ApiTestCase
{
    public function __construct()
    {
        parent::__construct();
 
        $config   = $this->factory->Config(CONFIG_XML);

        $api_credentials = $config->getSetting('api');
        $token = $this->httpclient->getAuthorizationToken(
            $api_credentials['username'],
            $api_credentials['password']
        );
 
        $this->httpclient = $this->httpclient->withAuthorizationToken($token);
    }

    public function setUp() {
    }

    public function tearDown() {
    }

    public function testProjectsGet() {
        $response = $this->httpclient->lorisGET('Projects.php?PrintProjects=true');
        $this->assertEquals(200, $response->getStatusCode());

        $projects = json_decode($response->getBody(), true)['Projects'] ?? null;
        $this->assertNotEmpty($projects);
        $project_name = get_object_vars($projects)[0];
        $first_projects = $projects[$project_name];
        
    }
}

