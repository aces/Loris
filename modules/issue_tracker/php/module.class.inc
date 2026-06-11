<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\issue_tracker;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'issue_tracker_all_issue',
                    'issue_tracker_own_issue',
                    'issue_tracker_site_issue',
                ]
            );
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Tools");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("issue_tracker", "Issue Tracker");
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        if (!in_array($type, ['usertasks', 'candidate'], true)) {
            return [];
        }

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $baseURL = $factory->settings()->getBaseURL();

        switch ($type) {
        case 'usertasks':
            $url = 'assignee=' . $user->getFullname() . '&status=acknowledged&'.
                   'status=assigned&status=feedback&status=new&status=resolved';
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    new \LORIS\GUI\LocalizableString(
                        "issue_tracker",
                        "Your assigned issue",
                        "Your assigned issues",
                    ),
                    $DB,
                    "SELECT COUNT(*) FROM issues
                     WHERE status != 'closed' AND assignee="
                     . $DB->quote($user->getUsername()),
                    '',
                    '',
                    '',
                    $baseURL . "/issue_tracker/?$url",
                    "issue_tracker"
                )
            ];
        case 'candidate':
            $candidate = $options['candidate'];
            if ($candidate === null) {
                return [];
            }
            $issues = $DB->pselect(
                "SELECT i.issueID as ID,
                        i.title as Title,
                        COUNT(DISTINCT ic.issueCommentID) as comments
                FROM issues i
                    LEFT JOIN issues_comments ic ON (i.issueID=ic.issueID)
                    JOIN candidate c ON c.ID=i.CandidateID
                WHERE status != 'closed' AND c.CandID=:cid
                GROUP BY i.issueID, i.Title",
                [ 'cid' => $candidate->getCandID() ],
            );
            if (count($issues) === 0) {
                return [];
            }
            return [
                new \LORIS\candidate_profile\CandidateWidget(
                    dgettext("issue_tracker", "Open Issues"),
                    $baseURL . "/issue_tracker/js/CandidateIssuesWidget.js",
                    "lorisjs.issue_tracker.CandidateIssuesWidget.default",
                    [
                        'Issues' => iterator_to_array($issues),
                    ],
                    1,
                    1,
                )
            ];

        }
        return [];
    }
}
