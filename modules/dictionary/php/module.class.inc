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
namespace LORIS\dictionary;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
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
            $user->hasAnyPermission(['data_dict_view', 'data_dict_edit']);
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Tools");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("dictionary", "Data Dictionary");
    }

    /**
     * Return a list of modules and categories that this user
     * has access to, stripping out modules that have no dictionary
     * items that the user can access.
     *
     * This should not be used outside of this module, it's only
     * to store common shared code between different endpoints and
     * must be public as a result of being used by different
     * classes.
     *
     * @param \User                $user      The user accessing the dictionary
     * @param \LORIS\LorisInstance $loris     The LorisInstance which the dictionary
     *                                        is being accessed for
     * @param ?string              $formodule An optional module name to only
     *                                        retrieve the dictionary for a single
     *                                        module with the given name
     *
     * @return array
     */
    public function getUserModuleCategories(
        \User $user,
        \LORIS\LorisInstance $loris,
        ?string $formodule=null
    ) : array {
        $modules     = $loris->getActiveModules();
        $usermodules = [];
        $categories  = [];

        $categoryitems = [];

        // Get the instruments that the user has access to based on their Projects
        $userVisits  = $user->getVisits();
        $instruments = [];
        foreach ($userVisits as $visitLabel => $_) {
            $visitInstruments = \Utility::getVisitInstruments($visitLabel);
            foreach ($visitInstruments as $testName => $fullName) {
                if (!isset($instruments[$testName])) {
                    $instruments[$testName] = $fullName;
                }
            }
        }
        foreach ($modules as $module) {
            if ($formodule !== null && $module->getName() !== $formodule) {
                continue;
            }
            if (!$module->hasAccess($user)) {
                continue;
            }

            $mdict = $module->getQueryEngine()->getDataDictionary();
            $mname = $module->getName();

            if (count($mdict) > 0) {
                $usermodules[]      = $module;
                $categories[$mname] = [];

                foreach ($mdict as $cat) {
                    if ($mname === 'instruments'
                        && !isset($instruments[$cat->getName()])
                    ) {
                        continue;
                    }
                    $categories[$mname][$cat->getName()] = $cat->getDescription();
                    $categoryitems[] = [
                        'Module'   => $module,
                        'Category' => $cat,
                    ];
                }
            }
        }
        return [
            'Modules'       => $usermodules,
            'Categories'    => $categories,
            'CategoryItems' => $categoryitems,
        ];
    }

    /**
     * Overload loadPage to delegate 'module' to 'moduledict' in order to
     * handle the URL `dictionary/module/$name`. LORIS delegates to classes
     * of the same name as the page being accessed, bt the "Module" class
     * name is already used by the Module class descriptor and can't be used
     * by the page, so we arbitrarily map "module" URLs to the "moduledict"
     * class name instead.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance that the module
     *                                    is serving.
     * @param string               $page  The name of the page within the
     *                                    module to load.
     *
     * @return \NDB_Page
     */
    public function loadPage(\Loris\LORISInstance $loris, string $page)
    {
        if ($page === 'module') {
            return $this->loadPage($loris, 'moduledict');
        }
        return parent::loadPage($loris, $page);
    }
}
