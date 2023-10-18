<?php
/**
 * Publications module class
 *
 * PHP version 8
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/mohadesz/Loris-Trunk
 */
namespace LORIS\roles;

/**
 * Module for viewing users roles.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Roles extends \DataFrameworkMenu
{
    public $AjaxModule   = true;
    public $skipTemplate = true;
    /**
     * Returns true if user has access to this page.
     *
     * You do not need to overload hasAccess() if there are no access restrictions.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'roles_view',
                    'roles_edit',
                    'roles_assign'
                ]
            );
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return ['user_accounts_multisite'];
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * UserProjectMatch filter.
     *
     * @return bool true
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
        return [];
    }

    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new RoleRowProvisioner();
    }


    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/roles/js/rolesIndex.js"]
        );
    }

    // /**
    //  * Converts the results of this menu filter to a JSON format to be retrieved
    //  * with ?format=json
    //  *
    //  * @return string json encoded string of the headers and data from this table
    //  */
    // function toJSON() : string
    // {
    //     $result = $this->toArray();
    //     // run values through htmlspecialchars decode to unescape
    //     // special chars
    //     array_walk_recursive(
    //         $result,
    //         function (&$r) {
    //             $r = htmlspecialchars_decode($r);
    //         }
    //     );
    //     $result['form'] = $this->form->form;

    //     return json_encode($result);
    // }
}

