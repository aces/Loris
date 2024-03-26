<?php declare(strict_types=1);
/**
 * File contains the Schedule Module class.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <wangshen.mcin@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\schedule_module;

/**
 * The Schedule Module provides the menu filter for this module.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <wangshen.mcin@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Schedule_Module extends \DataFrameworkMenu
{
    /**
     * Tells the base class that this page's provisioner can support
     * the UserSiteMatch filter.
     *
     * @return bool true
     */
    public function useSiteFilter(): bool
    {
        return true;
    }
    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool true
     */
    public function useProjectFilter() : bool
    {
        return true;
    }
    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return null;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
    {
        $sites       = array_values(\Utility::getSiteList(false));
        $visitlabels = array_values(\Utility::getVisitList());
        $projects    = array_values(\Utility::getProjectList());
        $subprojects = array_values(\Utility::getCohortList());
        $factory     = \NDB_Factory::singleton();
        $DB          = $factory->database();
        $appointment_types = $DB->pselect(
            "SELECT * FROM appointment_type",
            []
        );
        $appointmentTpyes  = [];
        foreach ($appointment_types as $type) {
            $appointmentTpyes[$type['AppointmentTypeID']] = $type['Name'];
        }

        return [
            'site'            => array_combine($sites, $sites),
            'visitLabel'      => array_combine($visitlabels, $visitlabels),
            'project'         => array_combine($projects, $projects),
            'subproject'      => array_combine($subprojects, $subprojects),
            'AppointmentType' =>  $appointmentTpyes,
            'today'           => date("Y-m-d"),
            'next30days'      => date("Y-m-d", strtotime("+30 days")),
        ];
    }
    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return new ScheduleModuleProvisioner();
    }

    /**
     * {@inheritDoc}
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/schedule_module/js/scheduleIndex.js",
            ]
        );
    }
}

