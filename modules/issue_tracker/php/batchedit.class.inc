<?php declare(strict_types=1);

/**
 * Batch editing endpoint for the Issue Tracker.
 *
 * PHP Version 8
 *
 * @category Loris
 * @package  Issue_Tracker
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\issue_tracker;

use LORIS\Middleware\ETagCalculator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Batch edit endpoint for the Issue Tracker.
 *
 * @category Loris
 * @package  Issue_Tracker
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class BatchEdit extends \NDB_Page implements ETagCalculator
{
    private const EDITABLE_FIELDS = [
        'assignee',
        'status',
        'priority',
        'category',
        'centerID',
    ];

    private const STATUSES = [
        'new',
        'acknowledged',
        'feedback',
        'assigned',
        'resolved',
        'closed',
        'rejected',
    ];

    private const CLOSED_STATUSES = [
        'closed',
        'rejected',
    ];

    private const PRIORITIES = [
        'low',
        'normal',
        'high',
        'urgent',
        'immediate',
    ];

    /**
     * Handle a batch edit request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if (!in_array($request->getMethod(), $this->allowedMethods(), true)) {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }

        $user = $request->getAttribute('user');
        if (!$user instanceof \User
            || !$user->hasPermission('issue_tracker_all_issue')
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'User does not have permission to batch edit issues.'
            );
        }

        if ($request->getMethod() === 'GET') {
            return new \LORIS\Http\Response\JsonResponse(
                $this->_getAllIssues($user)
            );
        }

        $values = json_decode((string)$request->getBody(), true);
        if (!is_array($values)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid request.'
            );
        }

        $issueIDs = $this->_validateIssueIDs($values['issueIDs'] ?? null);
        if ($issueIDs instanceof ResponseInterface) {
            return $issueIDs;
        }

        $updates = $this->_validateUpdates($values['updates'] ?? null);
        if ($updates instanceof ResponseInterface) {
            return $updates;
        }

        return $this->_updateIssues($issueIDs, $updates, $user);
    }

    /**
     * Fetch all issues and related data for batch editing.
     *
     * @param \User $user The current user.
     *
     * @return array{
     *     issues: array<int, array<string, mixed>>,
     *     assignees: array<string, string>,
     *     otherWatchers: array<string, string>
     * } Contains issues, assignees, and watcher information.
     */
    private function _getAllIssues(\User $user) : array
    {
        $db            = $this->loris->getDatabaseConnection();
        $assignees     = [];
        $otherWatchers = [];

        /**
         * Users who can be assigned an issue.
         *
         * @var array<int, array{UserID: string}> $assigneeRows
         */
        $assigneeRows = iterator_to_array(
            $db->pselect(
                "SELECT UserID
                 FROM users
                 WHERE Pending_approval = 'N'",
                []
            )
        );
        foreach ($assigneeRows as $assignee) {
            if (!empty($assignee['UserID'])) {
                $assignees[$assignee['UserID']]
                    = $this->_formatUserInformation($assignee['UserID']);
            }
        }

        $currentUsername = $user->getUsername();
        /**
         * Active users who can watch an issue.
         *
         * @var array<int, array{UserID: string}> $potentialWatchers
         */
        $potentialWatchers = iterator_to_array(
            $db->pselect(
                "SELECT UserID
                 FROM users
                 WHERE Active = 'Y' AND Pending_approval = 'N'",
                []
            )
        );
        foreach ($potentialWatchers as $watcher) {
            if (!empty($watcher['UserID'])
                && $watcher['UserID'] !== $currentUsername
            ) {
                $otherWatchers[$watcher['UserID']]
                    = $this->_formatUserInformation($watcher['UserID']);
            }
        }

        /**
         * Issues displayed in batch mode.
         *
         * @var array<int, array{
         *     issueID: int|string,
         *     assignee: ?string,
         *     reporter: ?string,
         *     lastUpdatedBy: ?string,
         *     CandidateID: mixed
         * }&array<string, mixed>> $issues
         */
        $issues = iterator_to_array(
            $db->pselect(
                "SELECT i.*, c.PSCID, s.Visit_label AS visitLabel
                 FROM issues AS i
                 LEFT JOIN candidate c ON i.CandidateID = c.ID
                 LEFT JOIN session s ON i.sessionID = s.ID
                 ORDER BY i.issueID DESC",
                []
            )
        );
        if (empty($issues)) {
            return [
                'issues'        => [],
                'assignees'     => $assignees,
                'otherWatchers' => $otherWatchers,
            ];
        }

        $watcherParams       = [];
        $watcherPlaceholders = [];
        foreach (array_column($issues, 'issueID') as $index => $issueID) {
            $param = "issueID$index";
            $watcherPlaceholders[] = ":$param";
            $watcherParams[$param] = $issueID;
        }
        $watcherPlaceholderList = implode(',', $watcherPlaceholders);
        /**
         * Watchers grouped by issue.
         *
         * @var array<int, array{issueID: int|string, userID: string}>
         *     $watcherRows
         */
        $watcherRows = iterator_to_array(
            $db->pselect(
                "SELECT issueID, userID
                 FROM issues_watching
                 WHERE issueID IN ($watcherPlaceholderList)",
                $watcherParams
            )
        );

        $watchersByIssue = [];
        foreach ($watcherRows as $watcher) {
            if (!empty($watcher['userID'])) {
                $issueID = (int)$watcher['issueID'];
                $watchersByIssue[$issueID][] = $watcher['userID'];
            }
        }

        foreach ($issues as &$issue) {
            $issueID           = (int)$issue['issueID'];
            $issueWatchers     = $watchersByIssue[$issueID] ?? [];
            $issue['watching'] = in_array(
                $currentUsername,
                $issueWatchers,
                true
            ) ? 'Yes' : 'No';

            $assigneeUserID = $issue['assignee'] ?? null;
            if (!empty($assigneeUserID)) {
                $issueWatchers = array_values(
                    array_filter(
                        $issueWatchers,
                        fn($watcherUserID) => $watcherUserID !== $assigneeUserID
                    )
                );
            }
            $issue['othersWatching'] = $issueWatchers;

            $issue['reporter']      = !empty($issue['reporter'])
                ? $this->_formatUserInformation($issue['reporter'])
                : null;
            $issue['lastUpdatedBy'] = !empty($issue['lastUpdatedBy'])
                ? $this->_formatUserInformation($issue['lastUpdatedBy'])
                : null;
            $issue['topComments']   = $this->_getTopComments($issueID);
            unset($issue['CandidateID']);
        }
        unset($issue);

        return [
            'issues'        => $issues,
            'assignees'     => $assignees,
            'otherWatchers' => $otherWatchers,
        ];
    }

    /**
     * Fetch the three most recent comments for an issue.
     *
     * @param int $issueID The issue ID.
     *
     * @return array<int, array{
     *     issueComment: string,
     *     dateAdded: string,
     *     addedBy: string
     * }> The recent comments.
     */
    private function _getTopComments(int $issueID) : array
    {
        /**
         * Comment rows returned by the database.
         *
         * @var iterable<array{
         *     issueComment: string,
         *     dateAdded: string,
         *     addedBy: string
         * }> $comments
         */
        $comments = $this->loris->getDatabaseConnection()->pselect(
            "SELECT issueComment, dateAdded, addedBy
             FROM issues_comments
             WHERE issueID = :issueID
             ORDER BY dateAdded DESC
             LIMIT 3",
            ['issueID' => $issueID]
        );

        $topComments = [];
        foreach ($comments as $comment) {
            $topComments[] = [
                'issueComment' => $comment['issueComment'],
                'dateAdded'    => $comment['dateAdded'],
                'addedBy'      => $this->_formatUserInformation(
                    $comment['addedBy']
                ),
            ];
        }

        return $topComments;
    }

    /**
     * Format a user ID for display in batch-mode issue cards.
     *
     * @param ?string $userID The user ID to format.
     *
     * @return string The formatted user information.
     */
    private function _formatUserInformation(?string $userID) : string
    {
        if ($userID === null) {
            return 'AnonymousUser';
        }

        $realName = $this->loris->getDatabaseConnection()->pselectOne(
            'SELECT Real_name FROM users WHERE userid = :userID',
            ['userID' => $userID]
        );
        if ($realName === null) {
            return 'AnonymousUser';
        }

        return (string)$realName . " ($userID)";
    }

    /**
     * Validate and normalize the selected issue IDs.
     *
     * @param mixed $issueIDs The submitted issue IDs.
     *
     * @return int[]|ResponseInterface Valid issue IDs or an error response.
     */
    private function _validateIssueIDs(mixed $issueIDs) : array|ResponseInterface
    {
        if (!is_array($issueIDs) || empty($issueIDs)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'At least one issue must be selected.'
            );
        }

        foreach ($issueIDs as $issueID) {
            if (!is_int($issueID) || $issueID <= 0) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Issue IDs must be positive integers.'
                );
            }
        }

        return array_values(array_unique($issueIDs));
    }

    /**
     * Validate and normalize the fields to update.
     *
     * @param mixed $updates The submitted field updates.
     *
     * @return array<string, int|string|null>|ResponseInterface Valid updates or
     *                                                          an error response.
     */
    private function _validateUpdates(mixed $updates) : array|ResponseInterface
    {
        if (!is_array($updates) || empty($updates)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'At least one field must be updated.'
            );
        }

        $unknownFields = array_diff(array_keys($updates), self::EDITABLE_FIELDS);
        if (!empty($unknownFields)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Unsupported field in batch edit request.'
            );
        }

        $db = $this->loris->getDatabaseConnection();

        if (array_key_exists('status', $updates)) {
            if (!is_string($updates['status'])
                || !in_array($updates['status'], self::STATUSES, true)
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid issue status.'
                );
            }
        }

        if (array_key_exists('priority', $updates)
            && (!is_string($updates['priority'])
            || !in_array($updates['priority'], self::PRIORITIES, true))
        ) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid issue priority.'
            );
        }

        if (array_key_exists('category', $updates)) {
            $category = $updates['category'];
            if ($category !== null
                && (!is_string($category) || $category === '')
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid issue category.'
                );
            }
            if ($category !== null
                && $db->pselectOne(
                    'SELECT categoryName FROM issues_categories '
                    . 'WHERE categoryName=:category',
                    ['category' => $category]
                ) === null
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid issue category.'
                );
            }
        }

        if (array_key_exists('assignee', $updates)) {
            $assignee = $updates['assignee'];
            if ($assignee !== null
                && (!is_string($assignee) || $assignee === '')
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid issue assignee.'
                );
            }
            if ($assignee !== null
                && $db->pselectOne(
                    "SELECT UserID FROM users
                     WHERE UserID=:assignee AND Pending_approval='N'",
                    ['assignee' => $assignee]
                ) === null
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid issue assignee.'
                );
            }
        }

        if (array_key_exists('centerID', $updates)) {
            $centerID = $updates['centerID'];
            if ($centerID !== null
                && !is_int($centerID)
                && !(is_string($centerID) && ctype_digit($centerID))
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid issue site.'
                );
            }

            if ($centerID !== null) {
                $centerID = (int)$centerID;
                if ($centerID <= 0
                    || $db->pselectOne(
                        'SELECT CenterID FROM psc WHERE CenterID=:centerID',
                        ['centerID' => $centerID]
                    ) === null
                ) {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        'Invalid issue site.'
                    );
                }
            }
            $updates['centerID'] = $centerID;
        }

        return $updates;
    }

    /**
     * Apply the validated updates to each selected issue.
     *
     * @param int[]                          $issueIDs The issue IDs to update.
     * @param array<string, int|string|null> $updates  The fields to update.
     * @param \User                          $user     The user making the request.
     *
     * @return ResponseInterface The batch edit result.
     */
    private function _updateIssues(
        array $issueIDs,
        array $updates,
        \User $user
    ) : ResponseInterface {
        $db           = $this->loris->getDatabaseConnection();
        $placeholders = implode(',', array_fill(0, count($issueIDs), '?'));

        try {
            $db->beginTransaction();
            /**
             * Selected issue rows.
             *
             * @var array<int, array{
             *     issueID: int|string,
             *     assignee: ?string,
             *     status: string,
             *     priority: string,
             *     category: ?string,
             *     lastUpdatedBy: ?string,
             *     centerID: int|string|null,
             *     reporter: string
             * }> $issues
             */
            $issues = iterator_to_array(
                $db->pselect(
                    "SELECT issueID, assignee, status, priority, category,
                            lastUpdatedBy, centerID, reporter
                     FROM issues
                     WHERE issueID IN ($placeholders)
                     FOR UPDATE",
                    $issueIDs
                )
            );

            if (count($issues) !== count($issueIDs)) {
                $db->rollBack();
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'One or more selected issues do not exist.'
                );
            }

            if (isset($updates['status'])
                && in_array($updates['status'], self::CLOSED_STATUSES, true)
            ) {
                foreach ($issues as $issue) {
                    if (!$this->_canCloseIssue($issue, $user)) {
                        $db->rollBack();
                        return new \LORIS\Http\Response\JSON\Forbidden(
                            'User does not have permission to close one or more '
                            . 'selected issues.'
                        );
                    }
                }
            }

            $globalWatchers = $this->_getGlobalWatchers();
            /**
             * Pending issue notifications.
             *
             * @var array<int, array{
             *     issueID: int,
             *     oldAssignee: ?string,
             *     newAssignee: ?string
             * }> $notificationQueue
             */
            $notificationQueue = [];
            $updatedCount      = 0;
            foreach ($issues as $issue) {
                $changedValues = [];
                foreach ($updates as $field => $value) {
                    $currentValue = $field === 'centerID'
                        && $issue[$field] !== null
                        ? (int)$issue[$field]
                        : $issue[$field];
                    if ($currentValue !== $value) {
                        $changedValues[$field] = $value;
                    }
                }

                if (empty($changedValues)) {
                    continue;
                }

                $issueID = (int)$issue['issueID'];
                if ($issue['lastUpdatedBy'] !== $user->getUsername()) {
                    $changedValues['lastUpdatedBy'] = $user->getUsername();
                }

                $db->unsafeUpdate('issues', $changedValues, ['issueID' => $issueID]);

                foreach ($changedValues as $field => $value) {
                    $db->unsafeInsert(
                        'issues_history',
                        [
                            'newValue'     => $value ?? '',
                            'fieldChanged' => $field,
                            'issueID'      => $issueID,
                            'addedBy'      => $user->getUsername(),
                        ]
                    );
                }

                $newAssignee = $issue['assignee'];
                if (array_key_exists('assignee', $changedValues)) {
                    $newAssignee = is_string($changedValues['assignee'])
                        ? $changedValues['assignee']
                        : null;
                    if ($issue['assignee'] !== null) {
                        $db->delete(
                            'issues_watching',
                            [
                                'userID'  => $issue['assignee'],
                                'issueID' => $issueID,
                            ]
                        );
                    }
                    if ($newAssignee !== null) {
                        $db->replace(
                            'issues_watching',
                            ['userID' => $newAssignee, 'issueID' => $issueID]
                        );
                    }
                }

                foreach ($globalWatchers as $watcher) {
                    $db->replace(
                        'issues_watching',
                        ['userID' => $watcher, 'issueID' => $issueID]
                    );
                }

                $notificationQueue[] = [
                    'issueID'     => $issueID,
                    'oldAssignee' => $issue['assignee'],
                    'newAssignee' => $newAssignee,
                ];
                $updatedCount++;
            }

            $db->commit();
        } catch (\Throwable $error) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            if ($this->logger !== null) {
                $this->logger->error(
                    'Issue Tracker batch edit failed.',
                    ['exception' => $error]
                );
            }
            return new \LORIS\Http\Response\JSON\InternalServerError();
        }

        foreach ($notificationQueue as $notification) {
            try {
                $this->_notifyIssueChange(
                    $notification['issueID'],
                    $notification['oldAssignee'],
                    $notification['newAssignee'],
                    $user
                );
            } catch (\Throwable $error) {
                if ($this->logger !== null) {
                    $this->logger->error(
                        'Issue Tracker batch edit notification failed.',
                        [
                            'exception' => $error,
                            'issueID'   => $notification['issueID'],
                        ]
                    );
                }
            }
        }

        return new \LORIS\Http\Response\JsonResponse(
            [
                'selected' => count($issueIDs),
                'updated'  => $updatedCount,
            ]
        );
    }

    /**
     * Return whether the user may close the selected issue.
     *
     * @param array $issue The selected issue row.
     * @param \User $user  The user making the request.
     *
     * @phpstan-param array{centerID: int|string|null, reporter: string} $issue
     *
     * @return bool Whether the issue may be closed.
     */
    private function _canCloseIssue(array $issue, \User $user) : bool
    {
        if ($user->hasPermission('issue_tracker_close_all_issue')) {
            return true;
        }

        if ($user->hasPermission('issue_tracker_close_site_issue')
            && $issue['centerID'] !== null
            && $user->hasCenter(new \CenterID((string)$issue['centerID']))
        ) {
            return true;
        }

        return $user->hasPermission('issue_tracker_own_issue')
            && $issue['reporter'] === $user->getUsername();
    }

    /**
     * Get users configured to receive all Issue Tracker change notifications.
     *
     * @return string[] User IDs.
     */
    private function _getGlobalWatchers() : array
    {
        return array_map(
            'strval',
            $this->loris->getDatabaseConnection()->pselectCol(
                "SELECT u.UserID
                 FROM users_notifications_rel unr
                 JOIN users u ON unr.user_id=u.ID
                 WHERE unr.module_id=(
                     SELECT id FROM notification_modules
                     WHERE module_name='issue_tracker'
                       AND operation_type='create/edit'
                 )",
                []
            )
        );
    }

    /**
     * Email the assignee and watchers after an issue changes.
     *
     * @param int     $issueID     The changed issue ID.
     * @param ?string $oldAssignee The assignee before the change.
     * @param ?string $newAssignee The assignee after the change.
     * @param \User   $user        The user making the request.
     *
     * @return void
     */
    private function _notifyIssueChange(
        int $issueID,
        ?string $oldAssignee,
        ?string $newAssignee,
        \User $user
    ) : void {
        $db          = $this->loris->getDatabaseConnection();
        $issue       = $db->pselectRow(
            'SELECT title, priority, status FROM issues WHERE issueID=:issueID',
            ['issueID' => $issueID]
        );
        $messageData = [
            'study'       => \NDB_Factory::singleton()->config()
                ->getSetting('title'),
            'url'         => \NDB_Factory::singleton()->settings()->getBaseURL()
                . '/issue_tracker/issue/' . $issueID,
            'issueID'     => $issueID,
            'currentUser' => $user->getUsername(),
            'title'       => $issue['title'] ?? null,
            'priority'    => $issue['priority'] ?? null,
            'status'      => $issue['status'] ?? null,
            'comment'     => null,
        ];

        if ($newAssignee !== null
            && $newAssignee !== $user->getUsername()
        ) {
            /**
             * Assignee contact information.
             *
             * @var ?array{Email: string, First_name: string} $assignee
             */
            $assignee = $db->pselectRow(
                'SELECT Email, First_name FROM users WHERE UserID=:userID',
                ['userID' => $newAssignee]
            );
            if ($assignee !== null) {
                $messageData['firstname'] = $assignee['First_name'];
                \Email::send(
                    $assignee['Email'],
                    $oldAssignee === $newAssignee
                        ? 'issue_assigned_modified.tpl'
                        : 'issue_assigned.tpl',
                    $messageData
                );
            }
        }

        /**
         * Watcher contact information.
         *
         * @var iterable<array{Email: string, First_name: string}> $watchers
         */
        $watchers = $db->pselect(
            "SELECT DISTINCT u.Email, u.First_name
             FROM users u
             JOIN issues_watching iw ON iw.userID=u.UserID
             WHERE iw.issueID=:issueID
               AND u.UserID<>:currentUser
               AND (:hasAssignee=0 OR u.UserID<>:assignee)",
            [
                'issueID'     => $issueID,
                'currentUser' => $user->getUsername(),
                'hasAssignee' => $newAssignee === null ? 0 : 1,
                'assignee'    => $newAssignee ?? '',
            ]
        );
        foreach ($watchers as $watcher) {
            $messageData['firstname'] = $watcher['First_name'];
            \Email::send(
                $watcher['Email'],
                'issue_change.tpl',
                $messageData
            );
        }
    }

    /**
     * Return true when the user can batch edit issues.
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool Whether access is granted.
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('issue_tracker_all_issue');
    }

    /**
     * Calculate an ETag for a batch-edit data request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        if ($request->getMethod() !== 'GET') {
            return '';
        }

        return md5(
            (string)json_encode((string)$this->handle($request)->getBody())
        );
    }

    /**
     * Return the valid HTTP methods for this endpoint.
     *
     * @return string[] Valid methods.
     */
    protected function allowedMethods() : array
    {
        return ['GET', 'POST'];
    }
}
