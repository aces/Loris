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
class Visit_0_0_4_Dev extends Endpoint implements \LORIS\Middleware\ETagCalculator
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
     * @var ?\Timepoint
     */
    private $_visit;

    /**
     * The visit centerID
     *
     * @var ?\CenterID
     */
    private $_centerID;

    /**
     * The visit Project
     *
     * @var ?\Project
     */
    private $_project;

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
        return [
            'GET',
            'PATCH',
            'PUT',
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
            'v0.0.4-dev'
        ];
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
        if ($this->_visit !== null) {
            $user = $request->getAttribute('user');
            if (!$this->_visit->isAccessibleBy($user)) {
                return new \LORIS\Http\Response\JSON\Forbidden('Permission denied');
            }
        }

        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) === 0) {
            $method = $request->getMethod();

            if (in_array($method, $this->allowedMethods())) {
                $handle = '_handle'.$method;
                return $this->$handle($request);
            }

            if ($method === 'OPTIONS') {
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }

            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }

        if ($this->_visit === null) {
            // Subendpoint requires a Timepoint. see Constructor comment for $visit
            return new \LORIS\Http\Response\JSON\NotFound('Visit not found');
        }

        // Delegate to sub-endpoints
        $subendpoint = array_shift($pathparts);
        switch ($subendpoint) {
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
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(): ResponseInterface
    {
        if ($this->_visit === null) {
            return new \LORIS\Http\Response\JSON\NotFound('Visit not found');
        }

        return new \LORIS\Http\Response\JsonResponse(
            (new \LORIS\api\Views\Visit($this->_visit, 'v0.0.4-dev'))
                ->toArray()
        );
    }

    /**
     * Validate a PUT request
     *
     * TODO: There is no way to validate the the visit_label in the url
     *       fits the json data of the request because it is removed from the
     *       pathparts in the calling class. The correct way to do it would be
     *       to pass a "light" timepoint class that contains the visit_label but
     *       no sessionid in the constructor.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ?ResponseInterface The outgoing PSR7 response
     */
    private function _validatePUT(
        ServerRequestInterface $request
    ): ?ResponseInterface {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true) ?? [];

        $requiredfields = [
            'CandID',
            'Visit',
            'Site',
            'Cohort',
            'Project',
        ];

        $diff = array_diff($requiredfields, array_keys($data));
        if (!empty($diff)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Field(s) missing: ' . implode(', ', $diff)
            );
        }

        try {
            $this->_project = \NDB_Factory::singleton()->project($data['Project']);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        if (strval($data['CandID']) !== strval($this->_candidate->getCandID())) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The CandID field does not match this candidate'
            );
        }

        if (!$this->_candidate->isAccessibleBy($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                "You can't modify that candidate"
            );
        }

        $centerID = array_search($data['Site'], \Utility::getSiteList());

        if ($centerID === false
            || !in_array(
                \CenterID::singleton($centerID),
                $user->getCenterIDs()
            )
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                "You can't create or modify candidates' visits for the site " .
                $data['Site']
            );
        }

        // Now that the validation is done, convert to an object.
        $this->_centerID = \CenterID::singleton($centerID);

        return null;
    }

    /**
     * Handles a PUT request that creates or replace a candidate visit
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request): ResponseInterface
    {
        $user      = $request->getAttribute('user');
        $data      = json_decode((string) $request->getBody(), true);
        $visitinfo = $data ?? [];

        $response = $this->_validatePUT($request);
        if ($response !== null) {
            return $response;
        }

        $cohortid = array_search(
            $visitinfo['Cohort'],
            \Utility::getCohortList()
        );

        $sessionid = array_search(
            $visitinfo['Visit'],
            $this->_candidate->getListOfVisitLabels()
        );

        if ($sessionid !== false) {
            // If the visit label already exists for that candidate
            $timepoint = \NDB_Factory::singleton()->timepoint(
                new \SessionID(strval($sessionid))
            );

            if ($timepoint->getCurrentStage() !== 'Not Started') {
                return new \LORIS\Http\Response\JSON\Conflict(
                    'This visit is already started'
                );
            }

            $username = $user->getUsername();
            $today    = date("Y-m-d");

            $timepoint->setData(
                [
                    'CenterID'        => $this->_centerID,
                    'Visit_label'     => $visitinfo['Visit'],
                    'CohortID'        => $cohortid,
                    'Active'          => 'Y',
                    'Date_active'     => $today,
                    'RegisteredBy'    => $username,
                    'UserID'          => $username,
                    'Date_registered' => $today,
                    'Testdate'        => $today,
                    'ProjectID'       => $this->_project->getId(),
                ]
            );

            $link = '/' . $request->getUri()->getPath();
            return (new \LORIS\Http\Response())
                ->withStatus(204)
                ->withHeader('Content-Location', $link);
        }

        try {
            \TimePoint::isValidVisitLabel(
                new CandID($visitinfo['CandID']),
                $this->_project->getId(),
                $cohortid,
                $visitinfo['Visit']
            );
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        \TimePoint::createNew(
            $this->_candidate,
            $cohortid,
            $visitinfo['Visit'],
            \Site::singleton($this->_centerID),
            $this->_project
        );

        $link = '/' . $request->getUri()->getPath();
        return (new \LORIS\Http\Response())
            ->withStatus(201)
            ->withHeader('Content-Location', $link);
    }

    /**
     * Handles a PATCH request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePATCH(
        ServerRequestInterface $request
    ): ResponseInterface {
        $data = json_decode((string) $request->getBody(), true);

        if (is_null($data)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The request is not a valid json object'
            );
        }

        if (is_null($this->_visit)) {
            return new \LORIS\Http\Response\JSON\NotFound('Visit not found');
        }

        // a PATCH request should contain the same mandatory fields as a PUT request.
        $response = $this->_validatePUT($request);
        if ($response !== null) {
            return $response;
        }

        if ($data['Visit'] !== $this->_visit->getVisitLabel()) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The Visit field does not match this visit'
            );
        }

        if ($this->_visit->getCurrentStage() !== 'Not Started') {
            return new \LORIS\Http\Response\JSON\Conflict(
                "This visit is already started"
            );
        }

        try {
            $date = new \DateTime($data['Stages']['Visit']['Date'] ?? 0);
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Stages.Visit.Date is invalid or missing'
            );
        }
        // TODO :: Check for min and max year

        $status = $data['Stages']['Visit']['Status'] ?? '';
        if ($status != 'In Progress') {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Stages.Visit.Status invalid or missing'
            );
        }

        $newStage = $this->_visit->getNextStage();

        $this->_visit->startStage($newStage);

        // set the date for the new stage
        $this->_visit->setData(["Date_$newStage" => $date->format('Y-m-d')]);

        // TODO :: Add support for scan done

        // create a new battery object && new battery
        $candidate  = \Candidate::singleton($this->_visit->getCandID());
        $visitLabel = $this->_visit->getVisitLabel();

        // First visit ?
        $firstVisit = false;
        try {
            $firstVisit = ($candidate->getFirstVisit() == $visitLabel);
        } catch (\LorisException $e) {
        }

        $battery = new \NDB_BVL_Battery;
        // select a specific time point (sessionID) for the battery
        $battery->selectBattery($this->_visit->getSessionID());

        // add instruments to the time point
        $battery->createBattery(
            $request->getAttribute("loris"),
            $this->_visit->getCohortID(),
            $newStage,
            $this->_visit->getVisitLabel(),
            $this->_visit->getCenterID(),
            $firstVisit
        );

        return new \LORIS\Http\Response\JSON\NoContent();
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
