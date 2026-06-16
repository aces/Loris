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
        switch ($type) {
        case 'study-progression':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();

            $query   = "SELECT
                    Project.ProjectID,
                    COUNT(ppf.PhysiologicalFileID) AS count,
                    CONCAT(
                        '$baseURL/electrophysiology_browser/?project=',
                        Project.Name
                    ) AS url,
                    Project.Name AS ProjectName
                FROM physiological_parameter_file ppf
                LEFT JOIN physiological_file pf
                    USING (PhysiologicalFileID)
                LEFT JOIN physiological_output_type pot
                    USING (PhysiologicalOutputTypeID)
                LEFT JOIN Project
                    ON ppf.ProjectID = Project.ProjectID
                LEFT JOIN session s
                    ON pf.SessionID = s.ID
                WHERE ParameterTypeID = (
                    SELECT ParameterTypeID
                    FROM parameter_type
                    WHERE Name = 'RecordingDuration'
                )
                AND Project.showSummaryOnLogin = 1";
            $params = [];

            if (!$user->hasPermission('electrophysiology_browser_view_allsites')) {
                $siteIDs    = array_map(
                    fn($centerID) => (string)$centerID,
                    $user->getCenterIDs()
                );
                $projectIDs = array_map(
                    fn($projectID) => (string)$projectID,
                    $user->getProjectIDs()
                );

                if (count($siteIDs) === 0 || count($projectIDs) === 0) {
                    return [];
                }

                $sitePlaceholders = [];
                foreach ($siteIDs as $index => $siteID) {
                    $placeholder          = "site$index";
                    $sitePlaceholders[]   = ':' . $placeholder;
                    $params[$placeholder] = $siteID;
                }

                $projectPlaceholders = [];
                foreach ($projectIDs as $index => $projectID) {
                    $placeholder           = "project$index";
                    $projectPlaceholders[] = ':' . $placeholder;
                    $params[$placeholder]  = $projectID;
                }

                $query .= "
                AND s.CenterID IN (" . implode(', ', $sitePlaceholders) . ")
                AND Project.ProjectID IN ("
                    . implode(', ', $projectPlaceholders)
                    . ")";
            }

            $query .= "
                GROUP BY Project.ProjectID, Project.Name";

            $data = $DB->pselectWithIndexKey(
                $query,
                $params,
                'ProjectID'
            );

            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "electrophysiology_browser",
                        "EEG Recording",
                        "EEG Recordings"
                    ),
                    $data,
                    "",
                    'rgb(255, 224, 171)',
                )
            ];
        }

        return [];
    }
}
