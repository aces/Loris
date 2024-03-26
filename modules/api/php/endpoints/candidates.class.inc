<?php declare(strict_types=1);
/**
 * This implements the Candidates endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints;

use LORIS\StudyEntities\Candidate\Sex;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;
use \LORIS\Data\Filters\HasAnyPermissionOrUserSiteMatch;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * A class for handling the /candidates endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Candidates extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * Permission checks
     *
     * @param \User $user The requesting user
     *
     * @return boolean true if access is permitted
     */
    private function _hasAccess(\User $user)
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
        return [
            'GET',
            'POST',
        ];
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
            "v0.0.3",
            "v0.0.4-dev",
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
            return new \LORIS\Http\Response\JSON\Unauthorized();
        }

        if (!$this->_hasAccess($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
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
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to candidate specific endpoint.
        try {
            $candID = new CandID($pathparts[1]);
        } catch (\DomainException $e) {
            $apiversion = $request->getAttribute("LORIS-API-Version") ?? "unknown";
            if ($apiversion != "v0.0.4-dev") {
                return new \LORIS\Http\Response\JSON\NotFound('Candidate not found');
            }

            $loris  = $request->getAttribute('loris');
            $db     = $loris->getDatabaseConnection();
            $pscids = $db->pselect(
                "SELECT CandID FROM candidate WHERE PSCID=:pscid",
                ["pscid" => $pathparts[1]]
            );

            if (count($pscids) === 0) {
                return new \LORIS\Http\Response\JSON\NotFound('Candidate not found');
            } else if (count($pscids) > 1) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Candidate identifier is not unique'
                );
            }

            // We don't try/catch this like above because the value
            // came from the CandID column of a database call. If
            // something goes wrong at this point we should definitely
            // propagate an exception..
            $candID = new CandID($pscids[0]["CandID"]);
        }

        try {
            $candidate = \NDB_Factory::singleton()->candidate($candID);
        } catch (\DomainException $e) {
            return new \LORIS\Http\Response\JSON\NotFound('Candidate not found');
        }

        if (!$candidate->isAccessibleBy($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
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
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $filter = new HasAnyPermissionOrUserSiteMatch(
            ['access_all_profiles']
        );

        $provisioner = (new \LORIS\api\Provisioners\CandidatesProvisioner())
            ->filter($filter)
            ->filter(new \LORIS\Data\Filters\UserProjectMatch());

        $candidates = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($request->getAttribute('user'));

        $this->_cache = new \LORIS\Http\Response\JsonResponse(
            ['Candidates' => $candidates]
        );

        return $this->_cache;
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
            return new \LORIS\Http\Response\JSON\BadRequest(
                'There is no Candidate object in the POST data'
            );
        }

        $usersites = $user->getSiteNames();
        if (!in_array($data['Candidate']['Site'], $usersites)) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                "You are not affiliated with the candidate's site"
            );
        }

        $projectname = $data['Candidate']['Project'] ?? '';
        try {
            $project = \NDB_Factory::singleton()->project($projectname);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\BadRequest($e->getMessage());
        }

        $centerid = array_search(
            $data['Candidate']['Site'],
            \Utility::getSiteList()
        );

        $pscid = $data['Candidate']['PSCID'] ?? null;

        $sex = new Sex($data['Candidate']['Sex']);

        try {
            $candid = \Candidate::createNew(
                new \CenterID("$centerid"),
                $data['Candidate']['DoB'] ?? null,
                $data['Candidate']['EDC'] ?? null,
                $sex,
                $pscid,
                $project->getId()
            );
        } catch (\ConflictException $e) {
            return new \LORIS\Http\Response\JSON\Conflict(
                $e->getMessage()
            );
        } catch (\Exception | \LorisException | \InvalidArgumentException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $candidate = \NDB_Factory::singleton()->candidate($candid);

        $body = (new \LORIS\api\Views\Candidate($candidate))->toArray()['Meta'];
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
