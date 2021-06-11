<?php
namespace LORIS\dqt\Models\DataInstances;
use \LORIS\Data\CouchDBResultRow;

class CategoryVisitInstance implements \LORIS\Data\DataInstance
{
    public function __construct(CouchDBResultRow $row)
    {
        $this->_label = $row->getKey()[1];
    }

    public function getLabel(): string
    {
        return $this->_label;
    }

    public function jsonSerialize()
    {
        return $this->_label;
    }
}
