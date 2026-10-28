<?php declare(strict_types=1);

/**
 * This implements the candidate identifiers endpoint class
 *
 * PHP Version 8
 *
 * @category API
 * @package  Loris
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling candidate identifiers
 *
 * @category API
 * @package  Loris
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Identifiers extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Candidate
     *
     * @var \Candidate
     */
    private $_candidate;

    /**
     * Permission codes indexed by permission ID.
     *
     * @var array<int, string|null>
     */
    private array $_permissionCodes = [];

    /**
     * Constructor
     *
     * @param \LORIS\LorisInstance $loris     The LORIS instance to retrieve data
     *                                        from.
     * @param \Candidate           $candidate The requested candidate.
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        \Candidate $candidate
    ) {
        $this->_candidate = $candidate;
    }

    /**
     * Return which methods are supported by this endpoint
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return ['GET', 'POST', 'PUT'];
    }

    /**
     * Versions of the LORIS API which are supported by this endpoint.
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
     * Handles a request for candidate identifiers
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

        case 'POST':
            return $this->_handlePOST($request);

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

    /**
     * Checks whether a user can access an identifier type for this candidate.
     *
     * @param \User                 $user           Requesting user
     * @param \LORIS\IdentifierType $identifierType Identifier type
     *
     * @return bool Whether access is permitted
     */
    private function _canAccessIdentifierType(
        \User $user,
        \LORIS\IdentifierType $identifierType
    ): bool {
        $projectID = $this->_candidate->getProjectID();

        if (!empty($identifierType->projects)) {
            $projectAllowed = false;

            foreach ($identifierType->projects as $project) {
                if ($project->getId() == $projectID) {
                    $projectAllowed = true;
                    break;
                }
            }

            if (!$projectAllowed || !$user->hasProject($projectID)) {
                return false;
            }
        }

        if ($identifierType->permissionID !== null) {
            $database = $this->loris->getDatabaseConnection();

            $permissionID = $identifierType->permissionID;

            if (!array_key_exists($permissionID, $this->_permissionCodes)) {
                $permission = $database->pselectRow(
                    "SELECT code FROM permissions WHERE permID = :permID",
                    ['permID' => $permissionID]
                );

                $this->_permissionCodes[$permissionID]
                    = $permission['code'] ?? null;
            }

            $permissionCode = $this->_permissionCodes[$permissionID];

            if ($permissionCode === null
                || !$user->hasPermission($permissionCode)
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns the candidate's identifiers
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(
        ServerRequestInterface $request
    ): ResponseInterface {
        $controller = new \LORIS\CandidateIdentifierController(
            $this->loris->getDatabaseConnection()
        );

        $identifiers = $controller->getCandidateIdentifiers(
            (int) $this->_candidate->getID()
        );

        $user = $request->getAttribute('user');

        $data = [];
        foreach ($identifiers as $identifier) {
            if (!$this->_canAccessIdentifierType($user, $identifier->type)) {
                continue;
            }

            $data[] = (
                new \LORIS\api\Views\CandidateIdentifier($identifier)
            )->toArray();
        }

        return new \LORIS\Http\Response\JsonResponse(
            ['Identifiers' => $data]
        );
    }

    /**
     * Creates a candidate identifier
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(
        ServerRequestInterface $request
    ): ResponseInterface {
        $data = json_decode((string) $request->getBody(), true);

        error_log('Candidate identifiers POST body: ' . (string) $request->getBody());
        error_log('Candidate identifiers POST decoded: ' . var_export($data, true));

        if (!isset($data['Identifier'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'There is no Identifier object in the POST data'
            );
        }

        if (!isset($data['Identifier']['CandidateIdentifierTypeID'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'CandidateIdentifierTypeID is required'
            );
        }

        $database = $this->loris->getDatabaseConnection();

        $typeController = new \LORIS\IdentifierTypeController(
            $database
        );

        try {
            $identifierType = $typeController->getIdentifierTypeFromID(
                (int) $data['Identifier']['CandidateIdentifierTypeID']
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $user = $request->getAttribute('user');

        if (!$this->_canAccessIdentifierType($user, $identifierType)) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'You cannot add an identifier of this type'
            );
        }

        $controller = new \LORIS\CandidateIdentifierController(
            $database
        );

        try {
            if ($identifierType->autoGenerate) {
                $identifier = $controller->generateCandidateIdentifier(
                    (int) $this->_candidate->getID(),
                    $identifierType
                );
            } else {
                if (!isset($data['Identifier']['Value'])) {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        'Value is required for this identifier type'
                    );
                }

                $identifier = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                    candidateIdentifierID: null,
                    candidateID: (int) $this->_candidate->getID(),
                    type: $identifierType,
                    value: $data['Identifier']['Value'],
                );

                $identifier = $controller->createCandidateIdentifier(
                    $identifier
                );
            }
        } catch (\InvalidArgumentException | \ConflictException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $body = (
            new \LORIS\api\Views\CandidateIdentifier($identifier)
        )->toArray();

        return (new \LORIS\Http\Response\JsonResponse($body))
            ->withStatus(201);
    }

    /**
     * Updates a candidate identifier
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePUT(
        ServerRequestInterface $request
    ): ResponseInterface {
        $data = json_decode((string) $request->getBody(), true);

        if (
            !isset($data['Identifier'])
            || !is_array($data['Identifier'])
        ) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'There is no Identifier object in the PUT data'
            );
        }

        $identifierData = $data['Identifier'];

        if (
            !isset($identifierData['CandidateIdentifierID'])
            || !isset($identifierData['CandidateIdentifierTypeID'])
            || !isset($identifierData['Value'])
        ) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'CandidateIdentifierID, CandidateIdentifierTypeID and Value are required'
            );
        }

        $database = $this->loris->getDatabaseConnection();

        $controller = new \LORIS\CandidateIdentifierController(
            $database
        );

        try {
            $existingIdentifier = $controller->getCandidateIdentifierFromID(
                (int) $identifierData['CandidateIdentifierID']
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        // Prevent updating an identifier belonging to another candidate.
        if (
            $existingIdentifier->candidateID
            !== (int) $this->_candidate->getID()
        ) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $typeController = new \LORIS\IdentifierTypeController(
            $database
        );

        try {
            $identifierType = $typeController->getIdentifierTypeFromID(
                (int) $identifierData['CandidateIdentifierTypeID']
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $user = $request->getAttribute('user');

        if (
            !$this->_canAccessIdentifierType($user, $existingIdentifier->type)
            || !$this->_canAccessIdentifierType($user, $identifierType)
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'You cannot edit an identifier of this type'
            );
        }

        $identifier = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
            candidateIdentifierID: $existingIdentifier->candidateIdentifierID,
            candidateID: (int) $this->_candidate->getID(),
            type: $identifierType,
            value: $identifierData['Value'],
        );

        try {
            $identifier = $controller->updateCandidateIdentifier(
                $identifier
            );
        } catch (\InvalidArgumentException | \ConflictException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $body = (
            new \LORIS\api\Views\CandidateIdentifier($identifier)
        )->toArray();

        return new \LORIS\Http\Response\JsonResponse($body);
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
}
