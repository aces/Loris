<?php
/**
 * This file implements a data provisioner to get all possible rows
 * for the dicom archive menu page.
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
 * This class implements a data provisioner to get all possible rows
 * for the dicom archive menu page.
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
class DicomArchiveRowProvisioner extends \LORIS\Data\Provisioner
{
    /**
     * Runs a query to retrieve all rows for the dicom archive
     *
     * @return array of DicomArchiveRow[] instances
     */
    protected function getAllInstances() : array
    {
        $sql     = "SELECT t.PatientID as `Patient ID`,
        t.PatientName as `Patient Name`,
        t.PatientGender as Gender,
        t.PatientDoB as `Date of birth`,
        t.DateAcquired as Acquisition,
        t.ArchiveLocation as Archive_Location,
        'View Details' as Metadata,
        'View Images' as `MRI Browser`,
        s.CenterID as Site,
        t.TarchiveID as TarchiveID,
        s.ID as SessionID,
        s.CenterID
        FROM tarchive t
              LEFT JOIN session s ON (s.ID=t.SessionID)
              LEFT JOIN candidate c ON (c.CandID=s.CandID)
        ";
        $db      = \Database::singleton();
        $query   = $db->pselect($sql, array());
        $results = [];

        foreach ($query as $row) {
            $cid = $row['CenterID'];
            unset($row['CenterID']);

            $r         = new DICOMArchiveRow($row, $cid);
            $results[] = $r;
        }
        return $results;
    }
}
