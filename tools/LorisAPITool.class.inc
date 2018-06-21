<?php
/** This class provides an easy-to-use wrapper around the PHP cURL functions for
 * use with the LORIS API.  It allows users to quickly login and create requests
 * without knowing the internals of cURL.  Other benefits include: 
 *      - Submitting the API prefix with every request 
 *      - Automatically JSON-encoding POST bodies
 *      - Including the auth token automatically.
 * Users of the class will be able to sequence API calls quickly and write unit
 * tests.
 *
 * @author John Saigle <john.saigle@mcgill.ca>
 */

// TODO: Delete this later
error_reporting(E_ALL);

class LorisAPITool {
    /* Target information. Change as needed. */
    public $loris_base_url;
    public $loris_api_version;
    private $auth_token;
    private $verbose;

    function __construct(
        String $url,
        String $api_version = 'v0.0.3-dev',
        Bool $verbose = false
    ) {
        $this->loris_base_url = $url;
        $this->api_version = $api_version;
        $this->verbose = $verbose;
    }

    /** Login to LORIS.
     *
     * @return string JWT authorization when successful. Empty string otherwise.
     */
    function login($loris_username = '', $loris_password = '') : String {
        if (empty($loris_username) || empty($loris_password)) {
            return '';
        }
        $endpoint = "login/";
        $post_body = [
            "username" => $loris_username,
            "password" => $loris_password,
        ];

        $json = json_decode($this->doLorisPost($endpoint, $post_body));

        // If no JWT token returned, login failed.
        if (!array_key_exists('token', $json)) {
            return '';
        }
        $this->auth_token = $json->token;
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
        if ($this->verbose) {
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        }
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
        if ($this->verbose) {
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        }
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
        $full_url = $this->prefix() . $endpoint;
        if ($this->loggedIn()) {
            $headers[] = "Authorization: Bearer $this->auth_token";
        }
        return $this->doPost($full_url, json_encode($post_body), $headers);
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
    function doLorisGet(String $endpoint, Array $headers = []) : String {
        $full_url = $this->prefix() . $endpoint;
        if ($this->loggedIn()) {
            $headers[] = "Authorization: Bearer $this->auth_token";
        }
        return $this->doGet($full_url, $headers);
    }

    /** Return API prefix. Avoids the need to type this out everytime we make an API
     * call.
     */
    function prefix() : String {
        return $this->loris_base_url . '/api/' . $this->api_version . '/';
    }

    function loggedIn() : Bool {
        return !empty($this->auth_token);
    }
}
