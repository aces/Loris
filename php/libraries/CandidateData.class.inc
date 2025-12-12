<?php declare(strict_types=1);

use LORIS\StudyEntities\Candidate\CandID;
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
    public CandID $CandID;
    public \ProjectID $registrationProjectID;
    public \CenterID $registrationCenterID;

    public array $timepoints;

    /**
     * Construct a CandidateData object
     *
     * @param ?CandID      $candID                The CandID for this candidate
     * @param ?\ProjectID  $registrationProjectID The RegistrationProjectID
     * @param ?\CenterID   $registrationCenterID  The RegistrationCenterID
     * @param ?TimePoint[] $timepoints            TimePoint objects for each
     *                                            visit of the candidate
     */
    public function __construct(
        ?CandID $candID=null,
        ?\ProjectID $registrationProjectID=null,
        ?\CenterID $registrationCenterID=null,
        ?array $timepoints=null,
    ) {
        if ($candID !== null) {
            $this->CandID = $candID;
        }

        if ($registrationProjectID !== null) {
            $this->registrationProjectID = $registrationProjectID;
        }
        if ($registrationCenterID !== null) {
            $this->registrationCenterID = $registrationCenterID;
        }
        if ($timepoints !== null) {
            foreach ($timepoints as $timepoint) {
                if (!($timepoint instanceof \TimePoint)) {
                    throw new \DomainException(
                        "CandidateData timepoints must contain TimePoint "
                        . "classes"
                    );
                }
            }
            $this->timepoints = $timepoints;
        }

    }
}
