<?php declare(strict_types=1);

namespace LORIS\issue_tracker;

use LORIS\issue_tracker\Provisioners\AttachmentProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * Edit class - GET & POST request methods.
 *
 * Handles issue edits and returns data in response to a front end call.
 *
 * @category Loris
 * @package  Issue Tracker
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Edit extends \NDB_Page implements ETagCalculator
{
    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        return match ($request->getMethod()) {
            'GET' => $this->_handleGET($request),
            'POST' => $this->_handlePOST($request),
            default => new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            ),
        };
    }

    /**
     * _handleGET retrieve the edit issue details
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();
        $user    = $factory->user();

        // get field options
        $sites = Issue_Tracker::getSites(false, true);

        //not yet ideal permissions
        $assignees      = [];
        $inactive_users = [];
        if ($user->hasPermission('access_all_profiles')) {
            $assignee_expanded = $db->pselect(
                "SELECT Real_name, UserID FROM users",
                []
            );

            $inactive_users_expanded = $db->pselect(
                "SELECT Real_name, UserID FROM users
                  WHERE Active='N'",
                []
            );
        } else {
            $CenterID = implode(',', $user->getCenterIDs());
            $DCCID    = $db->pselectOne(
                "SELECT CenterID from psc where Name='DCC'",
                []
            );
            $assignee_expanded = $db->pselect(
                "SELECT DISTINCT u.Real_name, u.UserID FROM users u
                 LEFT JOIN user_psc_rel upr ON (upr.UserID=u.ID)
                 WHERE FIND_IN_SET(upr.CenterID,:CenterID) OR (upr.CenterID=:DCC)",
                [
                    'CenterID' => $CenterID,
                    'DCC'      => $DCCID,
                ]
            );

            $inactive_users_expanded = $db->pselect(
                "SELECT DISTINCT u.Real_name, u.UserID FROM users u
                 LEFT JOIN user_psc_rel upr ON (upr.UserID=u.ID)
                 WHERE FIND_IN_SET(upr.CenterID,:CenterID) OR (upr.CenterID=:DCC)
                 AND Active='N'",
                []
            );
        }

        foreach ($assignee_expanded as $a_row) {
            $assignees[$a_row['UserID']] = $a_row['Real_name'];
        }

        foreach ($inactive_users_expanded as $u_row) {
            $inactive_users[$u_row['UserID']] = $u_row['Real_name'];
        }

        $otherWatchers = [];
        $potential_watchers_expanded = $db->pselect(
            "SELECT Real_name, UserID FROM users",
            []
        );
        foreach ($potential_watchers_expanded as $w_row) {
            if ($w_row['UserID'] != $user->getUsername()) {
                $otherWatchers[$w_row['UserID']] = $w_row['Real_name'];
            }
        }

        // can't set to closed if not developer.
        if ($user->hasPermission('issue_tracker_developer')) {
            $statuses = [
                'new'          => 'New',
                'acknowledged' => 'Acknowledged',
                'assigned'     => 'Assigned',
                'feedback'     => 'Feedback',
                'resolved'     => 'Resolved',
                'closed'       => 'Closed',
            ];
        } else {
            $statuses = [
                'new'          => 'New',
                'acknowledged' => 'Acknowledged',
                'assigned'     => 'Assigned',
                'feedback'     => 'Feedback',
                'resolved'     => 'Resolved',
            ];
        }

        $priorities = [
            'low'       => 'Low',
            'normal'    => 'Normal',
            'high'      => 'High',
            'urgent'    => 'Urgent',
            'immediate' => 'Immediate',
        ];

        $unorgCategories = $db->pselect(
            "SELECT categoryName FROM issues_categories",
            []
        );
        $categories      = [];
        foreach ($unorgCategories as $r_row) {
            $categoryName = $r_row['categoryName'];
            if ($categoryName) {
                $categories[$categoryName] = $categoryName;
            }
        }

        $allmodules = \Module::getActiveModulesIndexed($db);

        $modules = [];
        foreach ($allmodules as $key => $m) {
            $modules[$key] = $m->getLongName();
        }

        //Now get issue values
        $issueData = $this->getIssueData();
        if (!empty($_GET['issueID'])
            && $_GET['issueID'] != "new"
        ) { //if an existing issue
            $issueID   = intval($values['issueID']);
            $issueData = $this->getIssueData($issueID);

            $desc = $db->pselect(
                "SELECT issueComment
                FROM issues_comments WHERE issueID=:i
                ORDER BY dateAdded LIMIT 1",
                ['i' => $issueID]
            );

            $provisioner = (new AttachmentProvisioner($issueID));
            $attachments = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($user);

            $isWatching = $db->pselectOne(
                "SELECT userID, issueID FROM issues_watching
                WHERE issueID=:issueID AND userID=:userID",
                [
                    'issueID' => $issueID,
                    'userID'  => $user->getUsername(),
                ]
            );
            $issueData['watching'] = $isWatching === null ? 'No' : 'Yes';
            $issueData['commentHistory'] = $this->getComments($issueID);
            $issueData['attachments']    = $attachments;
            $issueData['whoami']         = $user->getUsername();
            $issueData['othersWatching'] = $this->getWatching($issueID);

            // We need to unescape the string here:
            // React is escaping the string in the template
            // This fixes an issue with multiple escaping (#6643)
            $issueData['desc'] = '';
            if (count($desc) > 0) {
                $comment           = $desc[0]['issueComment'];
                $issueData['desc'] = html_entity_decode($comment);
            }
        }
        $issueData['comment'] = null;

        $isOwnIssue = $issueData['reporter'] == $user->getUsername();

        $result = [
            'assignees'         => $assignees,
            'inactiveUsers'     => $inactive_users,
            'sites'             => $sites,
            'statuses'          => $statuses,
            'priorities'        => $priorities,
            'categories'        => $categories,
            'modules'           => $modules,
            'otherWatchers'     => $otherWatchers,
            'issueData'         => $issueData,
            'hasEditPermission' => $user->hasPermission(
                'issue_tracker_developer'
            ),
            'isOwnIssue'        => $isOwnIssue,
        ];

        return new \LORIS\Http\Response\JsonResponse(
            $result
        );
    }

    /**
     * If issueID is passed retrieves issue data from database,
     * otherwise return empty issue data object
     *
     * @param int|null $issueID the ID of the requested issue
     *
     * @return array
     */
    function getIssueData(int $issueID=null): array
    {
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $db      = $factory->database();

        if (!empty($issueID)) {
            return $db->pselectRow(
                "SELECT i.*, c.PSCID, s.Visit_label as visitLabel FROM issues as i " .
                "LEFT JOIN candidate c ON (i.candID=c.CandID)" .
                "LEFT JOIN session s ON (i.sessionID=s.ID) " .
                "WHERE issueID=:issueID",
                ['issueID' => $issueID]
            ) ?? [];
        }

        return [
            'reporter'      => $user->getUsername(),
            'dateCreated'   => date('Y-m-d H:i:s'),
            'centerID'      => $user->getCenterIDs(),
            'status'        => 'new',
            'priority'      => 'normal',
            'issueID'       => 0, //TODO: this is dumb
            'title'         => null,
            'lastUpdate'    => null,
            'PSCID'         => null,
            'assignee'      => null,
            'history'       => null,
            'watching'      => "Yes",
            'visitLabel'    => null,
            'category'      => null,
            'lastUpdatedBy' => null,
        ];
    }

    /**
     * Gets the changes to values, and the comments relevant to the given issue
     *
     * @param int $issueID the issueID
     *
     * @return array $commentHistory
     *
     */
    function getComments(int $issueID): array
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();

        $unformattedComments = $db->pselect(
            "SELECT newValue, fieldChanged, dateAdded, addedBy " .
            "FROM issues_history where issueID=:issueID " .
            "UNION " .
            "SELECT issueComment, 'comment', dateAdded, addedBy " .
            "FROM issues_comments where issueID=:issueID ",
            ['issueID' => $issueID]
        );

        //looping by reference so can edit in place
        $modules = \Module::getActiveModulesIndexed($db);
        foreach ($unformattedComments as &$comment) {
            if ($comment['fieldChanged'] === 'module') {
                $mid = $comment['newValue'];
                $comment['newValue'] = $modules[$mid]->getLongName();
            } else if ($comment['fieldChanged'] === 'centerID') {
                $comment['newValue']     = $this->getSiteName(intval($comment['newValue']));
                $comment['fieldChanged'] = 'site';
            } else if ($comment['fieldChanged'] === 'candID') {
                $PSCID = $db->pselectOne(
                    "SELECT PSCID FROM candidate WHERE CandID=:candID",
                    ['candID' => $comment['newValue']]
                );
                $comment['newValue']     = $PSCID;
                $comment['fieldChanged'] = 'PSCID';
            } else if ($comment['fieldChanged'] === 'sessionID') {
                $visitLabel          = $db->pselectOne(
                    "SELECT Visit_label FROM session WHERE ID=:sessionID",
                    ['sessionID' => $comment['newValue']]
                );
                $comment['newValue'] = $visitLabel;
                $comment['fieldChanged'] = 'Visit Label';
            }
        }

        return $unformattedComments; //now formatted I guess
    }

    /**
     * Gets a list of those watching an issue.
     *
     * @param int $issueID the relevant issue
     *
     * @return array those who are watching
     */
    function getWatching(int $issueID): array
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();

        $watching = $db->pselect(
            "SELECT userID from issues_watching WHERE issueID=:issueID",
            ['issueID' => $issueID]
        );

        $whoIsWatching = [];
        foreach ($watching as $watcher) {
            $whoIsWatching[] = $watcher['userID'];
        }
        return $whoIsWatching;
    }

    /**
     * Returns the site name in the database corresponding to the centerID
     *
     * @param int $centerID - must match one from the psc table or 0
     *
     * @return ?string
     */
    function getSiteName(int $centerID): ?string
    {
        $db =& \Database::singleton();
        return $centerID == null ? 'All Sites' : $db->pselectOne(
            "SELECT Name FROM psc WHERE CenterID=:centerID",
            ['centerID' => $centerID]
        );
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true);
        if (!is_array($values)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid request'
            );
        }
        return new \LORIS\Http\Response\JSON\Created(['success']);
    }

    /**
     * Returns true if the user has permission to access
     * the issue_tracker module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_entry');
    }

    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        if ($request->getMethod() === 'POST') {
            return '';
        }
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
            'POST',
        ];
    }
}
