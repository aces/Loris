<?php declare(strict_types=1);

/**
 * The Candidate Identifiers menu.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Candidate_Identifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\candidate_identifiers;

/**
 * Implements the Candidate Identifiers menu.
 *
 * @category Main
 * @package  Candidate_Identifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Candidate_Identifiers extends \DataFrameworkMenu
{
    /**
     * Check whether the user can access this page.
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool Whether the user can access this page
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return (
            $user->hasPermission('access_all_profiles')
            || ($user->hasStudySite() && $user->hasPermission('data_entry'))
        );
    }

    /**
     * Allow the data framework to use the existing site permission filter.
     *
     * @return ?array Permissions that grant access across sites
     */
    public function allSitePermissionNames() : ?array
    {
        return ['access_all_profiles'];
    }

    /**
     * Enable the existing project filter.
     *
     * @return bool Whether to use project filtering
     */
    public function useProjectFilter() : bool
    {
        return true;
    }

    /**
     * Return the data provisioner for the identifier table.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new CandidateIdentifierRowProvisioner($this->loris);
    }

    /**
     * Return filter options for the data table.
     *
     * @return array Filter options
     */
    protected function getFieldOptions(): array
    {
        $controller = new \LORIS\IdentifierTypeController(
            \NDB_Factory::singleton()->database()
        );

        $identifierTypes = [];

        foreach ($controller->getAllIdentifierTypes() as $identifierType) {
            $identifierTypes[] = [
                'value'        => $identifierType->candidateIdentifierTypeID,
                'label'        => $identifierType->name,
                'autoGenerate' => $identifierType->autoGenerate,
                'isRequired'   => $identifierType->isRequired,
            ];
        }

        return [
            'identifierTypes' => $identifierTypes,
        ];
    }

    /**
     * Include the JavaScript required to render the table.
     *
     * @return array JavaScript dependencies
     */
    public function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();

        return array_merge(
            $deps,
            [
                $baseURL . "/candidate_identifiers/js/candidateIdentifiersIndex.js",
            ]
        );
    }

    /**
     * Generate the breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs() : \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                dgettext("candidate_identifiers", "Candidate Identifiers"),
                "/$this->name"
            )
        );
    }
}
