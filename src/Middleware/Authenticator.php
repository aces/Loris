<?php
/**
 * Defines Authenticator interface to authenticate access
 * to incoming requests.
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

use \Psr\Http\Message\ServerRequestInterface;

// FIXME: This shouldn't be in the middleware namespace. There
// should be a LORIS authentication framework.

/**
 * An Authenticator takes an incoming request, and determines if it
 * has proper credentials to access a resource.
 *
 * @category Interfaces
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface Authenticator
{
    /**
     * Given a PSR7 ServerRequestInterface, an Authenticator
     * must return true if and only if the request has been
     * authenticated and should have access to the given resource.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return bool true iff the request is valid
     */
    public function authenticate(ServerRequestInterface $request) : bool;
}
