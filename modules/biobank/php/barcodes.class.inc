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

        $year = date('y');

        // Get the highest number from existing barcodes for the current year
        $query     = "
            SELECT
              MAX(CAST(SUBSTRING(Barcode, 3) AS UNSIGNED)) AS max_number  
            FROM biobank_container
            WHERE
              LEFT(Barcode, 2) = :year
        ";
        $qparams   = [':year' => $year];
        $maxNumber = $this->loris->getDatabaseConnection()
            ->pselectOne($query, $qparams);

        $maxNumber = $maxNumber ?? 0;
        $number    = $maxNumber + 1;

        $barcodes = [];
        for ($i = 0; $i < $params->limit; $i++) {
            $barcodes[] = $year .
                str_pad((string) ($number + $i), 6, '0', STR_PAD_LEFT);
        }

        return $barcodes;
    }
}
