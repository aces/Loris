<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
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
            new \LORIS\GUI\MenuItem(
                $category,
                sprintf(
                    dgettext("candidate_list", "New %s (Beta)"),
                    $name,
                ),
                $url . "?betaprofile=1"
            ),
        ];
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Candidate");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("candidate_list", "Access Profile");
    }

    /**
     * {@inheritDoc}
     *
     * @return bool Whether an api schema is available fro this module.
     */
    public function hasAPISpecification(): bool
    {
        return true;
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
                    ProjectID,
                    COUNT(DISTINCT PSCID) AS count,
                    CONCAT('$baseURL/candidate_list/?project=', ProjectName)
                    AS url,
                    ProjectName
                FROM (
                    SELECT
                        c.PSCID,
                        COALESCE(p.ProjectID, p2.ProjectID) AS ProjectID,
                        COALESCE(p.Name, p2.Name) AS ProjectName
                    FROM candidate c
                    LEFT JOIN session s ON s.CandidateID = c.ID
                    LEFT JOIN Project p ON p.ProjectID = s.ProjectID
                    JOIN Project p2 ON c.RegistrationProjectID = p2.ProjectID
                    WHERE c.Active <> 'N'
                    AND s.Active <> 'N'
                    AND s.CenterID <> 1
                ) AS sub
                GROUP BY ProjectID, ProjectName;",
                [],
                'ProjectID'
            );
            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "loris",
                        "Candidate",
                        "Candidates",
                    ),
                    $data,
                    "",
                    'rgb(255, 252, 199)',
                )
            ];
        }
        return [];
    }
}
