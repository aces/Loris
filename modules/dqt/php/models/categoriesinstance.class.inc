<?php
namespace LORIS\dqt\Models;

class CategoriesInstance implements \LORIS\Data\DataInstance
{
    public function __construct(string $name)
    {
        $this->_name = $name;
    }

    public function getName(): string
    {
        return $this->_name;
    }

    public function jsonSerialize()
    {
        return ['name' => $this->_name];
    }
}
