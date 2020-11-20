<?php declare(strict_types=1);
namespace LORIS\Router;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * An abstract class for common concerns of different API endpoints.
 *
 * @category Main
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
abstract class Endpoint implements RequestHandlerInterface
{
    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[]
     */
    abstract protected function allowedMethods() : array;

    /**
     * Processes an incoming request by delegating it to $handler, unless it is
     * an instance of ETagCalculator in which case it is processed via ETag.
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
