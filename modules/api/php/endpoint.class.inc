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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint as LORISEndpoint;
/**
 * An abstract class for common concerns of different API endpoints.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
abstract class Endpoint extends LORISEndpoint implements RequestHandlerInterface
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
     * An API endpoint overrides the default LORIS Endpoint to add checks for
     * supported version(s).
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request
     * @param RequestHandlerInterface $handler The PSR15 request handler
     *
     * @return ResponseInterface
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $versions = $this->supportedVersions() ?? [];
        $version  = $request->getAttribute("LORIS-API-Version") ?? "unknown";
        if (!in_array($version, $versions)) {
            return new \LORIS\Http\Response\JSON\BadRequest('Unsupported version');
        }

        return parent::process($request, $handler);
    }
}
