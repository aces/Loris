<?php
/**
 * Implements the AuthMiddleware middleware class
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
 * AuthMiddleware is a type of Middleware which determines whether or
 * not a request is properly authenticated, and returns a 403 if not.
 *
 * @category Router
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AuthMiddleware implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    protected $authenticator;

    /**
     * Construct an AuthMiddleware which delegates decisions about
     * access to $auth.
     *
     * @param Authenticator $auth The Authenticator to use to validate
     *                            proper authentication.
     */
    public function __construct(Authenticator $auth)
    {
        $this->authenticator = $auth;
    }

    /**
     * Calls $handler if the request is properly authenticated, otherwise
     * returns a 403.
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
        if ($this->authenticator->authenticate($request) === true) {
            return $this->next->process($request, $handler);
        }

        return (new \LORIS\Middleware\PageDecorationMiddleware(
            $request->getAttribute("user") ?? new \LORIS\AnonymousUser()
        ))->process(
            $request,
            new \LORIS\Router\NoopResponder(
                new \LORIS\Http\Error(
                    $request,
                    403,
                    "You do not have access to this page."
                )
            )
        );
    }
}
