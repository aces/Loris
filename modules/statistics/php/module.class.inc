<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Statistics
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\statistics;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Statistics
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
        return parent::hasAccess($user) && $user->hasPermission('data_entry');
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Reports");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("statistics", "Statistics");
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
        case 'dashboard':
            $widget = new \LORIS\dashboard\Widget(
                new \LORIS\dashboard\WidgetContent(
                    '',
                    '',
                    '',
                ),
                new \LORIS\dashboard\WidgetDisplayProps(
                    'normal',
                    10,
                    []
                ),
                new \LORIS\dashboard\WidgetDependencies(
                    [
                        $baseURL . '/css/c3.css',
                        $baseURL . '/statistics/css/recruitment.css'
                    ],
                    [
                        $baseURL . '/statistics/js/WidgetIndex.js'
                    ],
                )
            );
            $widget->setTemplate('div.tpl');
            $widget->setTemplateVariables(['id' => 'statistics_widgets']);

            return [$widget];
        case 'study-progression':
            $DB = $factory->database();
            $cachedSizeData = json_decode(
                html_entity_decode(
                    $DB->pselectOne(
                        "SELECT Value
                      FROM cached_data
                      JOIN cached_data_type USING (CachedDataTypeID)
                      WHERE Name='projects_disk_space'",
                        []
                    ) ?? ''
                ),
                true
            );

            $data = [];

            $projects = $user->getProjects();
            if (!is_null($cachedSizeData)) {
                foreach ($projects as $project) {
                    $projectName = $project->getName();
                    if (!in_array($projectName, array_keys($cachedSizeData))) {
                        continue;
                    }

                    $datasetSize = sprintf(
                        dgettext('statistics', '%s GB'),
                        $cachedSizeData[$projectName]['total']
                    );
                    $data[]      = [
                        'ProjectID'   => $project->getId(),
                        'ProjectName' => $projectName,
                        'count'       => $datasetSize,
                        'url'         => "$baseURL/dqt",
                    ];
                }
            }

            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "dqt",
                        "Dataset Size",
                        "Dataset Size",
                    ),
                    $data,
                    "",
                    'rgb(186,225,255)',
                )
            ];
        }
        return [];
    }
}
