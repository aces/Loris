<?php
namespace LORIS\StudyEntities\Candidate;

interface Identifier
{
    public function getType(): string;
    public function __toString(): string;
}

