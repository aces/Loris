<?php declare(strict_types=1);
/**
 * A CandidateData object is a DTO (data transfer object) to
 * store a representation of data associated with a Candidate
 * object in LORIS.
 *
 * The CandidateData may be partially loaded, in which case any
 * getter trying to access an unknown will throw an exception.
 * This allows modules to only load relevant data in a query,
 * and avoid the overhead of the Candidate::singleton() constructor.
 *
 * For instance, a query that selected CenterID and ProjectID and
 * timepoint related information:
 * the database could instantiate a Candidate as:
 *    $visit = new Candidate(new CandidateData($projectid, $centerid, $timepoints));
 *
 * with data loaded from the query, and then call
 * `$candidate->isAccessibleBy($user)` without having to load all the
 * other data that Candidate::singleton() does. If an attempt is
 * made to access a property not in the DTO, an exception is thrown,
 * rather than silently returning the incorrect value.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CandidateData
{
    protected $registrationProjectID;
    protected $registrationCenterID;
    protected $timepoints;

    /**
     * Construct a CandidateData object
     *
     * @param ?\ProjectID  $projectID  The RegistrationProjectID
     * @param ?\CenterID   $centerID   The RegistrationCenterID
     * @param ?TimePoint[] $timepoints TimePoint objects for each visit of the
     *                                 candidate
     */
    public function __construct(
        ?\ProjectID $projectID,
        ?\CenterID $centerID,
        ?array $timepoints,
    ) {
        $this->registrationProjectID = $projectID;
        $this->registrationCenterID  = $centerID;

        $this->timepoints = $timepoints;
    }

    /**
     * Get the RegistrationCenterID for this candidate.
     *
     * @return \CenterID
     */
    public function getRegistrationCenterID() : \CenterID
    {
        if ($this->registrationCenterID === null) {
            throw new LogicException("CenterID not loaded in data");
        }
        return $this->registrationCenterID;
    }

    /**
     * Get the RegistrationProjectID for this candidate.
     *
     * @return \ProjectID
     */
    public function getRegistrationProjectID() : \ProjectID
    {
        if ($this->registrationProjectID === null) {
            throw new LogicException("ProjectID not loaded in data");
        }
        return $this->registrationProjectID;
    }

    /**
     * Get the timepoint objects for this candidate's visits
     *
     * @return TimePoint[]
     */
    public function getTimepoints() : array
    {
        if ($this->timepoints === null) {
            throw new LogicException("Timepoints not instantiated");
        }
        return $this->timepoints;
    }
}
