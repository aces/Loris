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
 * All IdGenerators should implement this interface
 * so a set of behaviours can reasonably be expected.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
interface IdGeneratorInterface
{
    /**
     * Returns true if the generator has states
     * that can change with calls to next() and nextRand()
     *
     * @return bool
     */
    public function canReset();
    /**
     * Resets the generator state
     *
     * @return void
     */
    public function reset();
    /**
     * Expected to return `null` if unable to get the
     * current string, this returns the current string in sequence
     *
     * @return string|null The current string in the id
     */
    public function cur();
    /**
     * Tries to generate the next string in the sequence
     *
     * @return bool `true` on success
     */
    public function next();
    /**
     * Tries to generate a random string
     *
     * @return bool `true` on success
     */
    public function nextRand();
    /**
     * Returns the max number of times nextRand() can be
     * reasonably called without a reset.
     *
     * @return int -1 if nextRand() always returns the same result
     */
    public function randAttemptsMax();
    /**
     * Returns the number of sequences this generator can create.
     *
     * @return int `1` if there's only one sequence.
     */
    public function sequenceCount();
    /**
     * After calling setSequence($n), cur() will return the
     * $n-th sequence
     *
     * @param int $n Range: [0, sequenceCount())
     *
     * @return void
     */
    public function setSequence($n);
}
?>
