<?php declare(strict_types=1);
/**
 * This implements the Visit endpoint class under Candidates/$candid
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit;

use LORIS\api\Endpoints\Candidate\Visit\Electrophysiology\Electrophysiology;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * A class for handling the /candidates/$candidate/$visit_label endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Visit extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Candidate
     *
     * @var \Candidate
     */
    private $_candidate;

    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * Contructor
     *
     * @param \Candidate  $candidate The requested candidate
     * @param ?\Timepoint $visit     The requested visit; can be null in PUT requests
     */
    public function __construct(\Candidate $candidate, ?\Timepoint $visit)
    {
        $this->_candidate = $candidate;
        $this->_visit     = $visit;
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
            'PUT',
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
        // Removed 0.0.2 since session requires a project.
        return array('v0.0.3-dev');
    }

    /**
     * Handles a request that starts with /candidates/$candid
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) === 0) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'PUT':
                return $this->_handlePUT($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());

            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        if ($this->_visit === null) {
            // Subendpoint requires a Timepoint. see Constructor comment for $visit
            return new \LORIS\Http\Response\JSON\NotFound('Visit not found');
        }

        // Delegate to sub-endpoints
        $subendpoint = array_shift($pathparts);
        switch($subendpoint) {
        case 'instruments':
            $handler = new Instruments($this->_visit);
            break;
        case 'images':
            $handler = new Images($this->_visit);
            break;
        case 'qc':
            $handler = new Qc($this->_visit);
            break;
        case 'dicoms':
            $handler = new Dicoms($this->_visit);
            break;
        case 'recordings':
            $handler = new Recordings($this->_visit);
            break;
        default:
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process(
            $newrequest,
            $handler
        );
    }

    /**
     * Generates a response fitting the API specification for this endpoint.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if ($this->_visit === null) {
            return new \LORIS\Http\Response\JSON\NotFound('Visit not found');
        }

        return new \LORIS\Http\Response\JsonResponse(
            (new \LORIS\api\Views\Visit($this->_visit))
                ->toArray()
        );
    }

    /**
     * Handles a PUT request that creates or replace a candidate visit
     *
     * TODO: There is no way to validate the the visit_label in the url
     *       fits the json data of the request because it is removed from the
     *       pathparts in the calling class. The correct way to do it would be
     *       to pass a "light" timepoint class that contains the visit_label but
     *       no sessionid in the constructor.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request): ResponseInterface
    {
        $user      = $request->getAttribute('user');
        $data      = json_decode((string) $request->getBody(), true);
        $visitinfo = $data ?? array();

        $requiredfields = array(
            'CandID',
            'Visit',
            'Site',
            'Battery',
            'Project',
        );
        $diff           = array_diff($requiredfields, array_keys($visitinfo));
        if (!empty($diff)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Field(s) missing: ' . implode(', ', $diff)
            );
        }

        try {
            $project = \NDB_Factory::singleton()->project($visitinfo['Project']);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        if ($visitinfo['CandID'] !== $this->_candidate->getCandID()) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'CandID do not match this candidate'
            );
        }

        $sessionid = array_search(
            $visitinfo['Visit'],
            $this->_candidate->getListOfVisitLabels()
        );

        $centerid = array_search($visitinfo['Site'], \Utility::getSiteList());

        if (!in_array($centerid, $user->getCenterIDs())) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'You can`t create candidates visit for that site'
            );
        }

        $subprojectid = array_search(
            $visitinfo['Battery'],
            \Utility::getSubprojectList()
        );

        if ($sessionid !== false) {
            // If the visit label already exists for that candidate
            $timepoint = \NDB_Factory::singleton()->timepoint($sessionid);
            if ($timepoint->getCurrentStage() !== 'Not Started') {
                return new \LORIS\Http\Response\JSON\Conflict(
                    'This visit is already started'
                );
            }

            $username = $user->getUsername();
            $today    = date("Y-m-d");

            $timepoint->setData(
                array(
                    'CenterID'        => $centerid,
                    'Visit_label'     => $visitinfo['Visit'],
                    'SubprojectID'    => $subprojectid,
                    'Active'          => 'Y',
                    'Date_active'     => $today,
                    'RegisteredBy'    => $username,
                    'UserID'          => $username,
                    'Date_registered' => $today,
                    'Testdate'        => $today,
                    'ProjectID'       => $project->getId(),
                )
            );

            $link = '/' . $request->getUri()->getPath();
            return (new \LORIS\Http\Response())
                ->withStatus(204)
                ->withHeader('Content-Location', $link);
        }

        try {
            \TimePoint::isValidVisitLabel(
                new CandID($visitinfo['CandID']),
                $subprojectid,
                $visitinfo['Visit']
            );
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        \TimePoint::createNew(
            $this->_candidate,
            $subprojectid,
            $visitinfo['Visit'],
            \Site::singleton($centerid),
            $project
        );

        $link = '/' . $request->getUri()->getPath();
        return (new \LORIS\Http\Response())
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
        return md5(json_encode($this->_visit));
    }
}
