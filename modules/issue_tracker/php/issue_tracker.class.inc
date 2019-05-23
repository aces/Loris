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
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $provisioner = new IssueRowProvisioner();

        $user = \User::singleton();

        if ($user->hasPermission('access_all_profiles') === false) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        $provisioner = $provisioner->map(new IssueWatcherMapper());
        return $provisioner;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $user = \User::singleton();
        $db   = \Database::singleton();

        //sites
        $sites = array();
        if ($user->hasPermission('access_all_profiles')) {
            $sites = \Utility::getSiteList();
        } else {
            // allow only to view own site data
            $sites = $user->getStudySites();
        }

        //reporters
        $reporters         = array();
        $reporter_expanded = $db->pselect(
            "SELECT u.UserID,
                    u.Real_name
             FROM issues i
             INNER JOIN users u
               ON(i.assignee=u.UserID)",
            array()
        );
        foreach ($reporter_expanded as $r_row) {
            $reporters[$r_row['UserID']] = $r_row['Real_name'];
        }

        //assignees
        $assignees         = array();
        $assignee_expanded = $db->pselect(
            "SELECT u.UserID,
                    u.Real_name
             FROM issues i
             INNER JOIN users u
               ON(i.assignee=u.UserID)",
            array()
        );
        foreach ($assignee_expanded as $a_row) {
            $assignees[$a_row['UserID']] = $a_row['Real_name'];
        }

        //modules
        $modules          = [];
        $modules_expanded = $db->pselect(
            "SELECT DISTINCT Label,
                    ID 
             FROM LorisMenu 
             WHERE Parent IS NOT NULL
             ORDER BY Label",
            []
        );
        foreach ($modules_expanded as $r_row) {
            $resultValue = $r_row['Label'];
            if ($resultValue) {
                $modules[$resultValue] = $resultValue;
            }
        }

        $priorities = array(
                       'normal'    => 'Normal',
                       'high'      => 'High',
                       'urgent'    => 'Urgent',
                       'immediate' => 'Immediate',
                      );

        $statuses = array(
                     'new'          => 'New',
                     'acknowledged' => 'Acknowledged',
                     'feedback'     => 'Feedback',
                     'assigned'     => 'Assigned',
                     'resolved'     => 'Resolved',
                     'closed'       => 'Closed',
                    );

        $unorgCategories = $db -> pselect(
            "SELECT categoryName
             FROM issues_categories",
            []
        );
        $categories      = array();
        foreach ($unorgCategories as $r_row) {
            $categoryName = $r_row['categoryName'];
            if ($categoryName) {
                $categories[$categoryName] = $categoryName;
            }
        }

        $dateOptions = array(
                        'language'       => 'en',
                        'format'         => 'YMdHis',
                        'addEmptyOption' => true,
                       );

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

        $check = $table->toJSON($user);

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
            array($baseurl . "/issue_tracker/js/issueTrackerIndex.js")
        );
    }
}
