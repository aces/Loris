<?php declare(strict_types=1);
namespace LORIS\dqt\Models;

class QueryField implements \JsonSerializable
{
    public function __construct(string $cat, string $name, ?string $visit)
    {
        $this->_categoryname = $cat;
        $this->_fieldname    = $name;
        $this->_visitlabel   = $visit;
    }

    public function getCategoryName(): string
    {
        return $this->_categoryname;
    }

    public function getFieldName(): string
    {
        return $this->_fieldname;
    }

    public function getVisitlabel(): ?string
    {
        return $this->_visitlabel;
    }

    public function jsonSerialize()
    {
        return [
            'categoryname' => $this->_categoryname,
            'fieldname'    => $this->_fieldname,
            'visitlabel'   => $this->_visitlabel
        ];
    }
}
