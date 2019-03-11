<?php declare(strict_types=1);
/**
* File contains the PSR18 HTTP Client implementation that
* can be constructed with the "new" keyword.
*
* PHP Version 7
*
* @category PSR18
* @package  Http
* @author   John Saigle <john.saigle@mcin.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*
* @see https://www.php-fig.org/psr/psr-18/
*/
namespace LORIS\Http;

use \Http\Adapter\Guzzle6\Client as GuzzleClient;
use \Psr\Http\Client\ClientInterface;
use \Psr\Http\Message\RequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A LORIS Http Client is an implementation of the PSR18 ClientInterface to use
 * in LORIS.
 *
 * It is intended to reduce our coupling to any particular PSR18 implementation.
 */
class Client implements ClientInterface
{
    private $client;
    /**
     * Guzzle's Client class is final and so cannot be extended directly. This
     * function acts as a wrapper for this function and serves as a workaround.
     *
     * @param string $uri The base uri targeted for requests.
     *
     * @return void
     */
    public function __construct(string $uri) {
        $this->client = GuzzleClient::createWithConfig(
            array(
                'base_uri' => $uri
            )
        );
    }

    /**
     * {@inheritDoc}
     */
    public function sendRequest(RequestInterface $request): ResponseInterface {
        return $this->client->sendRequest($request);
    }
}
