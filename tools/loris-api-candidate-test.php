<?php

include('LorisAPITool.class.inc');

$url = "https://nihpd-stg.loris.ca";
$api = new LorisAPITool($url);
/* Login to LORIS and get JWT authentication token. */
// Note: I have created the below file on my system so it is not included in the
// source code. Please do the same or else create your own password-protection
// mechanism.
$logged_in = $api->login("John", 
    trim(
        file_get_contents(
            "{$_SERVER['HOME']}/.loris/credentials"
        )
    )
);
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
