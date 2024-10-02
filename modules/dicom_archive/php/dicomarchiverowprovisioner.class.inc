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
class DicomArchiveRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a DicomArchiveRowProvisioner, which gets rows for the dicom_archive
     * menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT t.PatientID AS patientID,
            t.PatientName AS patientName,
            t.PatientSex AS sex,
            t.PatientDoB AS dateOfBirth,
            t.DateAcquired AS acquisitionDate,
            t.ArchiveLocation AS archiveLocation,
            'View Details' AS Metadata,
            'View Images' AS `MRI Browser`,
            (SELECT GROUP_CONCAT(SeriesUID) FROM tarchive_series e WHERE
                    e.TarchiveID=t.TarchiveID GROUP BY e.TarchiveID) AS seriesUID,
            psc.Name AS site,
            t.TarchiveID AS TarchiveID,
            s.ID AS SessionID,
            s.CenterID AS CenterID,
            m.IsPhantom AS IsPhantom
            FROM tarchive t
                  LEFT JOIN session s ON (s.ID=t.SessionID)
                  LEFT JOIN candidate c ON (c.CandID=s.CandID)
                  LEFT JOIN psc ON (psc.CenterID=s.CenterID)
                  LEFT JOIN mri_upload m ON (m.TarchiveID=t.TarchiveID)
            WHERE COALESCE(c.Active, 'Y')='Y' AND COALESCE(s.Active, 'Y')='Y'",
            []
        );
    }

    /**
     * Returns an instance of a DICOMArchiveRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        if ($row['CenterID'] !== null) {
            $cid = \CenterID::singleton($row['CenterID']);
            unset($row['CenterID']);
            return new DICOMArchiveRowWithSession($row, $cid);
        }
        unset($row['CenterID']);
        return new DICOMArchiveRowWithoutSession($row);
    }
}
