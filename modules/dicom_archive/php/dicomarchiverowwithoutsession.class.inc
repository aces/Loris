<?php declare(strict_types=1);

/**
 * This class implements a data Instance which represents a single
 * row in the dicom archive menu table.
 *
 * PHP Version 8
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
class DICOMArchiveRowWithoutSession implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    protected $CreatedBy;

    /**
     * Create a new DICOMArchiveRow without a session.
     *
     * Session-less DICOMArchiveRows do not have CenterIDs to be filtered
     * by.
     *
     * @param array $row     The row (in the same format as \Database::pselectRow
     *                       returns)
     * @param \User $creator The user who created this row
     */
    public function __construct(array $row, \User $creator)
    {
        $this->DBRow     = $row;
        $this->CreatedBy = $creator;
    }

    /**
     * Returns Null always since this class is specifically for no session IDs.
     *
     * @return ?\SessionID The SessionID
     */
    public function getSessionID(): ?\SessionID
    {
        return null;
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
     * Check whether a user can access this data instance.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        if ($this->createdBy()->getId() === $user->getId()) {
            return true;
        }

        return $user->hasPermission('dicom_archive_view_allsites')
            || $user->hasPermission('dicom_archive_nosessionid');
    }
}
