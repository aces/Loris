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
 * Generates a numeric id, padded to `$length`
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NumericGenerator implements IdGeneratorInterface
{
    private $_min;
    private $_max;
    private $_length;
    private $_cur;
    private $_rand_attempts_cur;
    private $_rand_attempts_max;

    /**
     * The current raw int value
     *
     * @return int
     */
    public function curRaw()
    {
        return $this->_cur;
    }
    /**
     * The length of the output string
     *
     * @return int
     */
    public function getLength()
    {
        return $this->_length;
    }

    /**
     * Returns true if the generator has states
     * that can change and reset
     *
     * @return bool
     */
    public function canReset()
    {
        return true;
    }
    /**
     * Resets the generator state
     *
     * @return void
     */
    public function reset()
    {
        $this->_cur = $this->_min;

        $this->_rand_attempts_cur = 0;
    }
    /**
     * Expected to return `null` if unable to get the
     * current string, this returns the current string in sequence
     *
     * @return string|null The current string in the id
     */
    public function cur()
    {
        $cur = $this->curRaw();
        if (is_null($cur)) {
            return null;
        }
        return str_pad("{$cur}", $this->getLength(), "0", STR_PAD_LEFT);
    }
    /**
     * Tries to generate the next string in the sequence
     *
     * @return bool `true` on success
     */
    public function next()
    {
        if (is_null($this->_cur)) {
            return false;
        }
        if ($this->_cur >= $this->_max) {
            $this->_cur = null;
            return false;
        } else {
            ++$this->_cur;
            return true;
        }
    }
    /**
     * Tries to generate a random string
     *
     * @return bool `true` on success
     */
    public function nextRand()
    {
        if (is_null($this->_cur)) {
            return false;
        }
        ++$this->_rand_attempts_cur;
        if ($this->_rand_attempts_cur > $this->_rand_attempts_max) {
            //If you find that you are getting `null` with this function
            //when your probability space is not all used up,
            //Consider reevaluating the number of candidates in your study
            //and setting it so that `max`-`min` = (number of candidates)^3

            //n^3 isn't arbitray.
            //If you have `n` elements and generate `n` random numbers
            //in the interval [1, n^3], the probability that all
            //elements are unique is at least (1-1/n), where n > 1
            //It's actually more like,
            //(n^3)P(n) / n^(3n)
            //The higher `n` is, the more the above approaches 1

            //Where 1 = 100% probability
            //Higher n and higher n^3 => higher probability of uniqueness
            //Source: Introduction to Algorithms, 3rd Edition, Page 125
            //ISBN 978-0-262-03384-8 (hardcover : alk. paper)
            //ISBN 978-0-262-53305-8 (pbk. : alk. paper)
            $this->_cur = null;
            return false;
        } else {
            $this->_cur = rand($this->_min, $this->_max);
            return true;
        }
    }
    /**
     * Returns the max number of times nextRand() can be
     * reasonably called without a reset.
     *
     * @return int -1 if nextRand() always returns the same result
     */
    public function randAttemptsMax()
    {
        return $this->_rand_attempts_max;
    }
    /**
     * Returns the number of sequences this generator can create.
     *
     * @return int `1` if there's only one sequence.
     */
    public function sequenceCount()
    {
        return $this->_max - $this->_min + 1;
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
        if ($n < 0 || $n >= $this->sequenceCount()) {
            throw new Exception("Invalid sequence number {$n}");
        }
        $this->_cur = $this->_min + $n;
    }

    /**
     * Constructor
     *
     * @param int $min    The min value
     * @param int $max    The max value
     * @param int $length The length
     */
    public function __construct($min, $max, $length)
    {
        $this->_min    = $min;
        $this->_max    = $max;
        $this->_length = $length;

        $delta = $max-$min + 1;
        $this->_rand_attempts_max = IdGeneratorUtil::approximateRandAttemptsMax(
            $delta
        );

        $this->reset();
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
        $min    = IdGeneratorUtil::xmlTryGetInt($xml, "min");
        $max    = IdGeneratorUtil::xmlTryGetInt($xml, "max");
        $length = IdGeneratorUtil::xmlTryGetLength($xml);

        if (is_null($min) && is_null($max)) {
            if (is_null($length)) {
                throw new Exception(
                    "At least ('length') or ('min' and 'max') must be set"
                );
            } else {
                //Only `length` is set
                if ($length == 0) {
                    throw new Exception("'length' must be > 0");
                }
                $min = 0;
                $max = pow(10, $length) - 1;
                return new NumericGenerator($min, $max, $length);
            }
        } else {
            if (is_null($min)) {
                throw new Exception("If 'max' is set, 'min' must be set, too");
            }
            if (is_null($max)) {
                throw new Exception("If 'min' is set, 'max' must be set, too");
            }
            if ($min >= $max) {
                throw new Exception("'min' must be smaller than 'max'");
            }
            $default_max_length = floor(log10($max)+1);
            if (is_null($length)) {
                $length = $default_max_length;
            }
            if ($length < $default_max_length) {
                throw new Exception(
                    "'length' must be long enough to accommodate all digits. "
                    . "{$default_max_length} is recommended."
                );
            }

            return new NumericGenerator($min, $max, $length);
        }
    }
}
?>
