<?php declare(strict_types=1);

namespace LORIS\biobank;

define('MAX_BARCODES_PER_REQUEST', 1000); // Adjust this value as needed

/**
 * {@inheritDoc}
 *
 * @license https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License
 */
class Barcodes extends Endpoint
{
    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function allowedMethods(): array
    {
        return ['GET', 'OPTIONS'];
    }

    /**
     * {@inheritDoc}
     *
     * @param Permission $permission The permission object.
     *
     * @return string
     */
    protected static function getPermission(Permission $permission) : string
    {
        return match ($permission) {
            Permission::GET => 'biobank_specimen_create',
        };
    }

    /**
     * {@inheritDoc}
     *
     * @param string $subpath The subpath to check for a sub-handler.
     *
     * @return ?Endpoint
     */
    protected function getSubHandler(string $subpath): ?Endpoint
    {
        // No sub-handler exists, but acknowledge the parameter to avoid linting
        // warnings -- in the future another solution might be more optimal.
        unset($subpath);

        return null;
    }

    /**
     * Handles getting multiple resources
     *
     * @param QueryParams $params The number of requested barcodes
     *
     * @return array The data to be returned as JSON
     */
    protected function get(QueryParams $params): array
    {
        if ($params->limit > MAX_BARCODES_PER_REQUEST) {
            throw new \InvalidArgumentException(
                "The 'limit' parameter cannot exceed " . MAX_BARCODES_PER_REQUEST .
                "."
            );
        }

        $currentYear = date('y');

        // Query to get the largest barcode for the current year
        $query           = "SELECT
                    MAX(CAST(SUBSTRING(Barcode, 3, 6) AS UNSIGNED)) AS max_number
                  FROM biobank_container
                    WHERE SUBSTRING(Barcode, 1, 2) = :year";
        $qparams         = [':year' => $currentYear];
        $maxNumberResult = (array) $this->loris->getDatabaseConnection()
            ->pselectOne($query, $qparams);

        $maxNumber = $maxNumberResult['max_number'] ?? 0;
        $newNumber = $maxNumber + 1;

        $barcodes = [];
        for ($i = 0; $i < $params->limit; $i++) {
            $newNumberFormatted = str_pad(
                (string) ($newNumber + $i),
                6,
                '0',
                STR_PAD_LEFT
            );
            $newBarcode         = $currentYear . $newNumberFormatted;
            $barcodes[]         = $newBarcode;
        }

        return ['barcodes' => $barcodes];
    }
}
