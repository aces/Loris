<?php
namespace LORIS\integrationtests;

require_once('ApiTestCase.php');

class Canditate_Test extends ApiTestCase
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

    public function testCandidatesGet() {
        $response = $this->httpclient->lorisGET('candidates/');
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testCandidatesCandIdGet() {
        $response = $this->httpclient->lorisGET('candidates/105657');
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
