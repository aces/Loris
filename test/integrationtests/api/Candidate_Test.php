<?php
namespace LORIS\integrationtests;

require_once('HttpClient.php');

use \PHPUnit\Framework\TestCase;
use \Zend\Diactoros\Uri;
use \Zend\Diactoros\Request;

class Canditate_Test extends TestCase
{
    private $httpclient;
    private $factory;

    public function __construct()
    {
        parent::__construct();
        $this->factory  = \NDB_Factory::singleton();
 
        $config   = $this->factory->Config(CONFIG_XML);
        $dbconfig = $config->getSetting('database');

        $database = \Database::singleton(
            $dbconfig['database'],
            $dbconfig['username'],
            $dbconfig['password'],
            $dbconfig['host'],
            1
        );
        $this->factory->setDatabase($database);

        $httpclient = new \LORIS\tests\api\HttpClient(
            new Uri($this->factory->settings()->getBaseURL() . '/api/v0.0.3-dev/')
        );
        
        $api_credentials = $config->getSetting('api');
        $token = $httpclient->getAuthorizationToken(
            $api_credentials['username'],
            $api_credentials['password']
        );
 
        $this->httpclient = $httpclient->withAuthorizationToken($token);
    }

    public function setUp() {
    }

    public function tearDown() {
    }

    public function testCandidatesGetStatusCode() {
        $response = $this->httpclient->lorisGET('candidates/');
        $this->assertEquals(200, $response->getStatusCode());
    }
}
