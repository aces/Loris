<?php
/**
 * For genomic_browser class file
 * Main Genomic Browser tab
 * Displays genomic profiles - genomic data available per candidate
 * Filterable by candidate or genomic criteria.
 *
 * PHP version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser;

/**
 * Genomic_Browser: displays the Genomic Browser
 *   (tables and filters)
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
 */
class Genomic_Browser extends \NDB_Menu_Filter
{
    public $skipTemplate = true;
    var $AjaxModule      = true;

    /**
     * Add dependency on D3 and C3 javascript libraries
     * for the pretty dashboards in the chart
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . '/genomic_browser/js/genomicBrowserIndex.js',
            )
        );
    }
}

