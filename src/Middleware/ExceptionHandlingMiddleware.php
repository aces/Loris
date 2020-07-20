<?php declare(strict_types=1);
namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * ExceptionHandlingMiddleware is a type of Middleware which safely handles
 * exceptions that are not caught earlier by other code. It makes sure that
 * even when something unexpected happens that we can serve a decorated page
 * to the user.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ExceptionHandlingMiddleware implements MiddlewareInterface
{
    /**
     * Attempts a request and catches stray exceptions. When an exception occurs
     * hand this off to another Middleware to decoreate the page.
     *
     * @param ServerRequestInterface  $request The incoming request
     * @param RequestHandlerInterface $handler The handler to delegate
     *                                         valid requests to
     *
     * @return ResponseInterface the PSR15 response.
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        try {
            return $handler->handle($request);
        } catch (\NotFound $e) {
            error_log($e->getMessage() . $e->getTraceAsString());
            $status = 404;
        } catch (\Exception $e) {
            error_log($e->getMessage() . $e->getTraceAsString());
            $status = 500;
        }

        // Decorate the request.
        return (new \LORIS\Middleware\PageDecorationMiddleware(
            $request->getAttribute('user')
        ))->process(
            $request,
            new \LORIS\Router\NoopResponder(
                new \LORIS\Http\Error(
                    $request,
                    $status
                )
            )
        );
    }
}
