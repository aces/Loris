<?php declare(strict_types=1);
/**
 * A TimePointData object is a DTO (data transfer object) to
 * store a representation of data associated with a TimePoint
 * object in LORIS.
 *
 * The TimePointData may be partially loaded, in which case any
 * getter trying to access an unknown will throw an exception.
 * This allows modules to only load relevant data in a query,
 * and avoid the overhead of the TimePoint::singleton() constructor.
 *
 * For instance, a query that selected CenterID and ProjectID on
 * the database could instantiate a TimePoint as:
 *    $visit = new TimePoint(new TimePointData(null, $projectid, $centerid));
 *
 * with data loaded from the query, and then call
 * `$visit->isAccessibleBy($user)` without having to load all the
 * over data that TimePoint::singleton() does. If an attempt is
 * made to access a property not in the DTO (session in this example),
 * an exception is thrown, rather than silently returning the incorrect
 * value.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class TimePointData
{
    /**
     * The TimePoint's ProjectID
     *
     * @var ?ProjectID
     */
    protected $projectID;

    /**
     * The TimePoint's CenterID
     *
     * @var ?\CenterID
     */
    protected $centerID;

    /**
     * The TimePoint's SessionID
     *
     * @var ?SessionID
     */
    protected $sessionID;

    /**
     * Construct a TimePointData DTO for a TimePoint object
     *
     * @param ?SessionID $SessionID The SessionID for the TimePoint
     * @param ?ProjectID $ProjectID The ProjectID for the TimePoint
     * @param ?\CenterID $CenterID  The CenterID for the TimePoint
     */
    public function __construct(
        ?SessionID $SessionID,
        ?ProjectID $ProjectID,
        ?\CenterID $CenterID
    ) {
        $this->sessionID = $SessionID;
        $this->projectID = $ProjectID;
        $this->centerID  = $CenterID;
    }

    /**
     * Return the SessionID for this TimePoint, or throw
     * an exception if unknown.
     *
     * @return SessionID
     */
    public function getSessionID() : SessionID
    {
        if ($this->sessionID === null) {
            throw new \LogicException("No SessionID loaded into data model");
        }
        return $this->sessionID;
    }

    /**
     * Return the ProjectID for this TimePoint, or throw
     * an exception if unknown.
     *
     * @return ProjectID
     */
    public function getProjectID() : ProjectID
    {
        if ($this->projectID === null) {
            throw new \LogicException("No ProjectID loaded into data model");
        }
        return $this->projectID;
    }

    /**
     * Return the CenterID for this TimePoint, or throw
     * an exception if unknown.
     *
     * @return \CenterID
     */
    public function getCenterID() : \CenterID
    {
        if ($this->centerID === null) {
            throw new \LogicException("No CenterID loaded into data model");
        }
        return $this->centerID;
    }
}
