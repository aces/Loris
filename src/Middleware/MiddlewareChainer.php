<?php
/**
 * File defines the MiddlewareChainer interface.
 *
 * PHP Version 7
 *
 * @category Interfaces
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Middleware;

use \Psr\Http\Server\MiddlewareInterface;

/**
 * A MiddlewareChainer is a queue of middleware which should
 * be executed for a request.
 *
 * @category Interfaces
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface MiddlewareChainer extends MiddlewareInterface
{

    /**
     * Appends $next to the end of the middleware chain and returns
     * a new middleware queue.
     *
     * @param MiddlewareChainer $next The middleware to append to the queue
     *
     * @return MiddlewareChainer
     */
    public function withMiddleware(MiddlewareChainer $next) : MiddlewareChainer;
}
