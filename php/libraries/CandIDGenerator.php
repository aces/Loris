<?php declare(strict_types=1);
/**
 * This file contains a class used to generate CandIDs for use in LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use \LORIS\StudyEntities\Candidate\CandID;
/**
 * This class defines functions used to generate valid Candidate identifiers in
 * LORIS. It leverages the CandID study entity for validation.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
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
    public function generate(): CandID
    {
        $validID = false;
        while (! $validID) {
            $this->checkIDRangeFull();
            $id = new CandID(
                strval(
                    random_int($this->minValue, $this->maxValue)
                )
            );
            // Check if the ID is in use. If so, the loop will continue and a new
            // ID will be generated.
            $validID = \Database::singleton()
                ->pselectOne(
                    "SELECT count(CandID) FROM candidate WHERE CandID=:id",
                    array('id' => (string) $id)
                ) == 0;
        }
        return $id;
    }

    /**
     * {@inheritDoc}
     *
     * @return string[] The IDs retrieved from the database.
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
