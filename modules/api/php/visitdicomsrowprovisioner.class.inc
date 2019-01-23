<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all instrument names
 * of a visit.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api;

use \LORIS\Data\Provisioners\DBRowProvisioner;
/**
 * This class implements a data provisioner to get all possible rows
 * for the projects/$projectname/instruments endpoint
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitDicomsRowProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for
     * projects/$projectname/instruments endpoint.
     *
     * @param \Timepoint $timepoint The requested timepoint
     */
    function __construct(\Timepoint $timepoint)
    {
        parent::__construct(
            '
             SELECT
               SUBSTRING_INDEX(t.ArchiveLocation, "/", -1) as Tarname,
               ts.SeriesDescription as SeriesDescription,
               ts.SeriesNumber as SeriesNumber,
               ts.EchoTime as EchoTime,
               ts.RepetitionTime as RepetitionTime,
               ts.InversionTime as InversionTime,
               ts.SliceThickness as SliceThickness,
               ts.Modality as Modality,
               ts.SeriesUID as SeriesUID
             FROM tarchive t
             JOIN session s
               ON (t.SessionID=t.SessionID)
             JOIN candidate c
               ON (s.CandID=c.CandID)
             JOIN tarchive_series ts
               ON (ts.TarchiveID=t.TarchiveID)
             WHERE t.PatientName LIKE :v_patientname AND
               c.Active="Y" AND
               s.Active="Y" AND
               s.ID = :v_sessionid
             GROUP BY
               t.TarchiveID,
               ts.SeriesDescription,
               ts.SeriesNUmber,
               ts.EchoTime,
               ts.RepetitionTime,
               ts.InversionTime,
               ts.SliceThickness,
               ts.Modality,
               ts.SeriesUID
             ORDER BY Tarname
            ',
            array(
             'v_sessionid'   => $timepoint->getSessionID(),
             'v_patientname' => '%%',
            )
        );
    }

    /**
     * Returns an instance of a ProjectInstrumentsRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new VisitDicomsRow($row);
    }
}

