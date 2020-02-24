<?php
/**
 * Implements the ResponseGenerator middleware class
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
use \LORIS\Http\EmptyStream;

/**
 * A ResponseGenerator is a type of MiddlewareChainer which terminates the
 * chain and forces a response to be returned unconditionally.
 *
 * @category Router
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ResponseGenerator implements MiddlewareInterface, MiddlewareChainer
{
    /**
     * Implements MiddlewareInterface.
     *
     * A ResponseGenerator always calls $handler and returns its value.
     * If the response doesn't contain a body, it replaces it with an
     * EmptyStream.
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
        $response = $handler->handle($request);

        if ($response->getBody() == null) {
            // If there was no body attached from the handler, attach an empty
            // one
            return $response->withBody(new EmptyStream());
        }
        return $response;
    }

    /**
     * Implements the MiddlewareChainer interface
     *
     * @param MiddlewareChainer $next The next middleware to chain. (Discarded)
     *
     * @return MiddlewareChainer The same MiddlewareChainer, unmodified.
     */
    public function withMiddleware(MiddlewareChainer $next)
    {
        return $this;
    }
}
