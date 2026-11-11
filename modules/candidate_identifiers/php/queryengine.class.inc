<?php declare(strict_types=1);

/**
 * QueryEngine for configurable candidate identifiers.
 *
 * PHP Version 8
 *
 * @category LORIS
 * @package  LORIS
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\candidate_identifiers;

use LORIS\Data\Scope;
use LORIS\Data\Cardinality;
use LORIS\Data\Dictionary\Category;
use LORIS\Data\Dictionary\DictionaryItem;
use LORIS\Data\Types\StringType;

/**
 * QueryEngine for configurable candidate identifiers.
 *
 * Exposes candidate identifier types to Data Query.
 *
 * @category LORIS
 * @package  LORIS
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class QueryEngine extends \LORIS\Data\Query\SQLQueryEngine
{
    /**
     * Return the candidate identifier data dictionary.
     *
     * @return Category[]
     */
    public function getDataDictionary(): iterable
    {
        $scope = new Scope(Scope::CANDIDATE);

        $identifiers = new Category(
            "Identifiers",
            "Candidate Identifiers"
        );

        $db = $this->loris->getDatabaseConnection();

        $types = $db->pselect(
            "SELECT
        cit.CandidateIdentifierTypeID,
        cit.Name,
        cit.AllowMultiple,
        cit.permID,
        p.code AS PermissionCode
     FROM candidate_identifier_types cit
     LEFT JOIN permissions p ON cit.permID = p.permID
     ORDER BY cit.Name",
            []
        );

        $items = [];

        foreach ($types as $type) {
            // A missing permission code must not grant access
            // when the identifier type requires a permission.
            $permissionCode = null;

            if ($type['permID'] !== null) {
                $permissionCode = $type['PermissionCode'];

                if ($permissionCode === null) {
                    continue;
                }
            }

            $items[] = new IdentifierDictionaryItem(
                "Identifier_" . $type['CandidateIdentifierTypeID'],
                $type['Name'],
                $scope,
                new StringType(255),
                new Cardinality(
                    $type['AllowMultiple']
                        ? Cardinality::MANY
                        : Cardinality::OPTIONAL
                ),
                $permissionCode
            );
        }

        return [$identifiers->withItems($items)];
    }

    /**
     * Candidate identifiers are not session-scoped.
     *
     * @param Category       $category The dictionary category
     * @param DictionaryItem $item     The dictionary item
     *
     * @return string[]
     */
    public function getVisitList(
        Category $category,
        DictionaryItem $item
    ): iterable {
        return [];
    }

    /**
     * Return the SQL expression for an identifier field.
     *
     * @param DictionaryItem $item The dictionary item
     *
     * @return string
     */
    protected function getFieldNameFromDict(
        DictionaryItem $item
    ): string {
        $name = $item->getName();

        if (!preg_match('/^Identifier_([1-9][0-9]*)$/', $name, $matches)) {
            throw new \InvalidArgumentException(
                "Unknown candidate identifier field: " . $name
            );
        }

        $typeID = (int) $matches[1];
        $alias  = "ci_" . $typeID;

        $this->addTable(
            "LEFT JOIN candidate_identifiers $alias "
                . "ON ($alias.CandidateID = c.ID "
                . "AND $alias.CandidateIdentifierTypeID = $typeID "
                . "AND ("
                . "NOT EXISTS ("
                . "SELECT 1 FROM candidate_identifier_types_project_rel cipr "
                . "WHERE cipr.CandidateIdentifierTypeID = $typeID"
                . ") "
                . "OR EXISTS ("
                . "SELECT 1 FROM candidate_identifier_types_project_rel cipr "
                . "WHERE cipr.CandidateIdentifierTypeID = $typeID "
                . "AND cipr.ProjectID = c.RegistrationProjectID"
                . ")"
                . "))"
        );

        return "$alias.Value";
    }

    /**
     * Return the key field type for multivalued identifiers.
     *
     * @param DictionaryItem $item The dictionary item
     *
     * @return string
     */
    public function getCorrespondingKeyFieldType(
        DictionaryItem $item
    ): string {
        return "Candidate Identifier ID";
    }

    /**
     * Return the SQL key for multivalued identifiers.
     *
     * @param DictionaryItem $item The dictionary item
     *
     * @return string
     */
    public function getCorrespondingKeyField(
        DictionaryItem $item
    ): string {
        // Register the same join used to retrieve the identifier value.
        $this->getFieldNameFromDict($item);

        $name = $item->getName();

        if (!preg_match('/^Identifier_([1-9][0-9]*)$/', $name, $matches)) {
            throw new \InvalidArgumentException(
                "Unknown candidate identifier field: " . $name
            );
        }

        $alias = "ci_" . (int) $matches[1];

        return "$alias.CandidateIdentifierID";
    }
}
