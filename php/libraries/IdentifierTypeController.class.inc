<?php declare(strict_types=1);

/**
 * This file contains the IdentifierTypeController class.
 *
 * PHP Version 8
 *
 * @category Model
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

/**
 * Controller for candidate identifier types
 *
 * @category Model
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class IdentifierTypeController
{
    /**
     * Creates an IdentifierTypeController
     *
     * @param \Database $database Database connection
     *
     * @throws \RuntimeException If the database is not connected
     */
    public function __construct(
        private readonly \Database $database,
    ) {
        if (!$database->isConnected()) {
            throw new \RuntimeException(
                "IdentifierTypeController - Database not connected"
            );
        }
    }

    /**
     * Gets an identifier type by ID.
     *
     * @param int $candidateIdentifierTypeID Identifier type ID
     *
     * @return IdentifierType Identifier type associated with the supplied ID
     *
     * @throws \NotFound If the identifier type does not exist
     */
    public function getIdentifierTypeFromID(
        int $candidateIdentifierTypeID
    ): IdentifierType {
        $row = $this->database->pselectRow(
            "SELECT cit.CandidateIdentifierTypeID,
                cit.Name,
                cit.Format,
                cit.IsRequired,
                cit.IsUnique,
                cit.AutoGenerate,
                cit.AllowMultiple,
                cit.permID
         FROM candidate_identifier_types AS cit
         WHERE cit.CandidateIdentifierTypeID = :identifierTypeID",
            ['identifierTypeID' => $candidateIdentifierTypeID]
        );

        if (empty($row)) {
            throw new \NotFound(
                "No identifier type found in the database with id: "
                    . $candidateIdentifierTypeID
            );
        }

        return new IdentifierType(
            candidateIdentifierTypeID: (int) $row['CandidateIdentifierTypeID'],
            name: $row['Name'],
            format: $row['Format'],
            isRequired: (bool) $row['IsRequired'],
            isUnique: (bool) $row['IsUnique'],
            autoGenerate: (bool) $row['AutoGenerate'],
            allowMultiple: (bool) $row['AllowMultiple'],
            projects: $this->getProjects($candidateIdentifierTypeID),
            permissionID: isset($row['permID']) ? (int) $row['permID'] : null,
        );
    }

    /**
     * Gets the projects associated with an identifier type.
     *
     * @param int $candidateIdentifierTypeID Identifier type ID
     *
     * @return \Project[] Associated projects
     */
    private function getProjects(
        int $candidateIdentifierTypeID
    ): array {
        $projectIDs = $this->database->pselectCol(
            "SELECT ProjectID
         FROM candidate_identifier_types_project_rel
         WHERE CandidateIdentifierTypeID = :identifierTypeID",
            ['identifierTypeID' => $candidateIdentifierTypeID]
        );

        return array_map(
            static fn($projectID) => \Project::getProjectFromID(
                new \ProjectID(strval($projectID))
            ),
            $projectIDs
        );
    }

    /**
     * Creates an identifier type
     *
     * @param IdentifierType $identifierType Identifier type to create
     *
     * @return IdentifierType Created identifier type
     */
    public function createIdentifierType(IdentifierType $identifierType): IdentifierType
    {
        $this->database->beginTransaction();

        try {
            $this->database->insert(
                'candidate_identifier_types',
                [
                    'Name'          => $identifierType->name,
                    'Format'        => $identifierType->format,
                    'IsRequired'    => (int) $identifierType->isRequired,
                    'IsUnique'      => (int) $identifierType->isUnique,
                    'AutoGenerate'  => (int) $identifierType->autoGenerate,
                    'AllowMultiple' => (int) $identifierType->allowMultiple,
                    'permID'        => $identifierType->permissionID,
                ]
            );

            $identifierTypeID = (int) $this->database->getLastInsertId();

            foreach ($identifierType->projects as $project) {
                $this->database->insert(
                    'candidate_identifier_types_project_rel',
                    [
                        'CandidateIdentifierTypeID' => $identifierTypeID,
                        'ProjectID'                 => $project->getId(),
                    ]
                );
            }

            $this->database->commit();
        } catch (\Throwable $e) {
            $this->database->rollBack();
            throw $e;
        }

        return $this->getIdentifierTypeFromID($identifierTypeID);
    }

    /**
     * Updates an identifier type
     *
     * @param IdentifierType $identifierType Identifier type to update
     *
     * @return IdentifierType Updated identifier type
     *
     * @throws \NotFound If the identifier type does not exist
     */
    public function updateIdentifierType(IdentifierType $identifierType): IdentifierType
    {
        if ($identifierType->candidateIdentifierTypeID === null) {
            throw new \InvalidArgumentException(
                'Cannot update an identifier type without an ID'
            );
        }

        $identifierTypeID = $identifierType->candidateIdentifierTypeID;

        $this->getIdentifierTypeFromID($identifierTypeID);

        $this->database->beginTransaction();

        try {
            $this->database->update(
                'candidate_identifier_types',
                [
                    'Name'          => $identifierType->name,
                    'Format'        => $identifierType->format,
                    'IsRequired'    => (int) $identifierType->isRequired,
                    'IsUnique'      => (int) $identifierType->isUnique,
                    'AutoGenerate'  => (int) $identifierType->autoGenerate,
                    'AllowMultiple' => (int) $identifierType->allowMultiple,
                    'permID'        => $identifierType->permissionID,
                ],
                [
                    'CandidateIdentifierTypeID' => $identifierTypeID,
                ]
            );

            $this->database->delete(
                'candidate_identifier_types_project_rel',
                [
                    'CandidateIdentifierTypeID' => $identifierTypeID,
                ]
            );

            foreach ($identifierType->projects as $project) {
                $this->database->insert(
                    'candidate_identifier_types_project_rel',
                    [
                        'CandidateIdentifierTypeID' => $identifierTypeID,
                        'ProjectID'                 => $project->getId(),
                    ]
                );
            }

            $this->database->commit();
        } catch (\Throwable $e) {
            $this->database->rollBack();
            throw $e;
        }

        return $this->getIdentifierTypeFromID($identifierTypeID);
    }

    /**
     * Deletes an identifier type
     *
     * @param int $candidateIdentifierTypeID Identifier type ID
     *
     * @return void
     *
     * @throws \NotFound If the identifier does not exist
     */
    public function deleteIdentifierType(
        int $candidateIdentifierTypeID
    ): void {
        $this->getIdentifierTypeFromID($candidateIdentifierTypeID);

        $this->database->delete(
            'candidate_identifier_types',
            [
                'CandidateIdentifierTypeID' => $candidateIdentifierTypeID,
            ]
        );
    }
}