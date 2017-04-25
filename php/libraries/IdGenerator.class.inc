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
     
    class IdGeneratorUtil {
        private function __construct() {}
        
        //https://en.wikipedia.org/wiki/Harmonic_number#Alternative.2C_asymptotic_formulation
        public static function approximateHarmonicNumber ($n) {
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
        public static function approximateRandAttemptsMax ($n) {
            return intval($n*self::approximateHarmonicNumber($n));
        }
        
        private static function _validateNonNegativeInteger ($raw, $name) {
            if (!ctype_digit($raw)) {
                throw new Exception("{$name} must be a non-negative integer");
            }
            if ("" . intval($raw) !== $raw) {
                throw new Exception("{$name} must be a valid non-negative integer");
            }
        }
        
        public static function xmlKeyExists ($xml, $key) {
            return isset($xml["@"][$key]);
        }
        public static function xmlGet ($xml, $key) {
            if (!self::xmlKeyExists($xml, $key)) {
                throw new Exception("Expected '{$key}' to be set");
            }
            return $xml["@"][$key];
        }
        public static function xmlGetInt ($xml, $key) {
            $raw = self::xmlGet($xml, $key);
            self::_validateNonNegativeInteger($raw, $key);
            return intval($raw);
        }
        public static function xmlTryGetInt ($xml, $key) {
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
        public static function xmlTryGetLength ($xml) {
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

    interface IdGeneratorInterface {
        /*
         * Returns true if the generator has states
         * that can change with calls to next() and nextRand()
         *
         * @return bool
         */
        public function canReset ();
        /*
         * Resets the generator state
         *
         * @return void
         */
        public function reset ();
        /**
         * Expected to return `null` if unable to get the
         * current string, this returns the current string in sequence
         *
         * @return string|null The current string in the id
         */
        public function cur ();
        /**
         * Tries to generate the next string in the sequence
         *
         * @return bool `true` on success
         */
        public function next ();
        /**
         * Tries to generate a random string
         *
         * @return bool `true` on success
         */
        public function nextRand ();
    }
    class StaticGenerator implements IdGeneratorInterface {
        private $value;
        /*
         * Returns true if the generator has states
         * that can change and reset
         *
         * @return bool
         */
        public function canReset () {
            return false;
        }
        /*
         * Resets the generator state
         *
         * @return void
         */
        public function reset () {}
        /**
         * Tries to generate the next string in the sequence
         *
         * @return bool `true` on success
         */
        public function next () {
            return true;
        }
        /**
         * Tries to generate a random string
         *
         * @return bool `true` on success
         */
        public function nextRand () {
            return true;
        }
        /**
         * Expected to return `null` if unable to get the
         * current string, this returns the current string in sequence
         *
         * @return string|null The current string in the id
         */
        public function cur () {
            return $this->value;
        }
        
        public function __construct ($value) {
            $this->value = $value;
        }
        public static function fromXMLConfig ($xml) {
            $value = $xml["#"];
            if (strlen($value) == 0) {
                throw new Exception("Empty value not allowed");
            }
            return new StaticGenerator($value);
        }
    }
    class NumericGenerator implements IdGeneratorInterface {
        private $min;
        private $max;
        private $length;
        private $cur;
        private $rand_attempts_cur;
        private $rand_attempts_max;
        
        public function curRaw () {
            return $this->cur;
        }
        public function getLength () {
            return $this->length;
        }
        
        /*
         * Returns true if the generator has states
         * that can change and reset
         *
         * @return bool
         */
        public function canReset () {
            return true;
        }
        /*
         * Resets the generator state
         */
        public function reset () {
            $this->cur = $this->min;
            
            $this->rand_attempts_cur = 0;
        }
        /**
         * Expected to return `null` if unable to get the
         * current string, this returns the current string in sequence
         *
         * @return string|null The current string in the id
         */
        public function cur () {
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
        public function next () {
            if (is_null($this->cur)) {
                return false;
            }
            if ($this->cur >= $this->max) {
                $this->cur = null;
                return false;
            } else {
                ++$this->cur;
                return true;
            }
        }
        /**
         * Tries to generate a random string
         *
         * @return bool `true` on success
         */
        public function nextRand () {
            if (is_null($this->cur)) {
                return false;
            }
            ++$this->rand_attempts_cur;
            if ($this->rand_attempts_cur > $this->rand_attempts_max) {
                //If you find that you are getting `null` with this function
                //when your probability space is not all used up,
                //Consider reevaluating the number of candidates in your study
                //and setting it so that `max`-`min` = (number of candidates)^3
                
                //n^3 isn't arbitray.
                //If you have `n` elements and generate `n` random numbers
                //in the interval [1, n^3], the probability that all
                //elements are unique is at least (1-1/n).
                //Where 1 = 100% probability
                //Higher n and higher n^3 => higher probability
                //Source: Introduction to Algorithms, 3rd Edition, Page 125
                //ISBN 978-0-262-03384-8 (hardcover : alk. paper)
                //ISBN 978-0-262-53305-8 (pbk. : alk. paper)
                $this->cur = null;
                return false;
            } else {
                $this->cur = rand($this->min, $this->max);
                return true;
            }
        }
        
        public function __construct ($min, $max, $length) {
            $this->min    = $min;
            $this->max    = $max;
            $this->length = $length;
            
            $delta = $max-$min;
            $this->rand_attempts_max = IdGeneratorUtil::approximateRandAttemptsMax($delta);
            
            $this->reset();
        }
        public static function fromXMLConfig ($xml) {
            $min = IdGeneratorUtil::xmlTryGetInt($xml, "min");
            $max = IdGeneratorUtil::xmlTryGetInt($xml, "max");
            $length = IdGeneratorUtil::xmlTryGetLength($xml);
            
            if (is_null($min) && is_null($max)) {
                if (is_null($length)) {
                    throw new Exception("At least ('length') or ('min' and 'max') must be set");
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
                    throw new Exception("'length' must be long enough to accommodate all digits. {$default_max_length} is recommended.");
                }
                
                return new NumericGenerator($min, $max, $length);
            }
        }
    }
    class AlphabeticGenerator extends NumericGenerator {
        private static function _base26ToAlphabetic ($str) {
            $digit_0 = ord("0");
            $alpha_a = ord("a");
            
            $digit2alpha  = -$digit_0 + $alpha_a;
            $alpha_offset = 10;
            
            for ($i=0; $i<strlen($str); ++$i) {
                $char = $str[$i];
                if (ctype_digit($char)) {
                    $char = chr(ord($char)+$digit2alpha);
                    $str[$i] = $char;
                } else {
                    $char = chr(ord($char)+$alpha_offset);
                    $str[$i] = $char;
                }
            }
            return $str;
        }
        private static function _intToAlphabetic ($int) {
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
        public function cur () {
            $cur = $this->curRaw();
            if (is_null($cur)) {
                return null;
            }
            $str = self::_intToAlphabetic($cur);
            return str_pad($str, $this->getLength(), "a", STR_PAD_LEFT);
        }
        
        public function __construct ($length) {
            parent::__construct(0, pow(26, $length)-1, $length);
        }
        public static function fromXMLConfig ($xml) {
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
    class AlphanumericGenerator extends NumericGenerator {
        private static function _intToAlphanumeric ($int) {
            $str = base_convert("{$int}", 10, 36);
            return $str;
        }
        
        /**
         * Expected to return `null` if unable to get the
         * current string, this returns the current string in sequence
         *
         * @return string|null The current string in the id
         */
        public function cur () {
            $cur = $this->curRaw();
            if (is_null($cur)) {
                return null;
            }
            $str = self::_intToAlphanumeric($cur);
            return str_pad($str, $this->getLength(), "0", STR_PAD_LEFT);
        }
        
        public function __construct ($length) {
            parent::__construct(0, pow(36, $length)-1, $length);
        }
        public static function fromXMLConfig ($xml) {
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
    class EnumerationGenerator extends NumericGenerator {
        private $value_arr;
        
        /**
         * Expected to return `null` if unable to get the
         * current string, this returns the current string in sequence
         *
         * @return string|null The current string in the id
         */
        public function cur () {
            $cur = $this->curRaw();
            if (is_null($cur)) {
                return null;
            }
            return $this->value_arr[$cur];
        }
        
        public function __construct ($value_arr) {
            parent::__construct(0, count($value_arr)-1, count($value_arr)-1);
            $this->value_arr = $value_arr;
        }
        public static function fromXMLConfig ($xml) {
            $value_arr = explode("|", $xml["#"]);
            if (count($value_arr) == 0) {
                throw new Exception("Empty enumeration definition not allowed");
            }
            return new EnumerationGenerator($value_arr);
        }
    }
    class IdGenerator implements IdGeneratorInterface {
        private static function _nextImpl ($generator_arr, $index, $next_callback, &$attempts) {
            if ($index < 0) {
                return false;
            }
            $generator = $generator_arr[$index];
            if ($generator->canReset()) {
                ++$attempts;
                if ($next_callback($generator)) {
                    return true;
                } else {
                    $generator->reset();
                    return self::_nextImpl($generator_arr, $index-1, $next_callback, $attempts);
                }
            } else {
                return self::_nextImpl($generator_arr, $index-1, $next_callback, $attempts);
            }
        }
        
        private $generator_arr;
        private $needs_reset;
        private $attempts;
        
        public function getAttempts () {
            return $this->attempts;
        }
        
        /*
         * Returns true if the generator has states
         * that can change and reset
         *
         * @return bool
         */
        public function canReset () {
            true;
        }
        /*
         * Resets the generator state
         *
         * @return void
         */
        public function reset () {
            foreach ($this->generator_arr as $generator) {
                if ($generator->canReset()) {
                    $generator->reset();
                }
            }
            $this->needs_reset = false;
            $this->attempts = 0;
        }
        /**
         * Expected to return `null` if unable to get the
         * current string, this returns the current string in sequence
         *
         * @return string|null The current string in the id
         */
        public function cur () {
            if ($this->needs_reset) {
                return null;
            }
            $result = "";
            foreach ($this->generator_arr as $generator) {
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
        public function next () {
            if ($this->needs_reset) {
                return false;
            }
            
            $this->attempts = 0;
            
            $success = self::_nextImpl(
                $this->generator_arr,
                count($this->generator_arr)-1,
                function ($generator) {
                    return $generator->next();
                },
                $this->attempts
            );
            $this->needs_reset = !$success;
            return $success;
        }
        /**
         * Expected to return `null` if unable to generate the
         * next string, this returns the next string randomly
         *
         * @return string|null The next string in the id
         */
        public function nextRand () {
            if ($this->needs_reset) {
                return false;
            }
            
            $this->attempts = 0;
            
            $success = self::_nextImpl(
                $this->generator_arr,
                count($this->generator_arr)-1,
                function ($generator) {
                    return $generator->nextRand();
                },
                $this->attempts
            );
            $this->needs_reset = !$success;
            return $success;
        }
        
        public function __construct ($generator_arr) {
            $this->generator_arr = $generator_arr;
            
            $this->reset();
        }
        public static function fromXMLConfig ($xml, $site_name=null) {
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
                    case "static": {
                        $generator = StaticGenerator::fromXMLConfig($x);
                        break;
                    }
                    case "numeric": {
                        $generator = NumericGenerator::fromXMLConfig($x);
                        break;
                    }
                    case "alpha": {
                        $generator = AlphabeticGenerator::fromXMLConfig($x);
                        break;
                    }
                    case "alphanumeric": {
                        $generator = AlphanumericGenerator::fromXMLConfig($x);
                        break;
                    }
                    case "set":
                    case "enum": {
                        $generator = EnumerationGenerator::fromXMLConfig($x);
                        break;
                    }
                    case "siteAbbrev": {
                        if (is_null($site_name)) {
                            throw new Exception("Not allowed to use siteAbbrev generator when site_name is null");
                        }
                        $generator = new StaticGenerator($site_name);
                        break;
                    }
                    default: {
                        throw new Exception("Unknown generator type '{$type}'");
                    }
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