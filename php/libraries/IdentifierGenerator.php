<?php declare(strict_types=1);
/**
 * This file contains a class to act as a generic way to generate the various
 * LORIS identifiers used in the codebase (CandID, PSCID, ExternalID). It
 * handles the creation and validation of new IDs using various generation
 * methods.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
/**
 * This class serves as a generic parent for identifier generators.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class IdentifierGenerator
{
    private const RANGE_FULL = 'Cannot create new identifier because all ' .
        ' valid identifiers are in use!';
    protected $generationMethod;
    protected $alphabet = array();
    protected $length;
    protected $minValue;
    protected $maxValue;
    protected $prefix = '';

    /**
    * Generates a new unused identifier to represent a Candidate in LORIS.
    *
    * @return string The new identifier
    */
    protected function createNewID(): string
    {
        // Check that it is possible to create a new ID.
        $this->checkIDRangeFull();

        $id = '';
        switch ($this->generationMethod) {
        case 'sequential':
            $id = $this->padID($this->generateSequentialID());
            break;
        case 'random':
            $id = $this->padID($this->generateRandomID());
            // If the Random ID is already in use or is outside of the range
            // defined by minValue and maxValue, increment it by using the
            // generateSequentialID function with the previous ID as a starting
            // point.
            if (in_array($id, $this->getExistingIDs(), true)
                || strcmp(strval($id), strval($this->minValue)) < 0
                || strcmp(strval($id), strval($this->maxValue)) > 0
            ) {
                $id = $this->generateSequentialID($id);
            }
            break;
        }

        // Return padded value with appropriate prefix
        return $this->prefix . $id;
    }

    /**
     * Creates a new ID representing the next ID in a given sequence as defined
     * by configuration settings. By default this function will increment the
     * value of the largest existing ID in the database. If $id is passed,
     * the new ID will be an incremented value of that parameter.
     *
     * @param string $id An existing ID. This function will increment based on
     *                                      this value if present.
     *
     * @return string The new ID.
     */
    protected function generateSequentialID(string $id = ''): string
    {
        // If this is the first ID ever created, return the minimum value.
        if (count($this->getExistingIDs()) < 1) {
            return $this->minValue;
        }
        // Create the new ID by incrementing the value of the $id parameter OR
        // by incrementing the highest existing ID.
        $newID = !empty($id) ? $id : max($this->getExistingIDs());

        // Increment newID until we find an unused value within the boundaries
        // of $min and $max.
        do {
            $newID++;

            // Check that it is possible to create a new ID.
            $this->checkIDRangeFull();

            // If the $newID generated is greater than or equal to the max
            // value, then all possible IDs have been exhausted (since IDs
            // cannot be re-used without causing ambiguity in the data).
            if (strcmp(strval($newID), strval($this->maxValue)) >= 0) {
                throw new \LorisException(self::RANGE_FULL);
            }

            // Make sure $newID is greater than or equal to minimum and less
            // than or equal to maximum.
            if (strcmp(strval($newID), strval($this->minValue)) < 0) {
                // If newID is less than the minimum, increment again.
                continue;
            }
        } while (
            in_array(
                $this->padID(strval($newID)),
                $this->getExistingIDs(),
                true
            )
        );

        return $this->padID(strval($newID));
    }

    /**
     * Generates a new random string using the IdentifierGenerator's alphabet
     * and length variables.
     *
     * @return string The new ID.
     */
    protected function generateRandomID(): string
    {
        // Check that it is possible to create a new ID.
        $this->checkIDRangeFull();

        $id = '';
        while (strlen($id) < $this->length) {
            $id .= $this->alphabet[random_int(0, count($this->alphabet) - 1)];
        }
        return strval($id);
    }

    /**
     * Queries the database for existing IDs.
     *
     * @return string[] The IDs retrieved from the database.
     */
    abstract protected function getExistingIDs(): array;

    /**
     * Ensure that an ID is the correct length by prepending the first character
     * of the alphabet to the ID if the ID's length is shorter than it should be.
     *
     * @param string $id The ID to pad.
     *
     * @return string The ID padded to the correct length.
     */
    protected function padID(string $id): string
    {
        return str_pad(
            $id,
            $this->length,
            strval($this->alphabet[0]),
            STR_PAD_LEFT
        );
    }

    /**
     * Check that the number of existing IDs does not exceed the range of
     * possible values (given by the size of the alphabet to the power of
     * number of characters in the ID).
     *
     * @throws \LorisException
     *
     * @return void
     */
    protected function checkIDRangeFull(): void
    {
        // Check that the number of existing IDs does not exceed the range of
        // possible values (given by the size of the alphabet to the power of
        // number of characters in the ID).
        $sizeOfIDSpace = count($this->alphabet) ** $this->length;
        if (count($this->getExistingIDs()) >= $sizeOfIDSpace) {
            throw new \LorisException(self::RANGE_FULL);
        }
    }
}
