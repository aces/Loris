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
class ContentLength implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    /**
     * Process processes an incoming request by delegating to $handler,
     * and adds an HTTP Content-Length header to the response if possible.
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
        $response      = $this->next->process($request, $handler);
        $contentlength = $response->getBody()->getSize();
        if ($contentlength !== null) {
            return $response->withHeader("Content-Length", "$contentlength");
        }
        return $response;
    }
}
