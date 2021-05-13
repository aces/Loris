<?php
declare(strict_types=1);

namespace LORIS\dictionary;

use \Psr\Http\Message\ServerRequestInterface;

/**
 * Handle the main index page of the dictionary module
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

class Dictionary extends \DataFrameworkMenu
{
    protected array $modules;
    protected array $categories;
    protected array $categoryitems;

    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('data_dict_view') ||
                $user->hasPermission('data_dict_edit'));
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
     * Returns a list of instruments to use as the "Source From"
     * filter options
     *
     * @return array Dynamic field options
     */
    public function getFieldOptions() : array
    {
        $amodules = [];
        foreach ($this->modules as $module) {
            $amodules[$module->getName()] = $module->getLongName();
        }
        return [
            'modules'    => $amodules,
            'categories' => $this->categories,
        ];
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new DataDictRowProvisioner(
            $this->lorisinstance,
            $this->categoryitems
        );
    }

    /**
     * Include the column formatter required to make the content editable in
     * the datadict menu
     *
     * @return array of javascript to be inserted
     **/
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/dictionary/js/dataDictIndex.js",
            ]
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb('Data Dictionary', "/$this->name")
        );
    }

    /**
     * The datadict module does not have any concept of a project.
     *
     * @return bool
     */
    public function useProjectFilter() : bool
    {
        return false;
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getDataProvisionerWithFilters() : \LORIS\Data\Provisioner
    {
        return parent::getDataProvisionerWithFilters()
            ->filter(new \LORIS\Data\Filters\AccessibleResourceFilter());
    }

    /**
     * {@inheritDoc}
     *
     * @param \User                  $user    The user this request is for
     * @param ServerRequestInterface $request The PSR7 request
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {
        $this->lorisinstance = $request->getAttribute("loris");

        assert($this->Module instanceof Module);
        $modulesandcats = $this->Module->getUserModuleCategories(
            $user,
            $this->lorisinstance,
        );

        $this->categoryitems = $modulesandcats['CategoryItems'];
        $this->modules       = $modulesandcats['Modules'];
        $this->categories    = $modulesandcats['Categories'];
    }
}
