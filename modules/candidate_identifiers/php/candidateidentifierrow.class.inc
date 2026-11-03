<?php declare(strict_types=1);

/**
 * Represents a row in the Candidate Identifiers table.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Candidate_Identifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\candidate_identifiers;

/**
 * A candidate identifier row with site and project information.
 *
 * @category Main
 * @package  Candidate_Identifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifierRow implements
    \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    /**
     * Initialize the candidate identifier row.
     *
     * @param array      $row Database row
     * @param \CenterID  $cid Candidate registration site
     * @param \ProjectID $pid Candidate registration project
     */
    public function __construct(
        protected array $row,
        protected \CenterID $cid,
        protected \ProjectID $pid
    ) {
    }

    /**
     * Return the row data for serialization.
     *
     * @return array
     */
    public function jsonSerialize(): array
    {
        return $this->row;
    }

    /**
     * Return the candidate's registration site.
     *
     * @return \CenterID
     */
    public function getCenterID(): \CenterID
    {
        return $this->cid;
    }

    /**
     * Return the candidate's registration project.
     *
     * @return \ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return $this->pid;
    }
}
