<?php declare(strict_types=1);
namespace LORIS\module_manager;

class Module_Manager extends \DataFrameworkMenu
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

    protected function getFieldOptions() : array {
        return [];

    }
    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return new ModuleManagerProvisioner();
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
                $baseURL . "/module_manager/js/modulemanager.js",
            )
        );
    }
}

