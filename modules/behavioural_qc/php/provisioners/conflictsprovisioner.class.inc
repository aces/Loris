<?php declare(strict_types=1);

namespace LORIS\behavioural_qc\Provisioners;

/**
 * This class implements a data provisioner to get all conflicts
 * of visits.
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
class ConflictsProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            "
            SELECT DISTINCT
  	          s.CandID AS _candID,
  	          ca.PSCID AS _pscID,
  	          c.FieldName AS _fieldName,
  	          c.TestName AS _testName,
  	          t.full_name AS _test_name_display,
  	          s.visit_label AS _visit,
              s.ProjectID AS _project,
              s.CohortID AS _cohort,
              f.SessionID AS _sessionID,
              f.commentid AS _commentID,
              t.Full_name AS _instrument,
              psc.CenterID AS _site
            FROM
	          conflicts_unresolved c
	          LEFT JOIN flag f ON (c.CommentId1 = f.CommentID)
	          LEFT JOIN session s ON (f.SessionID = s.ID)
	          LEFT JOIN candidate ca ON (ca.CandID = s.CandID)
	          JOIN test_names t ON (t.test_name = f.test_name)
	          JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE
	          ca.Active = 'Y'
	          AND s.Active = 'Y'
	          AND psc.Centerid != '1'
	          AND ca.Entity_type != 'Scanner'
            ",
            [],
            '\LORIS\behavioural_qc\Models\ConflictsDTO'
        );
    }

}
