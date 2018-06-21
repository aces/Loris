<?php


error_reporting(E_ALL);

/* Ensure required packages are installed on the system */
if (!function_exists('curl_init')) {
    $Mv = PHP_MAJOR_VERSION;
    $mv = PHP_MINOR_VERSION;
    $cmd = "sudo apt-get install php$Mv.$mv-curl";
    echo "PHP-curl not found on the system. Installing it now." . PHP_EOL;
    echo "Please run this script again after installation completes." . PHP_EOL;
    die(shell_exec($cmd));
}
if (!function_exists('json_encode')) {
    $cmd = "sudo apt-get install php$Mv.$mv-curl";
    echo "PHP json not found on the system. Installing it now." . PHP_EOL;
    echo "Please run this script again after installation completes." . PHP_EOL;
    die(shell_exec($cmd));
}

$loris_username = "John";
$password_path = "{$_SERVER['HOME']}/.loris/credentials";
if (file_exists($password_path)) {
    $loris_password = trim(file_get_contents($password_path));
}

if (empty($loris_username) || empty($loris_password)) {
    die(
        "] Oops! You forgot to add your LORIS credentials." 
        . PHP_EOL
        . "Please consider creating the file $password_path containing your "
        . "password so that it is not included in the source code."
        . PHP_EOL
    );
}

/* Try logging in */
$endpoint = "login";
$post_body = [
    "username" => $loris_username,
    "password" => $loris_password,
];


echoo("] Response:");
$j = json_decode(doLorisPost($endpoint, $post_body));


/** Generic curl POST request.  Builds the cURL handler and sets the options 
 * corresponding to a POST request.
 *
 * @param string $url The resource to POST to.
 * @param mixed $post_body An array or string for the POST request body.
 *
 * @return $string The HTTP response to the POST request.
 */
function doPost(String $url, $post_body) : String {
    // change as needed

    /* Build curl and set options */
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    // for debugging. 
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    
    /* POST body */
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_body);

    // get response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

/** A wrapper for doPost that takes away some of the clutter when making a 
 * request to LORIS.  Specfically this function will append the necessary url
 * and versioned API prefix as well as JSON encode the POST body passed to it.
 * For debugging purposes it will echo the endpoint it is POSTing to as well as
 * the POST body.
 *
 * @param string $endpoint The URL to POST data to.
 * @param array $post_body The key-value pairs of the post body.
 *
 * @return string The HTTP response given by doPost.
 */
function doLorisPost(String $endpoint, Array $post_body) : String {
    $loris_url = "https://nihpd-stg.loris.ca";
    $api_version = "v0.0.3-dev";
    $api_prefix = "/api/$api_version/";
    $full_url = $loris_url . $api_prefix . $endpoint;
    echoo("] Attempting POST request to <$full_url>");
    echoo("] POST body: " . PHP_EOL);
    echoo($post_body);
    return doPost($full_url, json_encode($post_body));
}

/** Friendly platform-independent echo function so that you don't have to add
 * PHP_EOL to everything.
 */
function echoo($message) : Void {
    if (is_array($message)) {
        print_r($message) . PHP_EOL;
    }
    else {
        echo $message . PHP_EOL;
    }
}
