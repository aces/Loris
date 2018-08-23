<?php
/**
 * Created by IntelliJ IDEA.
 * User: intralizee
 * Date: 7/31/18
 * Time: 2:53 PM
 */

namespace LORIS\electrophysiology_browser;


class eeg_visualization extends \NDB_Form {

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
                $baseurl . '/electrophysiology/js/eeg_visualization.js',
            )
        );
        return $depends;
    }

}