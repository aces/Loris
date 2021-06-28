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
 * Displays the Genomic Browser module
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
 */
class Genomic_Browser extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Returns true if the user has permission to access
     * the Genomic Browser module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'genomic_browser_view_allsites',
                'genomic_browser_view_site'
            ]
        );
    }

    /**
     * Loads the compiled react code for the genomic_browser.
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
            [
                $baseURL . '/genomic_browser/js/genomicBrowserIndex.js',
            ]
        );
    }
}
