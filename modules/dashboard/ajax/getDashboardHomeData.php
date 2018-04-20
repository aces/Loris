<?php
/**
 * This file is used by the Dashboard to get the data for
 * the dashboard home page
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

header('Content-Type: application/json');
$result = array(
           "username"                 => getUsername(),
           "lastlogin"                => getLastLogin(),
           "description"              => getDescription(),
           "links"                    => getLinks(),
           "recruitment"              => getRecruitment(),
           "useProject"               => getUseProject(),
           "totalScans"               => getTotalScans(),
           "tasks"                    => getTasks(),
           "docRepoNotifications"     => getDocRepoNotifications(),
           "bvlFeedbackNotifications" => getBVLFeedbackNotifications(),
          );
echo json_encode($result);

/**
 * GetUsername
 *
 * @return string
 */
function getUsername()
{
    $user = User::singleton();

    return $user->getFullname();
}

/**
 * GetLastLogin
 *
 * @return string
 */
function getLastLogin()
{
    $DB     = Database::singleton();
    $user   = User::singleton();
    $userID = $user->getUsername();

    $lastLogin = $DB->pselectOne(
        "SELECT MAX(Login_timestamp)
         FROM user_login_history
         WHERE Login_timestamp < (SELECT MAX(Login_timestamp)
            FROM user_login_history
            WHERE userID=:UserID AND Success='Y')
         AND userID=:UserID AND Success='Y'",
        array('UserID' => $userID)
    );

    if ($lastLogin) {
        return $lastLogin;
    }
    return "...never. Welcome!";
}

/**
 * GetDescription
 *
 * @return string
 */
function getDescription()
{
    $config = NDB_Config::singleton();

    return $config->getSetting('projectDescription');
}

/**
 * GetLinks
 *
 * @return array
 */
function getLinks()
{
    $config = NDB_Config::singleton();

    $dashboardLinks = $config->getExternalLinks('dashboard');

    if (!empty($dashboardLinks)) {
        $dashboardLinkArray = array();
        foreach ($dashboardLinks as $text => $url) {
            $dashboardLinkArray[] = array(
                                     'url'        => $url,
                                     'label'      => $text,
                                     'windowName' => md5($url),
                                    );
        }
        return $dashboardLinkArray;
    }

    return null;
}

/**
 * GetRecruitment
 *
 * @return array
 */
function getRecruitment()
{
    $config = NDB_Config::singleton();

    $recruitment = array();

    $recruitment['overall'] = createProjectProgressBar(
        'overall',
        "Overall Recruitment",
        $config->getSetting('recruitmentTarget'),
        getTotalRecruitment()
    );

    if (getUseProject()) {
        $projects = Utility::getProjectList();
        foreach ($projects as $projectID => $project) {
            $projectInfo = $config->getProjectSettings($projectID);
            $recruitment[$projectID] = createProjectProgressBar(
                $projectID,
                $projectInfo['Name'],
                $projectInfo['recruitmentTarget'],
                getTotalRecruitmentByProject($projectID)
            );
        }
    }

    if (empty($recruitment)) {
        return null;
    }
    return $recruitment;
}

/**
 * GetUseProject
 *
 * @return array
 */
function getUseProject()
{
    $config = NDB_Config::singleton();

    return $config->getSetting('useProjects');
}

/**
 * GetTotalScans
 *
 * @return int
 */
function getTotalScans()
{
    $DB = Database::singleton();

    $totalScans = $DB->pselectOne(
        "SELECT COUNT(*) FROM files f
         LEFT JOIN session s ON (s.ID=f.SessionID)
         LEFT JOIN candidate c ON (s.CandID=c.CandID)
         WHERE s.Active='Y' AND c.Active='Y'
         AND s.CenterID <> 1",
        array()
    );

    return $totalScans;
}

/**
 * GetTasks
 *
 * @return array
 */
