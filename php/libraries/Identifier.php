<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category Model
 * @package  Behavioural
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * An Identifier is something that it used to identify an element of a study,
 * such as a Candidate, Session, etc.
 *
 * Instances of Identifier must have a type to distinguish what kind of identifier
 * it is (e.g. CandID, SessionID) and must be serializable to a string.
 *
 * @category Model
 * @package  Behavioural
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface Identifier
{
    /**
     * Return the name of the identifier type for this interface
     * implementation.
     *
     * @return string The identifier type
     */
    public function getType(): string;

    /**
     * Serializes the identifier's value to a string
     *
     * @return string The identifier type
     */
    public function __toString(): string;
}

