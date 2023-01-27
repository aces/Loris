<?php
/**
 * Implements the PostResponseQueuer middleware class
 *
 * PHP Version 7
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 *
 */
class PostResponseProcessQueuer implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    private array $callableQueue;

    /**
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

        $this->callableQueue = [];

        $request = $request->withAttribute('PostResponseProcessQueuer', $this);

        $response = $this->next->process($request, $handler);

        if (function_exists('\fastcgi_finish_request')) {
            \fastcgi_finish_request();
        }

        foreach ($this->callableQueue as $callback) {
            $callback();
        }

        return $response;
    }

    public function addCallback(callable $obj): void
    {
        $this->callableQueue[] = $obj;
    }
}
