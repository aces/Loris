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

    public function getWidgets(string $type, \User $user) {
        switch($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $config = $factory->config();
            $db = $factory->database();

            $recruitmentTarget = $config->getSetting('recruitmentTarget');

            $recruitment = [
                'overall' => $this->createProjectProgressBar(
                    'overall',
                    "Overall Recruitment",
                    $recruitmentTarget,
                    $this->getTotalRecruitment($db),
                    $db,
                )
            ];

            $projects = \Utility::getProjectList();
            foreach ($projects as $projectID => $project) {
                $projectInfo = $config->getProjectSettings($projectID);
                if (is_null($projectInfo)) {
                    throw new \LorisException(
                        'No project settings exist in the Database for ' .
                        'project ID ' . intval($projectID)
                    );
                }
                $recruitment[$projectID] = $this->createProjectProgressBar(
                    $projectID,
                    $projectInfo['Name'],
                    $projectInfo['recruitmentTarget'],
                    $this->getTotalRecruitmentByProject($db, $projectID),
                    $db
                );
            }


            return [
                new \LORIS\dashboard\SmartyWidget(
                    "Recruitment",
                    $this->renderTemplate(
                        "recruitment.tpl",
                        [
                            'recruitment' => $recruitment
                        ]
                    ),
                    "normal",
                ),
                new \LORIS\dashboard\SmartyWidget(
                    "Study Progression",
                    $this->renderTemplate(
                        "studyprogression.tpl",
                        [ ]
                    ),
                    "normal",
                )
            ];
        }
        return [];
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @return int
     */
    private function getTotalRecruitment(\Database $DB)
    {
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*) FROM candidate c
             WHERE c.Active='Y' AND c.Entity_type='Human'
             AND c.RegistrationCenterID <> 1",
            array()
        );
        return $totalRecruitment;
    }

    private function createProjectProgressBar(
        $ID, $title, $recruitmentTarget, $totalRecruitment, \Database $db
    ) {
        $rv = [
            'total_recruitment' => $totalRecruitment,
            'title' => $title,
        ];
        if(empty($recruitmentTarget)) {
            return $rv;
        }

        $rv['recruitment_target'] = $recruitmentTarget;
        if ($ID == 'overall') {
            $totalFemales = $this->getTotalSex($db, "Female");
        } else {
            $totalFemales = $this->getTotalSexByProject($db, "Female", $ID);
        }
        $rv['female_total']   = $totalFemales;
        $rv['female_percent']
            = round($totalFemales / $recruitmentTarget * 100);
        if ($ID == 'overall') {
            $totalMales = $this->getTotalSex($db, "Male");
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
     * @param string $sex Biological sex (male or female)
     *
     * @return int
     */
    private function getTotalSex(\Database $db, string $sex) : int
    {
        return $db->pselectOne(
            "SELECT COUNT(c.CandID)
            FROM candidate c
            WHERE c.Sex=:sex AND c.Active='Y' AND c.Entity_type='Human'
            AND c.RegistrationCenterID <> 1",
            array('sex' => $sex)
        );
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
    function getTotalSexByProject(\Database $DB, string $sex, int $projectID) : int
    {
        return $DB->pselectOne(
            "SELECT COUNT(c.CandID)
            FROM candidate c
            WHERE c.Sex=:sex AND c.Active='Y' AND c.RegistrationProjectID=:PID
            AND c.Entity_type='Human' AND c.RegistrationCenterID <> 1",
            array(
                'sex' => $sex,
                'PID' => $projectID,
            )
        );
    }


        /**
     * Gets the total count of candidates associated with a specific project
     *
     * @param int $projectID Project ID
     *
     * @return int
     */
    function getTotalRecruitmentByProject(\Database $db, int $projectID)
    {
        return $db->pselectOne(
            "SELECT COUNT(*)
             FROM candidate c
             WHERE c.Active='Y'
              AND c.RegistrationProjectID=:PID
              AND c.Entity_type='Human'
              AND c.RegistrationCenterID <> 1",
            array('PID' => $projectID)
        );
    }
}
