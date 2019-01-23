<?php
/**
 * Implements the ContentLength middleware class
 *
 * PHP Version 7
 *
 * @category Router
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Middleware;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * A ContentLength middleware is a chainable type of PSR15-based middleware
 * which takes a response, and adds an HTTP Content-Length header.
 *
 * It should be called near the top of a middleware chain (after the response
 * is fully created, and when you can be sure that the body won't be modified).
 *
 * @category Router
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ETag implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    /**
     * Process processes an incoming request by delegating to $handler,
     * and adds an HTTP ETag header to the response if possible.
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request.
     * @param RequestHandlerInterface $handler The PSR15 handler to delegate
     *                                         content generation to.
     *
     * @return ResponseInterface the PSR15 response
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        if (($handler instanceof ETagCalculator) === false) {
            // Handler does not have a way to calculate ETags, so we don't
            // do anything special.
            return $handler->handle($request);
        }

        $clientETag = $request->getHeaderLine("If-None-Match");
        if ($clientETag !== '') {
            // If-None-Match header provided
            $endpointETag = $handler->ETag($request);
            if ($clientETag == $endpointETag) {
                // It matches, so just return a 304 Not modified instead of
                // doing any work.
                return new \LORIS\Http\Response\NotModified(
                    $endpointETag
                );
            }
        }

        // It either doesn't match or the client didn't send an ETag. In either
        // case, we calculate one and add it to the response header after calling
        // the handler.
        $response = $handler->handle($request);

        if ($response->getStatusCode() >= 400) {
            // In case of client or server error, do not calculate ETag
            return $response;
        }

        if (empty($response->getHeaderLine('Etag'))) {
            // If a sub-endpoint already added a Etag, do not calculate ETag
            $response = $response->withHeader(
                "ETag",
                $handler->ETag($request)
            );
        }

        return $response;
    }
}
