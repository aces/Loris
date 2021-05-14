<?php declare(strict_types=1);

namespace LORIS\Data;

class CouchDBResultRow implements DataInstance
{
    private $_id;
    private $_key;
    private $_value;
    private $_doc;

    public function __construct(string $textrow)
    {
        $obj = json_decode($textrow, true);

        $this->_id = $obj['id'] ?? null;

        if (!isset($obj['key'])) {
            throw new \UnexpectedValueException("missing 'key' property");
        }
        $this->_key = $obj['key'];

        if (!isset($obj['value'])) {
            throw new \UnexpectedValueException("missing 'value' property");
        }
        $this->_value = $obj['value'];

        $this->_doc = $obj['doc'] ?? null;
    }

    public function getId(): ?string
    {
        return $this->_id;
    }

    public function getKey(): array
    {
        return $this->_key;
    }

    public function getValue(): array
    {
        return $this->_value;
    }

    public function getDoc(): ?array
    {
        return $this->_doc;
    }

    public function jsonSerialize()
    {
        return [
            'id'  => $this->_id,
            'key' => $this->_key,
            'value' => $this->_value,
            'doc' => $this->_doc
        ];
    }

}
