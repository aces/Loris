<?php declare(strict_types=1);

namespace LORIS\dqt\Models\Mappers;
use \LORIS\Data\Mapper;
use \LORIS\Data\DataInstance;
use \LORIS\Data\CouchDBResultRow;
use \LORIS\dqt\Models\DataInstances\SessionInstance;

class SessionRowMapper implements Mapper
{
    /**
     * Return CouchDBResultRow object as CouchDBSessionRow
     *
     * @param \User        $user     The user that this is being mapped on
     *                               behalf of.
     * @param DataInstance $resource The data being mapped from.
     *
     * @return DataInstance a new DataInstance with the map applied.
     */
    public function map(\User $user, DataInstance $resource) : DataInstance
    {
        if (!$resource instanceof CouchDBResultRow) {
            throw new \InvalidArgumentException('TypeError: resource must be an instance of CouchDBResultRow.');
        }
        return new SessionInstance($resource->getValue());
    }
}