function getTasks()
{
    $tasks = array();

    $newScans           = getNewScans();
    $dataEntryConflicts = getDataEntryConflicts();
    $incompleteForms    = getIncompleteForms();
    $finalRadiologicalReview = getFinalRadiologicalReview();
    $accountsPendingApproval = getAccountsPendingApproval();
    $violatedScans           = getViolatedScans();
    $issueTracker            = getIssueTrackerAssignedIssues();

    if (!is_null($newScans)) {
        $tasks[] = $newScans;
    }
    if (!is_null($dataEntryConflicts)) {
        $tasks[] = $dataEntryConflicts;
    }
    if (!is_null($incompleteForms)) {
        $tasks[] = $incompleteForms;
    }
    if (!is_null($finalRadiologicalReview)) {
        $tasks[] = $finalRadiologicalReview;
    }
    if (!is_null($accountsPendingApproval)) {
        $tasks[] = $accountsPendingApproval;
    }
    if (!is_null($violatedScans)) {
        $tasks[] = $violatedScans;
    }
    if (!is_null($issueTracker)) {
        $tasks[] = $issueTracker;
    }

    if (empty($tasks)) {
        return null;
    }
    return $tasks;
}

/**
 * GetDocRepoNotifications
 *
 * @return array
 */
function getDocRepoNotifications()
{
    $user = User::singleton();
    $DB   = Database::singleton();

    if ($user->hasPermission('document_repository_view')
        || $user->hasPermission('document_repository_delete')
    ) {
        $document_repository = $DB->pselect(
            "SELECT File_name as fileName, Date_uploaded as dateUploaded,
             Data_dir as dataDir
             FROM document_repository 
             ORDER BY Date_uploaded
             DESC LIMIT 4",
            array()
        );
        for ($i=0; $i < sizeof($document_repository); $i++) {
            if ($document_repository[$i]['dateUploaded'] > getLastLogin()) {
                $document_repository[$i]['new'] = 1;
            } else {
                $document_repository[$i]['new'] = 0;
            }
        }
        return $document_repository;
    }
    return null;
}

/**
 * GetBVLFeedbackNotifications
 *
 * @return array
 */
function getBVLFeedbackNotifications()
{
    $user = User::singleton();
    $DB   = Database::singleton();

    if ($user->hasPermission('bvl_feedback')) {
        $bvl_feedback = $DB->pselect(
            "SELECT fbt.Name as name, fbe.Testdate as testDate,
             fbe.Comment as comment, fbth.FieldName, 
             fbth.CommentID, fbth.SessionID, fbth.CandID, fbth.Feedback_level
             FROM feedback_bvl_entry fbe 
             JOIN feedback_bvl_thread fbth USING (FeedbackID) 
             JOIN feedback_bvl_type fbt USING (Feedback_type)
             WHERE fbth.Status='opened' AND fbth.Active='Y'
             ORDER BY fbe.Testdate DESC LIMIT 4",
            array()
        );
        for ($i=0; $i < sizeof($bvl_feedback); $i++) {
            if ($bvl_feedback[$i]['testDate'] > getLastLogin()) {
                $bvl_feedback[$i]['new'] = 1;
            } else {
                $bvl_feedback[$i]['new'] = 0;
            }
            if ($bvl_feedback[$i]['Feedback_level'] == 'profile') {
                $bvl_feedback[$i]['URL'] = '/' . $bvl_feedback[$i]['CandID'];
            } else if ($bvl_feedback[$i]['Feedback_level'] == 'visit') {
                $bvl_feedback[$i]['URL'] = '/instrument_list/?candID='
                    . $bvl_feedback[$i]['CandID'] . '&sessionID='
                    . $bvl_feedback[$i]['SessionID'];
            } else if ($bvl_feedback[$i]['Feedback_level'] == 'instrument') {
                $instrument = $DB->pselectOne(
                    "SELECT Test_name from flag WHERE CommentID=:cid",
                    array('cid' => $bvl_feedback[$i]['CommentID'])
                );
                if (isset($instrument) && !empty($instrument)) {
                    $bvl_feedback[$i]['URL'] = '/' . $instrument . '/?candID='
                        . $bvl_feedback[$i]['CandID'] . '&sessionID='
                        . $bvl_feedback[$i]['SessionID'] . '&commentID='
                        . $bvl_feedback[$i]['CommentID'];
                } else {
                    unset($bvl_feedback[$i]);
                    $bvl_feedback = array_values($bvl_feedback);
                }
            }
        }
        return $bvl_feedback;
    }
    return null;
}

