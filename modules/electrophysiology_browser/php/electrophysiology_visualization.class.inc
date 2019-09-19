<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the electrophysiology browser menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     intralizee <alizee.wickenheiser@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\electrophysiology_browser;

/**
 * This class implements electrophysiology visualization.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     intralizee <alizee.wickenheiser@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Electrophysiology_Visualization extends \NDB_Form
{

    public $skipTemplate = true; // stops from looking for a smarty template

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user hass access
     */
    function _hasAccess(\User $user): bool
    {
        $user = \NDB_Factory::singleton()->user();

        $timePoint = \NDB_Factory::singleton()->timepoint(
            intval($_REQUEST['sessionID'])
        );

        return ($user->hasPermission('electrophysiology_browser_view_allsites')
            || ((in_array(
                $timePoint->getData('CenterID'),
                $user->getData('CenterIDs')
            ))
            && $user->hasPermission('electrophysiology_browser_view_site')
             )
        );
    }

    /**
     * Get js Dependencies
     *
     * @return array
     */
    function getJSDependencies()
    {
        $depends = parent::getJSDependencies();
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = array_merge(
            $depends,
            array(
             $baseurl . '/electrophysiology/js/electrophysiology_visualization.js',
            )
        );

        return $depends;
    }

}