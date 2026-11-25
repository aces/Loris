<?php declare(strict_types=1);

namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * A RequestAttributeMBuilder middleware is a chainable type of PSR15-based
 * middleware which add/modify the requests attributes.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RequestAttributeBuilder implements MiddlewareInterface, MiddlewareChainer
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
        // use it once at the top of the middleware call
        $factory = \NDB_Factory::singleton();

        // add user to request attributes
        $user    = $factory->user();
        $request = $request->withAttribute("user", $user);

        // add loris instance to request attributes
        $lorisInstance = new \LORIS\LorisInstance(
            $factory->database(),
            $factory->config(),
            [
             __DIR__ . "/../../project/modules",
             __DIR__ . "/../../modules/",
            ]
        );
        $request       = $request->withAttribute("loris", $lorisInstance);

        // add baseurl to request attributes
        $uri     = $request->getURI();
        $baseurl = $uri->withPath("")->withQuery("");
        $request = $request->withAttribute(
            "baseurl",
            $baseurl->__toString()
        );

        //
        return $this->next->process($request, $handler);
    }
}
