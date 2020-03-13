<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\candidate_list;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(['data_entry', 'access_all_profiles']);
    }

    /**
     * The candidate_list temporarily overrides the getMenuItems link to
     * provide 2 menu items, one which links to the old timepoint_list
     * and one which links to the new candidate profile.
     *
     * @return \LORIS\GUI\MenuItem[]
     */
    public function getMenuItems() : array
    {
        $category = $this->getMenuCategory();
        $name     = $this->getLongName();

        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $url     = $baseURL . '/' . $this->getName() . '/';

        return [
            new \LORIS\GUI\MenuItem($category, $name, $url),
            new \LORIS\GUI\MenuItem($category, 'New ' . $name . ' (Beta)', $url . "?betaprofile=1"),
            ];
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Candidate";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Access Profile";
    }
}
