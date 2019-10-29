<?php declare(strict_types=1);
/**
 * This file contains a class which encapsulates the concept of a "module"
 * in LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * The Module class encapsulates all details of a module which are not specific
 * to a certain page.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Module extends \LORIS\Router\PrefixRouter implements RequestHandlerInterface
{
    const GENERIC_500_ERROR   = "We're sorry, LORIS has encountered an internal "
        . "server error. Please contact your project administrator for more "
        . "information.";
    const CONFIGURATION_ERROR = "LORIS configuration settings are invalid or "
        . "missing and as a result execution cannot proceed. Please contact "
        . "your project administrator and/or verify your LORIS configuration.";
    protected $name;
    protected $dir;

    /**
     * Returns a Module instance for the module named $name. The returned
     * value may be a subtype of the base LORIS module class and override
     * it's method.
     *
     * This also sets up PHP class autoloading for the module that is loaded,
     * such that files in the module/php directory can be autoloaded.
     *
     * @param string $name The module name we'd like information about
     *
     * @throws \LorisNoSuchModuleException
     * @throws \LorisModuleMissingException
     * @throws \NotFound
     *
     * @return \Module object
     */
    static public function factory(string $name): \Module
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();
        $base    = $config->getSetting("base");

        $mpath = "";
        // TODO: Module search path should be a config option.
        if (is_dir($base . "project/modules/$name")) {
            $mpath = $base . "project/modules/$name";
        } else if (is_dir($base . "modules/$name")) {
            $mpath = $base . "modules/$name";
        } else {
                throw new LorisNoSuchModuleException("No such module: $name");
        }

        if (!file_exists($mpath . "/php/module.class.inc")) {
            // Check if there's a module class to see if the module has been
            // updated. This can be removed once support for old Modules has
            // been removed. If it hasn't been updated, fall back on the old
            // style.
            throw new LorisModuleMissingException("$name is missing Module class");
        }
        // Manually do dependency injection for the module's php/ directory,
        // since composer doesn't know anything about our modules and we only
        // want *this* module's classes autoloaded anyways.
        spl_autoload_register(
            function ($class) use ($name,
                $mpath
            ) {
                if (strpos($class, "LORIS\\$name\\") === 0) {
                    $fpath = $mpath . "/php/"
                    . strtolower(substr($class, strlen("LORIS\\$name\\")))
                    . ".class.inc";
                    $fpath = str_replace('\\', '/', $fpath);
                    if (!file_exists($fpath)) {
                        throw new \NotFound(
                            "Could not load module `$name`: file `$fpath` " .
                            "does not exist"
                        );
                    }
                    include $fpath;
                }
            }
        );

        // Manually do the require for the module descriptor because of
        // namespacing
        //require_once $mpath . "/php/Module.class.inc";
        $className = "\LORIS\\$name\Module";
        $cls       = new $className($name, $mpath);
        return $cls;
    }

    /**
     * Creates a new module instance
     *
     * @param string $name      The name of the module
     * @param string $moduledir The directory on the filesystem containing the module
     */
    public function __construct(string $name, string $moduledir)
    {
        parent::__construct(
            new \ArrayIterator(
                [
                    "/css/"    => new \LORIS\Router\ModuleFileRouter(
                        $this,
                        $moduledir,
                        "css",
                        "text/css"
                    ),
                    "/js/"     => new \LORIS\Router\ModuleFileRouter(
                        $this,
                        $moduledir,
                        "js",
                        "application/javascript"
                    ),
                    "/static/" => new \LORIS\Router\ModuleFileRouter(
                        $this,
                        $moduledir,
                        "static",
                        ""
                    ),
                ]
            )
        );
        $this->name = $name;
        $this->dir  = $moduledir;
    }

    /**
     * Return the name of this module.
     *
     * @return string The module name
     */
    public function getName() : string
    {
        return $this->name;
    }

    /**
     * Returns true if this module should be publicly available to people who
     * are not logged in to LORIS.
     *
     * @return bool False. Subclasses must override this function in the case
     *                  that they should be publicly available.
     */
    public function isPublicModule()
    {
        return false;
    }

    /**
     * Return true if the given user should have access to this module.
     *
     * By default, this will assume that anonymous users do not have access
     * to non-public modules, but otherwise everyone has access to anything.
     *
     * @param \User $user The user to check access for.
     *
     * @return bool True if the user has access
     */
    public function hasAccess(\User $user): bool
    {
        if ($this->isPublicModule() !== true) {
            if ($user instanceof \LORIS\AnonymousUser) {
                return false;
            }
        }
        return true;
    }
    /**
     * Loads a page within this module and calls all necessary setup.
     *
     * @param string $page The name of the page within the module to load.
     *
     * @return a NDB_Page subclass representing this page.
     */
    public function loadPage(string $page)
    {
        // Some URLs are things like "/login/request-account", but `-` isn't valid
        // in a class name, so remove it while loading the module.
        $page = str_replace("-", "", $page);

        $className = "\LORIS\\" . $this->name . "\\$page";
        if (!class_exists($className)) {
            throw new \NotFound($className);
        }

        $identifier = $_REQUEST['identifier'] ?? '';
        $commentID  = $_REQUEST['commentID'] ?? '';
        $cls        = new $className($this, $page, $identifier, $commentID, $page);

        // Hacks so that existing display() functions load the right template
        // for different page types.
        $cls->menu = $page;

        return $cls;
    }

    /**
     * Returns help content for a page in the module.
     *
     * @param string $page The module subpage to get help for.
     *
     * @return string the content of the page help.
     */
    public function getHelp(string $page): string
    {
        $helpFile = $this->dir . "/help/$page.md";
        if (file_exists($helpFile)) {
                return file_get_contents($helpFile);
        }
        return "No help available for $page ($helpFile)";
    }

    /**
     * The default handler for a module routes to a page of the first component of
     * the URL's name, or the same name as the module if serving the root of the
     * module.
     *
     * Modules extend PrefixRouter, so that the parent handler knows that the
     * css, static, and js routes should be routed through the file system to
     * retrieve the files before trying to load any specific pages.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $resp = parent::handle($request);
        if ($resp->getStatusCode() != 404) {
            $path = $request->getURI()->getPath();
            if (preg_match('/(\.css)$/', $path) == 1) {
                $resp = $resp->withHeader(
                    "Content-Type",
                    "text/css"
                );
            }
            if (preg_match('/(\.js)$/', $path) == 1) {
                $resp = $resp->withHeader(
                    "Content-Type",
                    "application/javascript"
                );
            }
            return $resp;
        }

        $pagename = $this->getName();
        $path     = trim($request->getURI()->getPath(), "/");
        if (!empty($path)) {
            // There is a subpage
            $pagename = explode("/", $path)[0];
        }

        $user = $request->getAttribute("user") ?? new \LORIS\AnonymousUser();
        try {
            $page = $this->loadPage($pagename);
            // FIXME: Hack required for breadcrumbs. This should be removed,
            // but some tests depend on it.
            if ($this->getName() === $pagename) {
                $_REQUEST['test_name'] = $pagename;
            } else {
                $_REQUEST['subtest'] = $pagename;
            }

            if ($page->_hasAccess($user) !== true) {
                return (new \LORIS\Middleware\PageDecorationMiddleware(
                    $user
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
        } catch (\NotFound $e) {
            return (new \LORIS\Middleware\PageDecorationMiddleware(
                $user
            ))->process(
                $request,
                new \LORIS\Router\NoopResponder(
                    new \LORIS\Http\Error(
                        $request,
                        404,
                        "File not found: " . $request->getURI()->__toString()
                    )
                )
            );
            /* The order of these catch statements matter and should go from
             * most to least specific. Otherwise all Exceptions will be caught
             * as their more generic parent class which reduces precision.
             */
        } catch (\DatabaseException $e) {
            error_log($e->getMessage());
            return $this->responseStatus500(
                $request,
                $user,
                self::GENERIC_500_ERROR
            );
        } catch (\ConfigurationException $e) {
            error_log($e->getMessage());
            return $this->responseStatus500(
                $request,
                $user,
                self::CONFIGURATION_ERROR
            );
        } catch (\LorisException $e) {
            error_log($e->getMessage());
            return $this->responseStatus500(
                $request,
                $user,
                self::GENERIC_500_ERROR
            );
        } catch (\Exception $e) {
            error_log($e->getMessage());
            return $this->responseStatus500(
                $request,
                $user,
                self::GENERIC_500_ERROR
            );
        }

        return $page->process($request, $page);
    }

    /**
     * Return a properly-decorated response with status 500. Used to handle
     * exceptions thrown within the codebase in a graceful way.
     *
     * @param ServerRequestInterface $request The request to process.
     * @param \User                  $user    The user to decorate the page with.
     * @param string                 $message An error message explaining the
     *                                        500 code to the user.
     *
     * @return ResponseInterface A properly decorated 500 response.
     */
    function responseStatus500(
        ServerRequestInterface $request,
        \User $user,
        string $message
    ): ResponseInterface {
        return (new \LORIS\Middleware\PageDecorationMiddleware(
            $user
        ))->process(
            $request,
            new \LORIS\Router\NoopResponder(
                new \LORIS\Http\Error(
                    $request,
                    500,
                    $message
                )
            )
        );
    }
}
