<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get a single dicom
 * from a visit.
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
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitDicomRowProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for
     * projects/$projectname/instruments endpoint.
     *
     * @param \Timepoint $timepoint The requested timepoint
     * @param string     $tarname   The dicomtar filename
     */
    function __construct(\Timepoint $timepoint, string $tarname)
    {
        parent::__construct(
            '
             SELECT
               CONCAT(conf.path, tarchive.ArchiveLocation) as fullpath
             FROM
               tarchive,
               (SELECT
                  c.Value as path
                FROM Config c 
                JOIN ConfigSettings cs
                  ON (c.ConfigID = cs.ID)
                WHERE cs.Name = "tarchiveLibraryDir"
                LIMIT 1
               ) as conf
             WHERE
               tarchive.SessionID = :v_sessionid AND
               tarchive.ArchiveLocation LIKE :v_basename
            ',
            array(
             'v_sessionid' => $timepoint->getSessionID(),
             'v_basename'  => '%' . $tarname,
            )
        );
    }

    /**
     * Returns a DataInstance implementation instance.
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

