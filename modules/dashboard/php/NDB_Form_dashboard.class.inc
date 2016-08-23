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

class NDB_Form_Dashboard extends NDB_Form
{

    /**
     * Creates the template data for the dashboard
     *
     * @return void
     */
    function dashboard()
    {
        $DB     = Database::singleton();
        $user   = User::singleton();
        $config = NDB_Config::singleton();
        $site   = $user->getSiteName();

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

        $siteID = $user->getCenterID();
        $this->tpl_data['user_site'] = $siteID;

        // Welcome panel
        $this->tpl_data['username']            = $user->getFullname();
        $this->tpl_data['last_login']          = $last_login;
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

        $useProjects = $config->getSetting('useProjects');
        $this->tpl_data['useProjects'] = $useProjects;
        if ($useProjects == "true") {
            $projects = Utility::getProjectList();
            foreach ($projects as $projectID => $project) {
                $projectInfo = $config->getProjectSettings($projectID);
                $this->createProjectProgressBar(
                    $projectID,
                    $projectInfo['Name'],
                    $projectInfo['recruitmentTarget'],
                    $this->getTotalRecruitmentByProject($projectID)
                );
            }
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
                 LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID)
                 LEFT JOIN session s ON (s.ID=f.SessionID)
		LEFT JOIN candidate c ON (s.CandID=c.CandID)
                 WHERE fqc.QCStatus IS NULL
			AND s.Active='Y' AND c.Active='Y'
			AND s.CenterID <> 1",
                array()
            );
            $this->tpl_data['new_scans_site'] = 'Site: all';
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
                $this->tpl_data['conflicts_site'] = 'Site: all';
            } else {
                $this->tpl_data['conflicts']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM conflicts_unresolved cu 
                     LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
		             LEFT JOIN candidate c ON (c.CandID=s.CandID)
                     LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                     WHERE psc.Name=:Site
			            AND s.Active='Y' AND c.Active='Y'",
                    array('Site' => $site)
                );
                $this->tpl_data['conflicts_site'] = 'Site: ' . $site;
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
                $this->tpl_data['incomplete_forms_site'] = 'Site: all';
            } else {
                $this->tpl_data['incomplete_forms']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM flag 
                    LEFT JOIN session s ON (flag.SessionID=s.ID)
			LEFT JOIN candidate c ON (s.CandID=c.CandID)
                    LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                    WHERE Data_entry='In Progress' AND psc.Name=:Site
			          AND s.Active='Y' AND c.Active='Y'",
                    array('Site' => $site)
                );
                $this->tpl_data['incomplete_forms_site'] = 'Site: ' . $site;
            }
        }

        // Final radiological review
        if ($user->hasPermission('edit_final_radiological_review')
            && $user->hasPermission('view_final_radiological_review')
        ) {
            $this->tpl_data['radiology_review']      = $DB->pselectOne(
                "SELECT COUNT(*) FROM final_radiological_review f
			LEFT JOIN flag fg ON (fg.CommentID=f.CommentID)
			LEFT JOIN session s ON (s.ID=fg.SessionID)
			LEFT JOIN candidate c ON (c.CandID=s.CandID)
                WHERE Review_Done IS NULL
			AND c.Active='Y' AND s.Active='Y'",
                array()
            );
            $this->tpl_data['radiology_review_site'] = 'Site: all';
        }

        // Accounts pending approval
        if ($user->hasPermission('user_accounts_multisite')
            && $user->hasPermission('user_accounts')
        ) {
            $this->tpl_data['pending_users']      = $DB->pselectOne(
                "SELECT COUNT(*) FROM users
		WHERE Pending_approval='Y' AND (CenterID <> 1 OR CenterID IS NULL)",
                array()
            );
            $this->tpl_data['pending_users_site'] = 'Site: all';
        } elseif ($user->hasPermission('user_accounts')) {
            $this->tpl_data['pending_users']      = $DB->pselectOne(
                "SELECT COUNT(*) FROM users 
                 WHERE Pending_approval='Y' AND CenterID=:CID",
                array('CID' => $siteID)
            );
            $this->tpl_data['pending_users_site'] = 'Site: ' . $site;
        }

        // Violated scans
        if ($user->hasPermission('violated_scans_view_allsites')) {
            $this->tpl_data['violated_scans'] = $DB->pselectOne(
                "SELECT COUNT(*) FROM mri_protocol_violated_scans
			LEFT JOIN candidate c USING (CandID)
		WHERE COALESCE(c.CenterID, 0) <> 1",
                /* include null CenterIDs so we don't accidentally
                filter things out */
                array()
            );
            $this->tpl_data['violated_scans_site'] = 'Site: all';
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
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @return int
     */
    function getTotalRecruitment()
    {
        $DB = Database::singleton();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*) FROM candidate c
             WHERE c.Active='Y' AND c.Entity_type='Human' AND c.CenterID <> 1",
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
        $DB = Database::singleton();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*)
             FROM candidate c
             WHERE c.Active='Y' AND c.ProjectID=:PID AND c.Entity_type='Human'
             AND c.CenterID <> 1",
            array('PID' => $projectID)
        );
        return $totalRecruitment;
    }

    /**
     * Gets the total count of candidates of a specific gender
     *
     * @param string $gender gender (male or female)
     *
     * @return int
     */
    function getTotalGender($gender)
    {
        $DB    = Database::singleton();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Gender=:Gender AND c.Active='Y' AND c.Entity_type='Human'
             AND c.CenterID <> 1",
            array('Gender' => $gender)
        );
        return $total;
    }

    /**
     * Gets the total count of candidates of a specific gender,
     * associated with a specific project
     *
     * @param string $gender    gender (male or female)
     * @param int    $projectID Project ID
     *
     * @return int
     */
    function getTotalGenderByProject($gender, $projectID)
    {
        $DB    = Database::singleton();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Gender=:Gender AND c.Active='Y' AND c.ProjectID=:PID
             AND c.Entity_type='Human' AND c.CenterID <> 1",
            array(
             'Gender' => $gender,
             'PID'    => $projectID,
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
                $totalFemales = $this->getTotalGender("Female");
            } else {
                $totalFemales = $this->getTotalGenderByProject("Female", $ID);
            }
            $this->tpl_data['recruitment'][$ID]['female_total']   = $totalFemales;
            $this->tpl_data['recruitment'][$ID]['female_percent']
                = round($totalFemales / $recruitmentTarget * 100);

            if ($ID == 'overall') {
                $totalMales = $this->getTotalGender("Male");
            } else {
                $totalMales = $this->getTotalGenderByProject("Male", $ID);
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
     * Add dependency on D3 and C3 javascript libraries
     * for the pretty dashboards in the chart
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
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
}
?>
