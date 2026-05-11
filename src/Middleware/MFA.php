<?php declare(strict_types=1);

namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * The language middleware tries to get the most appropriate locale for
 * a user.
 *
 * By priority:
 *  1. First it will check if a "lang" get attribute is passed so
 *         that it can be overridden on a page dropdown
 *      2. Next, it will check the user's preference and use their preferred
 *         language if they haven't chosen another for this page load
 *      3. Finally, a best attempt based on the request Accept-Language header
 *         is made
 *
 * Otherwise, the request will fall back on the default locale.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class MFA implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request.
     * @param RequestHandlerInterface $handler The PSR15 handler to delegate
     *                                         content generation to.
     *
     * @return ResponseInterface the PSR15 response
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        $loris = $request->getAttribute("loris");
        $user  = $request->getAttribute("user");
        if ($user->totpRequired() === false) {
            return $this->next->process($request, $handler);
        }
        $singlepointlogin = $_SESSION['State']->getProperty('login');
        if ($singlepointlogin->passedMFA() === true) {
            return $this->next->process($request, $handler);
        }

        $loginmodule = $loris->getModule("login");
        $loginmodule->registerAutoloader();
        $page    = $loginmodule->loadPage($loris, "mfa");
        $baseURL = $request->getAttribute("baseurl");

    // Whitelist of resources needed to load the MFA prompt page
        if (str_ends_with($request->getURI()->getPath(), ".js") ||
        str_ends_with($request->getURI()->getPath(), ".css") ||
        str_ends_with($request->getURI()->getPath(), "Authentication") ||
        str_ends_with($request->getURI()->getPath(), "summary_statistics")) {
            return $this->next->process($request, $handler);
        }
        return (new AnonymousPageDecorationMiddleware(
            $baseURL ?? "",
            \NDB_Config::singleton(),
            $page->getJSDependencies(),
            $page->getCSSDependencies(),
        ))->process($request, $page);
    }
}
