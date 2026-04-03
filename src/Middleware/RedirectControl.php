<?php declare(strict_types=1);

namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * A Redirect middleware is a chainable type of PSR15-based middleware
 * which checks the "redirect" query param element.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedirectControl implements MiddlewareInterface, MiddlewareChainer
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
        // no redirect, skip to/follow normal process
        $queryString = $request->getServerParams()['QUERY_STRING'] ?? null;
        if ($queryString === null || !str_contains($queryString, "redirect")) {
            return $this->next->process($request, $handler);
        }

        // if redirect in query string, check if a query parameter has a
        // redirection set for a third-party
        $query = $request->getQueryParams();
        if (array_key_exists("redirect", $query)) {
            // redirect uri
            $redirect = rtrim($query["redirect"], "/");

            // if the redirection does not starts with current host, it is
            // trying to redirect outside, then force redirect to main/login page.
            $uri     = $request->getUri();
            $baseURL = $request->getAttribute("baseurl");
            if (!str_starts_with($redirect, $baseURL)) {
                error_log("[error][redirect] Tentative of redirection outside of LORIS: {$redirect}");

                // nullify uri query parameters
                $uri = $uri->withQuery("");

                // force reload the current host without redirect query param
                return new \LORIS\Http\Response\JSON\SeeOther($uri);
            }
        }

        //
        return $this->next->process($request, $handler);
    }
}