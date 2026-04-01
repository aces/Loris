<?php declare(strict_types=1);

/**
 * The configuration module is used to manage the configuration of Loris.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\configuration;

/**
 * Admin_Config Class
 *
 * This class is to configure the system settings
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class Cohort extends \NDB_Form
{
    /**
     * Determine whether the user has access to configure cohorts
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Loads the cohort management submodule
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $cohortList = \Utility::getCohortList();
        $cohorts    = [];
        foreach (array_keys($cohortList) as $cohortID) {
            $cohorts[$cohortID]
                = $config->getCohortSettings(intval($cohortID));
        }
        $this->tpl_data['cohorts'] = $cohorts;

        $this->tpl_data['useEDCOptions']
            = [
                '1' => 'Yes',
                '0' => 'No',
            ];
        $this->tpl_data['useDoBOptions']
            = [
                '1' => 'Yes',
                '0' => 'No',
            ];

        $this->tpl_data['WindowDifferenceOptions']
            = [
                'battery' => 'Closest Test Battery',
                'optimal' => 'Optimal Visit Window for Visit Label',
            ];
    }
}
