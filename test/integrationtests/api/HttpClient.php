<?php
/**
 * File contains the implementation of Client for HTTP exchanges.
 * PHP Version 7
 *
 * @category PSR7
 * @package  Http
 * @author   John Saigle <john.saigle@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 */
namespace LORIS\tests\api;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \LORIS\Http\Client;
use \Psr\Http\Message\ResponseInterface;
use \Zend\Diactoros\Uri;
use \Zend\Diactoros\Request;

/**
 * This class provides an easy-to-use wrapper around the PSR7-compliant Client
 * class.  It provides syntactic sugar for developers who wish to work with the
 * LORIS API.  HttpClient allows a developer to create an API client that will
 * handle session authentication and processing for requests to and from LORIS.
 *
 * @category PSR7
 * @package  API
 * @author   John Saigle <john.saigle@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class HttpClient extends Client
{
    public $loris_base_url;
    private $_auth_token;

    /**
 * Create an HTTPClient.  The $url passed to this constructor should
     * include both a URL to a LORIS instance as well as the API prefix.
     * E.g. $url = "https://demo.loris.ca/api/v0.0.x/"
     *
     * @param Uri $url A valid URI to a LORIS instance
     */
    function __construct(Uri $url)
    {
        $this->loris_base_url = $url;
    }

    /**
     * Login to LORIS.
     *
     * @param string $loris_username Front-end username
     * @param string $loris_password Front-end password matching $loris_username
     *
     * @return string JWT authorization when successful. Empty string otherwise.
     */
    function getAuthorizationToken(
        $loris_username = 'admin',
        $loris_password = 'testpassword'
    ) : String {

        if (empty($loris_username) || empty($loris_password)) {
            throw new \Exception("Username or password is empty!");
        }

        $post_body = [
                      "username" => $loris_username,
                      "password" => $loris_password,
                     ];

        $response = $this->lorisPOST('Login.php?PrintLogin=true', $post_body);
        if (empty($response)) {
            throw new \Exception("No token returned; empty response body");
        }

        $json = json_decode($response->getBody());

        // If no JWT token returned, login failed.
        if (is_null($json) || !array_key_exists('token', $json)) {
            throw new \Exception("No token returned");
       }

$json->token;
    }

    /**
    * Helper function to create a new instance of this class with the
     * auth_token variable initialized.  This allows authenticated requests and
     * allows the user to forget about managing their session as requests will
     * be sent with session information by default.
     *
     * @param string $token A JWT token encapsulating a valid LORIS session
     *
     * @return HttpClient A cloned object with _auth_token set
     */
    public function withAuthorizationToken(string $token)
    {
        $new = clone $this;
        $new->_auth_token = $token;
        return $new;
    }

    /**
     * A wrapper for doPOST that takes away some of the clutter when making a
     * request to LORIS.  Specfically this function will append the necessary url
     * and versioned API prefix as well as JSON encode the POST body passed to it.
     *
     * @param string $endpoint  The URL to POST data to.
     * @param array  $post_body The key-value pairs of the post body.
     * @param array  $headers   Misc HTTP headers
     *
     * @return ResponseInterface The HTTP response given by doPost.
     */
    function lorisPOST(
        String $endpoint,
        Array $post_body,
        Array $headers = []
    ) : ResponseInterface {
        $request = (new Request())
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

    /**
 * A wrapper for doGET that takes away some of the clutter when making a
     * request to LORIS.  Specfically this function will append the necessary url
     * and versioned API prefix.
     *
     * @param string $endpoint The URL to POST data to.
     * @param array  $headers  Option HTTP Headers
     *
     * @return ResponseInterface The HTTP response given by doPost.
     */
    function lorisGET(string $endpoint, array $headers = []): ResponseInterface
    {
        $full_url = new Uri((string) $this->loris_base_url . $endpoint);
        $request  = (new Request())
            ->withUri($full_url)
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

    /**
 * Whether the HTTPClient object has a valid session, represented by
     * auth_token
     *
     * @return bool Whether auth_token is set
     */
    function loggedIn() : Bool
    {
        return !empty($this->_auth_token);
    }
}
