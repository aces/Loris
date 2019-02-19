<?php declare(strict_types=1);

namespace LORIS\StudyEntities\Candidate;

class ExternalIDGenerator extends SiteIDGenerator
{
    /**
     * Generates ExternalIDs.
     */
    public function __construct(?string $prefix = null)
    {
        $this->kind = 'ExternalID';
        parent::__construct($prefix);
    }
}
