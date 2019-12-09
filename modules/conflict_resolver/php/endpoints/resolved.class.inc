<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\conflict_resolver\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;
use \LORIS\conflict_resolver\Provisioners\ResolvedProvisioner;

/**
 * Request handler to provide resolved conflicts for the conflict resolver
 * resolved tab.
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Resolved extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * Returns true if the user has permission to access
     * the conflict resolver module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    public function hasAccess(\User $user) : bool
    {
        return $user->hasPermission('conflict_resolver');
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
    protected function allowedMethods() : array
    {
        return ['GET'];
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * This part is not versioned yet.
     *
     * @return array
     */
    protected function supportedVersions() : array
    {
        return array('unknown');
    }

    /**
     * Returns a list of instruments to use as the "Source From"
     * filter options
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions() : array
    {
        $sites       = array_values(\Utility::getSiteList(false));
        $visitlabels = array_values(\Utility::getVisitList());
        $projects    = array_values(\Utility::getProjectList());

        return array(
            'site'       => array_combine($sites, $sites),
            'instrument' => \Utility::getAllInstruments(),
            'visitLabel' => array_combine($visitlabels, $visitlabels),
            'project'    => array_combine($projects, $projects),
        );
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
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods());

        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Create an array representation of this endpoint's response body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $user        = $request->getAttribute('user');
        $provisioner = (new ResolvedProvisioner())->forUser($user);

        $conflicts = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);

        $body = array(
            'data'         => $conflicts,
            'fieldOptions' => $this->_getFieldOptions(),
        );

        $this->_cache = new \LORIS\Http\Response\JsonResponse($body);

        return $this->_cache;
    }
}
