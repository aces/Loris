<?php declare(strict_types=1);

/**
 * This file is used by the Configuration module to update
 * or insert candidate identifier types.
 *
 * PHP version 8
 *
 * @category Main
 * @package  Loris
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

$user = \User::singleton();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit(0);
}

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$factory    = NDB_Factory::singleton();
$db         = $factory->database();
$controller = new \LORIS\IdentifierTypeController($db);

$identifierTypeID = $_POST['CandidateIdentifierTypeID'] ?? null;
$name             = trim($_POST['Name'] ?? '');
$format           = trim($_POST['Format'] ?? '');
$projectIDs       = $_POST['ProjectIDs'] ?? [];

if (empty($name)
    || empty($format)
    || ($identifierTypeID !== 'new'
    && filter_var($identifierTypeID, FILTER_VALIDATE_INT) === false)
    || !is_array($projectIDs)
) {
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request']);
    exit(0);
}

foreach ($projectIDs as $projectID) {
    if (filter_var($projectID, FILTER_VALIDATE_INT) === false
        || (int) $projectID <= 0
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid ProjectID']);
        exit(0);
    }
}

$isRequired = ($_POST['IsRequired'] ?? '0') === '1';
$isUnique = ($_POST['IsUnique'] ?? '0') === '1';
$autoGenerate = ($_POST['AutoGenerate'] ?? '0') === '1';
$allowMultiple = ($_POST['AllowMultiple'] ?? '0') === '1';

try {
    $existingType = null;

    try {
        $existingType = $controller->getIdentifierTypeFromName($name);
    } catch (\NotFound $e) {
        // No identifier type with this name exists.
    }

    if ($existingType !== null
        && ($identifierTypeID === 'new'
        || $existingType->candidateIdentifierTypeID !== (int) $identifierTypeID)
    ) {
        http_response_code(400);
        echo json_encode(
            ['error' => 'Failed to save, identifier type name already exists!']
        );
        exit(0);
    }

    $projects = array_map(
        function ($projectID) {
            return \Project::getProjectFromID(
                \ProjectID::singleton((int) $projectID)
            );
        },
        $projectIDs
    );

    if ($identifierTypeID === 'new') {
        $identifierType = new \LORIS\IdentifierType(
            null,
            $name,
            $format,
            $isRequired,
            $isUnique,
            $autoGenerate,
            $allowMultiple,
            $projects
        );

        $controller->createIdentifierType($identifierType);
    } else {
        $identifierType = $controller->getIdentifierTypeFromID(
            (int) $identifierTypeID
        );

        $identifierType->name          = $name;
        $identifierType->format        = $format;
        $identifierType->isRequired    = $isRequired;
        $identifierType->isUnique      = $isUnique;
        $identifierType->autoGenerate  = $autoGenerate;
        $identifierType->allowMultiple = $allowMultiple;
        $identifierType->projects      = $projects;

        $controller->updateIdentifierType($identifierType);
    }
} catch (\NotFound $e) {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit(0);
} catch (\Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error']);
    exit(0);
}

http_response_code(200);
echo json_encode(['ok' => 'Success']);
exit(0);