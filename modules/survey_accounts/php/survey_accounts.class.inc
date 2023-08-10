<?php
/**
 * This implements a menu filter to be used for viewing the Loris survey
 * keys that have been created
 *
 * PHP Version 5
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\survey_accounts;

/**
 * Implements menu filter class for survey module.
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Survey_Accounts extends \DataFrameworkMenu
{
    /**
     * Determine if user has permission to access this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('survey_accounts_view');
    }

    /**
     * {@inheritDoc}
     *
     * @return bool
     */
    public function useSiteFilter() : bool
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
     * @return bool
     */
    public function useProjectFilter() : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    public function getFieldOptions() : array
    {
        $statusOptions = [
            'Created'     => 'Created',
            'Sent'        => 'Sent',
            'In Progress' => 'In Progress',
            'Complete'    => 'Complete',
        ];

        $instruments
            = \NDB_BVL_Instrument::getDirectEntryInstrumentNamesList(
                $this->loris
            );

        return [
            'visits'        => \Utility::getVisitList(),
            'instruments'   => $instruments,
            'statusOptions' => $statusOptions,
        ];
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new SurveyAccountsProvisioner();
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/survey_accounts/js/surveyAccountsIndex.js",
            ]
        );
    }
}
