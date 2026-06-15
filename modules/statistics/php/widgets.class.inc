<?php declare(strict_types=1);

namespace LORIS\statistics;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * The Widgets Class.
 *
 * This class provides the php code to retrieve the statistics
 * for recruitment and study progression data.
 *
 * @category Loris
 * @package  Statistics
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Widgets extends \NDB_Page implements ETagCalculator
{
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * The handle function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            $this->_cache = $this->_handleGET($request);
            break;
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
        return $this->_cache;
    }

    /**
     * Handles the retrieval of statistical data for the request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request)
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }
        $factory   = \NDB_Factory::singleton();
        $config    = $factory->config();
        $db        = $request->getAttribute('loris')->getDatabaseConnection();
        $user      = $factory->user();
        $projects  = $user->getProjectIDs();
        $centerIDs = $user->getCenterIDs();
        $recruitmentTarget = $config->getSetting('recruitmentTarget');

        $projectString = "('".implode("','", array_map('strval', $projects))."')";
        $centerString  = "('".implode("','", array_map('strval', $centerIDs))."')";

        $recruitmentRaw     = iterator_to_array(
            $db->pselect(
                "SELECT
                COUNT(*) as Count,
                c.Sex as Sex,
                s.Name as SexLabel,
                s.Colour as Colour,
                c.RegistrationProjectID as ProjectID
             FROM candidate c
                 LEFT JOIN sex s ON s.Name=c.Sex
                 WHERE c.Active='Y' AND c.Entity_type='Human'
                 AND c.RegistrationProjectID IN $projectString
                 AND c.RegistrationCenterID IN $centerString
             GROUP BY c.Sex, s.Name, s.Colour, c.RegistrationProjectID",
                []
            )
        );
        $total_participants = array_sum(array_column($recruitmentRaw, 'Count'));
        $totalScans         = $db->pselectOne(
            "SELECT COUNT(distinct s.ID)
                FROM files f
                LEFT JOIN parameter_file pf USING (FileID)
                LEFT JOIN session s ON (s.ID=f.SessionID)
                JOIN parameter_type pt USING (ParameterTypeID)
                WHERE pt.Name='acquisition_date'
                AND s.ProjectID IN {$projectString}
                AND s.CenterID IN {$centerString}",
            []
        );
        $recruitment        = [
            'overall' => $this->_createProjectProgressBar(
                'overall',
                dgettext("statistics", "Overall Recruitment"),
                $recruitmentTarget,
                $total_participants,
                $recruitmentRaw,
            )
        ];

        $projectOptions     = [];
        $cohortOptions      = [];
        $visitOptions       = [];
        $recruitmentCohorts = [];
        $sites = \Utility::getSiteList();

        $studyWidgets = $this->_collectStudyProgressionWidgets($user);
        $studyProgressionProjects = $this->_createStudyProgressionProjects(
            $projects,
            $config,
            $studyWidgets
        );

        foreach ($projects as $pid) {
            // Set project recruitment data
            $projectInfo = $config->getProjectSettings(intval(strval($pid)));
            $projectOptions[intval(strval($pid))] = $projectInfo['Name'] ?? "";
            if (is_null($projectInfo)) {
                throw new \LorisException(
                    'No project settings exist in the Database for ' .
                    'project ID ' . intval(strval($pid))
                );
            }
            $recruitment[intval(strval($pid))] = $this->_createProjectProgressBar(
                strval($pid),
                $projectInfo['Name'],
                $projectInfo['recruitmentTarget'],
                $this->getTotalRecruitmentByProject(
                    $recruitmentRaw,
                    $pid
                ),
                $recruitmentRaw
            );
            // Set cohort recruitment data
            $centerList  = "'" . implode("','", $centerIDs) . "'";
            $projectList = "'" . implode("','", $projects) . "'";
            $cohortsRaw  = $db->pselectWithIndexKey(
                "SELECT
                COUNT(DISTINCT s.CandidateID) as Count,
                s.CohortID, co.Title, co.RecruitmentTarget
                FROM session s JOIN candidate c
                        ON (s.CandidateID=c.ID)
                JOIN cohort co ON (s.CohortID=co.CohortID)
                WHERE s.CenterID IN ({$centerList})
                AND s.ProjectID IN ({$projectList})
                AND c.RegistrationCenterID <> 1
                GROUP BY s.CohortID",
                [],
                'CohortID'
            );
            foreach ($cohortsRaw AS $sp) {
                $title = dgettext("cohort", $sp['Title']);
                $cohortOptions[$sp["CohortID"]]      = $title;
                $recruitmentCohorts[$sp["CohortID"]]
                    = $this->_createCohortProgressBar(
                        $sp["CohortID"],
                        $title,
                        $sp["RecruitmentTarget"],
                        $db,
                        $sp["Count"]
                    );
                $cohortVisits = \Utility::getVisitsForCohort(
                    intval($sp["CohortID"])
                );
                foreach ($cohortVisits as $visitLabel => $visitName) {
                    // get visit id
                    $visitOptions[$visitLabel] = dgettext("visit", $visitName);
                }
            }
        }

        $siteOptions = [];
        foreach ($centerIDs as $center) {
            if (array_key_exists($center->__toString(), $sites)) {
                $siteOptions[$center->__toString()] = $sites[$center->__toString()];
            }
        }

        $participantStatusOptions
            = \Candidate::getParticipantStatusOptions();

        $options = [
            'projects'          => $projectOptions,
            'cohorts'           => $cohortOptions,
            'sites'             => $siteOptions,
            'visits'            => $visitOptions,
            'participantStatus' => $participantStatusOptions,
        ];
        $values  = [];
        // Used for the react widget recruitment.js
        $values['recruitment'] = $recruitment;
        // Used for the react widget studyprogression.js
        $values['studyprogression']   = [
            'total_scans'     => $totalScans,
            'recruitment'     => $recruitment,
            'progressionData' => $studyProgressionProjects,
        ];
        $values['options']            = $options;
        $values['recruitmentcohorts'] = $recruitmentCohorts;

        $this->_cache = new \LORIS\Http\Response\JsonResponse($values);

        return $this->_cache;
    }

    /**
     * Generates the template data for a progress bar.
     *
     * @param $ID                The name of the progress bar being
     *                           created.
     * @param $title             The title to add to the template variables.
     * @param $recruitmentTarget The target for this recruitment type.
     * @param $db                The database connection to get data from.
     * @param $totalRecruitment  The total number of candidates of all
     *
     * @return array Smarty template data
     */
    private function _createCohortProgressBar(
        $ID,
        $title,
        $recruitmentTarget,
        \Database $db,
        $totalRecruitment
    ) {
        $totalRecruitment  = intval($totalRecruitment);
        $recruitmentTarget = intval($recruitmentTarget ?: $totalRecruitment);

        $rv = [
            'total_recruitment' => $totalRecruitment,
            'title'             => $title,
        ];

        $rv['recruitment_target'] = $recruitmentTarget;
        if ($totalRecruitment >= $recruitmentTarget) {
            $rv['surpassed_recruitment'] = "true";
        }
        $rv['sex_breakdown'] = $this->_formatSexBreakdown(
            $this->_getSexBreakdownByCohort($db, intval($ID)),
            $recruitmentTarget,
            $totalRecruitment
        );
        return $rv;
    }

    /**
     * Gets the grouped sex breakdown associated with a specific cohort.
     *
     * @param \Database $DB       A database connection to retrieve information
     *                            from.
     * @param int       $cohortID Cohort ID
     *
     * @return array<int, array<string, mixed>>
     */
    private function _getSexBreakdownByCohort(\Database $DB, int $cohortID) : array
    {

        $user        = \User::singleton();
        $projectIDs  = $user->getProjectIDs();
        $projectList = "'" . implode("','", $projectIDs) . "'";
        $centerIDs   = $user->getCenterIDs();
        $centerList  = "'" . implode("','", $centerIDs) . "'";

        return iterator_to_array(
            $DB->pselect(
                "SELECT COUNT(DISTINCT s.CandidateID) as Count,
                    c.Sex as Sex,
                    sx.Name as SexLabel,
                    sx.Colour as Colour
                FROM session s
                JOIN candidate c ON (c.ID=s.CandidateID)
                LEFT JOIN sex sx ON sx.Name=c.Sex
                WHERE CohortID=:sid
                AND CenterID IN ({$centerList})
                AND ProjectID IN ({$projectList})
                AND c.RegistrationCenterID <> 1
                GROUP BY c.Sex, sx.Name, sx.Colour",
                ['sid' => $cohortID]
            )
        );
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @param \Database $DB The database connection to get the count from.
     *
     * @return int
     */
    private function _getTotalRecruitment(\Database $DB): int
    {
        return $DB->pselectOneInt(
            "SELECT COUNT(*) FROM candidate c
             WHERE c.Active='Y' AND c.Entity_type='Human'
             AND c.RegistrationCenterID <> 1",
            []
        ) ?? 0;
    }

    /**
     * Generates the template data for a progress bar.
     *
     * @param string $ID                The name of the progress bar being
     *                                  created.
     * @param string $title             The title to add to the template
     *                                  variables.
     * @param int    $recruitmentTarget The target for this recruitment type.
     * @param int    $totalRecruitment  The total number of candidates of all
     *                                  types.
     * @param array  $rawData           The raw data from the database
     *
     * @return array Smarty template data
     */
    private function _createProjectProgressBar(
        $ID,
        $title,
        $recruitmentTarget,
        $totalRecruitment,
        $rawData
    ): array {
        $totalRecruitment  = intval($totalRecruitment);
        $recruitmentTarget = intval($recruitmentTarget);

        $rv = [
            'total_recruitment' => $totalRecruitment,
            'title'             => $title,
        ];
        if ($recruitmentTarget === 0) {
            return $rv;
        }

        $rv['recruitment_target'] = $recruitmentTarget;
        $filteredRaw = $ID == 'overall'
            ? $rawData
            : $this->_getSexBreakdownByProject($rawData, intval(strval($ID)));
        if ($totalRecruitment > $recruitmentTarget) {
            $rv['surpassed_recruitment'] = "true";
        }
        $rv['sex_breakdown'] = $this->_formatSexBreakdown(
            $filteredRaw,
            $recruitmentTarget,
            $totalRecruitment
        );
        return $rv;
    }

    /**
     * Formats grouped sex data for progress bars.
     *
     * @param array $raw               Grouped sex data.
     * @param int   $recruitmentTarget Target recruitment count.
     * @param int   $totalRecruitment  Total recruitment count.
     *
     * @return array<int, array<string, int|string|null>>
     */
    private function _formatSexBreakdown(
        array $raw,
        int $recruitmentTarget,
        int $totalRecruitment
    ) : array {
        $aggregatedBreakdown = [];
        foreach ($raw as $row) {
            $sexValue = is_string($row['Sex'] ?? null) ? trim($row['Sex']) : '';
            $label    = is_string($row['SexLabel'] ?? null)
                && trim($row['SexLabel']) !== ''
                ? trim($row['SexLabel'])
                : $sexValue;
            $key      = $this->_normalizeSexKey($sexValue);
            $count    = intval($row['Count'] ?? 0);
            if (!isset($aggregatedBreakdown[$key])) {
                $aggregatedBreakdown[$key] = [
                    'key'    => $key,
                    'label'  => $label !== '' ? $label : $key,
                    'colour' => is_string($row['Colour'] ?? null)
                        && trim($row['Colour']) !== ''
                        ? trim($row['Colour'])
                        : '#000000',
                    'total'  => 0,
                ];
            }
            $aggregatedBreakdown[$key]['total'] += $count;
        }

        $breakdown = [];
        foreach ($aggregatedBreakdown as $item) {
            $count = intval($item['total']);
            $breakdown[] = [
                'key'            => $item['key'],
                'label'          => $item['label'],
                'colour'         => $item['colour'],
                'total'          => $count,
                'target_percent' => $recruitmentTarget > 0
                    ? round($count / $recruitmentTarget * 100)
                    : null,
                'full_percent'   => $totalRecruitment > 0
                    ? round($count / $totalRecruitment * 100)
                    : null,
            ];
        }
        return $breakdown;
    }

    /**
     * Normalize a sex value into a stable key for frontend datasets.
     *
     * @param string $sexValue Raw sex value.
     *
     * @return string
     */
    private function _normalizeSexKey(string $sexValue) : string
    {
        $normalized = strtolower(trim($sexValue));
        $normalized = preg_replace('/[^a-z0-9]+/', '_', $normalized) ?? '';
        $normalized = trim($normalized, '_');
        return $normalized !== '' ? $normalized : 'unknown';
    }

    /**
     * Gets the grouped sex breakdown associated with a specific project.
     *
     * @param array $raw       The raw data returned from the SQL query.
     * @param int   $projectID Project ID.
     *
     * @return array<int, array<string, mixed>>
     */
    private function _getSexBreakdownByProject(array $raw, int $projectID) : array
    {
        $filtered = [];
        foreach ($raw as $row) {
            if (intval($row['ProjectID']) === $projectID) {
                $filtered[] = $row;
            }
        }
        return $filtered;
    }

    /**
     * Gets the total count of candidates associated with a specific project.
     *
     * @param array      $data      The raw data returned from the SQL query.
     * @param \ProjectID $projectID The Project ID to get recruitment for.
     *
     * @return int
     */
    function getTotalRecruitmentByProject(array $data, \ProjectID $projectID): int
    {
        $sum = 0;
        foreach ($data as $row) {
            if ($row['ProjectID'] == strval($projectID)) {
                $sum += intval($row['Count']);
            }
        }
        return $sum;
    }

    /**
     * Collects study progression widgets from all active modules.
     *
     * @param \User $user The current user
     *
     * @return array Collected study widgets data
     */
    private function _collectStudyProgressionWidgets(\User $user): array
    {
        $modules      = $this->loris->getActiveModules();
        $studyWidgets = [];

        foreach ($modules as $module) {
            $moduleWidgets = $module->getWidgets('study-progression', $user, []);

            foreach ($moduleWidgets as $widget) {
                if (!($widget instanceof \LORIS\dashboard\DataWidget)) {
                    continue;
                }

                $widgetData = [
                    ...$widget->data(),
                    "colour" => $widget->colour(),
                    "ref"    => $widget,
                ];

                // Remove URLs if user doesn't have access to the module
                if (!$module->hasAccess($user)) {
                    $widgetData = $this->_removeUrlsFromWidgetData($widgetData);
                }

                $studyWidgets[$widget->label()->getN(1)] = $widgetData;
            }
        }

        return $studyWidgets;
    }

    /**
     * Removes URLs from widget data for unauthorized access.
     *
     * @param array $widgetData The widget data to process
     *
     * @return array Widget data with URLs removed
     */
    private function _removeUrlsFromWidgetData(array $widgetData): array
    {
        foreach ($widgetData as $key => $value) {
            if (isset($value['url'])) {
                $widgetData[$key]['url'] = null;
            }
        }
        return $widgetData;
    }

    /**
     * Creates study progression data for all projects.
     *
     * @param array       $projects     Array of project IDs
     * @param \NDB_Config $config       Configuration object
     * @param array       $studyWidgets Collected study widgets
     *
     * @return array Study progression data organized by project
     */
    private function _createStudyProgressionProjects(
        array $projects,
        \NDB_Config $config,
        array $studyWidgets
    ): array {
        $studyProgressionProjects = [];

        foreach ($projects as $pid) {
            $projectInfo = $config->getProjectSettings(intval(strval($pid)));
            if (is_null($projectInfo)) {
                continue;
            }

            $studyProgressionProjects[$projectInfo['Name']]
                = $this->_createProjectSummary(strval($pid), $studyWidgets);
        }

        return $this->_sortProjectsByPopularity($studyProgressionProjects);
    }

    /**
     * Sorts project progression data by the most common statistic titles.
     *
     * @param array $projects The project data to sort
     *
     * @return array Sorted project data
     */
    private function _sortProjectsByPopularity(array $projects): array
    {
        $statisticCounts = $this->_calculateStatisticCounts($projects);

        foreach ($projects as &$projectData) {
            usort(
                $projectData,
                function ($a, $b) use ($statisticCounts) {
                    return ($statisticCounts[$b['title']] ?? 0)
                        - ($statisticCounts[$a['title']] ?? 0);
                }
            );
        }

        return $projects;
    }

    /**
     * Calculates how many times each statistic title appears across projects.
     *
     * @param array $studyProgressionProjects The project data
     *
     * @return array Count of each statistic title
     */
    private function _calculateStatisticCounts(
        array $studyProgressionProjects
    ): array {
        $statisticCounts = [];

        foreach ($studyProgressionProjects as $projectData) {
            foreach ($projectData as $data) {
                $title = $data['title'];
                $statisticCounts[$title] = ($statisticCounts[$title] ?? 0) + 1;
            }
        }

        return $statisticCounts;
    }

    /**
     * Generates the template data for a project summary.
     *
     * @param string $projectID The project ID being processed
     * @param array  $widgets   The collected study widgets
     *
     * @return array Data for the project summary
     */
    private function _createProjectSummary(string $projectID, array $widgets): array
    {
        $projectData = [];

        foreach ($widgets as $widgetConfig) {
            // Search through numeric indices for matching ProjectID
            foreach ($widgetConfig as $value) {
                if (is_array($value)
                    && isset($value['ProjectID'])
                    && strval($value['ProjectID']) === $projectID
                ) {
                    $title = $widgetConfig['ref']->label()->getN($value['count']);

                    $projectData[] = [
                        'title'  => $title,
                        'url'    => $value['url'] ?? null,
                        'colour' => $widgetConfig['colour'] ?? null,
                        'count'  => $value['count'] ?? 0
                    ];
                    break;
                }
            }
        }

        return $projectData;
    }

    /**
     * The ETagCalculator provides the ability to calculate
     * an ETag for an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint.
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return ['GET'];
    }
}
