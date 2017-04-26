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
 * A collection of utility methods for id generation.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class IdGeneratorUtil
{
    /**
     * Not meant to be instantiated
     */
    private function __construct()
    {
    }

    /**
     * Approximates the n-th harmonic number
     * https://en.wikipedia.org/wiki/Harmonic_number
     * #Alternative.2C_asymptotic_formulation
     *
     * @param int $n The index
     *
     * @return float the n-th harmonic number
     */
    public static function approximateHarmonicNumber($n)
    {
        //Euler-Mascheroni constant
        //https://en.wikipedia.org/wiki/Euler%E2%80%93Mascheroni_constant
        $gamma = 0.57721566490153286060651209008240243104215933593992;

        //http://stackoverflow.com/questions/404346/
        //python-program-to-calculate-harmonic-series
        return $gamma + log($n)
            + 1.0/(  2.0 * $n)
            - 1.0/( 12.0 * $n*$n)
            + 1.0/(120.0 * $n*$n*$n*$n);
    }
    /**
     * Calculated with this in mind:
     * https://en.wikipedia.org/wiki/Coupon_collector's_problem
     * Full explanation,
     * https://math.stackexchange.com/questions/2062743/
     * is-there-a-name-for-this-distribution-generating-until-all-numbers-appear
     *
     * Basically, we want to find how many times we should attempt to generate
     * random numbers before we can *expect* to have generated all random numbers
     * in the range [1, $n].
     * If we try this many times and collide every time, we can reasonably expect
     * the user to increase the probability space.
     *
     * @param int $n The probability space
     *
     * @return int The expected number of attempts before exhausting the space
     */
    public static function approximateRandAttemptsMax($n)
    {
        return intval($n*self::approximateHarmonicNumber($n));
    }
    /**
     * Validates the numeric string, throws an exception if invalid.
     *
     * @param string $raw  The raw string
     * @param string $name The name of the value
     *
     * @return void
     */
    private static function _validateNonNegativeInteger($raw, $name)
    {
        if (!ctype_digit($raw)) {
            throw new Exception("{$name} must be a non-negative integer");
        }
        if ("" . intval($raw) !== $raw) {
            throw new Exception("{$name} must be a valid non-negative integer");
        }
    }
    /**
     * Checks if the key exists.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return bool `true` if it exists
     */
    public static function xmlKeyExists($xml, $key)
    {
        return isset($xml["@"][$key]);
    }
    /**
     * Gets the value, throws an exception if unable.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return string The value
     */
    public static function xmlGet($xml, $key)
    {
        if (!self::xmlKeyExists($xml, $key)) {
            throw new Exception("Expected '{$key}' to be set");
        }
        return $xml["@"][$key];
    }
    /**
     * Gets the int value, throws an exception if unable.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return int The int
     */
    public static function xmlGetInt($xml, $key)
    {
        $raw = self::xmlGet($xml, $key);
        self::_validateNonNegativeInteger($raw, $key);
        return intval($raw);
    }
    /**
     * Tries to get the int value, if specified.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return int|null The int
     */
    public static function xmlTryGetInt($xml, $key)
    {
        return self::xmlKeyExists($xml, $key) ?
            self::xmlGetInt($xml, $key) : null;
    }
    /**
     * Tries to get the length, if specified.
     * Notice that `length` and `minLength` are synonymous...
     *
     * @param array $xml The xml
     *
     * @return int|null The length
     */
    public static function xmlTryGetLength($xml)
    {
        $raw;
        if (self::xmlKeyExists($xml, "length")) {
            return self::xmlGetInt($xml, "length");
        } else if (self::xmlKeyExists($xml, "minLength")) {
            return self::xmlGetInt($xml, "minLength");
        } else {
            return null;
        }
    }
}

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

