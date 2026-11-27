<?php declare(strict_types=1);

/**
 * Provides rows for the Candidate Identifiers table.
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
 * Retrieves candidate identifier rows for the data framework.
 *
 * @category Main
 * @package  Candidate_Identifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifierRowProvisioner extends
    \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create the data provisioner.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance
     */
    public function __construct(protected \LORIS\LorisInstance $loris)
    {
        $user = \User::singleton();

        /*
         * Build the list of permissions available to the current user.
         *
         * A type with no associated permission is visible.
         * A type with a permission is visible only when the user has it.
         */
        $database = $loris->getDatabaseConnection();

        $permissions = $database->pselect(
            "SELECT permID, code FROM permissions",
            []
        );

        $allowedPermissionIDs = [];

        foreach ($permissions as $permission) {
            if ($user->hasPermission($permission['code'])) {
                $allowedPermissionIDs[] = (int) $permission['permID'];
            }
        }

        /*
         * We use permission IDs only after converting them to integers.
         * This avoids introducing untrusted values into the SQL.
         */
        $permissionFilter = "cit.permID IS NULL";

        if (!empty($allowedPermissionIDs)) {
            $permissionFilter .= " OR cit.permID IN ("
                . implode(',', $allowedPermissionIDs)
                . ")";
        }

        /*
         * Retrieve identifiers while enforcing identifier-type restrictions.
         */
        $sql = "
            SELECT
                c.CandID,
                c.PSCID,
                cit.Name AS IdentifierType,
                ci.Value AS IdentifierValue,
                ci.DateAdded,
                ci.DateEdited,
                ci.CandidateIdentifierID,
                ci.CandidateIdentifierTypeID,
                c.RegistrationCenterID,
                c.RegistrationProjectID
            FROM candidate_identifiers ci
                JOIN candidate c
                    ON c.ID = ci.CandidateID
                JOIN candidate_identifier_types cit
                    ON cit.CandidateIdentifierTypeID =
                        ci.CandidateIdentifierTypeID
            WHERE c.Active = 'Y'
                AND c.RegistrationProjectID IS NOT NULL
                AND ($permissionFilter)
                AND (
                    NOT EXISTS (
                        SELECT 1
                        FROM candidate_identifier_types_project_rel citpr
                        WHERE citpr.CandidateIdentifierTypeID =
                            cit.CandidateIdentifierTypeID
                    )
                    OR EXISTS (
                        SELECT 1
                        FROM candidate_identifier_types_project_rel citpr
                        WHERE citpr.CandidateIdentifierTypeID =
                            cit.CandidateIdentifierTypeID
                            AND citpr.ProjectID = c.RegistrationProjectID
                    )
                )
            ORDER BY c.PSCID ASC
        ";

        parent::__construct($this->loris, $sql, []);
    }

    /**
     * Convert a database row into a CandidateIdentifierRow.
     *
     * @param array $row Database row
     *
     * @return \LORIS\Data\DataInstance
     */
    public function getInstance($row): \LORIS\Data\DataInstance
    {
        $cid = \CenterID::singleton($row['RegistrationCenterID']);
        $pid = \ProjectID::singleton($row['RegistrationProjectID']);

        unset(
            $row['RegistrationCenterID'],
            $row['RegistrationProjectID']
        );

        return new CandidateIdentifierRow($row, $cid, $pid);
    }
}
