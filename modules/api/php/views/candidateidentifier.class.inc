<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category ApiViews
 * @package  Loris
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views;

use LORIS\StudyEntities\Candidate\CandidateIdentifier as CandidateIdentifierEntity;

/**
 * This class formats a candidate identifier into an array following
 * the API specifications
 *
 * @category ApiViews
 * @package  Loris
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifier
{
    /**
     * Constructor
     *
     * @param CandidateIdentifierEntity $identifier The identifier to format
     */
    public function __construct(
        private CandidateIdentifierEntity $identifier
    ) {
    }

    /**
     * Generates the array
     *
     * @return array
     */
    public function toArray() : array
    {
        return [
            'CandidateIdentifierID' => $this->identifier->candidateIdentifierID,
            'Type'                  => $this->identifier->type->name,
            'Value'                 => $this->identifier->value,
        ];
    }
}
