<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Conflict_Resolver
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\conflict_resolver;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Conflict_Resolver
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
            $user->hasPermission('conflict_resolver');
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Clinical";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Conflict Resolver";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type The type of widgets to get
     * @param \User  $user The user widgets are being retrieved for.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user) : array
    {
        switch($type) {
        case 'usertasks':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "Data entry conflict",
                    $DB,
                    "SELECT COUNT(*) FROM conflicts_unresolved cu
                         LEFT JOIN flag ON (cu.CommentId1=flag.CommentID)
                         LEFT JOIN session s ON (flag.SessionID=s.ID)
                         LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE s.Active='Y' AND c.Active='Y'",
                    'access_all_profiles',
                    's.CenterID',
                    $baseURL . '/' . $this->getName()
                )
            ];
        }
        return [];
    }
}
