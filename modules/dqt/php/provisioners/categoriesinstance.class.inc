<?php
namespace LORIS\dqt\Provisioners;

class CategoriesInstance implements \LORIS\Data\DataInstance
{
    public function __construct(string $name)
    {
        $this->_name = $name;
    }

    public function jsonSerialize()
    {
        return ['name' => $this->_name];
    }
}
