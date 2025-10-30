<?php declare(strict_types=1);

/**
 * This file contains a class which encapsulates the concept of a "module"
 * in LORIS.
 *
 * PHP Version 8
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

use \Psr\Log\LoggerAwareInterface;

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
abstract class Module extends \LORIS\Router\PrefixRouter
    implements RequestHandlerInterface, LoggerAwareInterface
{
    use \Psr\Log\LoggerAwareTrait;

    const GENERIC_500_ERROR   = "We're sorry, LORIS has encountered an internal "
        . "server error. Please contact your project administrator for more "
        . "information.";
    const CONFIGURATION_ERROR = "LORIS configuration settings are invalid or "
        . "missing and as a result execution cannot proceed. Please contact "
        . "your project administrator and/or verify your LORIS configuration.";

    /**
     * Retrieve all active module descriptors from the given database, indexed
     * by their primary key in the database.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance with the modules
     *
     * @return \Module[]
     */
    static public function getActiveModulesIndexed(
        \LORIS\LorisInstance $loris
    ) : array {
        $db     = $loris->getDatabaseConnection();
        $mnames = $db->pselect(
            "SELECT ID, Name FROM modules WHERE Active='Y'",
            []
        );

        $rv = [];
        foreach ($mnames as $row) {
            $rv[$row['ID']] = $loris->getModule($row['Name']);
        }
        return $rv;
    }

    /**
     * Register an autoloader for this module's namespace.
     *
     * @return void
     */
    public function registerAutoloader() : void
    {
        // Manually do dependency injection for the module's php/ directory,
        // since composer doesn't know anything about our modules and we only
        // want *this* module's classes autoloaded anyways.
        spl_autoload_register(
            function ($class) {
                if (strpos($class, "LORIS\\{$this->name}\\") === 0) {
                    $fpath = $this->dir. "/php/"
                    . strtolower(substr($class, strlen("LORIS\\{$this->name}\\")))
                    . ".class.inc";
                    $fpath = str_replace('\\', '/', $fpath);
                    if (!file_exists($fpath)) {
                        throw new \NotFound(
                            "Could not load module `{$this->name}`: file `$fpath` " .
                            "does not exist"
                        );
                    }
                    include $fpath;
                }
            }
        );
    }

    /**
     * Creates a new module instance
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance for the module
     * @param string               $name  The name of the module
     * @param string               $dir   The directory on the filesystem
     *                                    containing the module
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        protected string $name,
        protected string $dir,
    ) {
        parent::__construct(
            new \ArrayIterator(
                [
                    "/css/"    => new \LORIS\Router\ModuleFileRouter(
                        $this,
                        $dir,
                        "css",
                        "text/css"
                    ),
                    "/js/"     => new \LORIS\Router\ModuleFileRouter(
                        $this,
                        $dir,
                        "js",
                        "application/javascript"
                    ),
                    "/static/" => new \LORIS\Router\ModuleFileRouter(
                        $this,
                        $dir,
                        "static",
                        ""
                    ),
                ]
            )
        );
    }

    /**
     * Return the short name of this module. The short name is used
     * in places such as the URL and by default matches the name of
     * the directory that the module is housed in.
     *
     * It should not contain special characters.
     *
     * @return string The machine friendly module name
     */
    public function getName() : string
    {
        return $this->name;
    }

    /**
     * Return the long name of this module. The long name is intended
     * to be the friendly, human-readable name and can not be automatically
     * derived. It may contain spaces, punctuation, or capitalization. The
     * long name of the module is how it should be referred to in
     * user-facing text.
     *
     * By default, the long name is used as the name in the LORIS menu
     * (if the module has a menu category defined by getMenuCategory().
     *
     * @return string The human friendly name for this module.
     */
    abstract function getLongName() : string;

    /**
     * Returns true if this module should be publicly available to people who
     * are not logged in to LORIS.
     *
     * @return bool False. Subclasses must override this function in the case
     *                  that they should be publicly available.
     */
    public function isPublicModule() : bool
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
                $this->logger->debug(
                    "Denied module access because AnonymousUser attempted to " .
                    "access non-public module"
                );
                return false;
            }
        }
        return true;
    }

    /**
     * Loads a page within this module and calls all necessary setup.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance that the module
     *                                    is serving.
     * @param string               $page  The name of the page within the
     *                                    module to load.
     *
     * @return NDB_Page
     *         Returns NDB_Page (or subclass) representing this page.
     */
    public function loadPage(\Loris\LORISInstance $loris, string $page)
    {
        // Some URLs are things like "/login/request-account", but
        // `-` isn't valid in a class name, so remove it while loading
        // the module.
        $page = str_replace("-", "", $page);

        $className = "\LORIS\\" . $this->name . "\\$page";
        if (!class_exists($className)) {
            throw new \NotFound($className);
        }

        $identifier = $_REQUEST['identifier'] ?? '';
        $commentID  = $_REQUEST['commentID'] ?? '';
        $cls        = new $className(
            $loris,
            $this,
            $page,
            $identifier,
            $commentID,
            $page,
        );

        // Hacks so that existing display() functions load the right template
        // for different page types.
        if (property_exists($cls, 'menu')) {
            $cls->menu = $page;
        }

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
        $this->logger->debug("Module handle function called");
        $moduleURI = $request->getAttribute("unhandledURI");
        $resp      = parent::handle($request);

        if ($resp->getStatusCode() != 404) {
            $path = $moduleURI->getPath();
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
        $path     = trim($moduleURI->getPath(), "/");
        if (!empty($path)) {
            // There is a subpage
            $pagename = explode("/", $path)[0];
        }

        $user  = $request->getAttribute("user") ?? new \LORIS\AnonymousUser();
        $loris = $request->getAttribute("loris");

        try {
            $page = $this->loadPage($loris, $pagename);
        } catch (\NotFound $e) {
            $this->logger->debug("Page $pagename not found");
            return $resp->withStatus(404);
        }

        $page->loadResources($user, $request);
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

    /**
     * Return a value which is used as the default menu category
     * (dropdown) to add this module to in the LORIS frontend.
     *
     * Unless overridden, this defaults to the empty string (which
     * results in the module not being added to the LORIS menu.)
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return null;
    }

    /**
     * Return a list of \LORIS\GUI\MenuItems to add to the LORIS
     * menu.
     *
     * By default, if getMenuCategory() and getLongName() are both
     * non-empty strings, a menu entry will be added for the module
     * under the appropriate category with the long name used as the
     * name. A module may override this if it wants to override this
     * behaviour and add more (or differently named) menu items.
     *
     * In order for a module to not be placed in the LORIS menu, it's
     * sufficient to simply not change the default returned by
     * getMenuCategory() without overriding getMenuItems.
     *
     * @return \LORIS\GUI\MenuItem[]
     */
    public function getMenuItems() : array
    {
        $category = $this->getMenuCategory();
        $name     = $this->getLongName();
        if ($category !== null && $name !== "") {
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $url     = $baseURL . '/' . $this->getName() . '/';

            return [
                new \LORIS\GUI\MenuItem($category, $name, $url)
            ];
        }
        return [];
    }

    /**
     * Return a list of widgets of type $type that this module
     * can provide for user $user.
     *
     * Widgets are things that can be rendered into other modules.
     * They serve as a somewhat abstract link that can be used
     * to loosely couple modules.
     *
     * As such, the exact type and nature of a widget can vary based
     * on $type, and the contract between the caller and callee is
     * implicit.
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options)
    {
        return [];
    }

    /**
     * Render a template from within this module's namespace.
     *
     * @param string $template The template file name.
     * @param array  $tpl_data The data to bind to the rendering.
     *
     * @return string The rendered template
     */
    public function renderTemplate(string $template, array $tpl_data) : string
    {
        $renderer = new \Smarty_NeuroDB($this->getName());
        $renderer->assign($tpl_data);
        return $renderer->fetch($template);
    }

    /**
     * Returns true if a schema.yml file exists under the satic directory of that
     * module.
     *
     * @return bool
     */
    public function hasAPISpecification(): bool
    {
        return false;
    }

    /**
     * Gets the QueryEngine to be used for querying against this module's
     * data.
     *
     * @return \LORIS\Data\Query\QueryEngine
     */
    public function getQueryEngine() : \LORIS\Data\Query\QueryEngine
    {
        return new \LORIS\Data\Query\NullQueryEngine();
    }
}
