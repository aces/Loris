<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\mri_violations;

/**
 * This class implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ResolvedProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a MediaFileProvisioner, which gets files for the meida
     * menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT v.PatientName,
                    pjct.Name as Project,
                    subpjct.title as Subproject,
                    site.Name as Site,
                    v.TimeRun,
                    v.MincFile,
                    v.Series_Description as Series_Description_Or_Scan_Type,
                    v.Problem,
                    v.SeriesUID,
                    v.hash,
                    v.join_id,
                    v.Resolved,
                    v.TarchiveID,
                    v.CandID,
                    v.PSCID,
                    pjct.ProjectID as ProjectID
             " . Module::getMriViolatedScanQuery(),
            []
        );
    }

    /**
     * Returns an instance of a MediaFile object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new MRIViolation($row);
    }
}
