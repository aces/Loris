<?php
namespace LORIS\dqt\Models\DataInstances;
use \LORIS\Data\CouchDBResultRow;

class CategoryFieldInstance implements \LORIS\Data\DataInstance
{
    public function __construct(CouchDBResultRow $row)
    {
        $this->_name        = $row->getKey()[1];
        $this->_description = $row->getValue()->Description ?? 'N/A';
        $this->_datatype    = $row->getValue()->Type ?? 'N/A';
    }

    public function getName(): string
    {
        return $this->_name;
    }

    public function getDescription(): string
    {
        return $this->_description;
    }

    public function getDatatype(): string
    {
        return $this->_datatype;
    }

    public function jsonSerialize()
    {
        return [
            'name'        => $this->_name,
            'description' => $this->_description,
            'datatype'    => $this->_datatype
        ];
    }
}
