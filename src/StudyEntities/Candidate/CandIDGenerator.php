<?php declare(strict_types=1);

namespace LORIS\StudyEntities\Candidate;

use LORIS\StudyEntities\Candidate\CandID;

class CandIDGenerator extends IdentifierGenerator
{
    /**
     * CandIDs should always be exactly 6 digits.
     */
    private const LENGTH     = 6;
    private const MIN_CANDID = 100000;
    private const MAX_CANDID = 999999;

    /**
     * Creates a new CandIDGenerator by initializing properties based on class
     * constants defined above.
     */
    public function __construct()
    {
        $this->generationMethod = 'random';
        $this->length           = self::LENGTH;
        $this->minValue         = self::MIN_CANDID;
        $this->maxValue         = self::MAX_CANDID;
        $this->alphabet         = range(0, 9);
    }

    public function generate(): CandID {
        $this->checkIDRangeFull();
        return new CandID(
            strval(
                random_int($this->minValue, $this->maxValue)
            )
        );
    }

    /**
     * {@inheritDoc}
     */
    protected function getExistingIDs(): array
    {
        // CandIDs have no prefix so the result of the query can be returned
        // immediately.
        return \Database::singleton()->pselectCol(
            'SELECT CandID from candidate',
            array()
        );
    }
}
