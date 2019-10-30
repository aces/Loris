<?php
/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\statistics;

/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Statistics extends \NDB_Form
{
    /**
     * Checking user's permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_entry');
    }

    /**
     * Sets up page template for the tabs on the statistics page.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $DB =& \Database::singleton();
        $this->tpl_data['StatsTabs'] = $DB->pselect(
            "SELECT ModuleName, SubModuleName, Description
                 FROM StatisticsTabs
                 ORDER BY OrderNo",
            array()
        );

    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the statistics menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/statistics/js/statistics.js",
            )
        );
    }
    /**
     * Include additional CSS files:
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
            array($baseURL . "/statistics/css/statistics.css")
        );
    }
}

