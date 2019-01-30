<?php declare(strict_types=1);

namespace LORIS\StudyEntities\Candidate;

class PSCIDGenerator extends SiteIDGenerator
{
    /**
     * Generate PSCIDs.
     */
    public function __construct(?string $prefix = null)
    {
        $this->kind = 'PSCID';
        parent::__construct($prefix);
    }
}
