<?php declare(strict_types=1);
/**
 * An endpoint is a HTTP request handler which abstracts away common element
 * of different LORIS API endpoints.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Http;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * An abstract class for common concerns of different API endpoints.
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
abstract class Endpoint implements RequestHandlerInterface
{
    /**
     * An Endpoint overrides the default LORIS middleware to remove the
     * PageDecorationMiddleware.
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
        $interfaces = class_implements($handler);
        if (in_array('LORIS\Middleware\ETagCalculator', $interfaces)) {
            return (new \LORIS\Middleware\ETag())->process($request, $handler);
        }

        return $handler->handle($request);
    }

    /**
     * Make sur the user is allowed to access the endpoint.
     *
     * @param \User $user The requesting user
     *
     * @return bool
     */
    public function hasAccess(\User $user): bool
    {
        return !($user instanceof \LORIS\AnonymousUser);
    }
}
