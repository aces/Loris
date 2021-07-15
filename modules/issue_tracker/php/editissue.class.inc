<?php declare(strict_types=1);

namespace LORIS\issue_tracker;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

require_once 'Email.class.inc';

use LORIS\issue_tracker\Provisioners\AttachmentProvisioner;
use \LORIS\issue_tracker\Issue_Tracker;

/**
 * Issue tracker
 *
 * Handles issue edits and returns data in response to a front end call.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Issue Tracker
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class EditIssue extends \NDB_Page implements ETagCalculator
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
     * Returns a list of fields from database, including issue data.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Database & user access needed.
        $db       = \NDB_Factory::singleton()->database();
        $user    = \NDB_Factory::singleton()->user();

        // get field options
        $sites = Issue_Tracker::getSites(false, true);

        // not yet ideal permissions
        $assignees      = [];
        $inactive_users = [];
        if ($user->hasPermission('access_all_profiles')) {
            $assignee_expanded = $db->pselect(
                "SELECT
                            Real_name,
                            UserID
                        FROM
                            users",
                []
            );

            $inactive_users_expanded = $db->pselect(
                "SELECT
                            Real_name,
                            UserID
                        FROM
                            users
                        WHERE
                            Active = 'N'",
                []
            );
        } else {
            $CenterID = implode(',', $user->getCenterIDs());
            $DCCID    = $db->pselectOne(
                "SELECT
                            CenterID
                        FROM
                            psc
                        WHERE
                            Name = 'DCC'",
                []
            );
            $assignee_expanded = $db->pselect(
                "SELECT DISTINCT
                            u.Real_name,
                            u.UserID
                        FROM
                            users u
                            LEFT JOIN user_psc_rel upr ON (upr.UserID = u.ID)
                        WHERE
                            FIND_IN_SET(upr.CenterID, :CenterID)
                            OR(upr.CenterID = :DCC)",
                [
                    'CenterID' => $CenterID,
                    'DCC'      => $DCCID,
                ]
            );

            $inactive_users_expanded = $db->pselect(
                "SELECT DISTINCT
                            u.Real_name,
                            u.UserID
                        FROM
                            users u
                            LEFT JOIN user_psc_rel upr ON (upr.UserID = u.ID)
                        WHERE
                            FIND_IN_SET(upr.CenterID, :CenterID)
                            OR(upr.CenterID = :DCC)
                            AND Active = 'N'",
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

        //can't set to closed if not developer.
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
        $issueData = getIssueData();
        if (!empty($values['issueID'])
            && $values['issueID'] != "new"
        ) { //if an existing issue
            $issueID   = intval($values['issueID']);
            $issueData = getIssueData($issueID);

            $desc = $db->pselect(
                "SELECT
                            issueComment
                        FROM
                            issues_comments
                        WHERE
                            issueID = :i
                        ORDER BY
                            dateAdded
                        LIMIT 1",
                ['i' => $issueID]
            );

            $provisioner = (new AttachmentProvisioner($issueID));
            $attachments = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($user);

            $isWatching = $db->pselectOne(
                "SELECT
                            userID,
                            issueID
                        FROM
                            issues_watching
                        WHERE
                            issueID = :issueID
                            AND userID = :userID",
                [
                    'issueID' => $issueID,
                    'userID'  => $user->getUsername(),
                ]
            );
            if ($isWatching === null) {
                $issueData['watching'] = "No";
            } else {
                $issueData['watching'] = "Yes";
            }
            $username = $user->getUsername();
            $issueData['commentHistory'] = getComments($issueID);
            $issueData['attachments']    = $attachments;
            $issueData['whoami']         = $username;
            $issueData['othersWatching'] = getWatching($issueID);

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

        if ($issueData['reporter'] == $user->getUsername()) {
            $isOwnIssue = true;
        } else {
            $isOwnIssue = false;
        }

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

        return new \LORIS\Http\Response\JsonResponse(
            $values
        );
    }

    /**
     * Returns true if the user has permission to access
     * the Create Timepoint module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'issue_tracker_reporter',
                'issue_tracker_developer',
            ]
        );
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
