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
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();
        $db      = $request->getAttribute('loris')->getDatabaseConnection();

        $recruitmentTarget = $config->getSetting('recruitmentTarget');

        $recruitmentRaw = iterator_to_array(
            $db->pselect(
                "SELECT
                COUNT(*) as Count,
                c.Sex as Sex,
                c.RegistrationProjectID as ProjectID
             FROM candidate c
                 WHERE c.Active='Y' AND c.Entity_type='Human'
                 AND c.RegistrationCenterID <> 1
             GROUP BY c.Sex, c.RegistrationProjectID",
                []
            )
        );
        $totalScans     = array_sum(array_column($recruitmentRaw, 'Count'));
        $recruitment    = [
            'overall' => $this->_createProjectProgressBar(
                'overall',
                "Overall Recruitment",
                $recruitmentTarget,
                $totalScans,
                $recruitmentRaw,
            )
        ];

        $user     = $factory->user();
        $projects = $user->getProjectIDs();

        $projectOptions     = [];
        $cohortOptions      = [];
        $visitOptions       = [];
        $recruitmentCohorts = [];
        $centerIDs          = $user->getCenterIDs();
        $sites = \Utility::getSiteList();

        foreach ($projects as $projectID) {
            // Set project recruitment data
            $projectInfo = $config->getProjectSettings(intval(strval($projectID)));
            if (is_null($projectInfo)) {
                throw new \LorisException(
                    'No project settings exist in the Database for ' .
                    'project ID ' . intval(strval($projectID))
                );
            }
            $recruitment[intval(strval($projectID))]
                = $this->_createProjectProgressBar(
                    strval($projectID),
                    $projectInfo['Name'],
                    $projectInfo['recruitmentTarget'],
                    $this->getTotalRecruitmentByProject(
                        $recruitmentRaw,
                        $projectID
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
                $cohortOptions[$sp["CohortID"]]      = $sp["Title"];
                $recruitmentCohorts[$sp["CohortID"]]
                    = $this->_createCohortProgressBar(
                        $sp["CohortID"],
                        $sp["Title"],
                        $sp["RecruitmentTarget"],
                        $db,
                        $sp["Count"]
                    );
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
            'participantStatus' => $participantStatusOptions
        ];
        $values  = [];
        // Used for the react widget recruitment.js
        $values['recruitment'] = $recruitment;
        // Used for the react widget studyprogression.js
        $values['studyprogression']   = [
            'total_scans' => $totalScans,
            'recruitment' => $recruitment
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
        $rv = [
            'total_recruitment' => $totalRecruitment,
            'title'             => $title,
        ];

        if (empty($recruitmentTarget)) {
            $recruitmentTarget = $totalRecruitment;
        }

        $rv['recruitment_target'] = $recruitmentTarget;
        $totalFemales         = $this->getTotalSexByCohort(
            $db,
            "Female",
            intval($ID)
        );
        $rv['female_total']   = $totalFemales;
        $rv['female_percent'] = $recruitmentTarget ?
            round($totalFemales / $recruitmentTarget * 100) :
            null;
        $totalMales           = $this->getTotalSexByCohort(
            $db,
            "Male",
            intval($ID)
        );
        $rv['male_total']     = $totalMales;
        $rv['male_percent']   = $recruitmentTarget ?
            round($totalMales / $recruitmentTarget * 100) :
            null;
        if ($totalRecruitment >= $recruitmentTarget) {
            $rv['surpassed_recruitment'] = "true";
        }
        $rv['female_full_percent'] = $totalRecruitment ?
            round($totalFemales / $totalRecruitment * 100) :
            null;

        $rv['male_full_percent'] = $totalRecruitment ?
            round($totalMales / $totalRecruitment * 100) :
            null;
        return $rv;
    }

    /**
     * Gets the total count of candidates of a specific sex,
     * associated with a specific project
     *
     * @param \Database $DB       A database connection to retrieve information
     *                            from.
     * @param string    $sex      A biological sex (male or female)
     * @param int       $cohortID Cohort ID
     *
     * @return int|string
     */
    function getTotalSexByCohort(\Database $DB, string $sex, int $cohortID)
    {

        $user        = \User::singleton();
        $projectIDs  = $user->getProjectIDs();
        $projectList = "'" . implode("','", $projectIDs) . "'";
        $centerIDs   = $user->getCenterIDs();
        $centerList  = "'" . implode("','", $centerIDs) . "'";

        return intval(
            $DB->pselectOne(
                "SELECT COUNT(DISTINCT s.CandidateID)
                FROM session s
                JOIN candidate c ON (c.ID=s.CandidateID)
                WHERE CohortID=:sid
                AND CenterID IN ({$centerList})
                AND ProjectID IN ({$projectList})
                AND c.Sex=:sex
                AND c.RegistrationCenterID <> 1",
                [
                    'sex' => $sex,
                    'sid' => $cohortID
                ]
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
        $rv = [
            'total_recruitment' => $totalRecruitment,
            'title'             => $title,
        ];
        if (empty($recruitmentTarget)) {
            return $rv;
        }

        $rv['recruitment_target'] = $recruitmentTarget;
        if ($ID == 'overall') {
            $totalFemales = $this->_getTotalSex($rawData, "Female");
        } else {
            $totalFemales = $this->getTotalSexByProject(
                $rawData,
                "Female",
                intval(strval($ID))
            );
        }
        $rv['female_total']   = $totalFemales;
        $rv['female_percent']
            = round($totalFemales / $recruitmentTarget * 100);
        if ($ID == 'overall') {
            $totalMales = $this->_getTotalSex($rawData, "Male");
        } else {
            $totalMales = $this->getTotalSexByProject(
                $rawData,
                "Male",
                intval(strval($ID))
            );
        }
        $rv['male_total']   = $totalMales;
        $rv['male_percent']
            = round($totalMales / $recruitmentTarget * 100);
        if ($totalRecruitment > $recruitmentTarget) {
            $rv['surpassed_recruitment'] = "true";

            $rv['female_full_percent']
                = round($totalFemales / $totalRecruitment * 100);

            $rv['male_full_percent']
                = round($totalMales / $totalRecruitment * 100);
        }
        return $rv;
    }

    /**
     * Gets the total count of candidates of a specific sex
     *
     * @param array  $raw The raw data returned from the SQL query.
     * @param string $sex Biological sex (male or female)
     *
     * @return int
     */
    private function _getTotalSex(array $raw, string $sex) : int
    {
        $sum = 0;
        foreach ($raw as $row) {
            if ($row['Sex'] == $sex) {
                $sum += intval($row['Count']);
            }
        }
        return $sum;
    }

    /**
     * Gets the total count of candidates of a specific sex,
     * associated with a specific project
     *
     * @param array  $raw       The raw data returned from the SQL query.
     * @param string $sex       A biological sex (male or female)
     * @param int    $projectID Project ID
     *
     * @return int
     */
    function getTotalSexByProject(array $raw, string $sex, int $projectID) : int
    {
        $sum = 0;
        foreach ($raw as $row) {
            if ($row['Sex'] == $sex && $row['ProjectID'] == $projectID) {
                $sum += intval($row['Count']);
            }
        }
        return $sum;
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
