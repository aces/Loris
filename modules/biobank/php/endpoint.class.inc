<?php declare(strict_types=1);

namespace LORIS\biobank;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use LORIS\Http\Endpoint as LORISEndpoint;

/**
 * Abstract Endpoint class responsible for handling HTTP requests for
 * Biobank-related operations.
 *
 * This class extends the LORIS Endpoint and implements the ETagCalculator
 * interface. It manages permissions, handles sub-endpoints, and processes
 * requests based on HTTP methods.
 *
 * @package    LORIS
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU General Public
 *             License
 */
abstract class Endpoint
    extends LORISEndpoint
    implements \LORIS\Middleware\ETagCalculator
{
    /**
     * Cache for storing intermediate results during request processing.
     *
     * @var ResponseInterface|null
     */
    private ? ResponseInterface $_cache = null;

    /**
     * Defines the permission required for accessing this endpoint.
     *
     * @param Permission $permission The permission object.
     *
     * @return string                 The name of the required permission.
     */
    abstract protected static function getPermission(
        Permission $permission
    ): string;

    /**
     * //TODO: to be moved to a service layer.
     * Handles getting multiple resources.
     *
     * @param QueryParams $params The number of requested barcodes
     *
     * @return array The data to be returned as JSON
     */
    abstract protected function get(QueryParams $params): array;

    /**
     * Defines the allowed HTTP methods for this endpoint.
     *
     * @return array The array of allowed HTTP methods.
     */
    protected function allowedMethods() : array
    {
        return ['GET', 'PUT', 'POST', 'OPTIONS'];
    }

    /**
     * Checks if the user has the required permission to access this endpoint.
     *
     * @param \User      $user       The user attempting access.
     * @param Permission $permission The required permission for this endpoint.
     *
     * @return void
     * @throws Forbidden  If the user does not have the required permission.
     */
    protected function checkPermission(
        \User $user,
        Permission $permission
    ) : void {
        if (!$user->hasPermission($this->getPermission($permission))) {
            throw new Forbidden(
                get_called_class() . ": {$permission->value} Permission Denied"
            );
        }
    }

    /**
     * Processes incoming requests, routing to sub-handlers if applicable.
     *
     * @param ServerRequestInterface  $request The incoming request.
     * @param RequestHandlerInterface $handler The request handler.
     *
     * @return ResponseInterface                 The response to the request.
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $path      = trim($request->getAttribute("unhandledURI")->getPath(), "/");
        $pathparts = explode('/', $path);

        // Check if sub-handlers are supported
        if ($this instanceof HasSubEndpoints && count($pathparts) > 1) {
            $subpath    = $pathparts[1];
            $subhandler = $this->getSubEndpoint($subpath);

            // Remove the handled part of the path and pass the remainder
            $remainingPath = implode('/', array_slice($pathparts, 1));

            // Update the request URI path
            $uri     = $request->getUri()->withPath($remainingPath);
            $request = $request->withUri($uri);

            return $subhandler->process($request, $subhandler);
        }

        // Default processing for the main endpoint if no subendpoint matches
        return parent::process($request, $handler);
    }

    /**
     * Handles incoming requests for this endpoint.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface              The outgoing PSR7 response.
     */
    public function handle(
        ServerRequestInterface $request
    ) : ResponseInterface {
        return match ($request->getMethod()) {
            'GET' => $this->_handleGET($request),
            'OPTIONS' => (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods()),
            default => new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            ),
        };
    }

    /**
     * Handles GET requests for this endpoint.
     *
     * This method checks the user's permission and processes the request to
     * either retrieve the root data or a specific resource based on the URI path.
     *
     * @param ServerRequestInterface $request The incoming PSR7 GET request.
     *
     * @return ResponseInterface              The response to the GET request.
     */
    private function _handleGET(
        ServerRequestInterface $request
    ): ResponseInterface {
        $this->checkPermission($request->getAttribute('user'), Permission::GET);

        $queryParams = (new QueryParamsHandler(
            $request->getQueryParams()
        ))->parse();

        $data = $this->get($queryParams);

        return new \LORIS\Http\Response\JSON\OK($data);
    }

    /**
     * Implements the ETagCalculator interface.
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string                        The ETag summarizing the request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }
}
