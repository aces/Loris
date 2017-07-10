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
     * @param array $xml         The xml
     * @param array $static_dict Maps element names to static, unchanging values
     *                           Example: array("siteAbbrev"=>"DCC")
     *
     * @return object The generator
     */
    public static function fromXMLConfig($xml, $static_dict)
    {
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
            default:
                if (!is_null($static_dict)
                    && is_array($static_dict)
                    && isset($static_dict[$type])
                ) {
                    $str = $static_dict[$type];
                    if (!is_string($str) || strlen($str) == 0) {
                        throw new Exception("{$type}'s value is invalid");
                    }
                    $generator = new StaticGenerator($str);
                    break;
                }
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
