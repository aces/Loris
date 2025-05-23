<?php declare(strict_types=1);

/**
 * This class implements a data Instance which represents a single
 * row in the dicom archive menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\dicom_archive;

/**
 * A DICOMArchiveRow represents a row in the DICOM Archive menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class DICOMArchiveRowWithSession implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    protected $DBRow;
    protected $CenterID;
    protected $ProjectID;
    protected $SessionID;
    protected $CreatedBy;

    /**
     * Create a new DICOMArchiveRowWithSession.
     *
     * This DataInstance type represents rows that have a session associated
     * with them (and hence are able to return a CenterID for the row.)
     *
     * @param array      $row     The row (in the same format as
     *                            \Database::pselectRow returns)
     * @param \CenterID  $cid     The centerID affiliated with this row.
     * @param \ProjectID $pid     The ProjectID affiliated with this row.
     * @param \SessionID $sid     The SessionID affiliated with this row.
     * @param \User      $creator The user who created this row
     */
    public function __construct(
        array $row,
        \CenterID $cid,
        \ProjectID $pid,
        \SessionID $sid,
        \User $creator,
    ) {
        $this->DBRow     = $row;
        $this->CenterID  = $cid;
        $this->ProjectID = $pid;
        $this->SessionID = $sid;
        $this->CreatedBy = $creator;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return \CenterID
     */
    public function getCenterID() : \CenterID
    {
        return $this->CenterID;
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match again.
     *
     * @return \ProjectID The ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return $this->ProjectID;
    }

    /**
     * Returns the SessionID for this row.
     *
     * @return \SessionID The SessionID
     */
    public function getSessionID(): \SessionID
    {
        return $this->SessionID;
    }

    /**
     * Return the User who created this row.
     *
     * @return \User The user who created this row
     */
    public function createdBy() : \User
    {
        return $this->CreatedBy;
    }
}
