<?php declare(strict_types=1);
/**
 * An endpoint is a HTTP request handler which abstracts away common element
 * of different LORIS API endpoints.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Router;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * An abstract class for common concerns of different API endpoints.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
abstract class Endpoint implements RequestHandlerInterface
{
    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    abstract protected function allowedMethods() : array;

    /**
     * An API endpoint overrides the default LORIS middleware to remove the
     * PageDecorationMiddleware, since the API only deals with JSON.
     *
     * It also acts as its own middleware by validating that an endpoint supports
     * the HTTP method request type.
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request
     * @param RequestHandlerInterface $handler The PSR15 request handler
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {

        if ($handler instanceof \LORIS\Middleware\ETagCalculator) {
            return (new \LORIS\Middleware\ETag())->process($request, $handler);
        }

        return $handler->handle($request);
    }
}
