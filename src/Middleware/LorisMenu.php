<?php declare(strict_types=1);

namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * The LorisMenu middleware pre-loads the LORIS menu categories so
 * that modules respect the database defined ordering.
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class LorisMenu implements MiddlewareInterface, MiddlewareChainer
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
        \LORIS\GUI\MenuCategory::bulkLoad($loris);
        return $this->next->process($request, $handler);
    }
}
