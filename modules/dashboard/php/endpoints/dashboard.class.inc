<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Dashboard.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Dashboard
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\dashboard\endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Page for the POST requests.
 *
 * @category Loris
 * @package  Dashboard
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Dashboard extends Endpoint implements ETagCalculator
{
    public $skipTemplate = true;
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
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $response = $this->initializeSetup();

        return new \LORIS\Http\Response\JsonResponse(
            $response
        );
    }

    /**
     * Initialize setup, building the Dashboard.
     *
     * @return array
     * @throws \LorisException
     */
    function initializeSetup() : array
    {
        // data for panels.
        $welcomeData            = array();
        $recruitmentData        = array();
        $studyProgressionData   = array();
        $myTasksData            = array();
        $documentRepositoryData = array();
        $behaviouralFeedbackData = array();

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $user    = $factory->user();
        $config  = $factory->config();
        $site    = $user->getSiteNames();

        $userID    = $user->getUsername();
        $lastLogin = $DB->pselectOne(
            "SELECT MAX(Login_timestamp)
             FROM user_login_history
             WHERE Login_timestamp < (SELECT MAX(Login_timestamp)
                FROM user_login_history
                WHERE userID=:UserID AND Success='Y')
             AND userID=:UserID AND Success='Y'",
            array('UserID' => $userID)
        );

        $siteID = $user->getCenterIDs();
        // todo user_site used with myTasks
        $myTasksData['user_site'] = $siteID;

        // Welcome panel
        // todo username used with welcome
        $welcomeData['username'] = $user->getFullname();
        if ($lastLogin) {
            // todo lastLogin used with welcome
            $welcomeData['lastLogin'] = $lastLogin;
        } else {
            // todo
            $welcomeData['lastLogin'] = '...never. Welcome!';
        }
        // todo projectDescription used with welcome
        $welcomeData['projectDescription']
            = $config->getSetting('projectDescription');
        $dashboard_links = $config->getExternalLinks('dashboard');
        if (!empty($dashboard_links)) {
            foreach ($dashboard_links as $text => $url) {
                // todo dashboard_links used with welcome
                $welcomeData['links'][]
                    = array(
                       'url'        => $url,
                       'label'      => $text,
                       'windowName' => md5($url),
                      );
            }
        }

        $recruitmentTarget = $config->getSetting('recruitmentTarget');
        $recruitmentData   = $this->createProjectProgressBar(
            'overall',
            "Overall Recruitment",
            $recruitmentTarget,
            $this->getTotalRecruitment(),
            $recruitmentData
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
            $recruitmentData = $this->createProjectProgressBar(
                $projectID,
                $projectInfo['Name'],
                $projectInfo['recruitmentTarget'],
                $this->getTotalRecruitmentByProject($projectID),
                $recruitmentData
            );
        }

        // Charts
        // todo total_scans used with recruitment
        $recruitmentData['total_scans'] = $DB->pselectOne(
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
            // todo new_scans used with myTasks
            $myTasksData['new_scans']      = $DB->pselectOne(
                "SELECT COUNT(DISTINCT s.ID)
                 FROM files f 
                 LEFT JOIN session s ON (s.ID=f.SessionID)
                 LEFT JOIN candidate c ON (s.CandID=c.CandID)
                 WHERE (MRIQCStatus='' OR MRIQCPending='Y')
                 AND s.Active='Y' AND c.Active='Y'
                 AND s.CenterID <> 1",
                array()
            );
            $myTasksData['new_scans_site'] = 'Sites: all';
        }

        // Data entry conflicts
        if ($user->hasPermission('conflict_resolver')) {
            if ($user->hasPermission('access_all_profiles')) {
                // todo conflicts used with myTasks
                $myTasksData['conflicts']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM conflicts_unresolved cu
                     LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
			         LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE s.CenterID <> 1
			         AND s.Active='Y' AND c.Active='Y'",
                    array()
                );
                $myTasksData['conflicts_site'] = 'Sites: all';
            } else {
                // todo
                $myTasksData['conflicts']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM conflicts_unresolved cu 
                     LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
		             LEFT JOIN candidate c ON (c.CandID=s.CandID)
		             LEFT JOIN Project p ON (s.ProjectID=p.ProjectID ) 
                     WHERE FIND_IN_SET(s.CenterID, :siteID) 
			            AND s.Active='Y' AND c.Active='Y'",
                    array('siteID' => implode(',', $siteID))
                );
                $myTasksData['conflicts_site'] = 'Sites: All User Sites';
            }
        }
        // Incomplete forms
        if ($user->hasPermission('data_entry')) {
            if ($user->hasPermission('access_all_profiles')) {
                $myTasksData['incomplete_forms']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM flag
			LEFT JOIN session s ON (s.ID=flag.SessionID)
			LEFT JOIN candidate c ON (s.CandID=c.CandID)
		     WHERE flag.Data_entry='In Progress'
			AND s.Active='Y' AND c.Active='Y' AND s.CenterID <> 1",
                    array()
                );
                $myTasksData['incomplete_forms_site'] = 'Sites: all';
            } else {
                $myTasksData['incomplete_forms']      = $DB->pselectOne(
                    "SELECT COUNT(*) FROM flag
                    LEFT JOIN session s ON (flag.SessionID=s.ID)
			LEFT JOIN candidate c ON (s.CandID=c.CandID)
                    LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                    WHERE Data_entry='In Progress' 
                    AND FIND_IN_SET(psc.CenterID, :siteID)
			          AND s.Active='Y' AND c.Active='Y'",
                    array('siteID' => implode(',', $siteID))
                );
                $myTasksData['incomplete_forms_site'] = $site;
            }
        }

        // Accounts pending approval
        if ($user->hasPermission('user_accounts_multisite')
            && $user->hasPermission('user_accounts')
        ) {
            $myTasksData['pending_users']      = $DB->pselectOne(
                "SELECT COUNT(DISTINCT users.UserID) FROM users 
                LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
		        WHERE users.Pending_approval='Y' 
                AND (upr.CenterID <> 1 OR upr.CenterID IS NULL)",
                array()
            );
            $myTasksData['pending_users_site'] = 'Sites: all';
        } elseif ($user->hasPermission('user_accounts')) {
            $site_arr = $user->getCenterIDs();
            $myTasksData['pending_users'] = $DB->pselectOne(
                "SELECT COUNT(DISTINCT users.UserID) FROM users 
                LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
		        WHERE users.Pending_approval='Y' AND upr.CenterID IN (:CID)",
                array('CID' => implode(",", $site_arr))
            );

            $myTasksData['pending_users_site'] = 'Sites: All User Sites';
        }

        // Violated scans
        if ($user->hasPermission('violated_scans_view_allsites')) {
            $myTasksData['violated_scans'] = $DB->pselectOne(
                "SELECT COUNT(*) FROM mri_protocol_violated_scans
			LEFT JOIN candidate c USING (CandID)
		WHERE COALESCE(c.RegistrationCenterID, 0) <> 1",
                /* include null CenterIDs so we don't accidentally
                filter things out */
                array()
            );
            $myTasksData['violated_scans_site'] = 'Sites: all';
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
                if ($document_repository[$i]['Date_uploaded'] > $lastLogin) {
                    $document_repository[$i]['new'] = 1;
                } else {
                    $document_repository[$i]['new'] = 0;
                }
            }
            $documentRepositoryData['notifications']
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
            $myTasksData['issues_assigned']
                = $issue_tracker;

            // I suppose you could also base it on your query
            if ($user->hasPermission('access_all_profiles')) {
                $myTasksData['issues_assigned_site'] = 'Sites: all';
            } else {
                $myTasksData['issues_assigned_site'] = 'Sites: All User Sites';
            }
        }

        // Behavioural Feedback Items
        if ($user->hasPermission('bvl_feedback')) {
            $bvl_feedback = $DB->pselect(
                "SELECT fbt.Name, fbe.Testdate, fbe.Comment, fbth.FieldName, 
                fbth.CommentID, fbth.SessionID, fbth.CandID, fbth.Feedback_level
                 FROM feedback_bvl_entry fbe 
                 JOIN feedback_bvl_thread fbth USING (FeedbackID) 
                 JOIN feedback_bvl_type fbt USING (Feedback_type)
                 WHERE fbth.Status='opened' AND fbth.Active='Y'
                 ORDER BY Testdate DESC LIMIT 4",
                array()
            );
            for ($i=0; $i < sizeof($bvl_feedback); $i++) {
                if ($bvl_feedback[$i]['Testdate'] > $lastLogin) {
                    $bvl_feedback[$i]['new'] = 1;
                } else {
                    $bvl_feedback[$i]['new'] = 0;
                }
                if ($bvl_feedback[$i]['Feedback_level'] === 'profile') {
                    $bvl_feedback[$i]['URL'] = '/'
                        . (string) $bvl_feedback[$i]['CandID'];
                } else if ($bvl_feedback[$i]['Feedback_level'] === 'visit') {
                    $bvl_feedback[$i]['URL'] = '/instrument_list/?candID= '
                        . (string) $bvl_feedback[$i]['CandID'] . '&sessionID='
                        . (string) $bvl_feedback[$i]['SessionID'];
                } else if ($bvl_feedback[$i]['Feedback_level'] === 'instrument') {
                    $instrument = $DB->pselectOne(
                        "SELECT Test_name from flag WHERE CommentID=:cid",
                        array('cid' => $bvl_feedback[$i]['CommentID'])
                    );
                    if (!empty($instrument)) {
                        $bvl_feedback[$i]['URL'] = '/instruments/'
                            . $instrument . '/?candID='
                            . (string) $bvl_feedback[$i]['CandID'] . '&sessionID='
                            . (string) $bvl_feedback[$i]['SessionID'] . '&commentID='
                            . (string) $bvl_feedback[$i]['CommentID'];
                    }
                }
            }
            $behaviouralFeedbackData['notifications']
                = $bvl_feedback;
        }

        if ($recruitmentData['progress']['overall']) {
            $studyProgressionData = $recruitmentData['progress']['overall'];
        }
        $studyProgressionData['total_scans'] = $recruitmentData['total_scans'];

        $values            = array();
        $values['welcome'] = $welcomeData;
        $values['recruitment']      = $recruitmentData;
        $values['studyProgression'] = $studyProgressionData;
        $values['tasks']            = $myTasksData;
        $values['documentRepository']  = $documentRepositoryData;
        $values['behaviouralFeedback'] = $behaviouralFeedbackData;

        return $values;
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @return int
     */
    function getTotalRecruitment()
    {
        $DB = \NDB_Factory::singleton()->database();
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
        $DB = \NDB_Factory::singleton()->database();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*)
             FROM candidate c
             WHERE c.Active='Y' 
              AND c.RegistrationProjectID=:PID 
              AND c.Entity_type='Human'
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
        $DB    = \NDB_Factory::singleton()->database();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Sex=:sex AND c.Active='Y' AND c.Entity_type='Human'
             AND c.RegistrationCenterID <> 1",
            array('sex' => $sex)
        );
        return intval($total);
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
        $DB    = \NDB_Factory::singleton()->database();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Sex=:sex AND c.Active='Y' AND c.RegistrationProjectID=:PID
             AND c.Entity_type='Human' AND c.RegistrationCenterID <> 1",
            array(
             'sex' => $sex,
             'PID' => $projectID,
            )
        );
        return intVal($total);
    }

    /**
     * Creates the template data for a progress bar
     *
     * @param mixed  $ID                ID for the progress bar
     * @param string $title             Title for the progress bar
     * @param int    $recruitmentTarget Target number of candidates
     * @param int    $totalRecruitment  Total number of candidates
     * @param array  $recruitmentData   Data for recruitment panel.
     *
     * @return array
     */
    function createProjectProgressBar(
        $ID, $title, $recruitmentTarget, $totalRecruitment, $recruitmentData
    ) {
        $recruitmentData['progress'][$ID]['id'] = $ID;
        $recruitmentData['progress'][$ID]['total_recruitment'] = $totalRecruitment;
        $recruitmentData['progress'][$ID]['title'] = $title;

        if (!empty($recruitmentTarget)) {
            $recruitmentData['progress'][$ID]['recruitment_target']
                = $recruitmentTarget;

            if ($ID == 'overall') {
                $totalFemales = $this->getTotalSex('Female');
            } else {
                $totalFemales = $this->getTotalSexByProject('Female', $ID);
            }
            $recruitmentData['progress'][$ID]['female_total']   = $totalFemales;
            $recruitmentData['progress'][$ID]['female_percent']
                = round($totalFemales / $recruitmentTarget * 100);

            if ($ID == 'overall') {
                $totalMales = $this->getTotalSex('Male');
            } else {
                $totalMales = $this->getTotalSexByProject('Male', $ID);
            }
            $recruitmentData['progress'][$ID]['male_total']   = $totalMales;
            $recruitmentData['progress'][$ID]['male_percent']
                = round($totalMales / $recruitmentTarget * 100);

            if ($totalRecruitment > $recruitmentTarget) {
                $recruitmentData['progress'][$ID]['surpassed_recruitment']
                    = 'true';

                $recruitmentData['progress'][$ID]['female_full_percent']
                    = round($totalFemales / $totalRecruitment * 100);

                $recruitmentData['progress'][$ID]['male_full_percent']
                    = round($totalMales / $totalRecruitment * 100);
            }
        }
        return $recruitmentData;
    }

    /**
     * Returns true if the user has permission to access
     * the Genomic Browser module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
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
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return array('GET');
    }

    /**
     * Return a list of LORIS API versions which this endpoint
     * supports.
     *
     * @return string[] LORIS API Versions
     */
    protected function supportedVersions(): array
    {
        return array('unknown');
    }
}
