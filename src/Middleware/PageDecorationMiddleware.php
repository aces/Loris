<?php
namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * A PageDecorationMiddleware takes a PSR7 request and delegates to
 * appropriate middleware to add the decorations for the user class
 * accessing the page and the page type being accessed.
 */
class PageDecorationMiddleware implements MiddlewareInterface
{
    protected $page;
    protected $user;
    public function __construct(\User $user)
    {
        $this->user = $user;
    }
    /**
     * Displays a page to an anonymous (not logged in) user.
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request
     * @param RequestHandlerInterface $handler The PSR15 handler to delegate to
     *
     * @return ResponseInterface The response with the page content
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface
    {
        $baseURL = $request->getAttribute("baseurl");
        $config  = \NDB_Config::singleton();
        $page    = $request->getAttribute("pageclass") ?? new \NDB_Page(new \Module("", ""), "", "", "", "");
        if ($this->user instanceof \LORIS\AnonymousUser) {
            return (new \LORIS\Middleware\AnonymousPageDecorationMiddleware(
                $baseURL ?? "",
                $config,
                $page->getJSDependencies(),
                $page->getCSSDependencies()
            )
            )->process($request, $handler);
        }

        return (new \LORIS\Middleware\UserPageDecorationMiddleware(
            $this->user,
            $baseURL ?? "",
            $page->name ?? "",
            $config,
            $page->getJSDependencies(),
            $page->getCSSDependencies()
        )
        )->process($request, $handler);
    }
}
