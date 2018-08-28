<?php

/**
 * This class features the code for the menu portion of the LORIS
 * electrophysiology browser module.
 *
 * PHP version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */
namespace LORIS\electrophysiology_browser;
/**
 * Provides the PHP code for the menu filter for the electrophysiology browser
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */

class Electrophysiology_Session extends \NDB_Form {

    public $skipTemplate = true; // stops from looking for a smarty template

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user hass access
     */
    function _hasAccess()
    {
        $user = &\User::singleton();

        $timePoint =& \TimePoint::singleton($_REQUEST['sessionID']);

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
                $baseurl . '/electrophysiology_browser/js/eeg_session_view.js',
            )
        );
        return $depends;
    }

}
