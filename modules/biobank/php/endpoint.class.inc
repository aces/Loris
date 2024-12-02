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
     * Returns a sub-handler for a given subpath, if any exists.
     *
     * @param string $subpath The subpath to check for a sub-handler.
     *
     * @return ?Endpoint       The sub-handler for the subpath, or null if none.
     */
    abstract protected function getSubHandler(string $subpath): ?Endpoint;

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
     * //TODO: to be moved to a service layer.
     * Shows a specific resource.
     *
     * @param string $resourceId The resource identifier that is requested
     *
     * @return array
     */
    abstract protected function getOne(string $resourceId): array;

    /**
     * //TODO: to be moved to a service layer.
     * Handles updating a specific resource.
     *
     * @param array $resource The resource to be updated
     *
     * @return array
     */
    abstract protected function update(string $resource): array;

    /**
     * //TODO: to be moved to a service layer.
     * Handles file upload requests.
     *
     * @param array $uploadedFiles The files to be uploaded
     *
     * @return void
     */
    abstract protected function upload(array $uploadedFiles): void;

    /**
     * //TODO: to be moved to a service layer.
     * Handles creating a new resource.
     *
     * @return array
     */
    abstract protected function create(): array;

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
        $path      = trim($request->getURI()->getPath(), "/");
        $pathparts = explode('/', $path);

        // Determine subendpoint handler based on the subpath
        if (count($pathparts) > 1) {
            $subpath    = $pathparts[1];
            $subhandler = $this->getSubHandler($subpath);

            if ($subhandler !== null) {
                // Remove the handled part of the path and pass the remainder
                $remainingPath = implode('/', array_slice($pathparts, 1));

                // Update the request URI path
                $uri     = $request->getUri()->withPath($remainingPath);
                $request = $request->withUri($uri);

                return $subhandler->process($request, $subhandler);
            }
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
            'POST' => $this->_handlePOST($request),
            'PUT' => $this->_handlePUT($request),
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

        $path      = trim($request->getURI()->getPath(), "/");
        $pathparts = explode('/', $path);

        $queryParams = (new QueryParamsHandler(
            $request->getQueryParams()
        ))->parse();

        if (count($pathparts) === 1) {
            if (method_exists($this, 'index')) {
                $data = $this->index($queryParams);
            } else {
                $data = []; // Or some default behavior
            }
        } else {
            if (method_exists($this, 'show')) {
                $data = $this->show(
                    $request,
                    $pathparts[1]
                );
            } else {
                // Handle the case where no specific handler exists
                throw new \LORIS\Http\Exception\NotFoundException(
                    "Resource '{$pathparts[1]}' not found."
                );
            }
        }

        return new \LORIS\Http\Response\JSON\OK($data);
    }

    /**
     * Handles PUT requests for this endpoint.
     *
     * This method checks the user's permission and processes the request to
     * update a specific resource based on the URI path.
     *
     * @param ServerRequestInterface $request The incoming PSR7 PUT request.
     *
     * @return ResponseInterface              The response to the PUT request.
     * @throws \LORIS\Http\Exception\NotFoundException If the path is invalid.
     */
    private function _handlePUT(
        ServerRequestInterface $request
    ): ResponseInterface {
        $this->checkPermission($request->getAttribute('user'), Permission::PUT);

        $path      = trim($request->getURI()->getPath(), "/");
        $pathparts = explode('/', $path);

        if (count($pathparts) === 2) {
            return $this->handleUpdateRequest($request, $pathparts[1]);
        } else {
            throw new \LORIS\Http\Exception\NotFoundException("Invalid path.");
        }
    }

    /**
     * Handles POST requests for this endpoint.
     *
     * This method checks the user's permission and processes the request to
     * either handle file uploads or create a new resource based on the request
     * content type.
     *
     * @param ServerRequestInterface $request The incoming PSR7 POST request.
     *
     * @return ResponseInterface              The response to the POST request.
     */
    private function _handlePOST(
        ServerRequestInterface $request
    ): ResponseInterface {
        $this->checkPermission($request->getAttribute('user'), Permission::POST);

        $contentType = $request->getHeaderLine('Content-Type');

        if (strpos($contentType, 'multipart/form-data') !== false) {
            $uploadedFiles = $request->getUploadedFiles();
            return $this->handleFileUploadRequest($request, $uploadedFiles);
        } else {
            return $this->handleCreateRequest($request);
        }
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
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}
