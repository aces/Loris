<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\behavioural_qc\Provisioners;

/**
 * This class implements a data provisioner to get all incomplete
 * visits.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class IncompleteProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        $config         =& \NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
        for ($i=0; $i<count($ddeInstruments); ++$i) {
            $ddeInstruments[$i] = \Database::singleton()->quote($ddeInstruments[$i]);
        }
        $where = "
                AND (f.commentid NOT LIKE 'DDE_%')
            ";
        if (count($ddeInstruments) > 0) {
            $ddeInstruments = implode(',', $ddeInstruments);
            $where          = "
                AND (f.test_name IN ($ddeInstruments) OR
                f.commentid NOT LIKE 'DDE_%')
            ";
        }
        parent::__construct(
            "
            SELECT DISTINCT
                t.Full_name AS _instrument,
                s.candid AS _candID,
                c.PSCID AS _pscID,
                s.visit_label AS _visit,
                s.ProjectID AS _project,
                psc.CenterID AS _site,
                s.ID AS _id,
                f.SessionID as _sessionID,
                f.test_name as _test_name,
                f.data_entry as _data_entry,
                f.commentid as _commentID
            FROM
	            session s
                JOIN flag f ON (f.sessionid = s.id)
                JOIN candidate c ON (c.candid = s.candid)
                JOIN test_names t ON (t.Test_name = f.Test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE
                s.Active = 'Y'
                AND c.Active = 'Y'
                AND coalesce(f.data_entry, 'In Progress') = 'In Progress'
                AND psc.Centerid != '1'
                AND c.Entity_type != 'Scanner'
                $where
            ORDER BY
	            f.commentid
            ",
            [],
            '\LORIS\behavioural_qc\Models\IncompleteDTO'
        );
    }
}
