<?php
/**
 * An API endpoint is an endpoint which abstracts away common element
 * of different LORIS API endpoints.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api;

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
abstract class APIEndpoint extends \NDB_Page
{
    abstract protected function AllowedMethods() : array;
    abstract protected function SupportedVersions() : array;

    /**
     * An API endpoint overrides the default LORIS middleware to remove the PageDecorationMiddleware,
     * since the API only deals with JSON.
     *
     * It also acts as its own middleware by validating that an endpoint supports both the version of
     * the API passed, and the HTTP method request type.
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $methods = $this->AllowedMethods();
        if (!in_array($request->getMethod(), $methods)) {
            return (new \LORIS\Http\Response())
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("error", "Unsupported HTTP Method")
                    )
                )->withHeader("Allow", join(",", $methods))
                ->withStatus(405);
        }

        $versions = $this->SupportedVersions() ?? [];
        $version  = $request->getAttribute("LORIS-API-Version") ?? "unknown";

        if (!in_array($version, $versions)) {
            return (new \LORIS\Http\Response())
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(array("error" => "Unsupported LORIS API version."))
                    )
                )
                ->withHeader("Allow", join(",", $methods))
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400);
        }
        // FIXME: Add an ETag middleware
        return $handler->handle($request);
    }
}
