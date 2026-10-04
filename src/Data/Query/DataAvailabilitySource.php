<?php declare(strict_types=1);

namespace LORIS\Data\Query;

/**
 * A DataAvailabilitySource is a table whose rows hold items listed by a
 * DataAvailabilityItem for a session or a candidate.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataAvailabilitySource
{
    /**
     * Construct a DataAvailabilitySource
     *
     * @param string  $from  The table expression to select from
     * @param string  $id    The column holding the SessionID, or the
     *                       CandidateID for a candidate scoped item
     * @param string  $item  The expression for the item listed
     * @param ?string $where An optional condition restricting the rows
     */
    public function __construct(
        public readonly string $from,
        public readonly string $id,
        public readonly string $item,
        public readonly ?string $where = null,
    ) {
    }
}
