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

// Get candidate info -- proof of concept for now
var_dump($api->doLorisGet('candidates/'));
