<?php declare(strict_types=1);

namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * The AWS middleware registers a stream wrapper for accessing AWS S3 buckets
 * through standard PHP file IO calls if AWS credentials are configured.
 *
 * It also adds a header to the response to make it easier to debug if it
 * is in use.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class AWS implements MiddlewareChainer
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
        $response = $this->next->process($request, $handler);
        if (getenv("AWS_ACCESS_KEY_ID") !== false) {
            $loris = $request->getAttribute("loris");
            (new \LORIS\AWS\Client($loris))->registerStreamWrapper();
            $response = $response
            ->withHeader("LORIS-S3-Enabled", "true");
        }
        return $response;
    }
}
