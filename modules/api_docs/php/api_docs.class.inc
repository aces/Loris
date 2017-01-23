<?php

/**
 * Loris api documentation module.
 *
 * PHP Version 5
 *
 * @category   Documentation
 * @package    Main
 * @subpackage API
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\api_docs;

/**
 * Provides the PHP code for the menu filter for the dicom archive
 *
 * @category   Documentation
 * @package    Main
 * @subpackage API
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class API_Docs extends \NDB_Page
{
    // Container variable for smarty
    var $tpl_data;

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        return true;
    }

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
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
             $baseURL . "/api_docs/js/object-assign-pollyfill.js",
             $baseURL . "/api_docs/js/jquery-1.8.0.min.js",
             $baseURL . "/api_docs/js/jquery.slideto.min.js",
             $baseURL . "/api_docs/js/jquery.wiggle.min.js",
             $baseURL . "/api_docs/js/jquery.ba-bbq.min.js",
             $baseURL . "/api_docs/js/handlebars-4.0.5.js",
             $baseURL . "/api_docs/js/lodash.min.js",
             $baseURL . "/api_docs/js/backbone-min.js",
             $baseURL . "/api_docs/js/swagger-ui.js",
             $baseURL . "/api_docs/js/highlight.9.1.0.pack.js",
             $baseURL . "/api_docs/js/highlight.9.1.0.pack_extended.js",
             $baseURL . "/api_docs/js/jsoneditor.min.js",
             $baseURL . "/api_docs/js/marked.js",
             $baseURL . "/api_docs/js/swagger-oauth.js",
            )
        );
    }

    /**
     * Include additional CSS files:
     *  1. instrument_builder.css
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/api_docs/css/print.css",
             $baseURL . "/api_docs/css/reset.css",
             $baseURL . "/api_docs/css/screen.css",
             $baseURL . "/api_docs/css/style.css",
             $baseURL . "/api_docs/css/typography.css",
            )
        );
    }
}
?>
