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
class ExceptionHandlingMiddleware implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

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
            return (new \LORIS\Middleware\ResponseGenerator())
                ->process(
                    $request,
                    $handler
                );
        } catch (\Exception $e) {
            // Handle uncaught errors.
            switch (get_class($e)) {
                case 'NotFound':
                    $status = 404;
                    break;
                default:
                    $status = 500;
            }
            return $this->decoratedError(
                $request,
                $status,
                $e->getMessage()
            );
        }

        // Decorate the request.
        return (new \LORIS\Middleware\PageDecorationMiddleware(
            \NDB_Factory::singleton()->user()
        ))->process(
            $request,
            new \LORIS\Router\NoopResponder(
                new \LORIS\Http\Error(
                    $request,
                    $status,
                    $msg
                )
            )
        );
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