/**
 * Generates an alphabetic id, padded to `$length`
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class AlphabeticGenerator extends NumericGenerator
{
    /**
     * Converts a base26 string to an alphabetic string.
     *
     * @param string $str The base26 string
     *
     * @return string The alphabetic string
     */
    private static function _base26ToAlphabetic($str)
    {
        //Get the ordinal values of these characters
        $digit_0 = ord("0");
        $alpha_a = ord("a");

        //To convert 0-9 to a-j
        $digit2alpha = -$digit_0 + $alpha_a;
        //To convert a-p to k-z
        $alpha_offset = 10;

        //Convert each character appropriately
        for ($i=0; $i<strlen($str); ++$i) {
            $char = $str[$i];
            if (ctype_digit($char)) {
                $char    = chr(ord($char)+$digit2alpha);
                $str[$i] = $char;
            } else {
                $char    = chr(ord($char)+$alpha_offset);
                $str[$i] = $char;
            }
        }
        return $str;
    }
    /**
     * Converts an int to an alphabetic string (modified base26).
     * It's a little more complicated than that because
     * base26 is 0-9 and a-p.
     * We still have to convert this base26 string to pure
     * alphabetic characters.
     *
     * @param int $int The int
     *
     * @return string The alphabetic string
     */
    private static function _intToAlphabetic($int)
    {
        $str = base_convert("{$int}", 10, 26);
        $str = self::_base26ToAlphabetic($str);
        return $str;
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
        $str = self::_intToAlphabetic($cur);
        return str_pad($str, $this->getLength(), "a", STR_PAD_LEFT);
    }

    /**
     * Constructor
     *
     * @param int $length The length
     */
    public function __construct($length)
    {
        parent::__construct(0, pow(26, $length)-1, $length);
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
        $length = IdGeneratorUtil::xmlTryGetLength($xml);

        if (is_null($length)) {
            throw new Exception("'length' must be set");
        } else if ($length == 0) {
            throw new Exception("'length' must be > 0");
        } else {
            return new AlphabeticGenerator($length);
        }
    }
}

/**
 * Generates an alphanumeric id, padded to `$length`
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class AlphanumericGenerator extends NumericGenerator
{
    /**
     * Converts an int to an alphanumeric string (base 36)
     *
     * @param int $int The int
     *
     * @return string The alphanumeric string
     */
    private static function _intToAlphanumeric($int)
    {
        $str = base_convert("{$int}", 10, 36);
        return $str;
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
        $str = self::_intToAlphanumeric($cur);
        return str_pad($str, $this->getLength(), "0", STR_PAD_LEFT);
    }

    /**
     * Constructor
     *
     * @param int $length The length
     */
    public function __construct($length)
    {
        parent::__construct(0, pow(36, $length)-1, $length);
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
        $length = IdGeneratorUtil::xmlTryGetLength($xml);

        if (is_null($length)) {
            throw new Exception("'length' must be set");
        } else if ($length == 0) {
            throw new Exception("'length' must be > 0");
        } else {
            return new AlphanumericGenerator($length);
        }
    }
}

/**
 * Generates an id from a set
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class EnumerationGenerator extends NumericGenerator
{
    private $_value_arr;

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
        return $this->_value_arr[$cur];
    }

    /**
     * Constructor
     *
     * @param array $value_arr The values
     */
    public function __construct($value_arr)
    {
        parent::__construct(0, count($value_arr)-1, -1);
        $this->_value_arr = $value_arr;
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
        $value_arr = explode("|", $xml["#"]);
        if (count($value_arr) == 0) {
            throw new Exception("Empty enumeration definition not allowed");
        }
        return new EnumerationGenerator($value_arr);
    }
}

