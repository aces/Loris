<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category Behavioural
 * @package  Loris
 * @author   Sruthy Mathew <sruthy.mathew@mcgill.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\behavioural_qc;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Loris
 * @author   Sruthy Mathew <sruthy.mathew@mcgill.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
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
            $user->hasPermission('behavioural_quality_control_view');
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Clinical");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("behavioural_qc", "Behavioural Quality Control");
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
            $DB   = $factory->database();
            $data = $DB->pselectWithIndexKey(
                "SELECT 
                            p.ProjectID,
                            COUNT(*) AS count,
                            CONCAT('$baseURL/behavioural_qc/?Project=', p.ProjectID)
                            AS url,
                            p.Name AS ProjectName
                        FROM flag f 
                        JOIN session s ON f.SessionID = s.ID 
                        JOIN Project p ON p.ProjectID = s.ProjectID
                        WHERE DataID IS NOT NULL
                        AND s.Active <> 'N' 
                        AND s.CenterID <> 1 
                        AND f.CommentID NOT LIKE 'DDE_%'
                        GROUP BY p.Name",
                [],
                'ProjectID'
            );
            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "behavioural_qc",
                        "Behavioural Session",
                        "Behavioural Sessions"
                    ),
                    $data,
                    "",
                    'rgb(252, 241, 255)'
                )
            ];
        }
        return [];
    }
}
