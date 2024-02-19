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
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        /* User has access if they have an 'all site' permission or if they are
        * part of a study site and are permitted to view their own site.
         */
        return $user->hasAnyPermission(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_phantom_allsites',
                'imaging_browser_phantom_ownsite',
            ]
        )
        || (
            $user->hasStudySite()
            && $user->hasPermission('imaging_browser_view_site')
        );
    }

    /**
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/brainbrowser/js/Brainbrowser.js',
            '/brainbrowser/js/jquery.mousewheel.min.js',
            '/brainbrowser/js/three.min.js',
            '/brainbrowser/js/brainbrowser.volume-viewer.min.js',
            '/brainbrowser/js/brainbrowser.config.js',
            '/brainbrowser/js/brainbrowser.loris.js',
        ];
    }

    /**
     * Add CSS dependencies
     *
     * @return array The list of CSS files this page depends on
     */
    function getCSSDependencies(): array
    {
        return [
            '/css/loris-jquery/jquery-ui-1.10.4.custom.min.css',
            '/brainbrowser/css/volume-viewer-demo.css',
            '/brainbrowser/css/brainbrowser.css',
        ];
    }
}
