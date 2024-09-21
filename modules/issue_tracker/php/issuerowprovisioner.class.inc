<?php declare(strict_types=1);
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
    private array $allCenterIDs;

    /**
     * Create a IssueRowProvisioner, which gets rows for the issues menu table.
     *
     * @param \LORIS\LorisInstance $loris the LORIS instance with the issues
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $this->allCenterIDs = array_map(
            function ($center) {
                return $center->getCenterID();
            },
            $loris->getAllSites()
        );
        $userID = $user->getUsername();

        //note that this needs to be in the same order as the headers array
        parent::__construct(
            "SELECT i.issueID,
                    i.title,
                    m.name as module,
                    i.category,
                    CONCAT(uReporter.First_name, ' ', uReporter.Last_name),
                    CONCAT(uAssignee.First_name, ' ', uAssignee.Last_name),
                    i.status,
                    i.priority,
                    i.centerID as centerId,
                    c.PSCID as pscid,
                    s.Visit_label as visitLabel,
                    i.dateCreated,
                    i.lastUpdate,
                    s.ID as sessionId,
                    c.CandID as candidateId,
                    w.userID as userId
            FROM issues as i
            LEFT JOIN modules m
              ON (m.ID=i.module)
            LEFT JOIN candidate c
              ON (i.candID=c.CandID)
            LEFT JOIN session s
              ON (i.sessionID = s.ID)
            LEFT JOIN issues_watching w
              ON (i.issueID = w.issueID AND w.userID=:username)
            LEFT JOIN issues_comments ic
              ON (i.issueID = ic.issueID)
            JOIN users uReporter
              ON (i.reporter = uReporter.UserID)
            LEFT JOIN users uAssignee
              ON (i.assignee = uAssignee.UserID)
            GROUP BY i.issueID, w.userID
            ORDER BY i.issueID DESC",
            ['username' => $userID]
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
        // We need the module descriptor to get the full name. Since modules
        // are likely to appear in multiple issues, keep a cache of descriptors
        // that come from the factory.
        static $modules = [];

        $mname  = $row['module'];
        $module = new \NullModule($this->loris);
        if (!empty($mname)) {
            if (!isset($modules[$mname])) {
                $modules[$mname] = $this->loris->getModule($mname);
            }
            $module = &$modules[$mname];
        }

        if (isset($row['centerId'])) {
            // convert the value from string to int array
            $cids = [\CenterID::singleton(intval($row['centerId']))];

        } else {
            $cids = $this->allCenterIDs;
        }

        $row['centerId']   = $cids;
        $row['lastUpdate'] = \Utility::toDateDisplayFormat($row['lastUpdate']);
        return new IssueRow($row, $cids, $module);
    }
}
