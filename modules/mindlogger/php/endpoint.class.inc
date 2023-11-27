<?php declare(strict_types=1);

namespace LORIS\mindlogger;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint as LORISEndpoint;

abstract class Endpoint extends LORISEndpoint implements RequestHandlerInterface
{
    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    abstract protected function allowedMethods(): array;

    /**
     * Return a list of Mindlog API versions which this endpoint
     * supports.
     *
     * @return string[] LORIS API Versions
     */
    abstract protected function supportedVersions(): array;

    /**
     * An API endpoint overrides the default Mindlog Endpoint to add checks for
     * supported version(s).
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     * @param RequestHandlerInterface $handler The PSR15 request handler
     *
     * @return ResponseInterface
     */
    public function process(
        ServerRequestInterface  $request,
        RequestHandlerInterface $handler
    ): ResponseInterface
    {
        $versions = $this->supportedVersions() ?? [];
        $version = $request->getAttribute("Mindlog-API-Version") ?? "unknown";
        if (!in_array($version, $versions)) {
            // If it's not supported by a version of the API, that means the
            // endpoint for that version should be not found
            return new \LORIS\Http\Response\JSON\NotFound('Unsupported version');
        }

        return parent::process($request, $handler);
    }
}
