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

/* Login to LORIS and get JWT authentication token. */
// Note: I have created the below file on my system so it is not included in the
// source code. Please do the same or else create your own password-protection
// mechanism.

// Do basic testing

/*
$responses[] = $api->lorisGET('candidates/');
$responses[] = $api->lorisGET('candidates/105657');
$responses[] = $api->lorisGET('candidates/182999/V1');
$responses[] = $api->lorisGET('candidates/182999/V1/instruments');


$errors = checkForErrors($responses);
if (count($errors) > 0) {
    echo "The following errors occurred:" . PHP_EOL;
    print_r($errors);
    die;
}
echo "All tests went as expected. :)" . PHP_EOL;

function checkForErrors($responses, $key = '') : Array {

    if (is_null($responses)) {
        throw new Exception("Only null responses received...");
    }
    $failures = [];
    foreach($responses as $r) {
        if (array_key_exists('error', json_decode($r))) {
            $failures[] = $r;
        }
    }
    return $failures;
}
*/
