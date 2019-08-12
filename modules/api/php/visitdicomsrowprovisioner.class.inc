<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all Dicoms
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
 * This class implements a data provisioner to get all Dicoms
 * from a Visit.
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
     * Create a RowProvisioner, which gets rows for a Visit Dicoms
     *
     * @param \Timepoint $timepoint The requested timepoint
     */
    function __construct(\Timepoint $timepoint)
    {
        parent::__construct(
            '
             SELECT
               t.TarchiveID as tarchiveid
             FROM tarchive t
             JOIN session s
               ON (s.ID=t.SessionID)
             JOIN candidate c
               ON (s.CandID=c.CandID)
             WHERE 
               c.Active="Y" AND
               s.Active="Y" AND
               s.ID = :v_sessionid
            ',
            array(
             'v_sessionid' => $timepoint->getSessionID(),
            )
        );
    }

    /**
     * Returns an instance of a DicomTar object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return (new \LORIS\DicomTar(intval($row['tarchiveid'])))
            ->asDTO();
    }
}

