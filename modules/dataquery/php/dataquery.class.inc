<?php declare(strict_types=1);

/**
 * Data Querying Module
 *
 * PHP Version 8
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
 * PHP Version 8
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
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        // check user permissions
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
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
            [
                $baseURL . "/dataquery/js/index.js",
            ]
        );
    }

    /**
     * Include module-specific CSS for customizing the help panel
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
            [
                $baseURL . "/dataquery/css/dataquery.css",
            ]
        );
    }
}
