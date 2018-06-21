<?php

error_reporting(E_ALL);

/* Target information. Change as needed. */
const LORIS_BASE_URL = "https://nihpd-stg.loris.ca";
const LORIS_API_VERSION = "v0.0.3-dev";

/* Set user info */
const LORIS_USERNAME = "John"; // change to your username

/* Ensure required packages are installed on the system. */
getPrerequisites();

/* Login to LORIS and get JWT authentication token. */
$auth_token = login();

if (empty($auth_token)) {
    die(echoo("Login failed!"));
}
echoo("] Login successful! <Token: $auth_token>");

// Must be included in every other request going forward.
$headers[] = "Authorization: Bearer $auth_token";

// Get candidate info -- proof of concept for now
echoo(doLorisGet('candidates/', $headers));

function login() : String {
    /* Try logging in */
    $endpoint = "login/";
    $loris_password = getPassword(); // see the function doc below!
    $post_body = [
        "username" => LORIS_USERNAME,
        "password" => $loris_password,
    ];

    echoo("] Response:");
    $json = json_decode(doLorisPost($endpoint, $post_body));

    // If no JWT token returned, login failed.
    if (!array_key_exists('token', $json)) {
        return '';
    }
    return $json->token;
}

/** Generic curl GET request.  Builds the cURL handler and sets the options.
 *
 * @param string $url The resource to POST to.
 * @param array $headers Option HTTP Headers to add
 *
 * @return $string The HTTP response to the POST request.
 */
function doGet(String $url, $headers = []) : String {
    /* Build curl and set options */
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    // Follow redirects.
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    // Verbose debugging. 
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    // Capture response isntead of printing it
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Attach optional headers if present
    if ($headers) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}


/** Generic curl POST request.  Builds the cURL handler and sets the options 
 * corresponding to a POST request.
 *
 * @param string $url The resource to POST to.
 * @param mixed $post_body An array or string for the POST request body.
 *
 * @return $string The HTTP response to the POST request.
 */
function doPost(String $url, $post_body, $headers = []) : String {
    // change as needed

    /* Build curl and set options */
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    // POST mode, activate!
    curl_setopt($ch, CURLOPT_POST, 1);
    // Follow redirects
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    // Verbose debugging. Uncomment if desired.
    //curl_setopt($ch, CURLOPT_VERBOSE, true);
    // Capture response isntead of printing it
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Attach optional headers if present
    if ($headers) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    /* POST body */
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_body);


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
function doLorisPost(
    String $endpoint, 
    Array $post_body, 
    Array $headers = []
) : String {
    $full_url = prefix() . $endpoint;
    echoo("] Attempting POST request to <$full_url>");
    echoo("] POST body: " . PHP_EOL);
    echoo($post_body);
    return doPost($full_url, json_encode($post_body), $headers);
}

/** A wrapper for doGet that takes away some of the clutter when making a 
 * request to LORIS.  Specfically this function will append the necessary url
 * and versioned API prefix.
 * For debugging purposes it will echo the endpoint it is requesting
 *
 * @param string $endpoint The URL to POST data to.
 * @param array $headers Option HTTP Headers
 *
 * @return string The HTTP response given by doPost.
 */
function doLorisGet(
    String $endpoint, 
    Array $headers = []
) : String {
    $full_url = prefix() . $endpoint;
    echoo("] Attempting GET request to <$full_url>");
    return doGet($full_url, $headers);
}

/** Install required apt packages.
 */
function getPrerequisites() : Void {
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
}

/** Get password from credential file.  This is done so that the password is 
 * never written in this source code and accidentally committed to git.
 */
function getPassword() : String {
    // $_SERVER['HOME'] will give a user's home folder even when running
    // locally.  PHP will not resolve '~' given in paths, so we must use this
    // environment variable.
    $password_path = "{$_SERVER['HOME']}/.loris/credentials";
    if (!file_exists($password_path)) {
        die(
            "] Oops! You forgot to add your LORIS credentials." 
            . PHP_EOL
            . "Please consider creating the file $password_path containing your "
            . "password so that it is not included in the source code."
            . PHP_EOL
        );
    }
    return trim(file_get_contents($password_path));
}

/** Return API prefix. Avoids the need to type this out everytime we make an API
 * call.
 */
function prefix() : String {
    return LORIS_BASE_URL . '/api/' . LORIS_API_VERSION . '/';
}

/** Friendly platform-independent echo function so that you don't have to add
 * PHP_EOL to everything.  Arrays are printed with print_r.  Objects (such as a
 * JSON response) are printed with var_dump.  Everything else is echoed.
 *
 * @param string $messsage The content to output.
 */
function echoo($content) : Void {
    if (is_array($content)) {
        print_r($content) . PHP_EOL;
    } else if (is_object($content)) {
        var_dump($content) . PHP_EOL;
    }
    else {
        echo $content . PHP_EOL;
    }
}
