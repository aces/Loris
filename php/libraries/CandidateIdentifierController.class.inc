<?php declare(strict_types=1);

/**
 * This file contains the CandidateIdentifierController class
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

use LORIS\StudyEntities\Candidate\CandidateIdentifier;

/**
 * Controller for candidate identifiers
 *
 * @category Model
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifierController
{
    /**
     * Creates a CandidateIdentifierController
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
                "CandidateIdentifierController - Database not connected"
            );
        }
    }

    /**
     * Gets a candidate identifier by ID
     *
     * @param int $candidateIdentifierID Candidate identifier ID
     *
     * @return CandidateIdentifier Candidate identifier associated with the
     *                             supplied ID
     *
     * @throws \NotFound If the candidate identifier does not exist
     */
    public function getCandidateIdentifierFromID(
        int $candidateIdentifierID
    ): CandidateIdentifier {
        $row = $this->database->pselectRow(
            "SELECT ci.CandidateIdentifierID,
            ci.CandidateID,
            ci.CandidateIdentifierTypeID,
            ci.Value
         FROM candidate_identifiers AS ci
         WHERE ci.CandidateIdentifierID = :candidateIdentifierID",
            ['candidateIdentifierID' => $candidateIdentifierID]
        );

        if (empty($row)) {
            throw new \NotFound(
                "No candidate identifier found in the database with id: "
                    . $candidateIdentifierID
            );
        }

        $identifierTypeController = new IdentifierTypeController(
            $this->database
        );

        return new CandidateIdentifier(
            candidateIdentifierID: (int) $row['CandidateIdentifierID'],
            candidateID: (int) $row['CandidateID'],
            type: $identifierTypeController->getIdentifierTypeFromID(
                (int) $row['CandidateIdentifierTypeID']
            ),
            value: $row['Value'],
        );
    }

    /**
     * Gets all identifiers for a candidate
     *
     * @param int $candidateID Candidate ID
     *
     * @return CandidateIdentifier[] Candidate identifiers
     */
    public function getCandidateIdentifiers(
        int $candidateID
    ): array {
        $identifierIDs = $this->database->pselectCol(
            "SELECT CandidateIdentifierID
            FROM candidate_identifiers
            WHERE CandidateID = :candidateID
            ORDER BY CandidateIdentifierID",
            [
                'candidateID' => $candidateID,
            ]
        );

        $identifiers = [];

        foreach ($identifierIDs as $identifierID) {
            $identifiers[] = $this->getCandidateIdentifierFromID(
                (int) $identifierID
            );
        }

        return $identifiers;
    }

    /**
     * Creates a candidate identifier
     *
     * @param CandidateIdentifier $candidateIdentifier Candidate identifier to create
     *
     * @return CandidateIdentifier Created candidate identifier
     *
     * @throws \InvalidArgumentException If the identifier violates its type rules
     */
    public function createCandidateIdentifier(
        CandidateIdentifier $candidateIdentifier
    ): CandidateIdentifier {
        $identifierType = $candidateIdentifier->type;

        $this->_validateFormat($candidateIdentifier);

        if (!$identifierType->allowMultiple) {
            $existingIdentifier = $this->database->pselectRow(
                "SELECT CandidateIdentifierID
             FROM candidate_identifiers
             WHERE CandidateID = :candidateID
               AND CandidateIdentifierTypeID = :identifierTypeID",
                [
                    'candidateID'      => $candidateIdentifier->candidateID,
                    'identifierTypeID' =>
                    $identifierType->candidateIdentifierTypeID,
                ]
            );

            if (!empty($existingIdentifier)) {
                throw new \InvalidArgumentException(
                    'Candidate already has an identifier of this type'
                );
            }
        }

        if ($identifierType->isUnique) {
            $existingIdentifier = $this->database->pselectRow(
                "SELECT CandidateIdentifierID
             FROM candidate_identifiers
             WHERE CandidateIdentifierTypeID = :identifierTypeID
               AND Value = :value
               AND CandidateID != :candidateID",
                [
                    'identifierTypeID' =>
                    $identifierType->candidateIdentifierTypeID,
                    'value'            => $candidateIdentifier->value,
                    'candidateID'      => $candidateIdentifier->candidateID,
                ]
            );

            if (!empty($existingIdentifier)) {
                throw new \InvalidArgumentException(
                    'Identifier value is already assigned to another candidate'
                );
            }
        }

        $this->database->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => $candidateIdentifier->candidateID,
                'CandidateIdentifierTypeID' =>
                $identifierType->candidateIdentifierTypeID,
                'Value'                     => $candidateIdentifier->value,
            ]
        );

        $candidateIdentifierID = (int) $this->database->getLastInsertId();

        return $this->getCandidateIdentifierFromID($candidateIdentifierID);
    }

    /**
     * Generates and creates a candidate identifier
     *
     * @param int            $candidateID    Candidate ID
     * @param IdentifierType $identifierType Identifier type
     *
     * @return CandidateIdentifier Generated candidate identifier
     *
     * @throws \InvalidArgumentException If automatic generation is not enabled
     */
    public function generateCandidateIdentifier(
        int $candidateID,
        IdentifierType $identifierType
    ): CandidateIdentifier {
        if (!$identifierType->autoGenerate) {
            throw new \InvalidArgumentException(
                'Identifier type is not configured for automatic generation'
            );
        }

        $candidate = $this->_getCandidateAliases($candidateID);

        $generator = new \CandidateIdentifierGenerator(
            $this->database,
            $identifierType,
            $candidate['SiteAlias'],
            $candidate['ProjectAlias']
        );

        $candidateIdentifier = new CandidateIdentifier(
            candidateIdentifierID: null,
            candidateID: $candidateID,
            type: $identifierType,
            value: $generator->generate(),
        );

        return $this->createCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Updates a candidate identifier
     *
     * @param CandidateIdentifier $candidateIdentifier Candidate identifier to update
     *
     * @return CandidateIdentifier Updated candidate identifier
     *
     * @throws \NotFound If the candidate identifier does not exist
     */
    public function updateCandidateIdentifier(
        CandidateIdentifier $candidateIdentifier
    ): CandidateIdentifier {
        if ($candidateIdentifier->candidateIdentifierID === null) {
            throw new \InvalidArgumentException(
                'Cannot update a candidate identifier without an ID'
            );
        }

        $candidateIdentifierID = $candidateIdentifier->candidateIdentifierID;
        $identifierType        = $candidateIdentifier->type;

        $this->_validateFormat($candidateIdentifier);

        if ($identifierType->candidateIdentifierTypeID === null) {
            throw new \InvalidArgumentException(
                'Cannot update a candidate identifier without an identifier type ID'
            );
        }

        $this->getCandidateIdentifierFromID($candidateIdentifierID);

        if (!$identifierType->allowMultiple) {
            $existingIdentifier = $this->database->pselectRow(
                "SELECT CandidateIdentifierID
             FROM candidate_identifiers
             WHERE CandidateID = :candidateID
               AND CandidateIdentifierTypeID = :identifierTypeID
               AND CandidateIdentifierID != :candidateIdentifierID",
                [
                    'candidateID'           => $candidateIdentifier->candidateID,
                    'identifierTypeID'      =>
                    $identifierType->candidateIdentifierTypeID,
                    'candidateIdentifierID' => $candidateIdentifierID,
                ]
            );

            if (!empty($existingIdentifier)) {
                throw new \InvalidArgumentException(
                    'Candidate already has an identifier of this type'
                );
            }
        }

        if ($identifierType->isUnique) {
            $existingIdentifier = $this->database->pselectRow(
                "SELECT CandidateIdentifierID
             FROM candidate_identifiers
             WHERE CandidateIdentifierTypeID = :identifierTypeID
               AND Value = :value
               AND CandidateID != :candidateID
               AND CandidateIdentifierID != :candidateIdentifierID",
                [
                    'identifierTypeID'      =>
                    $identifierType->candidateIdentifierTypeID,
                    'value'                 => $candidateIdentifier->value,
                    'candidateID'           => $candidateIdentifier->candidateID,
                    'candidateIdentifierID' => $candidateIdentifierID,
                ]
            );

            if (!empty($existingIdentifier)) {
                throw new \InvalidArgumentException(
                    'Identifier value is already assigned to another candidate'
                );
            }
        }

        $this->database->update(
            'candidate_identifiers',
            [
                'CandidateID'               => $candidateIdentifier->candidateID,
                'CandidateIdentifierTypeID' =>
                $identifierType->candidateIdentifierTypeID,
                'Value'                     => $candidateIdentifier->value,
            ],
            [
                'CandidateIdentifierID' => $candidateIdentifierID,
            ]
        );

        return $this->getCandidateIdentifierFromID($candidateIdentifierID);
    }

    /**
     * Deletes a candidate identifier
     *
     * @param int $candidateIdentifierID Candidate identifier ID
     *
     * @return void
     *
     * @throws \NotFound If the candidate identifier does not exist
     */
    public function deleteCandidateIdentifier(
        int $candidateIdentifierID
    ): void {
        $this->getCandidateIdentifierFromID($candidateIdentifierID);

        $this->database->delete(
            'candidate_identifiers',
            [
                'CandidateIdentifierID' => $candidateIdentifierID,
            ]
        );
    }

    /**
     * Gets the site and project aliases for a candidate
     *
     * @param int $candidateID Candidate ID
     *
     * @return array<string,string> Candidate site and project aliases
     *
     * @throws \NotFound If the candidate does not exist
     */
    private function _getCandidateAliases(int $candidateID): array
    {
        $candidate = $this->database->pselectRow(
            "SELECT p.Alias AS SiteAlias,
                pr.Alias AS ProjectAlias
         FROM candidate AS c
         JOIN psc AS p
           ON p.CenterID = c.RegistrationCenterID
         JOIN Project AS pr
           ON pr.ProjectID = c.RegistrationProjectID
         WHERE c.ID = :candidateID",
            [
                'candidateID' => $candidateID,
            ]
        );

        if (empty($candidate)) {
            throw new \NotFound(
                "No candidate found in the database with id: "
                    . $candidateID
            );
        }

        return $candidate;
    }

    /**
     * Validates a candidate identifier against its type format
     *
     * Resolves the candidate's site and project aliases so that identifier
     * formats containing SITE:ALIAS or PROJECT:ALIAS can be validated.
     *
     * @param CandidateIdentifier $candidateIdentifier Candidate identifier
     *
     * @return void
     *
     * @throws \NotFound                 If the candidate does not exist
     * @throws \InvalidArgumentException If the value does not match the format
     */
    private function _validateFormat(
        CandidateIdentifier $candidateIdentifier
    ): void {

        $candidate = $this->_getCandidateAliases(
            $candidateIdentifier->candidateID
        );

        $pattern = \Candidate::structureToPCRE(
            $candidateIdentifier->type->format,
            $candidate['SiteAlias'],
            $candidate['ProjectAlias']
        );

        if (preg_match($pattern, $candidateIdentifier->value) !== 1) {
            throw new \InvalidArgumentException(
                'Candidate identifier does not match the identifier type format'
            );
        }
    }
}