/*
 * Recruitment
 */

/**
 * GetTotalRecruitment
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
 * Creates the data for a progress bar
 *
 * @param mixed  $ID                ID for the progress bar
 * @param string $title             Title for the progress bar
 * @param int    $recruitmentTarget Target number of candidates
 * @param int    $totalRecruitment  Total number of candidates
 *
 * @return array
 */
function createProjectProgressBar($ID, $title, $recruitmentTarget, $totalRecruitment)
{
    $progressBar = array();
    $progressBar['total_recruitment'] = $totalRecruitment;
    $progressBar['title'] = $title;
    $progressBar['title'] = $title;

    if (!empty($recruitmentTarget)) {
        $progressBar['recruitment_target']
            = $recruitmentTarget;

        if ($ID == 'overall') {
            $totalFemales = getTotalGender("Female");
        } else {
            $totalFemales = getTotalGenderByProject("Female", $ID);
        }
        $progressBar['female_total']   = $totalFemales;
        $progressBar['female_percent']
            = round($totalFemales / $recruitmentTarget * 100);

        if ($ID == 'overall') {
            $totalMales = getTotalGender("Male");
        } else {
            $totalMales = getTotalGenderByProject("Male", $ID);
        }
        $progressBar['male_total']   = $totalMales;
        $progressBar['male_percent']
            = round($totalMales / $recruitmentTarget * 100);

        if ($totalRecruitment > $recruitmentTarget) {
            $progressBar['surpassed_recruitment']
                = "true";

            $progressBar['female_percent']
                = round($totalFemales / $totalRecruitment * 100);

            $progressBar['male_percent']
                = round($totalMales / $totalRecruitment * 100);
        }
    }
    return $progressBar;
}

/*
 * TASKS
 */

/**
 * GetNewScans
 *
 * @return array
 */
function getNewScans()
{
    $user    = User::singleton();
    $DB      = Database::singleton();
    $config  = NDB_Config::singleton();
    $baseURL = $config->getSetting('url');
    if ($user->hasPermission('imaging_browser_qc')) {
        $count = $DB->pselectOne(
            "SELECT COUNT(DISTINCT s.ID)
             FROM files f 
             LEFT JOIN session s ON (s.ID=f.SessionID)
             LEFT JOIN candidate c ON (s.CandID=c.CandID)
             WHERE (MRIQCStatus='' OR MRIQCPending='Y')
             AND s.Active='Y' AND c.Active='Y'
             AND s.CenterID <> 1",
            array()
        );

        if ($count > 0) {
            $data = array(
                     'URL'   => $baseURL . "/imaging_browser/",
                     'count' => $count,
                     'label' => 'New and pending imaging session'.
                         ($count != 1 ? "s" : ""),
                     'site'  => "Sites: all",
                    );

            return $data;
        }
    }

    return null;
}

/**
 * GetDataEntryConflicts
 *
 * @return array
 */
