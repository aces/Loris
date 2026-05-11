<?php declare(strict_types=1);

namespace LORIS\electrophysiology_uploader;

use LORIS\Data\DataInstance;

/**
 * This class implements a data provisioner to get all possible rows
 * for the electrophysiology uploader menu page.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ElectrophysiologyUploaderProvisioner
    extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ElectrophysiologyUploaderProvisioner, which gets rows for
     * the Electrophysiology Uploader menu table.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to retrieve data
     *                                    from.
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        parent::__construct(
            $loris,
            "SELECT
                e.UploadID,
                psc.Name,
                c.PSCID,
                s.Visit_label,
                e.UploadLocation,
                e.UploadDate,
                e.Status,
                e.UploadedBy,
                c.RegistrationCenterID,
                c.RegistrationProjectID
            FROM electrophysiology_uploader e
                JOIN session s ON (s.ID = e.SessionID)
                JOIN candidate c ON (c.ID = s.CandidateID)
                JOIN psc ON (psc.CenterID = c.RegistrationCenterID)
            ",
            []
        );
    }

    /**
     * Returns an instance of a ElectrophysiologyUploaderRow object
     * for a given table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row): DataInstance
    {
        $cid = \CenterID::singleton(intval($row['RegistrationCenterID']));
        $pid = \ProjectID::singleton(intval($row['RegistrationProjectID']));
        unset($row['RegistrationCenterID']);
        unset($row['RegistrationProjectID']);
        return new ElectrophysiologyUploaderRow($row, $cid, $pid);
    }
}
