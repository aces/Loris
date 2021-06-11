<?php declare(strict_types=1);

namespace LORIS\dqt\Models\Filters;
use \LORIS\Data\Filter;
use \LORIS\Data\DataInstance;

/**
 * Accepts CouchDBResultRow objects from the search view/
 * The keys of those object should be an array of length 4 where the
 * fourth element is the one to compare.
 */
class NotEqualFilter implements Filter
{
    public function __construct(?string $value = null)
    {
        $this->_value = $value;
    }

    /**
     * Filter returns true only if the resource should be filtered out of the results
     * displayed to user.
     *
     * @param \User        $user     The user that the data is being filtered on
     *                               on behalf of.
     * @param DataInstance $resource The Instance being filtered.
     *
     * @return bool true if and only if the user should see the resource Instance
     */
    public function filter(\User $user, DataInstance $resource) : bool
    {
        $value = $resource->getKey()[3] ?? '';
        return $value !== $this->_value;
    }
}
