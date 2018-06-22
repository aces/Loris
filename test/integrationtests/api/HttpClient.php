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
 * @category Main
 * @author John Saigle <john.saigle@mcgill.ca>
 */
namespace LORIS\tests\api;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \LORIS\Http\Client;
use \Psr\Http\Message\ResponseInterface;
use \Zend\Diactoros\Uri;
use \Zend\Diactoros\Request;

// TODO :: Delete this later
error_reporting(E_ALL);

class HttpClient extends Client {

    /* Target information. Change as needed. */
    public $loris_base_url;
    private $auth_token;

    function __construct(
        Uri $url,
        Bool $verbose = false
    ) {
        $this->loris_base_url = $url;
        $this->verbose = $verbose;
    }

    /** Login to LORIS.
     *
     * @return string JWT authorization when successful. Empty string otherwise.
     */
    function getAuthorizationToken($loris_username = '', $loris_password = '') : String {
        if (empty($loris_username) || empty($loris_password)) {
            throw new \Exception("Username or password is empty!");
        }

        $post_body = [
            "username" => $loris_username,
            "password" => $loris_password,
        ];
         
        $response = $this->lorisPOST('login/', $post_body);

        if (empty($response)) {
            throw new \Exception("No token returned; empty response body");
        }

        $json = json_decode($response->getBody());

        // If no JWT token returned, login failed.
        if (!array_key_exists('token', $json)) {
            throw new \Exception("No token returned");
        }

        return $json->token;
    }

    public function withAuthorizationToken(string $token)
    {
        $new = clone $this;
        $new->auth_token = $token;
        return $new;
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
    function lorisPOST(
        String $endpoint, 
        Array $post_body, 
        Array $headers = []
    ) : ResponseInterface {
        $full_url = new Uri((string) $this->loris_base_url . $endpoint);
        $request  = (new Request())
            ->withUri(new Uri((string) $this->loris_base_url . $endpoint))
            ->withMethod('POST')
            ->withAddedHeader('Content-Type', 'application/json')
            ->withAddedHeader('Accept', 'application/json');

        $request->getBody()->write(json_encode($post_body));

        if ($this->loggedIn()) {
            $request = $request->withAddedHeader(
                'Authorization',
                "Bearer $this->auth_token"
            );
        }
        return $this->sendRequest($request);
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
    function lorisGET(string $endpoint, array $headers = []): ResponseInterface
    {
        $full_url = new Uri((string) $this->loris_base_url . $endpoint);
        $request  = (new Request())
            ->withUri(new Uri((string) $this->loris_base_url . $endpoint))
            ->withMethod('GET')
            ->withAddedHeader('Accept', 'application/json');

        if ($this->loggedIn()) {
            $request = $request->withAddedHeader(
                'Authorization',
                "Bearer $this->auth_token"
            );
        }
        return $this->sendRequest($request);
    }

    function loggedIn() : Bool {
        return !empty($this->auth_token);
    }
}
