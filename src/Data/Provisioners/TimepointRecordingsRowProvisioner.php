<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all images
 * of a visit.
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Data\Provisioners;

/**
 * This class implements a data provisioner to get all possible rows
 * for the /candidates/$candid/$visit_label/images endpoint.
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class TimepointRecordingsRowProvisioner extends DBRowProvisioner
{
    /**
     * Constructor
     *
     * @param \Timepoint $timepoint The requested timepoint
     */
    public function __construct(\Timepoint $timepoint)
    {
        parent::__construct(
            '
             SELECT
               PhysiologicalFileID as fileid
             FROM
               physiological_file f
             JOIN session s
               ON (s.ID=f.SessionID)
             JOIN candidate c
               ON (s.CandID=c.CandID)
             WHERE
               s.ID=:v_sessionid AND
               c.Active=\'Y\' AND
               s.Active=\'Y\'
            ',
            array(
             'v_sessionid' => $timepoint->getSessionID(),
            )
        );
    }

    /**
     * Returns an instance of a Recording.class object for a given table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return (new \LORIS\Recording(intval($row['fileid'])))
            ->asDTO();
    }
}
