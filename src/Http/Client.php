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
namespace LORIS\http;

use \Psr\Http\Message\RequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Zend\Diactoros\Response;
// phan has an issue with the line below. Is it used? It is needed?
//use \Zend\Diactoros\Stream;

/**
 * This class provides an easy-to-use wrapper around the PHP cURL functions for
 * use with the LORIS API.  It allows users to quickly login and create requests
 * without knowing the internals of cURL.  Other benefits include:
 *      - Submitting the API prefix with every request
 *      - Automatically JSON-encoding POST bodies
 *      - Including the auth token automatically.
 * Users of the class will be able to sequence API calls quickly and write unit
 * tests.
 *
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

class Client
{

    /**
     * Sends a PSR-7 request and returns a PSR-7 response.
     *
     * Every technically correct HTTP response MUST be returned as is,
     * even if it represents an HTTP error response or a redirect instruction.
     * The only special case is 1xx responses, which MUST be assembled in the
     * HTTP client.
     *
     * The client MAY do modifications to the Request before sending it. Because
     * PSR-7 objects are immutable, one cannot assume that the object passed to
     * ClientInterface::sendRequest() will be the same object that is actually
     * sent. For example the Request object that is returned by an exception MAY
     * be a different object than the one passed to sendRequest, so comparison
     * by reference (===) is not possible.
     *
     * {@link https://github.com/php-fig/fig-standards/blob/master/accepted/
     *                          PSR-7-http-message-meta.md#why-value-objects}
     *
     * @param RequestInterface $request Request object. See link above.
     *
     * @return ResponseInterface
     */
    public function sendRequest(RequestInterface $request): ResponseInterface
    {
        switch($request->getMethod()) {
        case 'GET':
            $response = $this->doGET($request->getUri(), $request->getHeaders());
            break;
        case 'POST':
            $response = $this->doPOST(
                $request->getUri(),
                (string) $request->getBody(),
                $request->getHeaders()
            );
            break;
        }
        return $response;
    }

    /**
     * Generic curl GET request.  Builds the cURL handler and sets the options.
     * For now, GET requests with data attached are not supported.
     *
     * @param string $url     The resource to POST to.
     * @param array  $headers Misc additional HTTP headers
     *
     * @return ResponseInterface The HTTP response to the POST request.
     */
    function doGET(String $url, $headers = []) : ResponseInterface
    {
        // Set GET as the method with an empty body.
        return $this->doCurl($url, 'GET', '', $headers);
    }


    /**
     * Generic curl POST request.  Builds the cURL handler and sets the options
     * corresponding to a POST request.
     *
     * @param string $url       The resource to POST to.
     * @param mixed  $post_body An array or string for the POST request body.
     * @param array  $headers   Misc additional HTTP headers
     *
     * @return ResponseInterface The HTTP response to the POST request.
     */
    function doPOST(String $url, $post_body, $headers = []) : ResponseInterface
    {
        return $this->doCurl((string) $url, 'POST', $post_body, $headers);
    }

    /**
     * Generic curl object. Currently handles cases for GET and POST with HEAD
     * partially implemented in case the LORIS API ends up using it soon.
     * Opens, configures, executes, and closes a cURL object.
     *
     * @param string $url       The resource to request.
     * @param string $method    The HTTP method. GET and POST supported.
     * @param mixed  $post_body An array or string for the request body.
     * @param array  $headers   Misc additional HTTP headers
     *
     * @return ResponseInterface The HTTP response to the request.
     */
    function doCurl(
        String $url,
        String $method,
        $post_body,
        Array $headers = []
    ) : ResponseInterface {

        /* Build curl and set options */
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, true);

        // Alter curl structure based on HTTP method.
        if ($method === 'POST') {
            /* POST body */
            if (empty($post_body)) {
                throw new \Exception(
                    "Method selected is POST but body is empty!"
                );
            }
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_body);
            curl_setopt($ch, CURLOPT_POST, 1);
        } else if ($method === 'HEAD') { // TODO: This isn't actually implemented yet
            curl_setopt($ch, CURLOPT_NOBODY, true); // read: 'no body'
        }
        // Follow redirects.
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        // Capture response isntead of printing it.
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // Connect via HTTP/2 if available. Some versions of PHP/cURL don't 
        // know about it so we are using the magic number 3 here.
        // The usual alias is CURL_HTTP_VERSION_2_0 but Travis has an issue with
        // it.
        curl_setopt($ch, CURLOPT_HTTP_VERSION, 3);

        // For VMs with expired ssl certificate
        //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        // Attach optional headers if present
        if (!empty($headers)) {
            curl_setopt(
                $ch,
                CURLOPT_HTTPHEADER,
                array_reduce(
                    array_keys($headers),
                    function ($carry, $item) use ($headers) {
                        $carry[] = $item . ': ' . implode(';', $headers[$item]);
                        return $carry;
                    },
                    array()
                )
            );
        }

        $response  = curl_exec($ch);
        $curl_info = curl_getinfo($ch);
        curl_close($ch);

        $r_header_size = $curl_info['header_size'];
        $r_header      = substr($response, 0, $r_header_size);
        $r_body        = substr($response, $r_header_size);

        $formated_headers = array_reduce(
            explode(PHP_EOL, $r_header),
            function ($carry, $item) {
                $pair = explode(':', $item);
                if (count($pair) == 2) {
                    $carry[$pair[0]] = trim($pair[1]);
                }
                return $carry;
            },
            array()
        );

        return new Response(
            new \LORIS\Http\StringStream($r_body),
            $curl_info['http_code'],
            $formated_headers
        );
    }
}
