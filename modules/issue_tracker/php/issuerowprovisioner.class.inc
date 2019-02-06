<?php
/**
 * This file implements a data provisioner to get all possible rows
 * for the issue tracker menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\issue_tracker;

/**
 * This class implements a data provisioner to get all possible rows
 * for the issue tracker menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class IssueRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a IssueRowProvisioner, which gets rows for the issues menu table.
     */
    function __construct()
    {
        $user   = \User::singleton();
        $userID = $user->getUsername();
        //note that this needs to be in the same order as the headers array
        parent::__construct(
            "SELECT i.issueID,
                    i.title,
                    l.Label as module,
                    i.category,
                    i.reporter,
                    i.assignee,
                    i.status,
                    i.priority,
                    i.centerID as centerId,
                    c.PSCID as pscid,
                    s.Visit_label as visitLabel,
                    i.dateCreated,
                    i.lastUpdate,
                    s.ID as sessionID,
                    c.CandID as candidateID,
                    w.userID
            FROM issues as i
            LEFT JOIN candidate c 
              ON (i.candID=c.CandID)
            LEFT JOIN LorisMenu l
              ON (i.module=l.ID)
            LEFT JOIN session s
              ON (i.sessionID = s.ID)
            LEFT JOIN issues_watching w
              ON (i.issueID = w.issueID)
            LEFT JOIN issues_comments ic
              ON (i.issueID = ic.issueID)
            GROUP BY i.issueID, w.userID
            ORDER BY i.issueID DESC",
            array()
        );
    }

    /**
     * Returns an instance of an IssueRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            $cid = $row['centerId'];
            unset($row['CenterID']);
            return new IssueRow($row, $cid);
    }
}
