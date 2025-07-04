<?php declare(strict_types=1);

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
        parent::__construct(
            "
            SELECT DISTINCT
                t.Full_name AS _instrument,
                CASE
                    WHEN f.commentid LIKE 'DDE_%' THEN 'DDE'
                    ELSE 'IDE'
                END AS _data_entry_type,
                c.CandID AS _candID,
                c.PSCID AS _pscID,
                s.visit_label AS _visit,
                s.ProjectID AS _project,
                s.CohortID AS _cohort,
                psc.CenterID AS _site,
                s.ID AS _id,
                f.SessionID as _sessionID,
                t.test_name as _test_name,
                f.data_entry as _data_entry,
                f.commentid as _commentID
            FROM
	            session s
                JOIN flag f ON (f.sessionid = s.id)
                JOIN candidate c ON (c.ID = s.CandidateID)
                JOIN test_names t ON (t.ID = f.TestID)
                JOIN psc ON (s.CenterID = psc.CenterID)
                JOIN test_battery ON (
                    t.Test_name = test_battery.Test_name
                    AND test_battery.Visit_label = s.Visit_label
                )
            WHERE
                s.Active = 'Y'
                AND c.Active = 'Y'
                AND coalesce(f.data_entry, 'In Progress') = 'In Progress'
                AND psc.Centerid != '1'
                AND c.Entity_type != 'Scanner'
                AND (
                    test_battery.DoubleDataEntryEnabled = 'Y'
                    OR f.commentid NOT LIKE 'DDE_%'
                )
            ORDER BY
	            f.commentid
            ",
            [],
            '\LORIS\behavioural_qc\Models\IncompleteDTO'
        );
    }
}
