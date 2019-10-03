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
        $versions = $this->supportedVersions() ?? [];
        $version  = $request->getAttribute("LORIS-API-Version") ?? "unknown";
        if (!in_array($version, $versions)) {
            return new \LORIS\Http\Response\BadRequest('Unsupported version');
        }

        if ($handler instanceof \LORIS\Middleware\ETagCalculator) {
            return (new \LORIS\Middleware\ETag())->process($request, $handler);
        }

        return $handler->handle($request);
    }

    /**
     * Used to create (select, text, ...) element for form filter.
     *
     * @param string     $name   for element
     * @param string     $type   for element
     * @param string     $label  for element
     * @param bool       $hidden for element
     * @param array|null $values for element
     *
     * @return object
     */
    public function _formElementObjectCreator(
        string $name,
        string $type,
        string $label,
        bool   $hidden,
        ?array $values
    ) : object {
        $element         = new \stdClass();
        $element->name   = $name;
        $element->type   = $type;
        $element->label  = $label;
        $element->hidden = !$hidden;
        if (isset($values)) {
            $element->options = $values;
        }
        return $element;
    }
}