function getDataEntryConflicts()
{
    $user    = User::singleton();
    $DB      = Database::singleton();
    $siteID  = $user->getCenterIDs();
    $config  = NDB_Config::singleton();
    $baseURL = $config->getSetting('url');
    if ($user->hasPermission('conflict_resolver')) {
        $count    = 0;
        $siteText = 'Sites: All User Sites';
        if ($user->hasPermission('access_all_profiles')) {
            $count    = $DB->pselectOne(
                "SELECT COUNT(*) FROM conflicts_unresolved cu
                 LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                 LEFT JOIN session s ON (flag.SessionID=s.ID)
                 LEFT JOIN candidate c ON (s.CandID=c.CandID)
                 WHERE s.CenterID <> 1
                 AND s.Active='Y' AND c.Active='Y'",
                array()
            );
            $siteText = 'Sites: all';
        } else {
            $count = $DB->pselectOne(
                "SELECT COUNT(*) FROM conflicts_unresolved cu 
                 LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                 LEFT JOIN session s ON (flag.SessionID=s.ID)
                 LEFT JOIN candidate c ON (c.CandID=s.CandID)
                 LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                 WHERE FIND_IN_SET(psc.CenterID, :siteID)
                 AND s.Active='Y' AND c.Active='Y'",
                array('siteID' => implode(',', $siteID))
            );
        }

        if ($count > 0) {
            $data = array(
                     'URL'   => $baseURL . "/conflict_resolver/",
                     'count' => $count,
                     'label' => 'Data entry conflict' . ($count != 1 ? "s" : ""),
                     'site'  => $siteText,
                    );

            return $data;
        }
    }
    return null;
}

/**
 * GetIncompleteForms
 *
 * @return array
 */
function getIncompleteForms()
{
    $user     = User::singleton();
    $DB       = Database::singleton();
    $siteIDs  = $user->getCenterIDs();
    $config   = NDB_Config::singleton();
    $baseURL  = $config->getSetting('url');
    $siteText = null;
    if ($user->hasPermission('data_entry')) {
        $count = 0;
        $url   = $baseURL . "/statistics/?submenu=statistics_site";

        if ($user->hasPermission('access_all_profiles')) {
            $count    = $DB->pselectOne(
                "SELECT COUNT(*) FROM flag
                 LEFT JOIN session s ON (s.ID=flag.SessionID)
                 LEFT JOIN candidate c ON (s.CandID=c.CandID)
                 WHERE flag.Data_entry='In Progress'
                 AND s.Active='Y' AND c.Active='Y' AND s.CenterID <> 1",
                array()
            );
            $siteText = 'Sites: all';
        } else {
            $count = $DB->pselectOne(
                "SELECT COUNT(*) FROM flag 
                 LEFT JOIN session s ON (flag.SessionID=s.ID)
                 LEFT JOIN candidate c ON (s.CandID=c.CandID)
                 LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                 WHERE Data_entry='In Progress' 
                 AND FIND_IN_SET(psc.CenterID,:siteIDs)
                 AND s.Active='Y' AND c.Active='Y'",
                array('siteIDs' => implode(',', $siteIDs))
            );

            $url = array();

            foreach ($siteIDs as $id) {
                $siteName       = $DB->pselectOne(
                    'SELECT Name 
                     FROM psc
                     WHERE CenterID=:cid',
                    array('cid' => $id)
                );
                $url[$siteName] = $baseURL . "/statistics/?submenu=
                statistics_site&CenterID=" . $id;
            }
        }

        if ($count > 0) {
            $data = array(
                     'URL'   => $url,
                     'count' => $count,
                     'label' => 'Incomplete form' . ($count != 1 ? "s" : ""),
                     'site'  => $siteText,
                    );

            return $data;
        }
    }
    return null;
}

/**
 * GetFinalRadiologicalReview
 *
 * @return array
 */
function getFinalRadiologicalReview()
{
    $user    = User::singleton();
    $DB      = Database::singleton();
    $config  = NDB_Config::singleton();
    $baseURL = $config->getSetting('url');
    if ($user->hasPermission('edit_final_radiological_review')
        && $user->hasPermission('view_final_radiological_review')
    ) {

        $count = $DB->pselectOne(
            "SELECT COUNT(*) FROM final_radiological_review f
             LEFT JOIN flag fg ON (fg.CommentID=f.CommentID)
             LEFT JOIN session s ON (s.ID=fg.SessionID)
             LEFT JOIN candidate c ON (c.CandID=s.CandID)
             WHERE Review_Done IS NULL
             AND c.Active='Y' AND s.Active='Y'",
            array()
        );

        if ($count > 0) {
            $data = array(
                     'URL'   => $baseURL . "/final_radiological_review/",
                     'count' => $count,
                     'label' => 'Final radiological review'.($count != 1 ? "s" : ""),
                     'site'  => 'Sites: all',
                    );

            return $data;
        }
    }
    return null;
}

