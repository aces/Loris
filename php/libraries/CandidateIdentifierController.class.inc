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
}
