<?php declare(strict_types=1);

namespace LORIS\dqt\Models\DataInstances;
use \LORIS\Data\DataInstance;

class QueryResultItem implements DataInstance
{
    public function __construct(array $key, ?string $value = null)
    {
        $this->_key   = $key;
        $this->_value = $value;
    }

    public function getKey(): array
    {
        return $this->_key;
    }

    public function getValue(): ?string
    {
        return $this->_value;
    }

    public function jsonSerialize()
    {
        return [
            'key'   => $this->_key,
            'value' => $this->_value
        ];
    }
}
