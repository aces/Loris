<?php declare(strict_types=1);
/**
 * An API endpoint is an endpoint which abstracts away common element
 * of different LORIS API endpoints.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;


/**
 * An abstract class for common concerns of different API endpoints.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
abstract class Endpoint implements RequestHandlerInterface
{
    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    abstract protected function allowedMethods() : array;

    /**
     * Return a list of LORIS API versions which this endpoint
     * supports.
     *
     * @return string[] LORIS API Versions
     */
    abstract protected function supportedVersions() : array;

    /**
     * An API endpoint overrides the default LORIS middleware to remove the
     * PageDecorationMiddleware, since the API only deals with JSON.
     *
     * It also acts as its own middleware by validating that an endpoint supports
     * both the version of the API passed, and the HTTP method request type.
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request
     * @param RequestHandlerInterface $handler The PSR15 request handler
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $methods = $this->allowedMethods();
        if (!in_array($request->getMethod(), $methods)) {
            return (new \LORIS\Http\Response())
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array("error" => "Unsupported HTTP Method")
                        )
                    )
                )->withHeader("Allow", join(",", $methods))
                ->withStatus(405);
        }

        $versions = $this->supportedVersions() ?? [];
        $version  = $request->getAttribute("LORIS-API-Version") ?? "unknown";

        if (!in_array($version, $versions)) {
            return (new \LORIS\Http\Response())
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array("error" => "Unsupported LORIS API version")
                        )
                    )
                )
                ->withHeader("Allow", join(",", $methods))
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400);
        }
        if ($handler instanceof \LORIS\Middleware\ETagCalculator) {
            return (new \LORIS\Middleware\ETag())->process($request, $handler);
        }
        return $handler->handle($request);
    }
}