/**
 * GetAccountsPendingApproval
 *
 * @return array
 */
function getAccountsPendingApproval()
{
    $user    = User::singleton();
    $DB      = Database::singleton();
    $config  = NDB_Config::singleton();
    $baseURL = $config->getSetting('url');

    if ($user->hasPermission('user_accounts')) {
        $count    = 0;
        $siteText = 'Sites: All User Sites';

        if ($user->hasPermission('user_accounts_multisite')) {
            $count = $DB->pselectOne(
                "SELECT COUNT(DISTINCT users.UserID) FROM users
                 LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
                 WHERE users.Pending_approval='Y'
                 AND (upr.CenterID <> 1 OR upr.CenterID IS NULL)",
                array()
            );

            $siteText = 'Sites: all';

        } else {
            $site_arr = $user->getCenterIDs();
            $count    = $DB->pselectOne(
                "SELECT COUNT(DISTINCT u.UserID) FROM users u
                 LEFT JOIN user_psc_rel as upr ON (upr.UserID=u.ID)  
                 WHERE Pending_approval='Y' AND FIND_IN_SET(upr.CenterID, :CID)",
                array('CID' => implode(',', $site_arr))
            );
        }

        if ($count > 0) {
            $data = array(
                     'URL'   => $baseURL . "/user_accounts/",
                     'count' => $count,
                     'label' => 'Account' .
                         ($count != 1 ? "s" : "") . ' pending approval',
                     'site'  => $siteText,
                    );

            return $data;
        }
    }
    return null;
}

/**
 * GetViolatedScans
 *
 * @return array
 */
function getViolatedScans()
{
    $user    = User::singleton();
    $DB      = Database::singleton();
    $config  = NDB_Config::singleton();
    $baseURL = $config->getSetting('url');

    if ($user->hasPermission('violated_scans_view_allsites')) {
        $count = $DB->pselectOne(
            "SELECT COUNT(*) FROM mri_protocol_violated_scans
             LEFT JOIN candidate c USING (CandID)
             WHERE COALESCE(c.CenterID, 0) <> 1",
            /* include null CenterIDs so we don't accidentally
            filter things out */
            array()
        );

        if ($count > 0) {
            $data = array(
                     'URL'   => $baseURL . "/mri_violations/",
                     'count' => $count,
                     'label' => 'Violated scan' . ($count != 1 ? "s" : ""),
                     'site'  => 'Sites: all',
                    );

            return $data;
        }
    }
    return null;
}

/**
 * GetIssueTrackerAssignedIssues
 *
 * @return array
 */
function getIssueTrackerAssignedIssues()
{
    $user    = User::singleton();
    $DB      = Database::singleton();
    $config  = NDB_Config::singleton();
    $baseURL = $config->getSetting('url');
    if ($user->hasPermission('issue_tracker_developer')) {
        $count = $DB->pselectOne(
            "SELECT COUNT(*) FROM issues
             WHERE status !='closed'
             AND assignee=:userID",
            array('userID' => $user->getData('UserID'))
        );

        if ($count > 0) {
            $data = array(
                     'URL'   => $baseURL . "/issue_tracker/?submenu=
                     my_issue_tracker",
                     'count' => $count,
                     'label' => 'Issue' .
                         ($count != 1 ? "s" : "") . " assigned to you",
                     'site'  => 'Site: all',
                    );

            return $data;
        }
    }
    return null;
}

?>
