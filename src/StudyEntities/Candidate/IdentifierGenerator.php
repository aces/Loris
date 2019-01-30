<?php declare(strict_types=1);

namespace LORIS\StudyEntities\Candidate;

abstract class IdentifierGenerator
{

    protected $generationMethod;
    protected $alphabet;
    protected $length;
    protected $minValue;
    protected $maxValue;
    protected $prefix    = '';
    protected $ALPHABETS = '';

    /**
    * Generates a new unused identifier to represent a Candidate in LORIS.
    *
    * @return string The new identifier
    */
    public function generate(): string
    {
        // Check that the number of existing IDs does not exceed the range of
        // possible values (given by the size of the alphabet to the power of
        // number of characters in the ID).
        $sizeOfIDSpace = count($this->alphabet) ** $this->length;
        if (count($this->getExistingIDs) >= $sizeOfIDSpace) {
            throw new \LorisException(
                'Cannot create new identifier because all valid identifiers ' .
                'are in use!'
            );
        }

        $id = '';
        switch ($this->generationMethod) {
        case 'sequential':
            $id = $this->padID($this->generateSequentialID());
            break;
        case 'random':
            $id = $this->padID($this->generateRandomID());
            // If the Random ID is already in use, increment it by using the
            // generateSequentialID function with the random ID as a starting
            // point.
            if (in_array($id, $this->getExistingIDs(), true)) {
                $id = $this->generateSequentialID($id);
            }
            break;
        }

        // Return padded value with appropriate prefix
        return $this->prefix . $id;
    }

    protected function generateSequentialID(string $id = ''): string
    {
        $newID = $id ?? max($this->getExistingIDs());
        // Increment newID until we find an unused value within the boundaries
        // of $min and $max.
        do {
            // Make sure $newID is greater than or equal to minimum and less
            // than or equal to maximum.
            if (strcmp(strval(++$newID), $this->minValue) < 0) {
                // If newID is less than the minimum, increment again.
                continue;
            }
            if (strcmp(strval($newID), $this->maxValue) > 0) {
                // If newID has exceeded the maximum, wrap back around to the
                // minimum possible value. We know that there is a free ID
                // available somewhere in the range of possible IDs or else
                // _generateID above will have thrown an exception. This allows
                // us to increment $newID until we find a free space.
                $newID = $this->minValue;
            }
        } while (
            in_array(
                $this->padID($newID),
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
        $id = '';
        while (strlen($id) < $this->length) {
            $id .= $this->alphabet[random_int(0, count($this->alphabet) - 1)];
        }
        return strval($id);
    }

    /**
     * Queries the database for PSCIDs starting with a prefix. This is used to
     * get all existing IDs for a given site. The prefix will be stripped from
     * the IDs as the calling code will be interested in and aware of the Site
     * corresponding to the prefix. Returning the bare IDs allows for easier
     * processing.
     *
     * @return string[] The IDs retrieved from the database with the prefix
     *                      stripped. E.g. MON1234 becomes 1234.
     */
    abstract protected function getExistingIDs(): array;

    /**
     * Ensure that an ID is the correct length by prepending the first character
     * of the alphabet to the ID if the ID's length is shorter than it should be.
     *
     * string $id The ID to pad.
     *
     * return array The ID padded to the correct length.
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

    public function __construct()
    {
        $this->ALPHABETS = array(
                            'numeric'      => range(0, 9),
                            'alpha'        => range('A', 'Z'),
                            'alphanumeric' => array_merge(range(0, 9), range('A', 'Z')),
                           );
    }
}
