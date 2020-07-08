<?php
/**
 * Implements ModuleRouter, a class for routing to a specific
 * module.
 *
 * PHP Version 7
 *
 * @category Router
 * @package  Router
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Router;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles the base of a module's routing, adding authentication middleware
 * if the module is not a public module.
 *
 * @category Router
 * @package  Router
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ModuleRouter extends PrefixRouter
{
    /**
     * The module being accessed.
     *
     * @var \Module
     */
    protected $module;

    /**
     * Constructs a ModuleRouter
     *
     * @param \Module $module    The module being accessed
     * @param string  $moduledir The base directory of $module.
     */
    public function __construct(\Module $module, string $moduledir)
    {
        $this->module = $module;

        $arr = [
                "/css/"    => new ModuleFileRouter(
                    $module,
                    $moduledir,
                    "css",
                    "text/css"
                ),
                "/js/"     => new ModuleFileRouter(
                    $module,
                    $moduledir,
                    "js",
                    "application/javascript"
                ),
                "/static/" => new ModuleFileRouter(
                    $module,
                    $moduledir,
                    "static",
                    ""
                ),
               ];
        parent::__construct(new \ArrayIterator($arr));
    }

    /**
     * Handles an incoming request for a module. The $request is relative the
     * the module, the BaseRouter having stripped off the path leading up to
     * it.
     *
     * @param ServerRequestInterface $request The incoming request relative to
     *                                        the module
     *
     * @return ResponseInterface The PSR15 response.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($this->module->isPublicModule() !== true) {
            // Add the authentication middleware for the current user (which was
            // added to the requset by the base router), and handle the request.
            $authmiddleware = new \LORIS\Middleware\AuthMiddleware(
                new ModuleAuthenticator(
                    $request->getAttribute("user"),
                    $this->module
                )
            );
            return $authmiddleware->withMiddleware(
                new \LORIS\Middleware\ResponseGenerator(
                )
            )->process($request, $this->module);
        }
        // Directly handle the request, because it was public anyways.
        return $this->module->handle($request);
    }
}
