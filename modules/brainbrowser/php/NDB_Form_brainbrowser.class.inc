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

/**
 * Stub class for BrainBrowser module to load
 *
 * @category BrainBrowser
 * @package  LorisModules
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Form_Brainbrowser extends NDB_Form
{
    /**
     * Stub method so that LORIS doesn't throw an exception
     * about form named brainbrowser not found.
     *
     * @return none
     */
    function brainbrowser()
    {

    }
    /**
     * Everyone has access to the BrainBrowser module.
     *
     * @return boolean true if user has correct access permissions
     */
    function _hasAccess()
    {
        return true;
    }

    /**
     * Override base function to include brainbrowser javascript files
     * and dependencies
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $deps = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
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
     *  1. brainbrowser.css
     *  2. volume-viewer-demo.css
     *  3. surface-viewer-demo.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [
             $baseURL . "/brainbrowser/css/volume-viewer-demo.css",
             $baseURL . "/brainbrowser/css/brainbrowser.css",
            ]
        );
    }
}
?>
