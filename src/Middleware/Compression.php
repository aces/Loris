<?php declare(strict_types=1);
namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * A Compression middleware is a chainable type of PSR15-based middleware
 * which takes a response, and streams a compressed response with appropriate
 * Content-Encoding headers setn.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Compression implements MiddlewareInterface
{
    use MiddlewareChainerMixin;

    /**
     * Process processes an incoming request by delegating to $handler,
     * compress the content using gzip if accepted by the client, and
     * return the appropriate response.
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
        // $request->getHeader is returning one comma separated string. This
        // doesn't match my reading of PSR7, but it's what we've got to work with.
        if (strpos($request->getHeader("Accept-Encoding")[0] ?? '', 'gzip') === false) {
                return $response;
        }
        return $response
            ->withHeader("Content-Encoding", "gzip")
            ->withBody(new \LORIS\Http\GzipStream($response->getBody()));
    }
}
