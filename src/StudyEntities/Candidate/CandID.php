<?php
namespace LORIS\StudyEntities\Candidate;
class CandID extends ValidatableIdentifier
{
    public function getType(): string
    {
        return 'CandID';
    }

    static protected function validate(string $value): bool
    {
        return preg_match('/[0-9]{6}/', $value) === 1;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}

