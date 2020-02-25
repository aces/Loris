<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\imaging_browser;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
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
            $user->hasAnyPermission(
                [
                    'imaging_browser_view_site',
                    'imaging_browser_view_allsites',
                    'imaging_browser_phantom_allsites',
                    'imaging_browser_phantom_ownsite'
                ]
            );
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Imaging";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Imaging Browser";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        switch($type) {
        case 'usertasks':
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $baseURL = $factory->settings()->getBaseURL();

            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "New and pending imaging session",
                    $DB,
                    "SELECT COUNT(DISTINCT s.ID)
                     FROM files f
                         LEFT JOIN session s ON (s.ID=f.SessionID)
                         LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE (MRIQCStatus='' OR MRIQCPending='Y')
                         AND s.Active='Y' AND c.Active='Y'
                         AND s.CenterID <> 1",
                    'imaging_browser_view_allsites',
                    's.CenterID',
                    $baseURL . "/imaging_browser/?pendingNew=N&pendingNew=P",
                    "new-scans"
                )
            ];
        }
        return [];
    }
}
