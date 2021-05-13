<?php declare(strict_types=1);

namespace LORIS\dqt\Models\Filters;
use \LORIS\Data\Filter;

class ContainsFilter implements Filter
{
    public function __construct(string $value)
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
        $value = $resource->getKey()[3];
        return (strpos($value, $this->_value) !== false);
    }
}
