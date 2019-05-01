<?php declare(strict_types=1);
/**
 * This implements the Candidates endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
/**
 * A class for handling the api/v????/candidates endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Candidates extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    protected $cache;

    /**
     * Permission checks
     *
     * @param \User $user The requesting user
     *
     * @return boolean true if access is permitted
     */
    protected function hasAccess(\User $user)
    {
        return (
            $user->hasPermission('access_all_profiles') ||
            ($user->hasStudySite() && $user->hasPermission('data_entry'))
        );
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array(
                'GET',
                'POST',
               );
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
                "v0.0.1",
                "v0.0.2",
                "v0.0.3-dev",
               ];
    }

    /**
     * Handles a request starts with /candidates
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute('user');
        if ($user instanceof \LORIS\AnonymousUser) {
            return new \LORIS\Http\Response\Unauthorized();
        }

        if (!$this->hasAccess($user)) {
            return new \LORIS\Http\Response\Forbidden();
        }

        $pathparts = $request->getAttribute('pathparts');

        if (count($pathparts) === 1) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'POST':
                return $this->_handlePOST($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());

            default:
                return new \LORIS\Http\Response\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to candidate specific endpoint.
        try {
            $candidate = \NDB_Factory::singleton()
                ->candidate($pathparts[1]);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\NotFound();
        }

        $endpoint = new Candidate\Candidate($candidate);

        $pathparts = array_slice($pathparts, 2);
        $request   = $request->withAttribute('pathparts', $pathparts);

        return $endpoint->process($request, $endpoint);
    }

    /**
     * Generates a list of all candidates visible to a user fiting this endpoint
     * response format.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (!isset($this->cache)) {
            $user        = $request->getAttribute('user');
            $provisioner = (new \LORIS\api\CandidatesProvisioner())
                ->forUser($user);

            $candidates = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($user);

            $this->cache = new \LORIS\Http\Response\JsonResponse(
                array('Candidates' => $candidates)
            );
        }
        return $this->cache;
    }

    /**
     * Create a candidate with the provided data
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);

        if (!isset($data['Candidate'])) {
            return new \LORIS\Http\Response\BadRequest(
                'There is no Candidate object in the POST data'
            );
        }

        $usersites = explode(';', $user->getSiteNames());
        if (!in_array($data['Candidate']['Site'], $usersites)) {
            return new \LORIS\Http\Response\Forbidden(
                'You are not affiliated with the candidate`s site'
            );
        }

        $projectname = $data['Candidate']['Project'] ?? '';
        try {
            $project = \NDB_Factory::singleton()->project($projectname);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\BadRequest($e->getMessage());
        }

        $centerid = array_search(
            $data['Candidate']['Site'],
            \Utility::getAssociativeSiteList()
        );

        $pscid = $data['Candidate']['PSCID'] ?? null;

        try {
            $candid = \Candidate::createNew(
                $centerid,
                $data['Candidate']['DoB'],
                $data['Candidate']['EDC'],
                $data['Candidate']['Gender'],
                $pscid
            );
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\BadRequest($e->getMessage());
        }

        $candidate = \NDB_Factory::singleton()->candidate($candid);
        $candidate->setData(
            array('ProjectID' => $project->getId())
        );

        $body = (new \LORIS\Api\Views\Candidate($candidate))->toArray()['Meta'];
        $link = '/'. $request->getURI()->getPath() . '/' . $candid;

        return (new \LORIS\Http\Response\JsonResponse($body))
            ->withStatus(201)
            ->withHeader('Content-Location', $link);
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
        return md5(json_encode($this->_handleGet($request)->getBody()));
    }
}
