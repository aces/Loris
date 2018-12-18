<?php
namespace LORIS\StudyEntities\Candidate;

abstract class ValidatableIdentifier implements Identifier
{
    protected $value;

    abstract static protected function validate(string $value): bool;

    public function __construct(string $value)
    {
        if (!static::validate($value)) {
            throw new \DomainException('The value is not valid');
        }
        $this->value = $value;
    }
}

