<?php declare(strict_types=1);

/**
 * This implements the Candidates endpoint class
 *
 * PHP Version 8
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
use LORIS\StudyEntities\Candidate\CandidateIdentifier;

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
    private function _innerHasAccess(\User $user)
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

        if (!$this->_innerHasAccess($user)) {
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
            assert($pscids instanceof \LORIS\Database\Query);
            $candID = new CandID(strval($pscids->getFirstRow()["CandID"]));
        }

        try {
            $candidate = \NDB_Factory::singleton()->candidate($candID);
        } catch (\DomainException $e) {
            return new \LORIS\Http\Response\JSON\NotFound('Candidate not found');
        }

        if (!$candidate->isAccessibleBy($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        $endpoint = new Candidate\Candidate($this->loris, $candidate);

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

        $provisioner = (new \LORIS\api\Provisioners\CandidatesProvisioner(
            $this->loris,
            $request->getAttribute('LORIS-API-Version') === 'v0.0.4-dev'
        )
        )
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
     * Get identifier types applicable to a project.
     *
     * @param \ProjectID $projectID Registration project
     *
     * @return \LORIS\IdentifierType[] Applicable identifier types
     */
    private function _getApplicableIdentifierTypes(
        \ProjectID $projectID
    ): array {
        $database = \NDB_Factory::singleton()->database();

        $controller = new \LORIS\IdentifierTypeController(
            $database
        );

        $applicableTypes = [];

        foreach ($controller->getAllIdentifierTypes() as $type) {

            if (!empty($type->projects)) {
                $projectAllowed = false;

                foreach ($type->projects as $project) {
                    if ($project->getId() == $projectID) {
                        $projectAllowed = true;
                        break;
                    }
                }

                if (!$projectAllowed) {
                    continue;
                }
            }

            $applicableTypes[] = $type;
        }

        return $applicableTypes;
    }

    /**
     * Validate that all required manual identifiers are provided.
     *
     * @param \User                   $user            User creating the candidate
     * @param \LORIS\IdentifierType[] $identifierTypes Applicable types
     * @param array                   $identifiers     Submitted identifiers
     * @param \ProjectID              $projectID       Registration project
     *
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    private function _validateRequiredIdentifiers(
        \User $user,
        array $identifierTypes,
        array $identifiers,
        \ProjectID $projectID
    ): void {
        foreach ($identifierTypes as $type) {
            if (!$type->isRequired || $type->autoGenerate) {
                continue;
            }

            if (!$this->_canAccessIdentifierType($user, $type, $projectID)) {
                throw new \InvalidArgumentException(
                    "You do not have permission to create required identifier "
                        . "'{$type->name}'"
                );
            }

            $found = false;

            foreach ($identifiers as $identifier) {
                $submittedTypeID = $identifier['CandidateIdentifierTypeID'] ?? null;

                if ($submittedTypeID == $type->candidateIdentifierTypeID
                    && isset($identifier['Value'])
                    && is_string($identifier['Value'])
                    && trim($identifier['Value']) !== ''
                ) {
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                throw new \InvalidArgumentException(
                    "Required identifier '{$type->name}' must be provided"
                );
            }
        }
    }

    /**
     * Validate submitted identifier types, values, and permissions.
     *
     * @param \User                   $user            User creating the candidate
     * @param \LORIS\IdentifierType[] $identifierTypes Applicable identifier types
     * @param array                   $identifiers     Submitted identifiers
     * @param \ProjectID              $projectID       Registration project
     *
     * @return void
     *
     * @throws \InvalidArgumentException If an identifier is invalid or unauthorized
     */
    private function _validateSubmittedIdentifiers(
        \User $user,
        array $identifierTypes,
        array $identifiers,
        \ProjectID $projectID
    ): void {
        $allowedTypes = [];

        foreach ($identifierTypes as $type) {
            $allowedTypes[$type->candidateIdentifierTypeID] = $type;
        }

        $seen = [];

        foreach ($identifiers as $identifier) {
            if (!is_array($identifier)
                || !isset($identifier['CandidateIdentifierTypeID'])
                || !is_int($identifier['CandidateIdentifierTypeID'])
            ) {
                throw new \InvalidArgumentException(
                    'Each identifier must have a valid integer type ID'
                );
            }

            $typeID = $identifier['CandidateIdentifierTypeID'];

            if (!isset($allowedTypes[$typeID])) {
                throw new \InvalidArgumentException(
                    'Identifier type is not applicable to this project'
                );
            }

            $type = $allowedTypes[$typeID];
            if (!$this->_canAccessIdentifierType($user, $type, $projectID)) {
                throw new \InvalidArgumentException(
                    "You do not have permission to create identifier "
                        . "'{$type->name}'"
                );
            }

            if (isset($seen[$typeID]) && !$type->allowMultiple) {
                throw new \InvalidArgumentException(
                    "Multiple values are not allowed for '{$type->name}'"
                );
            }

            $seen[$typeID] = true;

            if ($type->autoGenerate) {
                if (($identifier['Generate'] ?? null) !== true
                    || array_key_exists('Value', $identifier)
                ) {
                    throw new \InvalidArgumentException(
                        "Identifier '{$type->name}' must be generated"
                    );
                }
            } elseif (!isset($identifier['Value'])
                || !is_string($identifier['Value'])
                || trim($identifier['Value']) === ''
                || array_key_exists('Generate', $identifier)
            ) {
                throw new \InvalidArgumentException(
                    "Identifier '{$type->name}' requires a manual value"
                );
            }
        }
    }

    /**
     * Check whether a user can access an identifier type for a project.
     *
     * @param \User                 $user      User creating the candidate
     * @param \LORIS\IdentifierType $type      Identifier type
     * @param \ProjectID            $projectID Registration project
     *
     * @return bool Whether the user has access
     */
    private function _canAccessIdentifierType(
        \User $user,
        \LORIS\IdentifierType $type,
        \ProjectID $projectID
    ): bool {
        $controller = new \LORIS\IdentifierTypeController(
            \NDB_Factory::singleton()->database()
        );

        return $controller->canAccessIdentifierTypeForProject(
            $user,
            $type,
            $projectID
        );
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

        $projectname  = $data['Candidate']['Project'] ?? '';
        $userprojects = array_map(
            function ($project) {
                return $project->getName();
            },
            $user->getProjects()
        );

        try {
            $project = \NDB_Factory::singleton()->project($projectname);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\BadRequest($e->getMessage());
        }

        if (!in_array($projectname, $userprojects, true)) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                "You are not affiliated with the candidate's project"
            );
        }

        try {
            $parameters = $this->_validateCandidateParameters(
                $project->getId(),
                $data['Candidate']['Parameters'] ?? []
            );
        } catch (\InvalidArgumentException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest($e->getMessage());
        }

        $registrationCohortID = null;
        $config = \NDB_Factory::singleton()->config();
        if ($request->getAttribute('LORIS-API-Version') === 'v0.0.4-dev'
            && $config->settingEnabled('useRegistrationCohort')
        ) {
            $registrationCohortID = array_search(
                $data['Candidate']['RegistrationCohort'] ?? null,
                \Utility::getCohortsForProject($project->getId()),
                true
            );
            if ($registrationCohortID === false) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'A valid registration cohort must be specified'
                );
            }
            $registrationCohortID = (int) $registrationCohortID;
        }

        $centerid = array_search(
            $data['Candidate']['Site'],
            \Utility::getSiteList()
        );

        $pscid = $data['Candidate']['PSCID'] ?? null;

        $identifiers = $data['Candidate']['Identifiers'] ?? [];

        if (!is_array($identifiers) || !array_is_list($identifiers)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Identifiers must be an array'
            );
        }

        $identifierTypes = $this->_getApplicableIdentifierTypes(
            $project->getId()
        );

        foreach ($identifierTypes as $type) {
            if ($type->name === 'PSCID' && !$type->autoGenerate) {
                if (is_string($pscid) && trim($pscid) !== '') {
                    $identifiers[] = [
                        'CandidateIdentifierTypeID' =>
                            $type->candidateIdentifierTypeID,
                        'Value'                     => $pscid,
                    ];
                }
                break;
            }
        }

        try {

            $this->_validateSubmittedIdentifiers(
                $user,
                $identifierTypes,
                $identifiers,
                $project->getId()
            );

            $this->_validateRequiredIdentifiers(
                $user,
                $identifierTypes,
                $identifiers,
                $project->getId()
            );

            foreach ($identifierTypes as $type) {
                if ($type->isRequired
                    && $type->autoGenerate
                    && !$this->_canAccessIdentifierType(
                        $user,
                        $type,
                        $project->getId()
                    )
                ) {
                    throw new \InvalidArgumentException(
                        "You do not have permission to create required identifier "
                            . "'{$type->name}'"
                    );
                }
            }
        } catch (\InvalidArgumentException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $sex = new Sex($data['Candidate']['Sex']);

        $db = \NDB_Factory::singleton()->database();
        try {
            $db->beginTransaction();
            $pscidType = null;

            foreach ($identifierTypes as $type) {
                if ($type->name === 'PSCID') {
                    $pscidType = $type;
                    break;
                }
            }

            if ($pscidType === null) {
                throw new \InvalidArgumentException(
                    'PSCID identifier type is not configured'
                );
            }

            if ($pscidType->autoGenerate) {
                $site = \Site::singleton(\CenterID::singleton($centerid));

                $pscid = (new \CandidateIdentifierGenerator(
                    $db,
                    $pscidType,
                    $site->getSiteAlias(),
                    $project->getAlias()
                ))->generate();
            } else {
                $submittedPSCID = array_values(
                    array_filter(
                        $identifiers,
                        fn($identifier) =>
                        $identifier['CandidateIdentifierTypeID']
                            === $pscidType->candidateIdentifierTypeID
                    )
                );

                if (count($submittedPSCID) !== 1) {
                    throw new \InvalidArgumentException(
                        'Exactly one manual PSCID must be provided'
                    );
                }

                $pscid = $submittedPSCID[0]['Value'];
            }
            $candid = \Candidate::createNew(
                \CenterID::singleton($centerid),
                $data['Candidate']['DoB'] ?? null,
                $data['Candidate']['EDC'] ?? null,
                $sex,
                $pscid,
                $project->getId(),
                $registrationCohortID,
                true
            );

            $candidate   = \NDB_Factory::singleton()->candidate($candid);
            $candidateID = (int) $candidate->getID();

            $identifierController = new \LORIS\CandidateIdentifierController($db);

            foreach ($identifierTypes as $type) {
                $submittedIdentifiers = array_filter(
                    $identifiers,
                    fn($identifier) =>
                    $identifier['CandidateIdentifierTypeID']
                        === $type->candidateIdentifierTypeID
                );

                if ($type->autoGenerate) {
                    if ($type->isRequired || !empty($submittedIdentifiers)) {
                        if ($type->name === 'PSCID') {
                            $candidateIdentifier
                                = new CandidateIdentifier(
                                    candidateIdentifierID: null,
                                    candidateID: $candidateID,
                                    type: $type,
                                    value: $pscid
                                );

                            $identifierController->createCandidateIdentifier(
                                $candidateIdentifier
                            );
                        } else {
                            $identifierController->generateCandidateIdentifier(
                                $candidateID,
                                $type
                            );
                        }
                    }
                } else {
                    foreach ($submittedIdentifiers as $identifier) {
                        $candidateIdentifier
                            = new CandidateIdentifier(
                                candidateIdentifierID: null,
                                candidateID: $candidateID,
                                type: $type,
                                value: $identifier['Value']
                            );

                        $identifierController->createCandidateIdentifier(
                            $candidateIdentifier
                        );
                    }
                }
            }

            if (!empty($parameters)) {
                foreach ($parameters as $parameterTypeID => $value) {
                    $db->insert(
                        'parameter_candidate',
                        [
                            'CandidateID'     => $candidate->getID(),
                            'ParameterTypeID' => $parameterTypeID,
                            'Value'           => $value,
                            'InsertTime'      => time(),
                        ]
                    );
                }
            }
            $db->commit();
        } catch (\ConflictException $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            return new \LORIS\Http\Response\JSON\Conflict(
                $e->getMessage()
            );
        } catch (\Exception | \LorisException | \InvalidArgumentException $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $candidate = \NDB_Factory::singleton()->candidate($candid);

        $body = (new \LORIS\api\Views\Candidate(
            $candidate,
            $request->getAttribute('LORIS-API-Version') === 'v0.0.4-dev'
        ))->toArray()['Meta'];
        $link = '/'. $request->getURI()->getPath() . '/' . $candid;

        return (new \LORIS\Http\Response\JsonResponse($body))
            ->withStatus(201)
            ->withHeader('Content-Location', $link);
    }

    /**
     * Validate configured candidate parameters for a project.
     *
     * @param \ProjectID $projectID Project used to create the candidate
     * @param mixed      $values    Candidate parameter values
     *
     * @return array<int,string> Validated values indexed by parameter type ID
     * @throws \InvalidArgumentException If a value is missing or invalid
     */
    private function _validateCandidateParameters(
        \ProjectID $projectID,
        mixed $values
    ): array {
        if (!is_array($values)) {
            throw new \InvalidArgumentException(
                'Candidate Parameters must be an object'
            );
        }

        $db    = \NDB_Factory::singleton()->database();
        $rules = $db->pselect(
            "SELECT pt.ParameterTypeID, pt.Name, pt.Type, pt.Description,
                pcr.Required
            FROM parameter_type pt
            JOIN parameter_type_category_rel ptcr USING (ParameterTypeID)
            JOIN parameter_type_category ptc USING (ParameterTypeCategoryID)
            JOIN parameter_candidate_rules pcr USING (ParameterTypeID)
            WHERE ptc.Name = 'Candidate Parameters'
                AND pcr.ProjectID = :projectID
                AND pcr.ShowOnRegistration = 1",
            ['projectID' => $projectID]
        );

        $validated = [];
        $allowedParameterTypeIDs = [];
        foreach ($rules as $rule) {
            $parameterTypeID           = (int) $rule['ParameterTypeID'];
            $allowedParameterTypeIDs[] = $parameterTypeID;
            $label    = $rule['Description'] ?: $rule['Name'];
            $hasValue = array_key_exists(
                $parameterTypeID,
                $values
            );

            if ($hasValue && $values[$parameterTypeID] !== null
                && !is_scalar($values[$parameterTypeID])
            ) {
                throw new \InvalidArgumentException("$label is invalid");
            }

            $hasValue = $hasValue
                && $values[$parameterTypeID] !== null
                && trim(strval($values[$parameterTypeID])) !== '';

            if (!$hasValue) {
                if ((int) $rule['Required'] === 1) {
                    throw new \InvalidArgumentException(
                        "$label is required"
                    );
                }
                continue;
            }

            $value = trim(strval($values[$parameterTypeID]));
            if (strlen($value) > 255) {
                throw new \InvalidArgumentException(
                    "$label must be 255 characters or fewer"
                );
            }

            $type = strtolower(strval($rule['Type']));
            if (str_starts_with($type, 'numeric') && !is_numeric($value)) {
                throw new \InvalidArgumentException("$label must be numeric");
            }

            if (str_starts_with($type, 'date')) {
                $date = \DateTime::createFromFormat('!Y-m-d', $value);
                if ($date === false || $date->format('Y-m-d') !== $value) {
                    throw new \InvalidArgumentException(
                        "$label must be a valid date"
                    );
                }
            }

            if (str_starts_with($type, 'enum')) {
                preg_match_all("/'([^']*)'/", $rule['Type'], $matches);
                if (!in_array($value, $matches[1], true)) {
                    throw new \InvalidArgumentException("$label is invalid");
                }
            }

            $validated[$parameterTypeID] = $value;
        }

        foreach ($values as $parameterTypeID => $value) {
            if (!in_array((int) $parameterTypeID, $allowedParameterTypeIDs, true)
                && $value !== null
                && (!is_scalar($value) || trim(strval($value)) !== '')
            ) {
                throw new \InvalidArgumentException(
                    'Candidate Parameters contains an invalid field'
                );
            }
        }

        return $validated;
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
