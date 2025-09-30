<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all possible rows
 * for the dicom archive menu page.
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
 * This class implements a data provisioner to get all possible rows
 * for the dicom archive menu page.
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
class DicomArchiveRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a DicomArchiveRowProvisioner, which gets rows for the dicom_archive
     * menu table.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to retrieve data
     *                                    from.
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        parent::__construct(
            $loris,
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
            s.ProjectID AS ProjectID,
            m.IsPhantom AS IsPhantom,
            t.CreatingUser
            FROM tarchive t
                  LEFT JOIN session s ON (s.ID=t.SessionID)
                  LEFT JOIN candidate c ON (c.ID=s.CandidateID)
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
        $creator = \User::factory($row['CreatingUser']);

        if ($row['CenterID'] !== null
            && $row['ProjectID'] !== null
            && $row['SessionID'] !== null
        ) {
            $cid = \CenterID::singleton(intval($row['CenterID']));
            $pid = \ProjectID::singleton(intval($row['ProjectID']));
            $sid = new \SessionID(strval($row['SessionID']));
            unset($row['CenterID']);
            unset($row['ProjectID']);
            unset($row['CreatingUser']);
            return new DICOMArchiveRowWithSession($row, $cid, $pid, $sid, $creator);
        }
        unset($row['CenterID']);
        unset($row['ProjectID']);
        unset($row['CreatingUser']);
        return new DICOMArchiveRowWithoutSession($row, $creator);
    }
}
