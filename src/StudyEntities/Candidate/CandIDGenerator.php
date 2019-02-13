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

    /**
     * Creates a new CandidateID. Also queries the database to ensure that all
     * possible CandIDs have not been exhausted.
     *
     * @return CandID The new identifier.
     */
    public function generate(): CandID {
        $this->checkIDRangeFull();
        return new CandID(
            strval(
                random_int($this->minValue, $this->maxValue)
            )
        );
    }

    /**
     * Wrapper for \Database::insert() to add new Candidate information to the
     * database. This function will generate new IDs in the edge-case that a
     * race condition occurs and causes an error upon insertion.
     *
     * @param array $setArray An associative array of column names and values.
     *
     * @return CandID The newly-created CandID object.
     */
    public function createIDAndInsertWithValues(array $setArray): CandID {
        do {
            $invalidID = false;
            // Generate candid and insert into setArray
            $candID = $this->generate();
            $setArray['CandID'] = (string) $candID;
            try {
                \Database::singleton()->insert('candidate', $setArray);
            } catch (\DatabaseException | \DomainException $e) {
                $invalidID = true;
                // Occurs in the case of a race condition where another CandID
                // with the same value has been inserted into the DB before this
                // one.
            }
        } while ($invalidID === true);
        return $candID;
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
