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
 * @author     Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\candidate_identifiers;

use LORIS\candidate_profile\CandidateWidget;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool Whether access is granted
     */
    public function hasAccess(\User $user): bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(['data_entry', 'access_all_profiles']);
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory(): ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Candidate");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human-readable module name
     */
    public function getLongName(): string
    {
        return dgettext("candidate_identifiers", "Candidate Identifiers");
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    Widget type
     * @param \User  $user    Current user
     * @param array  $options Widget options
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options): array
    {
        if ($type !== 'candidate') {
            return [];
        }

        $candidate = $options['candidate'] ?? null;

        if ($candidate === null || !$this->hasAccess($user)) {
            return [];
        }

        $controller = new \LORIS\CandidateIdentifierController(
            \NDB_Factory::singleton()->database()
        );

        $identifiers = $controller->getCandidateIdentifiers(
            (int) $candidate->getID()
        );

        $data = [];

        $database  = \NDB_Factory::singleton()->database();
        $projectID = $candidate->getProjectID();

        foreach ($identifiers as $identifier) {
            $identifierType = $identifier->type;

            // Check project restrictions.
            if (!empty($identifierType->projects)) {
                $projectAllowed = false;

                foreach ($identifierType->projects as $project) {
                    if ($project->getId() == $projectID) {
                        $projectAllowed = true;
                        break;
                    }
                }

                if (!$projectAllowed || !$user->hasProject($projectID)) {
                    continue;
                }
            }

            // Check identifier-specific permissions.
            if ($identifierType->permissionID !== null) {
                $permission = $database->pselectRow(
                    "SELECT code FROM permissions WHERE permID = :permID",
                    ['permID' => $identifierType->permissionID]
                );

                $permissionCode = $permission['code'] ?? null;

                if ($permissionCode === null
                    || !$user->hasPermission($permissionCode)
                ) {
                    continue;
                }
            }

            $data[] = [
                'ID'    => $identifier->candidateIdentifierID,
                'Type'  => $identifierType->name,
                'Value' => $identifier->value,
            ];
        }

        $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();

        return [
            new CandidateWidget(
                dgettext("candidate_identifiers", "Candidate Identifiers"),
                $baseURL . "/candidate_identifiers/js/CandidateIdentifiersWidget.js",
                "lorisjs.candidate_identifiers.CandidateIdentifiersWidget.default",
                ['Identifiers' => $data],
                1,
                1,
            ),
        ];
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Query\QueryEngine[]
     */
    public function getQueryEngines(): iterable
    {
        return [new QueryEngine($this->loris)];
    }
}
