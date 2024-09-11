<?php
namespace LORIS\dataquery;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
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
        $dictionary = $this->loris->getModule("dictionary");
        return parent::hasAccess($user) && $user->hasPermission('dataquery_view')
            && $dictionary->hasAccess($user);
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Reports";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Data Query Tool (Beta)";
    }

    /**
     * This module has an specification
     *
     * @return bool
     */
    public function hasAPISpecification() : bool
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
    public function getWidgets(string $type, \User $user, array $options)
    {
        switch ($type) {
        case 'dashboard':
            $baseURL        = \NDB_Factory::singleton()->settings()->getBaseURL();
            $provisioner    = (
                new Provisioners\StarredQueries($this->loris, $user)
            )->filter(
                new \LORIS\Data\Filters\AccessibleResourceFilter()
            );
            $results        = $provisioner->execute($user);
            $starredqueries = [];
            foreach ($results as $query) {
                $starredqueries[] = $query;
            }
            $widgets = [];
            if (count($starredqueries) > 0) {
                $widgets[] = new \LORIS\dashboard\Widget(
                    new \LORIS\dashboard\WidgetContent(
                        "Starred Queries",
                        $this->renderTemplate(
                            "starredwidget.tpl",
                            [
                                'baseURL'        => $baseURL,
                                'starredqueries' => $starredqueries,
                            ]
                        ),
                        ""
                    ),
                    new \LORIS\dashboard\WidgetDisplayProps("small"),
                );
            }

            $provisioner = (
                new Provisioners\StudyQueries($this->loris, 'dashboard')
            )->filter(
                new \LORIS\Data\Filters\AccessibleResourceFilter()
            );

            $results      = $provisioner->execute($user);
            $studyqueries = [];
            foreach ($results as $query) {
                $studyqueries[] = $query;

            }
            if (count($studyqueries) > 0) {
                $widgets[] = new \LORIS\dashboard\Widget(
                    new \LORIS\dashboard\WidgetContent(
                        "Study Queries",
                        $this->renderTemplate(
                            "studyquerieswidget.tpl",
                            [
                                'baseURL' => $baseURL,
                                'queries' => $studyqueries,
                            ]
                        ),
                        ""
                    ),
                    new \LORIS\dashboard\WidgetDisplayProps("small"),
                );
            }
            return $widgets;
        }
        return [];
    }
}
