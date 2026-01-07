<?php declare(strict_types=1);

/**
 * Implements BaseRouter, a Router to handle the base of a LORIS
 * install.
 *
 * PHP Version 8
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
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * Handles the root of a LORIS install. It will mostly delegate to
 * other routers (such as Module routers)
 *
 * @category Router
 * @package  Router
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class BaseRouter extends PrefixRouter implements RequestHandlerInterface
{
    /**
     * Construct a BaseRouter
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance being routed
     * @param \User                $user  The user accessing LORIS. (May be an
     *                                    AnonymousUser instance).
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        protected \User $user
    ) {
    }

    /**
     * Handle delegates to an appropriate sub-router to do the real handling of a
     * LORIS request.
     *
     * @param ServerRequestInterface $request The PSR7 request
     *
     * @return ResponseInterface The PSR15 response.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $request = $request->withAttribute("unhandledURI", $request->getURI());
        $uri     = $request->getUri();
        $path    = $uri->getPath();

        // Replace multiple slashes in the URL with a single slash
        $path = preg_replace("/\/+/", "/", $path);
        // Remove any trailing slash remaining, so that foo/ and foo are the same
        // route
        $path    = preg_replace("/\/$/", "", $path);
        $request = $request->withAttribute("user", $this->user)
            ->withAttribute("loris", $this->loris);

        if ($path == "") {
            if ($this->user instanceof \LORIS\AnonymousUser) {
                $modulename = "login";
            } else {
                $modulename = "dashboard";
            }
            $request = $request->withURI($uri->withPath("/"));
        } elseif ($path[0] === "/") {
            $path    = substr($path, 1);
            $request = $request->withURI($uri->withPath($path));
        }

        $components = [];
        if (empty($modulename)) {
            $components = preg_split("/\/+?/", $path);
            $modulename = $components[0];
        }

        $factory           = \NDB_Factory::singleton();
        $ehandler          = new \LORIS\Middleware\ExceptionHandlingMiddleware();
        $logSettings       = $this->loris->getConfiguration()->getLogSettings();
        $exceptionloglevel = $logSettings->getExceptionLogLevel();

        if ($exceptionloglevel != "none") {
            $ehandler->setLogger(
                new \LORIS\Log\ErrorLogLogger($exceptionloglevel)
            );
        } else {
            $ehandler->setLogger(new \PSR\Log\NullLogger);
        }

        if ($this->loris->hasModule($modulename)) {
            $uri    = $request->getURI();
            $suburi = $this->stripPrefix($modulename, $uri);

            // Calculate the base path by stripping off the module from the original.
            $path     = $uri->getPath();
            $pathstrt =strpos($path, $modulename);
            if ($pathstrt !== false) {
                $baseurl = substr($path, 0, $pathstrt);
            } else {
                $baseurl = '';
            }
            $baseurl = $uri->withPath($baseurl)->withQuery("");
            $request = $request->withAttribute("baseurl", $baseurl->__toString());

            $factory->setBaseURL((string )$baseurl);

            $module = $this->loris->getModule($modulename);
            $module->registerAutoloader();

            $lang    = \LORIS\Middleware\Language::detectLocale($this->loris, $request);
            $request = $request->withAttribute("lang", $lang);

            if (file_exists(__DIR__ . "/../../project/locale/")) {
                if ($lang !== null) {
                    /* detectLanguage should have validated that it's a valid locale, but
                     * ensure that there are no unsafe characters just in case since we
                     * might be dealing with user input */
                    if (preg_match("/([a-zA-Z])+(_)?(a-zA-Z)*/", $lang)) {
                        $overrides = glob(__DIR__ . "/../../project/locale/$lang/LC_MESSAGES/*.mo");
                        // Requires pecl intl extension
                        if (function_exists('locale_get_primary_language')) {
                            $overrides = array_merge(
                                $overrides,
                                glob(
                                    __DIR__ . "/../../project/locale/"
                                    . locale_get_primary_language($lang)
                                    . "/LC_MESSAGES/*.mo"
                                )
                            );
                        }

                        // We need to override the textdomain binding for every module
                        // that has a translation override for the menu to be able
                        // to look up the right project-specific translation even though we're
                        // in the module.
                        // Otherwise, fall back on the module's textdomain set from getModule()
                        foreach ($overrides as $file) {
                            $textdomain = basename($file, ".mo");
                            bindtextdomain($textdomain, __DIR__ . "/../../project/locale/");
                        }
                    }
                }
            }
            $requestloglevel = $logSettings->getRequestLogLevel();
            if ($requestloglevel != "none") {
                $module->setLogger(
                    new \LORIS\Log\ErrorLogLogger($requestloglevel)
                );
            } else {
                $module->setLogger(new \PSR\Log\NullLogger);
            }
            $mr      = new ModuleRouter($module);
            $request = $request->withAttribute("unhandledURI", $suburi);

            return $ehandler->process($request, $mr);
        }
        // Legacy from .htaccess. A CandID goes to the timepoint_list
        // FIXME: This should all be one candidates module, not a bunch
        // of hacks in the base router.
        if (preg_match("/^([0-9]{6,10})$/", $components[0])) {
            $baseurl = $uri->withPath("")->withQuery("");

            $factory->setBaseURL((string )$baseurl);
            if (count($components) == 1) {
                $request = $request
                    ->withAttribute("baseurl", $baseurl->__toString())
                    ->withAttribute("CandID", $components[0]);

                $module = $this->loris->getModule("timepoint_list");
                $module->registerAutoloader();

                $requestloglevel = $logSettings->getRequestLogLevel();
                if ($requestloglevel != "none") {
                    $module->setLogger(
                        new \LORIS\Log\ErrorLogLogger($requestloglevel)
                    );
                } else {
                    $module->setLogger(new \PSR\Log\NullLogger);
                }
                $mr = new ModuleRouter($module);
                return $ehandler->process($request, $mr);
            }
        }

        // Fall through to 404. We don't have any routes that go farther
        // than 1 level..
        return (new \LORIS\Middleware\PageDecorationMiddleware($this->user))
                ->process(
                    $request,
                    new NoopResponder(new \LORIS\Http\Error($request, 404))
                );
    }
}
