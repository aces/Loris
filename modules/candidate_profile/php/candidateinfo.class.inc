<?php declare(strict_types=1);
namespace LORIS\candidate_profile;

/**
 * The CandidateInfo class is used to represent a term to be
 * displayed in the Candidate Info table of the candidate dashboard.
 *
 * It must be a simple term/value pair that can be encoded as a JSON
 * object to be rendered to the client.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CandidateInfo implements \LORIS\GUI\Widget
{
    /**
     * Construct a CandidateInfo object
     *
     * @param string $term  The term being summarized for the candidate
     * @param string $value The value of the term
     */
    public function __construct(
        string $term,
        string $value
    ) {
        $this->term  = $term;
        $this->value = $value;
    }

    /**
     * Implement the \LORIS\GUI\Widget interface
     *
     * @return string
     */
    public function __toString()
    {
        return "";
    }
}
