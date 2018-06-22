<?php
namespace LORIS\integrationtests;

require_once('HttpClient.php');

use \PHPUnit\Framework\TestCase;

class Canditate_Test extends TestCase
{
    public function setUp() {
        // Add login step
    }

    public function testCandidatesGetStatusCode() {
        // Do test
    }
}

$url = "https://nihpd-stg.loris.ca";
$api = new \LORIS\tests\api\HttpClient($url);
/* Login to LORIS and get JWT authentication token. */
// Note: I have created the below file on my system so it is not included in the
// source code. Please do the same or else create your own password-protection
// mechanism.
$logged_in = $api->login("John", '!Demo40aa');
if (!$logged_in) {
    echo "Login failed!\n";
}

// Do basic testing

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
