<?php
/**
 * This is a stub class that permits Loris to load the BrainBrowser
 * module. Since BrainBrowser is implemented in Javascript on the
 * front end, it does nothing but check permissions.
 *
 * PHP Version 5
 *
 * @category BrainBrowser
 * @package  LorisModules
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\brainbrowser;
/**
 * Stub class for BrainBrowser module to load
 *
 * @category BrainBrowser
 * @package  LorisModules
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Brainbrowser extends \NDB_Page
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user hass access
     */
    function _hasAccess(\User $user) : bool
    {
        /* User has access if they have an 'all site' permission or if they are
        * part of a study site and are permitted to view their own site.
         */
        return $user->hasAnyPermission(
            array(
                'imaging_browser_view_allsites',
                'imaging_browser_phantom_allsites',
                'imaging_browser_phantom_ownsite',
            )
        )
        || (
            $user->hasStudySite()
            && $user->hasPermission('imaging_browser_view_site')
        );
    }

    /**
     * Override base function to include brainbrowser javascript files
     * and dependencies
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $deps = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/brainbrowser/js/Brainbrowser.js",
                $baseURL . "/brainbrowser/js/jquery.mousewheel.min.js",
                $baseURL . "/brainbrowser/js/three.min.js",
                $baseURL . "/brainbrowser/js/brainbrowser.volume-viewer.min.js",
                $baseURL . "/brainbrowser/js/brainbrowser.config.js",
                $baseURL . "/brainbrowser/js/brainbrowser.loris.js",
            )
        );
    }

    /**
     * Include additional CSS files:
     *  1. jQuery UI
     *  2. volume-viewer-demo.css
     *  3. brainbrowser.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/css/loris-jquery/jquery-ui-1.10.4.custom.min.css",
                $baseURL . "/brainbrowser/css/volume-viewer-demo.css",
                $baseURL . "/brainbrowser/css/brainbrowser.css",
            ]
        );
    }
}

