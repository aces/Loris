<?php declare(strict_types=1);

/**
 * Policy tracker frontend page.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Admin
 * @author     Loris Team <loris.mni@bic.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\policy_tracker;

/**
 * Policy tracker frontend page.
 *
 * @category   Core
 * @package    Main
 * @subpackage Admin
 * @author     Loris Team <loris.mni@bic.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Policy_Tracker extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Include the policy tracker React entrypoint.
     *
     * @return array of JavaScript files to load
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/policy_tracker/js/policyTrackerIndex.js"]
        );
    }
}
