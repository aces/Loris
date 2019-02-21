<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all qc data from an image
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
 * for a visit imaging qc data.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitImagingQcRowProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for to get all Imaging qc data
     * for a Visit.
     *
     * @param \Timepoint $timepoint The requested timepoint
     */
    function __construct(\Timepoint $timepoint)
    {
        parent::__construct(
            '
             SELECT 
               s.MRIQCStatus,
               s.MRIQCPending 
             FROM session s
             WHERE
               s.ID = :v_sessionid AND
               s.Active="Y"
            ',
            array(
             'v_sessionid' => $timepoint->getSessionID(),
            )
        );
    }

    /**
     * Returns an instance of a VisitImagingQcRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new VisitImagingQcRow($row);
    }
}

