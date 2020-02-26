<?php declare(strict_types=1);
/**
 * File contains the Module_Manager class.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\schedule_module;

/**
 * The Module_Manager provides the menu filter for the module manager module.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
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
        return false;
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool false
     */
    public function useProjectFilter() : bool
    {
        return false;
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
        $subprojects = array_values(\Utility::getSubProjectList());
        $TypeName = array_values(\Utility::getAppointmentTypeList());
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $appointment_types = $DB->pselect(
                "SELECT * FROM appointment_type",
                array()
            );
        $appointmentTpyes = array();
        foreach ($appointment_types as $type) {
            $appointmentTpyes[$type['AppointmentTypeID']] = $type['Name'];
        }

        return array(
            'site'       => array_combine($sites, $sites),
            'visitLabel' => array_combine($visitlabels, $visitlabels),
            'project'    => array_combine($projects, $projects),
            'subproject' => array_combine($subprojects, $subprojects),
            'AppointmentTypeName' => array_combine($TypeName, $TypeName),
            'AppointmentType' =>  $appointmentTpyes,
        );
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
            array(
                $baseURL . "/schedule_module/js/scheduleIndex.js",
            )
        );
    }
}

