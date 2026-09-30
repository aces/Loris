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

        if (!$identifierType->allowMultiple) {
            $existingIdentifier = $this->database->pselectRow(
                "SELECT CandidateIdentifierID
             FROM candidate_identifiers
             WHERE CandidateID = :candidateID
               AND CandidateIdentifierTypeID = :identifierTypeID",
                [
                    'candidateID'       => $candidateIdentifier->candidateID,
                    'identifierTypeID'  =>
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
                    'candidateID'          => $candidateIdentifier->candidateID,
                    'identifierTypeID'     =>
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
}
