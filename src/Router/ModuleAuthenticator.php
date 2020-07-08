<?php
/**
 * File implements the ModuleAuthenticator class.
 *
 * PHP Version 7
 *
 * @category Router
 * @package  Authentication
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Router;

use \Psr\Http\Message\ServerRequestInterface;

// FIXME: This shouldn't be in the middleware namespace. There
// should be a separate LORIS authentication framework to handle
// things like this.

/**
 * ModuleAuthenticator is an implementation of the Authenticator
 * interface for modules. It determines if a user has access to
 * a module.
 *
 * @category Router
 * @package  Authentication
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ModuleAuthenticator implements \LORIS\Middleware\Authenticator
{

    /**
     * The constructor for a ModuleAuthenticator takes the user accessing
     * the module, and the module being accessed in order to determine
     * if access should be granted.
     *
     * @param \User   $user   The user being authenticated.
     * @param \Module $module The LORIS module being accessed.
     */
    public function __construct(\User $user, \Module $module)
    {
        $this->user   = $user;
        $this->Module = $module;
    }

    /**
     * Implements Authenticator interface to determine if the request
     * should be granted access.
     *
     * A public module always grants access, while a non-public one
     * grants access if $module->hasAccess($user) is true for the
     * user passed in the constructor of this authenticator.
     *
     * @param ServerRequestInterface $request The PSR7 ServerRequest being
     *                                        authenticated
     *
     * @return bool true if the user should be granted access.
     */
    public function authenticate(ServerRequestInterface $request) : bool
    {
        if ($this->Module->isPublicModule() === true) {
            return true;
        }

        return $this->Module->hasAccess($this->user);
    }
}
