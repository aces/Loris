<?php
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
class Subproject extends \NDB_Form
{
    /**
     * Determine whether the user has access to configure subprojects
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Loads the subproject management submodule
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $subprojectList = \Utility::getSubprojectList();
        $subprojects    = array();
        foreach ($subprojectList as $subprojectID => $title) {
            $subprojects[$subprojectID]
                = $config->getSubprojectSettings($subprojectID);
        }
        $this->tpl_data['subprojects'] = $subprojects;

        $this->tpl_data['useEDCOptions']
            = array(
                '1' => 'Yes',
                '0' => 'No',
            );

        $this->tpl_data['WindowDifferenceOptions']
            = array(
                'battery' => 'Closest Test Battery',
                'optimal' => 'Optimal Visit Window for Visit Label',
            );
    }
}
