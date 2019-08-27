<?php
/**
 * This class provides the php code to create the menu filter form that
 * allows unresolved conflicts to be processed as part of the conflict resolver
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\conflict_resolver;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * Menu_Filter_Form_Conflicts_Resolver Class
 *
 * This class provides the php code to create the menu filter form that
 * allows unresolved conflicts to be processed as part of the conflict resolver
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Unresolved extends Endpoint implements ETagCalculator
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
        return ($user->hasPermission('conflict_resolver'));
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
        return md5(json_encode($this->_handleGET($request)->getBody()));
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
     * Provide the select inputs options
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions() : array
    {
        return array(
                'site'       => \Utility::getSiteList(false),
                'instrument' => \Utility::getAllInstruments(),
                'visitLabel' => \Utility::getVisitList(),
                'project'    => \Utility::getProjectList(),
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
        if (!isset($this->_cache)) {
            $user        = $request->getAttribute('user');
            $provisioner = (new UnresolvedProvisioner())->forUser($user);

            $conflicts = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($user);

            $body = array(
                     'data'         => $conflicts,
                     'fieldOptions' => $this->_getFieldOptions(),
                    );

            $this->_cache = new \LORIS\Http\Response\JsonResponse($body);
        }
        return $this->_cache;
    }
}
