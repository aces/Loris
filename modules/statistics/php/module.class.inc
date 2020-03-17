<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Statistics
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\statistics;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Statistics
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
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
        return parent::hasAccess($user) && $user->hasPermission('data_entry');
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Reports";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Statistics";
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
        switch($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $config  = $factory->config();
            $db      = $factory->database();
            $baseURL = $factory->settings()->getBaseURL();

            $recruitmentTarget = $config->getSetting('recruitmentTarget');

            $totalScans  = $this->_getTotalRecruitment($db);
            $recruitment = [
                'overall' => $this->_createProjectProgressBar(
                    'overall',
                    "Overall Recruitment",
                    $recruitmentTarget,
                    $totalScans,
                    $db,
                )
            ];

            $projects = \Utility::getProjectList();
            foreach (array_keys($projects) as $projectID) {
                $projectInfo = $config->getProjectSettings($projectID);
                if (is_null($projectInfo)) {
                    throw new \LorisException(
                        'No project settings exist in the Database for ' .
                        'project ID ' . intval($projectID)
                    );
                }
                $recruitment[$projectID] = $this->_createProjectProgressBar(
                    $projectID,
                    $projectInfo['Name'],
                    $projectInfo['recruitmentTarget'],
                    $this->getTotalRecruitmentByProject($db, $projectID),
                    $db
                );
            }

            // These are just here to avoid phpcs complaining about line length.
            $overallstring       = 'View overall recruitment';
            $sitebreakdownstring = 'View site breakdown';
            $projbreakdownstring = 'View project breakdown';

            $recpersite = 'View recruitment per site';

            return [
                new \LORIS\dashboard\Widget(
                    new \LORIS\dashboard\WidgetContent(
                        "Recruitment",
                        $this->renderTemplate(
                            "recruitment.tpl",
                            [
                                'recruitment' => $recruitment
                            ]
                        ),
                        "",
                    ),
                    new \LORIS\dashboard\WidgetDisplayProps(
                        "normal",
                        10,
                        [
                            'overall-recruitment'           => $overallstring,
                            'recruitment-site-breakdown'    => $sitebreakdownstring,
                            'recruitment-project-breakdown' => $projbreakdownstring,
                        ]
                    ),
                    new \LORIS\dashboard\WidgetDependencies(
                        [
                            $baseURL . "/css/c3.css",
                            $baseURL . "/statistics/css/recruitment.css"
                        ],
                        [
                            $baseURL. '/js/d3.min.js',
                            $baseURL . '/js/c3.min.js',
                            $baseURL . "/statistics/js/recruitment.js"
                        ],
                    )
                ),
                new \LORIS\dashboard\Widget(
                    new \LORIS\dashboard\WidgetContent(
                        "Study Progression",
                        $this->renderTemplate(
                            "studyprogression.tpl",
                            [
                                'total_scans' => $totalScans,
                                'recruitment' => $recruitment
                            ]
                        ),
                        "",
                    ),
                    new \LORIS\dashboard\WidgetDisplayProps(
                        "normal",
                        10,
                        [
                            'scan-line-chart-panel'        => 'View scans per site',
                            'recruitment-line-chart-panel' => $recpersite
                        ]
                    ),
                    new \LORIS\dashboard\WidgetDependencies(
                        [
                            $baseURL . "/css/c3.css"
                        ],
                        [
                            $baseURL . '/js/d3.min.js',
                            $baseURL . '/js/c3.min.js',
                            $baseURL . "/statistics/js/studyprogression.js"
                        ],
                    )
                )
            ];
        }
        return [];
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
        $totalRecruitment = $DB->pselectOneInt(
            "SELECT COUNT(*) FROM candidate c
             WHERE c.Active='Y' AND c.Entity_type='Human'
             AND c.RegistrationCenterID <> 1",
            []
        );
        return $totalRecruitment;
    }

    /**
     * Generates the template data for a progress bar.
     *
     * @param $ID                The name of the progress bar being
     *                           created.
     * @param $title             The title to add to the template variables.
     * @param $recruitmentTarget The target for this recruitment type.
     * @param $totalRecruitment  The total number of candidates of all types.
     * @param \Database $db                The database connection to get data from.
     *
     * @return array Smarty template data
     */
    private function _createProjectProgressBar(
        $ID,
        $title,
        $recruitmentTarget,
        $totalRecruitment,
        \Database $db
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
            $totalFemales = $this->_getTotalSex($db, "Female");
        } else {
            $totalFemales = $this->getTotalSexByProject($db, "Female", $ID);
        }
        $rv['female_total']   = $totalFemales;
        $rv['female_percent']
            = round($totalFemales / $recruitmentTarget * 100);
        if ($ID == 'overall') {
            $totalMales = $this->_getTotalSex($db, "Male");
        } else {
            $totalMales = $this->getTotalSexByProject($db, "Male", $ID);
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
     * @param \Database $db  A database connection to retrieve information
     *                       from.
     * @param string    $sex Biological sex (male or female)
     *
     * @return int
     */
    private function _getTotalSex(\Database $db, string $sex) : int
    {
        return $db->pselectOneInt(
            "SELECT COUNT(c.CandID)
            FROM candidate c
            WHERE c.Sex=:sex AND c.Active='Y' AND c.Entity_type='Human'
            AND c.RegistrationCenterID <> 1",
            ['sex' => $sex]
        );
    }

    /**
     * Gets the total count of candidates of a specific sex,
     * associated with a specific project
     *
     * @param \Database $DB        A database connection to retrieve information
     *                             from.
     * @param string    $sex       A biological sex (male or female)
     * @param int       $projectID Project ID
     *
     * @return int
     */
    function getTotalSexByProject(\Database $DB, string $sex, int $projectID) : int
    {
        return $DB->pselectOneInt(
            "SELECT COUNT(c.CandID)
            FROM candidate c
            WHERE c.Sex=:sex AND c.Active='Y' AND c.RegistrationProjectID=:PID
            AND c.Entity_type='Human' AND c.RegistrationCenterID <> 1",
            [
                'sex' => $sex,
                'PID' => $projectID,
            ]
        );
    }


    /**
     * Gets the total count of candidates associated with a specific project.
     *
     * @param \Database $db        A database connection to retrieve information
     *                             from.
     * @param int       $projectID The Project ID to get recruitment for.
     *
     * @return int
     */
    function getTotalRecruitmentByProject(\Database $db, int $projectID): int
    {
        return $db->pselectOneInt(
            "SELECT COUNT(*)
             FROM candidate c
             WHERE c.Active='Y'
              AND c.RegistrationProjectID=:PID
              AND c.Entity_type='Human'
              AND c.RegistrationCenterID <> 1",
            ['PID' => $projectID]
        );
    }
}
