<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all possible rows
 * for the issue tracker menu page.
 *
 * PHP Version 8
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
 * PHP Version 8
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

    private const BASE_QUERY = "
        SELECT i.issueID,
               i.title,
               m.name AS module,
               i.category,
               CONCAT(uReporter.First_name, ' ', uReporter.Last_name) AS reporter,
               CONCAT(uAssignee.First_name, ' ', uAssignee.Last_name) AS assignee,
               i.status,
               i.priority,
               i.centerID AS centerId,
               c.PSCID AS pscid,
               s.Visit_label AS visitLabel,
               i.dateCreated,
               i.lastUpdate,
               s.ID AS sessionId,
               w.userID AS userId
        FROM issues AS i
        LEFT JOIN modules m ON m.ID = i.module
        LEFT JOIN candidate c ON (i.CandidateID=c.ID)
        LEFT JOIN session s ON i.sessionID = s.ID
        LEFT JOIN issues_watching w ON i.issueID = w.issueID AND w.userID = :username
        LEFT JOIN issues_comments ic ON i.issueID = ic.issueID
        JOIN users uReporter ON i.reporter = uReporter.UserID
        LEFT JOIN users uAssignee ON i.assignee = uAssignee.UserID";

    private const PERMISSION_QUERY = "
        WHERE i.reporter = :username";

    private const GROUP_ORDER_CLAUSE = "
        GROUP BY i.issueID, w.userID
        ORDER BY i.issueID DESC";

    /**
     * Create a IssueRowProvisioner, which gets rows for the issues menu table.
     *
     * @param \LORIS\LorisInstance $loris the LORIS instance with the issues
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        $this->allCenterIDs = array_map(
            function ($center) {
                return $center->getCenterID();
            },
            $loris->getAllSites()
        );

        $user   = \NDB_Factory::singleton()->user();
        $userID = $user->getUsername();

        $query = self::BASE_QUERY;
        if (!$this->_hasPartialAccess($user)) {
            $query .= self::GROUP_ORDER_CLAUSE;
        } else {
            $query .= self::PERMISSION_QUERY . self::GROUP_ORDER_CLAUSE;
        }

        parent::__construct($loris, $query, ['username' => $userID]);

    }

    /**
     * Check user has permission to see only issues created by the user
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasPartialAccess($user): bool
    {
        return !$user->hasAnyPermission(
            [
                'issue_tracker_all_issue',
                'issue_tracker_site_issue',
            ]
        ) && $user->hasPermission('issue_tracker_own_issue');
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
