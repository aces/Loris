<?php declare(strict_types=1);
/**
 * This implements the Subproject page class under Project
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Project\Subproject;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling the /projects/$projectname/subprojects/$subproject
 * endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Subproject extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * The requested instrument
     */
    private $_subproject;

    /**
     * Contructor for the subproject endpoint
     *
     * @param \Subproject $subproject The subproject
     */
    public function __construct(\Subproject $subproject)
    {
        $this->_subproject = $subproject;
    }

    /**
     * Return which methods are supported by this endpoint.
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
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return [
            'v0.0.4-dev',
        ];
    }

    /**
     * Handles a HTTP request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) !== 0) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods());
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Create an array representation of this endpoint's reponse body
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $data = json_decode(json_encode($this->_subproject), true);
        unset($data['SubprojectID']);
        unset($data['WindowDifference']);
        unset($data['RecruitmentTarget']);
        $visits = array_reduce(
            $this->_subproject->getVisits(),
            function ($carry, $item) {
                // This is just changing the keys from visit_label to VisitName
                // It should probably be delegated to a view object.
                array_push($carry, ['VisitName' => $item->getName()]);
                return $carry;
            },
            []
        );

        $data['Visits'] = $visits;

        $this->_cache = new \LORIS\Http\Response\JsonResponse($data);

        return $this->_cache;
    }

    /**
     * Implements the ETagCalculator interface
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}

