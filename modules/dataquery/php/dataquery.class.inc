<?php
/**
 * Data Querying Module
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Loris
 * @subpackage DQT
 * @author     Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\dataquery;

/**
 * Data Querying Module
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Loris
 * @subpackage DQT
 * @author     Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Dataquery extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Check user access permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/dataquery/js/index.js',
        ];
    }
}
