<?php declare(strict_types=1);
namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

use \Psr\Log\LoggerAwareInterface;

/**
 * ExceptionHandlingMiddleware is a type of Middleware which safely handles
 * exceptions that are not caught earlier by other code. It makes sure that
 * even when something unexpected happens that we can serve a decorated page
 * to the user.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ExceptionHandlingMiddleware implements MiddlewareInterface, LoggerAwareInterface
{
    use \PSR\Log\LoggerAwareTrait;

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
        // Catch PHP Fatal errors that aren't exceptions such as type errors
        // or out of memory errors
        register_shutdown_function(
            function () {
                $error = error_get_last();

                if (isset($error['type']) && $error['type'] === E_ERROR) {
                    $location = $error['file'] ?? 'unknown';
                    if (isset($error['line'])) {
                        $location .= ":" . $error['line'];
                    }
                    $this->logger->critical($location . ": " . $error['message']);
                }
            }
        );

        try {
            $status = 200;
            return $handler->handle($request);
            /* The order of these catch statements matter and should go from
             * most to least specific. Otherwise all Exceptions will be caught
             * as their more generic parent class which reduces precision.
             */
        } catch (\NotFound $e) {
            $this->logger->notice($e->getMessage() . $e->getTraceAsString());
            $status = 404;
        } catch (\DatabaseException $e) {
            $this->logger->critical($e->getMessage() . $e->getTraceAsString());
            $status = 500;
        } catch (\ConfigurationException $e) {
            $this->logger->critical($e->getMessage() . $e->getTraceAsString());
            $status = 500;
        } catch (\LorisException $e) {
            $this->logger->error($e->getMessage() . $e->getTraceAsString());
            $status = 500;
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage() . $e->getTraceAsString());
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
