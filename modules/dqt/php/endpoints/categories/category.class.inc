<?php
namespace LORIS\dqt\Endpoints\Categories;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;
use \LORIS\Middleware\ETagCalculator;
use \LORIS\dqt\Views\Category as VCategory;
use \LORIS\dqt\Provisioners\CategoryProvisioner;


class Category extends Endpoint implements ETagCalculator
{
    public function __construct(string $name)
    {
        $this->_name = $name;
    }

    /**
     * Returns true if the user has permission to access
     * the dqt categories
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('dataquery_view');
    }
    
    /**
     * Implements the ETagCalculator interface.
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * Projects can only be retrieved, not created.
     *
     * @return array supported HTTP methods
     */
    private function _allowedMethods() : array
    {
        return [
            'GET',
        ];
    }

    /**
     * Handles a request to Resolved conflicts
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (!empty($pathparts)) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        if (empty($pathparts)) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->_allowedMethods());

            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->_allowedMethods()
                );
            }
        }
    }

    /**
     * Create an array representation of this endpoint's response body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (!isset($this->_cache)) {
            $loris       = $request->getAttribute('loris');
            $user        = $request->getAttribute('user');

            $provisioner = new CategoryProvisioner($loris, $this->_name);

            $categories = $provisioner->execute($user);

            $this->_cache = [
                'name'   => $this->_name,
                'fields' => iterator_to_array($categories)
            ];
        }

        return new \LORIS\Http\Response\JsonResponse(
            $this->_cache
        );
    }

}