/**
 * Generates an id, from the composition of other generator types
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class IdGenerator implements IdGeneratorInterface
{
    /**
     * Pretend that each generator is a digit on your car's odometer.
     * This recursive method attempts to increment the ones place.
     * If that fails, reset the ones and try to increment the tens place.
     * If that fails, reset the tens and try to increment the hundreds place.
     * If that fails, ... etc.
     * When the "odometer" overflows, we've run out of sequences and fail.
     *
     * It's a bit more complicated than that because some "digits" don't
     * increment. Like `StaticGenerator`. And our "digits" aren't 0-9.
     *
     * @param array $generator_arr The generators
     * @param int   $index         The index to increment
     *
     * @return bool `true` if the next sequence was generated
     */
    private static function _nextImpl($generator_arr, $index)
    {
        if ($index < 0) {
            return false;
        }
        $generator = $generator_arr[$index];
        if ($generator->canReset()) {
            if ($generator->next()) {
                return true;
            } else {
                $generator->reset();
                return self::_nextImpl($generator_arr, $index-1);
            }
        } else {
            return self::_nextImpl($generator_arr, $index-1);
        }
    }

    private $_generator_arr;
    private $_needs_reset;
    private $_attempts;
    private $_rand_attempts_max;

    /**
     * The number of attempts made when next() or nextRand() was called
     * next() tries multiple times
     *
     * @return int The attempts
     */
    public function getAttempts()
    {
        return $this->_attempts;
    }

    /**
     * Returns true if the generator has states
     * that can change and reset
     *
     * @return bool
     */
    public function canReset()
    {
        true;
    }
    /**
     * Resets the generator state
     *
     * @return void
     */
    public function reset()
    {
        foreach ($this->_generator_arr as $generator) {
            if ($generator->canReset()) {
                $generator->reset();
            }
        }
        $this->_needs_reset = false;
        $this->_attempts    = 0;
    }
    /**
     * Expected to return `null` if unable to get the
     * current string, this returns the current string in sequence
     *
     * @return string|null The current string in the id
     */
    public function cur()
    {
        if ($this->_needs_reset) {
            return null;
        }
        $result = "";
        foreach ($this->_generator_arr as $generator) {
            $str = $generator->cur();
            if (is_null($str)) {
                return null;
            }
            $result .= $str;
        }
        return $result;
    }
    /**
     * Expected to return `null` if unable to generate the
     * next string, this returns the next string in sequence
     *
     * @return string|null The next string in the id
     */
    public function next()
    {
        if ($this->_needs_reset) {
            return false;
        }

        ++$this->_attempts;

        $success = self::_nextImpl(
            $this->_generator_arr,
            count($this->_generator_arr)-1
        );

        $this->_needs_reset = !$success;
        return $success;
    }
    /**
     * Expected to return `null` if unable to generate the
     * next string, this returns the next string randomly
     *
     * @return string|null The next string in the id
     */
    public function nextRand()
    {
        if ($this->_needs_reset) {
            return false;
        }

        ++$this->_attempts;
        if ($this->_attempts >= $this->_rand_attempts_max) {
            $this->_needs_reset = true;
            return false;
        }

        foreach ($this->_generator_arr as $generator) {
            if (!$generator->nextRand()) {
                $generator->reset();
                if (!$generator->nextRand()) {
                    //Can't even generate the first random result...
                    return false;
                }
            }
        }
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
        return $this->_rand_attempts_max;
    }
    /**
     * Returns the number of sequences this generator can create.
     *
     * @return int `1` if there's only one sequence.
     */
    public function sequenceCount()
    {
        $result = 1;
        foreach ($this->_generator_arr as $generator) {
            $result *= $generator->sequenceCount();
        }
        return $result;
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
        for ($i=count($this->_generator_arr)-1; $i>=0; --$i) {
            $generator = $this->_generator_arr[$i];
            $count     = $generator->sequenceCount();
            $digit     = $n % $count;

            $n /= $count;

            $generator->setSequence($digit);
        }
    }

    /**
     * Does a linear search to find an unallocated id
     *
     * @param function $is_colliding_callback `bool ($needle)`
     *
     * @return bool `true` on success
     */
    private function _linearNextNonColliding($is_colliding_callback)
    {
        //Reset while preserving the number of attempts
        $tmp = $this->_attempts;
        $this->reset();
        $this->_attempts = $tmp;

        while ($is_colliding_callback($this->cur())) {
            if (!$this->next()) {
                //We collided and could not generate the next sequence.
                //We've allocated everything
                return false;
            }
        }
        return true;
    }

    /**
     * Does a binary search to find an unallocated id.
     * If it fails, it will fall back to linear search.
     * The reason behind this is that the user may have
     * mixed `sequential` and `random` generation in the past,
     * causing gaps in the allocated id sequence.
     * So, the fall back is a last-ditch attempt to find
     * an unallocated id.
     * Users should really have a setting that never causes
     * them to run out of allocatable ids, though...
     * Still, failing after running in O(n) is preferable to
     * failing in O(log n) when there's the possibility of
     * an unallocated id!
     *
     * @param function $is_colliding_callback `bool ($needle)`
     *
     * @return bool `true` on success
     */
    public function nextNonColliding($is_colliding_callback)
    {
        $this->_attempts = 0;
        //Modified binary search
        $start = 0;
        $end   = $this->sequenceCount();
        while ($start < $end) {
            ++$this->_attempts;
            $mid = floor(($start+$end)/2);

            $this->setSequence($mid);
            $needle = $this->cur();

            if ($is_colliding_callback($needle)) {
                $start = $mid+1;
            } else {
                $end = $mid;
            }
        }
        if ($end == $this->sequenceCount()) {
            //We're still colliding, fall back to linear search
            //and hope for a gap.
            return $this->_linearNextNonColliding($is_colliding_callback);
        }
        $this->setSequence($end);
        if ($is_colliding_callback($this->cur())) {
            //We're not doing a "true" binary search
            //Therefore, there is the possibility of being off-by-1
            //This attempts to rectify it
            $this->setSequence($end+1);
            if ($is_colliding_callback($this->cur())) {
                //We're still colliding, fall back to linear search
                //and hope for a gap.
                return $this->_linearNextNonColliding($is_colliding_callback);
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    /**
     * Constructor
     *
     * @param array $generator_arr The generators
     */
    public function __construct($generator_arr)
    {
        $this->_generator_arr     = $generator_arr;
        $this->_rand_attempts_max = 1;

        foreach ($generator_arr as $generator) {
            $r = $generator->randAttemptsMax();
            if ($r > 0) {
                $this->_rand_attempts_max *= $r;
            }
        }
        $this->reset();
    }
    /**
     * Parses the xml to produce the generator
     *
     * @param array       $xml       The xml
     * @param string|null $site_name The site name
     *
     * @return object The generator
     */
    public static function fromXMLConfig($xml, $site_name=null)
    {
        if (!is_null($site_name)) {
            if (!is_string($site_name)) {
                throw new Exception("site_name must be a string");
            }
            if (strlen($site_name) == 0) {
                throw new Exception("site_name cannot be an empty string");
            }
        }

        $generator_arr = array();
        foreach ($xml as $x) {
            if (!isset($x["@"]["type"])) {
                throw new Exception("Each generator definition must have a type");
            }
            $type = $x["@"]["type"];
            $generator;
            switch ($type) {
            case "static":
                $generator = StaticGenerator::fromXMLConfig($x);
                break;
            case "numeric":
                $generator = NumericGenerator::fromXMLConfig($x);
                break;
            case "alpha":
                $generator = AlphabeticGenerator::fromXMLConfig($x);
                break;
            case "alphanumeric":
                $generator = AlphanumericGenerator::fromXMLConfig($x);
                break;
            case "set":
                $generator = EnumerationGenerator::fromXMLConfig($x);
                break;
            case "siteAbbrev":
                if (is_null($site_name)) {
                    throw new Exception(
                        "Not allowed to use siteAbbrev generator "
                        . "when site_name is null"
                    );
                }
                $generator = new StaticGenerator($site_name);
                break;
            default:
                throw new Exception("Unknown generator type '{$type}'");
            }

            $generator_arr[] = $generator;
        }
        if (count($generator_arr) == 0) {
            throw new Exception("Empty id generator definition not allowed");
        }
        $can_reset = false;
        foreach ($generator_arr as $generator) {
            if ($generator->canReset()) {
                $can_reset = true;
                break;
            }
        }
        if (!$can_reset) {
            throw new Exception("At least one id generator must not be static");
        }
        return new IdGenerator($generator_arr);
    }
}
?>
