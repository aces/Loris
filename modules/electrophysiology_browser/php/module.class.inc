<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrohysiology
 * @author     Cécile Madjar <cecile.madjar2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\electrophysiology_browser;
/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electophysiology
 * @author     Cécile Madjar <cecile.madjar2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
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
                    'electrophysiology_browser_view_allsites',
                    'electrophysiology_browser_view_site'
                ]
            );
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Electrophysiology");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("electrophysiology_browser", "Electrophysiology Browser");
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
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        switch ($type) {
        case 'study-progression':
            $DB          = $factory->database();
            $sessionData = $DB->pselectWithIndexKey(
                "SELECT
                    p.ProjectID,
                    p.Name AS ProjectName,
                    COUNT(s.ID) AS count,
                    CONCAT('"
                        . $baseURL .
                        "/electrophysiology_browser/?project=', p.Name
                    ) as url
                FROM session s
                JOIN Project p ON p.ProjectID = s.ProjectID
                JOIN physiological_file pf ON pf.SessionID = s.ID
                WHERE s.Active <> 'N'
                AND s.CenterID <> 1
                GROUP BY p.Name",
                [],
                'ProjectID'
            );
            $eventData   = $DB->pselectWithIndexKey(
                "SELECT
                    p.ProjectID,
                    p.Name AS ProjectName,
                    COUNT(pte.PhysiologicalTaskEventID) AS count,
                    CONCAT('"
                . $baseURL .
                "/electrophysiology_browser/?project=', p.Name
                    ) as url
                FROM session s
                JOIN Project p ON p.ProjectID = s.ProjectID
                JOIN physiological_file pf ON pf.SessionID = s.ID
                JOIN physiological_task_event pte USING (PhysiologicalFileID)
                WHERE s.Active <> 'N'
                AND s.CenterID <> 1
                GROUP BY p.Name",
                [],
                'ProjectID'
            );
            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "dqt",
                        "EEG Session",
                        "EEG Sessions",
                    ),
                    $sessionData,
                    "",
                    'rgb(186,255,201)',
                ),
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "dqt",
                        "EEG Event",
                        "EEG Events",
                    ),
                    $eventData,
                    "",
                    'rgb(186,255,201)',
                )
            ];
        }
        return [];
    }
}
