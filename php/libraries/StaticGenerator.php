<?php
/**
 * Generates Ids used for PSCID and ExternalId
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Always returns the same text
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class StaticGenerator implements IdGeneratorInterface
{
    private $_value;
    /**
     * Returns true if the generator has states
     * that can change and reset
     *
     * @return bool
     */
    public function canReset()
    {
        return false;
    }
    /**
     * Resets the generator state
     *
     * @return void
     */
    public function reset()
    {
    }
    /**
     * Expected to return `null` if unable to get the
     * current string, this returns the current string in sequence
     *
     * @return string|null The current string in the id
     */
    public function cur()
    {
        return $this->_value;
    }
    /**
     * Tries to generate the next string in the sequence
     *
     * @return bool `true` on success
     */
    public function next()
    {
        return true;
    }
    /**
     * Tries to generate a random string
     *
     * @return bool `true` on success
     */
    public function nextRand()
    {
        return true;
    }
    /**
     * Returns the max number of times nextRand() can be
     * reasonably called without a reset.
     *
     * @return int -1 if nextRand() always returns the same result
     */
    public function randAttemptsMax()
    {
        return -1;
    }
    /**
     * Returns the number of sequences this generator can create.
     *
     * @return int `1` if there's only one sequence.
     */
    public function sequenceCount()
    {
        return 1;
    }
    /**
     * After calling setSequence($n), cur() will return the
     * $n-th sequence
     *
     * @param int $n Range: [0, sequenceCount())
     *
     * @return void
     */
    public function setSequence($n)
    {
        if ($n != 0) {
            throw new Exception("Invalid sequence number {$n}");
        }
    }

    /**
     * Constructor
     *
     * @param string $value The value
     */
    public function __construct($value)
    {
        $this->_value = $value;
    }
    /**
     * Parses the xml to produce the generator
     *
     * @param array $xml The xml
     *
     * @return object The generator
     */
    public static function fromXMLConfig($xml)
    {
        $value = $xml["#"];
        if (strlen($value) == 0) {
            throw new Exception("Empty value not allowed");
        }
        return new StaticGenerator($value);
    }
}
?>
