<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the electrophysiology browser menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Cecile Madjar <cecile.madjar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\electrophysiology_browser;

/**
 * This class implements a data provisioner to get all possible rows
 * for the electrophysiology browser menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Cecile Madjar <cecile.madjar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ElectrophysiologyBrowserRowProvisioner
    extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create an ElectrophysiologyBrowserRowProvisioner, which gets rows for the
     * electrophysiology browser menu table.
     */
    function __construct()
    {

        parent::__construct(
            "SELECT
              psc.Name                                  AS Site,
              c.PSCID                                   AS PSCID,
              c.CandID                                  AS DCCID,
              Project.Name                              AS Project,
              s.Visit_label                             AS Visit_Label,
              MIN(pf.AcquisitionTime)                   AS Acquisition_Time,
              MIN(pf.InsertTime)                        AS Insert_Time,
              GROUP_CONCAT(DISTINCT pot.OutputTypeName) AS Links,
              GROUP_CONCAT(DISTINCT pot.OutputTypeName) AS Type,
              s.ID                                      AS SessionID,
              s.CenterID                                AS CenterID,
              s.ProjectID                               AS ProjectID
            FROM physiological_file pf
              LEFT JOIN session s   ON (s.ID=pf.SessionID)
              LEFT JOIN candidate c USING (CandID)
              LEFT JOIN psc         ON (s.CenterID=psc.CenterID)
              LEFT JOIN Project     ON (s.ProjectID=Project.ProjectID)
              LEFT JOIN physiological_output_type pot
                USING (PhysiologicalOutputTypeID)
            WHERE c.Active='Y'
              AND s.Active='Y'
              AND pf.FileType IN (
                SELECT type FROM ImagingFileTypes
                WHERE
                  description LIKE '%(EEG)'
                  OR type = 'archive'
              )
            GROUP BY SessionID",
            []
        );
    }

    /**
     * Returns an instance of a ElectrophysiologyBrowserRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $cid = \CenterID::singleton(intval($row['CenterID']));
        $pid = \ProjectID::singleton(intval($row['ProjectID']));
        unset($row['CenterID']);
        unset($row['ProjectID']);
        return new ElectrophysiologyBrowserRow($row, $cid, $pid);
    }
}
