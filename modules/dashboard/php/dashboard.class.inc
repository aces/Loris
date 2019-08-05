<?php
/**
 * Dashboard: displays recruitment and study progression charts,
 * user tasks and document repository notifications
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

namespace LORIS\dashboard;
/**
 * Dashboard: displays recruitment and study progression charts,
 * user tasks and document repository notifications
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class Dashboard extends \NDB_Form
{

    /**
     * Creates the template data for the dashboard
     *
     * @return void
     */
    function setup()
    {
        $DB     = \Database::singleton();
        $user   = \User::singleton();
        $config = \NDB_Config::singleton();
        $site   = $user->getSiteNames();

        $userID     = $user->getUsername();
        $last_login = $DB->pselectOne(
            "SELECT MAX(Login_timestamp)
             FROM user_login_history
             WHERE Login_timestamp < (SELECT MAX(Login_timestamp)
                FROM user_login_history
                WHERE userID=:UserID AND Success='Y')
             AND userID=:UserID AND Success='Y'",
            array('UserID' => $userID)
        );

        $siteID = $user->getCenterIDs();
        $this->tpl_data['user_site'] = $siteID;

        // Welcome panel
        $this->tpl_data['username'] = $user->getFullname();
        if ($last_login) {
            $this->tpl_data['last_login'] = $last_login;
        } else {
            $this->tpl_data['last_login'] = "...never. Welcome!";
        }
        $this->tpl_data['project_description']
            = $config->getSetting('projectDescription');
        $dashboard_links = $config->getExternalLinks('dashboard');
        if (!empty($dashboard_links)) {
            foreach ($dashboard_links as $text => $url) {
                $this->tpl_data['dashboard_links'][]
                    = array(
                       'url'        => $url,
                       'label'      => $text,
                       'WindowName' => md5($url),
                      );
            }
        }

        $recruitmentTarget = $config->getSetting('recruitmentTarget');
        $this->createProjectProgressBar(
            'overall',
            "Overall Recruitment",
            $recruitmentTarget,
            $this->getTotalRecruitment()
        );

        $projects = \Utility::getProjectList();
        foreach ($projects as $projectID => $project) {
            $projectInfo = $config->getProjectSettings($projectID);
            if (is_null($projectInfo)) {
                throw new \LorisException(
                    'No project settings exist in the Database for ' .
                    'project ID ' . intval($projectID)
                );
            }
            $this->createProjectProgressBar(
                $projectID,
                $projectInfo['Name'],
                $projectInfo['recruitmentTarget'],
                $this->getTotalRecruitmentByProject($projectID)
            );
        }

        // Charts
        $this->tpl_data['total_scans'] = $DB->pselectOne(
            "SELECT COUNT(*) FROM files f
		LEFT JOIN session s ON (s.ID=f.SessionID)
		LEFT JOIN candidate c ON (s.CandID=c.CandID)
		WHERE s.Active='Y' AND c.Active='Y'
			AND s.CenterID <> 1",
            array()
        );

        // Tasks

        // New scans
        if ($user->hasPermission('imaging_browser_qc')) {
            $this->tpl_data['new_scans']      = $DB->pselectOne(
                "SELECT COUNT(DISTINCT s.ID)
                 FROM files f 
                 LEFT JOIN session s ON (s.ID=f.SessionID)
                 LEFT JOIN candidate c ON (s.CandID=c.CandID)
                 WHERE (MRIQCStatus='' OR MRIQCPending='Y')
                 AND s.Active='Y' AND c.Active='Y'
                 AND s.CenterID <> 1",
                array()
            );
            $this->tpl_data['new_scans_site'] = 'Sites: all';
        }

        // Data entry conflicts
        if ($user->hasPermission('conflict_resolver')) {
            if ($user->hasPermission('access_all_profiles')) {
                $this->tpl_data['conflicts']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM conflicts_unresolved cu
                     LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
			         LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE s.CenterID <> 1
			         AND s.Active='Y' AND c.Active='Y'",
                    array()
                );
                $this->tpl_data['conflicts_site'] = 'Sites: all';
            } else {
                $this->tpl_data['conflicts']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM conflicts_unresolved cu 
                     LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
		             LEFT JOIN candidate c ON (c.CandID=s.CandID)
		             LEFT JOIN Project p ON (c.ProjectID=p.ProjectID ) 
                     WHERE FIND_IN_SET(s.CenterID, :siteID) 
			            AND s.Active='Y' AND c.Active='Y'",
                    array('siteID' => implode(',', $siteID))
                );
                $this->tpl_data['conflicts_site'] = 'Sites: All User Sites';
            }
        }
        // Incomplete forms
        if ($user->hasPermission('data_entry')) {
            if ($user->hasPermission('access_all_profiles')) {
                $this->tpl_data['incomplete_forms']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM flag
			LEFT JOIN session s ON (s.ID=flag.SessionID)
			LEFT JOIN candidate c ON (s.CandID=c.CandID)
		     WHERE flag.Data_entry='In Progress'
			AND s.Active='Y' AND c.Active='Y' AND s.CenterID <> 1",
                    array()
                );
                $this->tpl_data['incomplete_forms_site'] = 'Sites: all';
            } else {
                $this->tpl_data['incomplete_forms']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM flag
                    LEFT JOIN session s ON (flag.SessionID=s.ID)
			LEFT JOIN candidate c ON (s.CandID=c.CandID)
                    LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                    WHERE Data_entry='In Progress' 
                    AND FIND_IN_SET(psc.CenterID, :siteID)
			          AND s.Active='Y' AND c.Active='Y'",
                    array('siteID' => implode(',', $siteID))
                );
                $this->tpl_data['incomplete_forms_site'] = $site;
            }
        }

        // Accounts pending approval
        if ($user->hasPermission('user_accounts_multisite')
            && $user->hasPermission('user_accounts')
        ) {
            $this->tpl_data['pending_users']      = $DB->pselectOne(
                "SELECT COUNT(DISTINCT users.UserID) FROM users 
                LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
		        WHERE users.Pending_approval='Y' 
                AND (upr.CenterID <> 1 OR upr.CenterID IS NULL)",
                array()
            );
            $this->tpl_data['pending_users_site'] = 'Sites: all';
        } elseif ($user->hasPermission('user_accounts')) {
            $site_arr = $user->getCenterIDs();
            $this->tpl_data['pending_users'] = $DB->pselectOne(
                "SELECT COUNT(DISTINCT users.UserID) FROM users 
                LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
		        WHERE users.Pending_approval='Y' AND upr.CenterID IN (:CID)",
                array('CID' => implode(",", $site_arr))
            );

            $this->tpl_data['pending_users_site'] = 'Sites: All User Sites';
        }

        // Violated scans
        if ($user->hasPermission('violated_scans_view_allsites')) {
            $this->tpl_data['violated_scans'] = $DB->pselectOne(
                "SELECT COUNT(*) FROM mri_protocol_violated_scans
			LEFT JOIN candidate c USING (CandID)
		WHERE COALESCE(c.RegistrationCenterID, 0) <> 1",
                /* include null CenterIDs so we don't accidentally
                filter things out */
                array()
            );
            $this->tpl_data['violated_scans_site'] = 'Sites: all';
        }

        // Document Repository Items
        if ($user->hasPermission('document_repository_view')
            || $user->hasPermission('document_repository_delete')
        ) {
            $document_repository = $DB->pselect(
                "SELECT File_name, Date_uploaded, Data_dir FROM document_repository 
                 ORDER BY Date_uploaded DESC LIMIT 4",
                array()
            );
            for ($i=0; $i < sizeof($document_repository); $i++) {
                if ($document_repository[$i]['Date_uploaded'] > $last_login) {
                    $document_repository[$i]['new'] = 1;
                } else {
                    $document_repository[$i]['new'] = 0;
                }
            }
            $this->tpl_data['document_repository_notifications']
                = $document_repository;
        }

        // Issue Tracker Assigned Issues
        if ($user->hasPermission('issue_tracker_developer')) {
            $issue_tracker = $DB->pselectOne(
                "SELECT COUNT(*) FROM issues
                 WHERE status !='closed'
                 AND assignee=:userID",
                array('userID' => $user->getData('UserID'))
            );
            $this->tpl_data['issues_assigned']
                = $issue_tracker;

            // I suppose you could also base it on your query
            if ($user->hasPermission('access_all_profiles')) {
                $this->tpl_data['issues_assigned_site'] = 'Sites: all';
            } else {
                $this->tpl_data['issues_assigned_site'] = 'Sites: All User Sites';
            }
        }

        // Behavioural Feedback Items
        if ($user->hasPermission('bvl_feedback')) {
            $bvl_feedback      = $DB->pselect(
                "SELECT fbt.Name, fbe.Testdate, fbe.Comment, fbth.FieldName, 
                fbth.CommentID, fbth.SessionID, fbth.CandID, fbth.Feedback_level
                 FROM feedback_bvl_entry fbe 
                 JOIN feedback_bvl_thread fbth USING (FeedbackID) 
                 JOIN feedback_bvl_type fbt USING (Feedback_type)
                 WHERE fbth.Status='opened' AND fbth.Active='Y'
                 ORDER BY Testdate DESC LIMIT 4",
                array()
            );
            $frontend_feedback = array();
            foreach ($bvl_feedback as $row) {
                if ($row['Testdate'] > $last_login) {
                    $row['new'] = 1;
                } else {
                    $row['new'] = 0;
                }
                if ($row['Feedback_level'] === 'profile') {
                    $row['URL'] = '/' . $row['CandID'];
                } else if ($row['Feedback_level'] === 'visit') {
                    $row['URL'] = '/instrument_list/?candID='
                        . $row['CandID'] . '&sessionID='
                        . $row['SessionID'];
                } else if ($row['Feedback_level'] === 'instrument') {
                    $instrument = $DB->pselectOne(
                        "SELECT Test_name from flag WHERE CommentID=:cid",
                        array('cid' => $row['CommentID'])
                    );
                    if (!empty($instrument)) {
                        $row['URL'] = '/instruments/'
                            . $instrument . '/?candID='
                            . $row['CandID'] . '&sessionID='
                            . $row['SessionID'] . '&commentID='
                            . $row['CommentID'];
                    }
                }
                $frontend_feedback[] = $row;
            }
            $this->tpl_data['bvl_feedback_notifications']
                = $frontend_feedback;
        }
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @return int
     */
    function getTotalRecruitment()
    {
        $DB = \Database::singleton();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*) FROM candidate c
             WHERE c.Active='Y' AND c.Entity_type='Human' 
             AND c.RegistrationCenterID <> 1",
            array()
        );
        return $totalRecruitment;
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @param int $projectID Project ID
     *
     * @return int
     */
    function getTotalRecruitmentByProject($projectID)
    {
        $DB = \Database::singleton();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*)
             FROM candidate c
             WHERE c.Active='Y' AND c.ProjectID=:PID AND c.Entity_type='Human'
             AND c.RegistrationCenterID <> 1",
            array('PID' => $projectID)
        );
        return $totalRecruitment;
    }

    /**
     * Gets the total count of candidates of a specific sex
     *
     * @param string $sex Biological sex (male or female)
     *
     * @return int
     */
    function getTotalSex(string $sex) : int
    {
        $DB    = \Database::singleton();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Sex=:sex AND c.Active='Y' AND c.Entity_type='Human'
             AND c.RegistrationCenterID <> 1",
            array('sex' => $sex)
        );
        return $total;
    }

    /**
     * Gets the total count of candidates of a specific sex,
     * associated with a specific project
     *
     * @param string $sex       A biological sex (male or female)
     * @param int    $projectID Project ID
     *
     * @return int
     */
    function getTotalSexByProject(string $sex, int $projectID) : int
    {
        $DB    = \Database::singleton();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Sex=:sex AND c.Active='Y' AND c.ProjectID=:PID
             AND c.Entity_type='Human' AND c.RegistrationCenterID <> 1",
            array(
             'sex' => $sex,
             'PID' => $projectID,
            )
        );
        return $total;
    }

    /**
     * Creates the template data for a progress bar
     *
     * @param mixed  $ID                ID for the progress bar
     * @param string $title             Title for the progress bar
     * @param int    $recruitmentTarget Target number of candidates
     * @param int    $totalRecruitment  Total number of candidates
     *
     * @return void
     */
    function createProjectProgressBar(
        $ID, $title, $recruitmentTarget, $totalRecruitment
    ) {
        $this->tpl_data['recruitment'][$ID]['total_recruitment'] = $totalRecruitment;
        $this->tpl_data['recruitment'][$ID]['title'] = $title;
        $this->tpl_data['recruitment'][$ID]['title'] = $title;

        if (!empty($recruitmentTarget)) {
            $this->tpl_data['recruitment'][$ID]['recruitment_target']
                = $recruitmentTarget;

            if ($ID == 'overall') {
                $totalFemales = $this->getTotalSex("Female");
            } else {
                $totalFemales = $this->getTotalSexByProject("Female", $ID);
            }
            $this->tpl_data['recruitment'][$ID]['female_total']   = $totalFemales;
            $this->tpl_data['recruitment'][$ID]['female_percent']
                = round($totalFemales / $recruitmentTarget * 100);

            if ($ID == 'overall') {
                $totalMales = $this->getTotalSex("Male");
            } else {
                $totalMales = $this->getTotalSexByProject("Male", $ID);
            }
            $this->tpl_data['recruitment'][$ID]['male_total']   = $totalMales;
            $this->tpl_data['recruitment'][$ID]['male_percent']
                = round($totalMales / $recruitmentTarget * 100);

            if ($totalRecruitment > $recruitmentTarget) {
                $this->tpl_data['recruitment'][$ID]['surpassed_recruitment']
                    = "true";

                $this->tpl_data['recruitment'][$ID]['female_full_percent']
                    = round($totalFemales / $totalRecruitment * 100);

                $this->tpl_data['recruitment'][$ID]['male_full_percent']
                    = round($totalMales / $totalRecruitment * 100);
            }
        }
    }

    /**
     * Include additional CSS files:
     *  1. dashboard.css
     *
     * @return array of css to be included
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/dashboard/css/dashboard.css"]
        );
    }

    /**
     * Add dependency on D3 and C3 javascript libraries
     * for the pretty dashboards in the chart
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting('www');
        $baseurl = $www['url'];

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
             $baseurl . '/js/d3.min.js',
             $baseurl . '/js/c3.min.js',
             $baseurl . '/dashboard/js/dashboard-helper.js',
            )
        );

    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail();
    }
}

