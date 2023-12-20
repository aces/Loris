<?php declare(strict_types=1);
/**
 * File contains the Consent class.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Consent
 * @author     Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\consent;

/**
 * The Consent provides the menu filter for the consent module.
 *
 * @category   Core
 * @package    Main
 * @subpackage Consent
 * @author     Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Consent extends \DataFrameworkMenu
{

    public $skipTemplate = true;

    /**
     * Checks if the user has access to consent module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        if (is_null($user->userID)) {
            return false;
        }
        return ($user->hasPermission('access_all_profiles')
            || $user->hasPermission('consent_view')
            || $user->hasPermission('consent_edit')
        );
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return ['access_all_profiles'];
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool always false
     */
    public function useProjectFilter() : bool
    {
        return false;
    }

    /**
     * Return the list of field options required to be serialized to JSON
     * in order to render the frontend.
     *
     * @return array
     */
    function getFieldOptions() : array
    {
        $db = \Database::singleton();

        // Options used for filtering consent codes
        $consentOptions = $db->pselectColWithIndexKey(
            "SELECT Name, Label FROM consent",
            [],
            'Name'
        );
        $consentLabels  = array_combine(
            array_values($consentOptions),
            array_values($consentOptions)
        );

        // Options used for filtering consent groups
        $consentGroupOptions = $db->pselectcolWithIndexKey(
            "SELECT Name, Label FROM consent_group",
            [],
            'Name'
        );

        $consentGroupLabels = array_combine(
            array_values($consentGroupOptions),
            array_values($consentGroupOptions)
        );

        // Options for filtering request status
        $requestStatusOptions = [
            'NA'          => 'NA',
            'created'     => 'Created',
            'sent'        => 'Sent',
            'in_progress' => 'In Progress',
            'complete'    => 'Complete',
            'expired'     => 'Expired',
        ];

        // Options for filtering consent status
        $consentStatusOptions = [
            'yes'            => 'Yes',
            'no'             => 'No',
            'not_applicable' => 'Not Applicable',
        ];

        // List of eConsent forms
        $eConsentForms = $db->pselect(
            "SELECT cg.Name, cdr.CenterID
            FROM consent_display_rel cdr 
            JOIN consent_group cg ON cg.ConsentGroupID=cdr.ConsentGroupID",
            []
        );

        $centerIDs = $db->pselectColWithIndexKey(
            "SELECT CandID, RegistrationCenterID FROM candidate",
            [],
            'CandID'
        );

        return [
            'consentLabels'       => $consentLabels,
            'consentGroupOptions' => $consentGroupOptions,
            'consentGroupLabels'  => $consentGroupLabels,
            'requestStatus'       => $requestStatusOptions,
            'consentStatus'       => $consentStatusOptions,
            'eConsentForms'       => $eConsentForms,
            'centerIDs'           => $centerIDs,
        ];
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new ConsentRowProvisioner();
    }

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/consent/js/consentIndex.js",
            ]
        );
    }
}