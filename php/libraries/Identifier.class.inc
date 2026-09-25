<?php declare(strict_types=1);

/**
 * This file contains the Identifier class.
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
 * Representation of a candidate identifier type in LORIS.
 *
 * @category Model
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Identifier
{
    /**
     * @param int|null   $candidateIdentifierTypeID Identifier type ID
     * @param string     $name                      Identifier type name
     * @param string     $format                    Identifier format
     * @param bool       $isRequired                Whether a value is required
     * @param bool       $isUnique                  Whether values must be unique
     * @param bool       $autoGenerate              Whether values are generated
     * @param bool       $allowMultiple             Whether multiple values are
     *                                              allowed
     * @param \Project[] $projects                  Associated projects
     * @param int|null   $permissionID              Associated permission ID
     */
    public function __construct(
        public readonly ?int $candidateIdentifierTypeID,
        public string $name,
        public string $format,
        public bool $isRequired,
        public bool $isUnique,
        public bool $autoGenerate,
        public bool $allowMultiple,
        public array $projects = [],
        public ?int $permissionID = null,
    ) {
    }
}