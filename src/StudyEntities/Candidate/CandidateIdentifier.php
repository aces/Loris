<?php declare(strict_types=1);

/**
 * Defines a candidate identifier assigned to a candidate
 *
 * PHP Version 8
 *
 * @category StudyEntities
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\StudyEntities\Candidate;

use LORIS\IdentifierType;

/**
 * Representation of a candidate identifier in LORIS
 *
 * @category StudyEntities
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifier
{
    /**
     * Constructor for CandidateIdentifier
     *
     * @param int|null       $candidateIdentifierID Candidate identifier ID
     * @param int            $candidateID           Candidate ID
     * @param IdentifierType $type                  Identifier type
     * @param string         $value                 Identifier value
     */
    public function __construct(
        public readonly ?int $candidateIdentifierID,
        public readonly int $candidateID,
        public readonly IdentifierType $type,
        public string $value,
    ) {
    }
}
