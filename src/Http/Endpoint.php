<?php declare(strict_types=1);
namespace LORIS\Http;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

use \Psr\Log\LoggerAwareTrait;

/**
 * An endpoint is a HTTP request handler which abstracts away common element
 * of different LORIS API endpoints.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
abstract class Endpoint implements RequestHandlerInterface
{
    use LoggerAwareTrait;

    /**
     * Construct an endpoint
     *
     * @param \LORIS\LorisInstance $loris
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
    ) {
    }

    /**
     * An Endpoint acts as middleware which will calculate ETag if applicable.
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
        $loris    = $request->getAttribute('loris');
        $loglevel = $loris->getConfiguration()
            ->getLogSettings()
            ->getRequestLogLevel();

        $this->logger = new \LORIS\Log\ErrorLogLogger($loglevel);

        $interfaces = class_implements($handler);
        if (in_array('LORIS\Middleware\ETagCalculator', $interfaces)) {
            return (new \LORIS\Middleware\ETag())->process($request, $handler);
        }

        return $handler->handle($request);
    }

    /**
     * Make sure the user is allowed to access the endpoint.
     *
     * @param \User $user The requesting user
     *
     * @return bool
     */
    public function hasAccess(\User $user): bool
    {
        return !($user instanceof \LORIS\AnonymousUser);
    }

    /**
     * This function can be overridden in a module's page to load the necessary
     * resources to check the permissions of a user.
     *
     * @param \User                   $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return void
     */
    public function loadResources(
        \User $user,
        ServerRequestInterface $request
    ) : void {
    }
}
