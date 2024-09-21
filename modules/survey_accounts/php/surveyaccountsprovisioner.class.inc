<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the survey accounts menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\survey_accounts;

/**
 * This class implements a data provisioner to get all possible rows
 * for the survey accounts menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class SurveyAccountsProvisioner
    extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a SurveyAccountsProvisioner, which gets rows for the
     * survey accounts menu table.
     */
    function __construct()
    {

        parent::__construct(
            "SELECT
                c.PSCID AS PSCID,
                s.Visit_label AS Visit,
                p.Test_name as SurveyName,
                p.OneTimePassword as URL,
                p.Status,
                s.CenterID,
                s.ProjectID
             FROM participant_accounts p
                JOIN session s ON (p.SessionID=s.ID)
                JOIN candidate c ON (c.CandID=s.CandID)
             WHERE c.Active = 'Y'
                AND s.Active = 'Y'
             ORDER BY PSCID",
            []
        );
    }

    /**
     * Returns an instance of a SurveyAccountsRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $cid = \CenterID::singleton(intval($row['CenterID']));
        $pid = \ProjectID::singleton((intval($row['ProjectID'])));
        return new SurveyAccountsRow($row, $cid, $pid);
    }
}
