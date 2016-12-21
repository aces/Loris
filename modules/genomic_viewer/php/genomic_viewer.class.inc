<?php

/**
 * This class manage the acces and provide the files use by the browser
 *
 * PHP Version 5
 *
 * @category Epigenomics
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\genomic_viewer;

/**
 * Provides the PHP code for the genomic viewer
 *
 * @category Epigenomics
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Genomic_Viewer extends \NDB_Page
{

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        $user = \User::singleton();
        return $user->hasPermission('genomic_browser_view_allsites')
               || $user->hasPermission('genomic_browser_view_site');
    }

    /**
     * Include additional CSS files
     *
     * @return array of css to be included
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/genomic_viewer/css/box.css")
        );
    }

    /**
     * Overrides base getJSDependencies() to add
     *
     * @return an array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/js/d3.min.js",
             $baseURL . "/genomic_viewer/js/box.js",
             $baseURL . "/genomic_viewer/js/genomic_viewer_app.js",
            )
        );
    }
}
?>
