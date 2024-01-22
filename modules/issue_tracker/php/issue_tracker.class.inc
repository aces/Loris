<?php

/**
 * This class features the code for the menu portion of the Loris issue
 * tracker.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\issue_tracker;

/**
 * Provides the PHP code for the menu filter for the issue tracker
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Issue_Tracker extends \NDB_Menu_Filter_Form
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    /**
     * Returns true if user has access to this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
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
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $provisioner = new IssueRowProvisioner($this->loris);

        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();

        if ($user->hasPermission('access_all_profiles') === false) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        $provisioner = $provisioner->map(new IssueWatcherMapper());
        return $provisioner;
    }

    /**
     * Returns a list of sites in the database with an additional All Sites option
     *
     * @param boolean $study_site if true only return study sites from psc
     *                            table
     * @param boolean $DCC        Whether the DCC should be included or not
     *
     * @return array an associative array("center ID" => "site name")
     */
    static function getSites(
        bool $study_site = true,
        bool $DCC = true
    ): array {
        $user = \User::singleton();
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = \Utility::getSiteList($study_site, $DCC);
        } else {
            // allow only to view own site data
            $sites = $user->getStudySites();
        }
        return $sites;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON(): string
    {
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $db      = $factory->database();

        //sites
        if ($user->hasPermission('access_all_profiles')) {
            $sites = \Utility::getSiteList();
        } else {
            // allow only to view own site data
            $sites = $user->getStudySites();
        }

        //reporters
        $reporters         = [];
        $reporter_expanded = $db->pselect(
            "SELECT DISTINCT u.UserID,
                    u.Real_name
             FROM issues i
             INNER JOIN users u
               ON(i.reporter=u.UserID)",
            []
        );
        foreach ($reporter_expanded as $r_row) {
            $reporters[$r_row['Real_name']] = $r_row['Real_name'];
        }

        //assignees
        $assignees         = [];
        $assignee_expanded = $db->pselect(
            "SELECT DISTINCT u.UserID,
                    u.Real_name
             FROM issues i
             INNER JOIN users u
               ON(i.assignee=u.UserID)",
            []
        );
        foreach ($assignee_expanded as $a_row) {
            $assignees[$a_row['Real_name']] = $a_row['Real_name'];
        }

        $modules = array_reduce(
            $this->loris->getActiveModules(),
            function (
                $result,
                $module
            ) {
                $moduleName          = $module->getLongName();
                $result[$moduleName] = $moduleName;
                return $result;
            },
            []
        );

        $priorities = [
            'low'       => 'Low',
            'normal'    => 'Normal',
            'high'      => 'High',
            'urgent'    => 'Urgent',
            'immediate' => 'Immediate',
        ];

        $statuses = [
            'new'          => 'New',
            'acknowledged' => 'Acknowledged',
            'feedback'     => 'Feedback',
            'assigned'     => 'Assigned',
            'resolved'     => 'Resolved',
            'closed'       => 'Closed',
        ];

        $unorgCategories = $db -> pselect(
            "SELECT categoryName
             FROM issues_categories",
            []
        );
        $categories      = [];
        foreach ($unorgCategories as $r_row) {
            $categoryName = $r_row['categoryName'];
            if ($categoryName) {
                $categories[$categoryName] = $categoryName;
            }
        }

        $fieldOptions = [
            'modules'    => $modules,
            'categories' => $categories,
            'reporters'  => $reporters,
            'assignees'  => $assignees,
            'statuses'   => $statuses,
            'priorities' => $priorities,
            'sites'      => $sites,
            'userID'     => $user->getUsername(),
        ];

        $table = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisioner());
        $arr   = array_map(
            function ($row) {
                return array_values($row);
            },
            json_decode($table->toJSON($user), true)
        );
        return json_encode(
            [
                'data'         => $arr,
                'fieldOptions' => $fieldOptions,
                'centerIDs'    => \Utility::getSiteList()
            ]
        );
    }

    /**
     * Overrides base getJSDependencies() to add support for issue tracker
     * specific React Index file.
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            [$baseurl . "/issue_tracker/js/issueTrackerIndex.js"]
        );
    }
}
