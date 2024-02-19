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

        $DB = $this->loris->getDatabaseConnection();
        $this->tpl_data['StatsTabs'] = $DB->pselect(
            "SELECT ModuleName, SubModuleName, Description
                 FROM StatisticsTabs
                 ORDER BY OrderNo",
            []
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
            '/statistics/js/statistics.js',
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
            '/statistics/css/statistics.css',
        ];
    }
}
