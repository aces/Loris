<?php declare(strict_types=1);
namespace LORIS\new_profile;

/**
 * New_profile module. This class handles the creation of new candidates from
 * the front-end of LORIS.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class New_Profile extends \NDB_Form
{
    public $skipTemplate = true;

    /**
     * Determines whether a user can access the page. The access to tied to
     * the data_entry permission.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess(\User $user) : bool
    {
        if ($user->hasStudySite() || $user->hasCenter(\CenterID::singleton(1))) {
            return $user->hasPermission('data_entry');
        }

        return false;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup(): void
    {
        $factory   = \NDB_Factory::singleton();
        $config    = $factory->config();
        $user      = $factory->user();
        $startYear = $config->getSetting('startYear');
        $endYear   = $config->getSetting('endYear');
        $ageMax    = $config->getSetting('ageMax');
        $ageMin    = $config->getSetting('ageMin');
        $dobFormat = $config->getSetting('dobFormat');
        $edc       = $config->getSetting('useEDC');
        $sex       = \Utility::getSexList();

        $pscidSet = "false";
        $minYear  = (isset($startYear, $ageMax)) ? $startYear - $ageMax : null;
        $maxYear  = (isset($endYear, $ageMin)) ? $endYear - $ageMin : null;

        // Get sites for the select dropdown
        $user_list_of_sites = $user->getCenterIDs();
        $site = \Utility::getSiteNameListByIDs($user_list_of_sites);

        // Get projects for the select dropdown
        $projList = [];
        foreach ($user->getProjects() as $project) {
            $projList[$project->getName()] = $project->getName();
        }

        // Get setting through pscid
        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $pscidSet = "true";
        }

        $this->fieldOptions = [
            'minYear'   => $minYear,
            'maxYear'   => $maxYear,
            'dobFormat' => $dobFormat,
            'edc'       => $edc,
            'sex'       => $sex,
            'pscidSet'  => $pscidSet,
            'site'      => $site,
            'project'   => $projList,
        ];
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . '/new_profile/js/NewProfileIndex.js']
        );
    }
}
